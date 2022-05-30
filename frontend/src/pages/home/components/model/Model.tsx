import React, {useEffect, useState} from "react";
import {
	BufferAttribute,
	BufferGeometry,
	Material,
	MeshMatcapMaterial,
	Points,
	PointsMaterial,
	Vector3
} from "three";
import {useLoader} from "@react-three/fiber";
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";
import {XYZLoader} from "three/examples/jsm/loaders/XYZLoader";  // supports xyz and xyzrgb
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader";
import {RootState} from "app/store";
import {useAppSelector} from "app/hooks";
import {BackendState, VISUALIZATION_MODE} from "app/context/globalSlice";
import {createApiURI} from "app/helpers/global";
import {OrbitControls, Bounds, useMatcapTexture, useBounds, Point} from "@react-three/drei";
import {getStaticURI} from "app/adapters";

interface InitialFileData {
	fileData: string | undefined
}

interface FileExtension {
	fileExtension: "ply" | "xyz" | "xyzrgb" | "pcd"
}

const fileExtensionToLoader = new Map<string, any>([["ply", PLYLoader], ["xyz", XYZLoader], ["xyzrgb", XYZLoader], ["pcd", PCDLoader]]);

/** A component that processes a 3D model for the 3D scene.
 *  The 3D model is loaded from `fileData` or from the back-end state saved in the Redux store,
 *  whereas the back-end state is prioritized. */
export const Model = ({fileData, fileExtension}: InitialFileData & FileExtension) => {
	const backendState: BackendState | undefined = useAppSelector((state: RootState) => state.global.backendState);

	const [_fileData, setFileData] = useState<string>();
	const [_fileExtension, setFileExtension] = useState<string>(fileExtension);

	useEffect(() => {
		if (fileData === undefined) return;
		setFileData(fileData);
		setFileExtension(fileExtension);
	}, [fileData]);
	
	useEffect(() => {
		if (backendState === undefined) return;
		setFileData(createApiURI(getStaticURI(backendState)));
		setFileExtension(backendState.fileExtension);
	}, [backendState]);

	// useLoader doesn't take a loader and URL (or file data) as an initial state (how state from useState works).
	// Its parameters are updated on prop change (similarly to custom hook).
	const model: BufferGeometry | Points = useLoader(
		_fileExtension ? fileExtensionToLoader.get(_fileExtension) : PLYLoader,
		(_fileExtension && _fileData) ? _fileData : "",
		loader => {console.log("Model has been loaded.")}
	);

	const geometry: BufferGeometry = _fileExtension === "pcd" ? (model as Points).geometry : model as BufferGeometry;
	const material: Material = new PointsMaterial({color: "white", size: 0.12});

	return (
		geometry?.attributes.position.count === 0 ? <></> : <Geometry geometry={geometry} material={material} />
	)
}

interface GeometryProps {
	geometry: BufferGeometry,
	material: Material
}

const Geometry = ({geometry, material}: GeometryProps) => {

	const [cameraTargetVector, setCameraTargetVector] = useState<Vector3>(new Vector3(0, 0, 0));

	useEffect(() => {
		const position = geometry.attributes.position;
		geometry.computeVertexNormals();

		// remove duplicate points only if the input is point cloud without normals

		const sumVector: Vector3 = new Vector3(0, 0, 0);

		if (geometry.attributes?.normal?.count > 0) {
			for (let i = 0; i < position.count; i++) {
				sumVector.add(new Vector3().fromArray(position.array, i * 3));
			}
			// average of all positions of points
			setCameraTargetVector(sumVector.divide(new Vector3(position.count, position.count, position.count)));
			return;
		}

		// JavaScript doesn't offer any pre-defined hash() or equal() methods that we could implement in extended
		// class of `Vector3` in order to make it hashable e.g. for the Set.
		// Hence, we're using different strategy/algorithm to effectively remove duplicate points.
		const hashes: Set<string> = new Set();  // Set of JSON.stringify(Vector3) since strings are hashable
		const duplicateVectorIndexes: Set<number> = new Set();
		const vectors: Vector3[] = [];

		for (let i = 0; i < position.count; i++) {
			const v: Vector3 = new Vector3().fromArray(position.array, i * 3);
			const hash = JSON.stringify(v);
			if (hashes.has(hash)) {
				duplicateVectorIndexes.add(i);  // register indexes of duplicates
				continue;
			}
			hashes.add(hash);
			vectors.push(v);
			sumVector.add(v);
		}

		// average of all non-duplicate positions of points
		setCameraTargetVector(sumVector.divide(new Vector3(vectors.length, vectors.length, vectors.length)));

		const positions = new Float32Array(vectors.length * 3);
		let j = 0;
		for (let i = 0; i < position.count; i++) {
			if (!duplicateVectorIndexes.has(i)) {
				positions.set([position.array[i*3], position.array[(i*3)+1], position.array[(i*3)+2]], j * 3);
				j++;
			}
		}
		const normals = new Float32Array(vectors.length * 3);
		const colors = new Float32Array(vectors.length * 3);

		geometry.setAttribute("position", new BufferAttribute(positions, 3));
		geometry.setAttribute("normal", new BufferAttribute(normals, 3));
		geometry.setAttribute("color", new BufferAttribute(colors, 3));
		geometry.attributes.position.needsUpdate = true;
		geometry.attributes.normal.needsUpdate = true;
		geometry.attributes.color.needsUpdate = true;
		geometry.computeBoundingBox();
		geometry.computeBoundingSphere();

	}, [geometry]);

	// possibly use to control the camera
	// const { camera, gl } = useThree();
	// camera.zoom = 2; camera.updateProjectionMatrix();

	return <>
		<Bounds fit clip>  {/* Inspired by: https://codesandbox.io/s/bounds-and-makedefault-rz2g0?file=/src/App.js:518-548 */}
			<Group geometry={geometry} material={material} />
		</Bounds>
		<OrbitControls target={cameraTargetVector} makeDefault />
	</>
}

/** Construct 3D primitives for the 3D scene from the `geometry` and `material` props. ä
 *  Note: This component assumes that it is nested inside <Bounds/> component
 *  (otherwise bounding the camera to the object won't work). */
const Group = ({geometry, material}: GeometryProps) => {

	const visualizationMode: VISUALIZATION_MODE = useAppSelector((state: RootState) => state.global.visualizationMode);

	const bounds = useBounds();

	useEffect(() => {
		bounds.refresh().clip().fit();  // calculate scene bounds
	}, [geometry]);

	const [matcap] = useMatcapTexture(
		67, // index of the matcap texture https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
		1024 // size of the texture ( 64, 128, 256, 512, 1024 )
	)

	const meshMatcapMaterial = new MeshMatcapMaterial({
		matcap: matcap
	});

	return (
		<group>
			{visualizationMode === VISUALIZATION_MODE.POINT_CLOUD
				?
					<points geometry={geometry} material={material} position={[0, 0, 0]}/>
				:
					<mesh geometry={geometry} material={meshMatcapMaterial} position={[0, 0, 0]}/>
			}
		</group>
	)
}