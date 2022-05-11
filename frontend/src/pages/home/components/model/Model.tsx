import React, {useEffect, useState} from "react";
import {
	BufferGeometry,
	Material,
	MeshBasicMaterial,
	MeshMatcapMaterial,
	MeshPhongMaterial,
	Points,
	PointsMaterial,
	Vector3
} from "three";
import {useLoader, useThree} from "@react-three/fiber";
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";
import {XYZLoader} from "three/examples/jsm/loaders/XYZLoader";  // supports xyz and xyzrgb
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader";
import {RootState} from "app/store";
import {useAppSelector} from "app/hooks";
import {BackendState, VISUALIZATION_MODE} from "app/context/globalSlice";
import {createApiURI} from "app/helpers/global";
import {OrbitControls, Bounds, useMatcapTexture, useBounds} from "@react-three/drei";
import {getStaticURI} from "app/adapters";

interface InitialFileData {
	fileData: string | undefined
}

interface FileData {
	fileData: string
}

interface FileExtension {
	fileExtension: "ply" | "xyz" | "xyzrgb" | "pcd"
}

const fileExtensionToLoader = new Map<string, any>([["ply", PLYLoader], ["xyz", XYZLoader], ["xyzrgb", XYZLoader], ["pcd", PCDLoader]]);

/**
 * Abstract model for a point cloud (parent).
 * @param fileData Raw data from the point cloud file.
 * @param fileExtension
 */
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

	useEffect(() => {
		return () => {
			console.log("ummount");
		}
	}, []);

	// TODO: test if useLoader takes loader and/or url as initial state or it would be updated on prop change (like custom hook)

	const model: BufferGeometry | Points = useLoader(
		_fileExtension ? fileExtensionToLoader.get(_fileExtension) : PLYLoader,
		(_fileExtension && _fileData) ? _fileData : "",
		loader => {console.log("PLY loaded")}
	);
	const geometry: BufferGeometry = _fileExtension === "pcd" ? (model as Points).geometry : model as BufferGeometry;
	const material: Material = new PointsMaterial({color: "white", size: 0.1});

	return (
		geometry?.attributes.position.count === 0 ? <></> : <Geometry geometry={geometry} material={material} />
	)

	{/*
	if (!_fileData) return <></>
	if (_fileExtension === "ply") return <ModelPLY fileData={_fileData} />
	else if (_fileExtension === "xyz" || _fileExtension === "xyzrgb") return <ModelXYZ fileData={_fileData} />
	else if (_fileExtension === "pcd") return <ModelPCD fileData={_fileData} />
	return <>TODO: error - invalid file extension, error should be handled sooner</>
	*/}
}

const ModelPLY = ({fileData}: FileData) => {
	const geometry: BufferGeometry = useLoader(PLYLoader, fileData, loader => {console.log("PLY loaded")});
	const material: Material = new PointsMaterial({color: "white", size: 0.1});
	return (
		geometry?.attributes.position.count === 0 ? <></> : <Geometry geometry={geometry} material={material} />
	)
}

const ModelXYZ = ({fileData}: FileData) => {
	const geometry: BufferGeometry = useLoader(XYZLoader, fileData, loader => {console.log("XYZ loaded")});
	const material: Material = new PointsMaterial({color: "white", size: 0.1});
	return (
		geometry?.attributes.position.count === 0 ? <></> : <Geometry geometry={geometry} material={material} />
	)
}

const ModelPCD = ({fileData}: FileData) => {
	const points: Points<BufferGeometry, Material | Material[]> = useLoader(PCDLoader, fileData, loader => {console.log("PCD loaded")});
	const geometry: BufferGeometry = points.geometry;
	//const material: Material = points.material as Material;  // TODO: can also be Material[]
	const material: Material = new PointsMaterial({color: "white", size: 0.1});
	return (
		geometry?.attributes.position.count === 0 ? <></> : <Geometry geometry={geometry} material={material} />
	)
}

interface GeometryProps {
	geometry: BufferGeometry,
	material: Material
}

const Geometry = ({geometry, material}: GeometryProps) => {

	//const currentBackendFileUrl: string | undefined
	//= useAppSelector((state: RootState) => state.global.currentBackendFileUrl);

	const visualizationMode: VISUALIZATION_MODE = useAppSelector((state: RootState) => state.global.visualizationMode);

	const [cleanGeometry, setCleanGeometry] = useState<BufferGeometry>();

	/*
	const [mesh, setMesh] = useState<ConvexGeometry | null>();

	useEffect(() => {
		const vectors: Vector3[] = [];
		for (let i = 0; i * 3 < geometry.attributes.position.array.length; i++) {
			const vector: Vector3 = new Vector3().fromArray(geometryPCD.geometry.attributes.position.array, i * 3);
			vectors.push(vector);
		}
		setMesh(new ConvexGeometry(vectors));
	}, [geometry])
	 */

	const [vector, setVector] = useState<Vector3>(new Vector3(0, 0, 0));

	useEffect(() => {
		const vectors: Vector3[] = [];
		for (let i = 0; i * 3 < geometry.attributes.position.array.length; i++) {
			const vector: Vector3 = new Vector3().fromArray(geometry.attributes.position.array, i * 3);
			if (vector.x !== 0 && vector.y !== 0 && vector.z !== 0) {  // add only no-null points
				vectors.push(vector);
			}
		}

		// avg
		setVector(
			vectors
				.reduce((prev, curr): Vector3 => curr.add(prev))
				.divide(new Vector3(vectors.length, vectors.length, vectors.length))
		);

		geometry.computeVertexNormals();  // TODO

		const g: BufferGeometry = new BufferGeometry();
		g.setFromPoints(vectors);
		setCleanGeometry(g);
	}, [geometry]);

	/*
	useEffect(() => {
		const vectors: Vector3[] = [];
		for (let i = 0; i * 3 < geometryPCD.geometry.attributes.position.array.length; i++) {
			const vector: Vector3 = new Vector3().fromArray(geometryPCD.geometry.attributes.position.array, i * 3);
			if (vector.x !== 0 && vector.y !== 0 && vector.z !== 0) {  // add only no-null points
				vectors.push(vector);
			}
		}
		const geometry: BufferGeometry = new BufferGeometry();
		geometry.setFromPoints(vectors);
		setGeometry(geometry);
	}, [geometryPCD]);
	 */

	// https://threejs.org/docs/#api/en/materials/MeshBasicMaterial
	const meshMaterial = new MeshBasicMaterial({
		color: "orange",
		wireframe: true,
		reflectivity: 1,
		envMap: null
	});

	const [matcap, url] = useMatcapTexture(
		67, // index of the matcap texture https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
		1024 // size of the texture ( 64, 128, 256, 512, 1024 )
	)

	// https://docs.pmnd.rs/drei/staging/use-matcap-texture
	// TODO: possible to test: https://docs.pmnd.rs/drei/staging/use-normal-texture
	const meshMatcam = new MeshMatcapMaterial({
		matcap: matcap
	});

	const meshPhongMaterial = new MeshPhongMaterial({
		color: "white",
		polygonOffset: true,
		polygonOffsetFactor: 1, // positive value pushes polygon further away
		polygonOffsetUnits: 1
	});

	const { camera, gl } = useThree();
	// camera.zoom = 2;
	// camera.updateProjectionMatrix();

	// https://codesandbox.io/s/bounds-and-makedefault-rz2g0?file=/src/App.js:518-548

	return <>
		<Bounds fit clip>
			<Group geometry={geometry} material={material} />
		</Bounds>
		<OrbitControls target={vector} makeDefault />
	</>
}

const Group = ({geometry, material}: GeometryProps) => {
	const [matcap, url] = useMatcapTexture(
		67, // index of the matcap texture https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
		1024 // size of the texture ( 64, 128, 256, 512, 1024 )
	)

	const visualizationMode: VISUALIZATION_MODE = useAppSelector((state: RootState) => state.global.visualizationMode);
	const bounds = useBounds();
	useEffect(() => {
		bounds.refresh().clip().fit();  // calculate scene bounds
	}, [geometry]);
	const meshMatcam = new MeshMatcapMaterial({
		matcap: matcap
	});

	return (
		<group>
			{visualizationMode === VISUALIZATION_MODE.POINT_CLOUD
				?
				<points geometry={geometry} material={material}/>
				:
				<mesh geometry={geometry} material={meshMatcam} position={[0, 0, 0]}/>
			}
		</group>
	)
}