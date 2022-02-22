import React, {useEffect, useState} from "react";
import {BufferGeometry, Material, MeshStandardMaterial, Points, PointsMaterial, Vector3} from "three";
import {useLoader} from "@react-three/fiber";
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";
import {XYZLoader} from "three/examples/jsm/loaders/XYZLoader";  // supports xyz and xyzrgb
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader";
import {RootState} from "app/store";
import {useAppSelector} from "app/hooks";
import {FileState} from "app/context/globalSlice";
import {createApiURI} from "app/helpers/global";

const loaders = {ply: PLYLoader, xyz: XYZLoader, xyzrgb: XYZLoader, pcd: PCDLoader}

interface FileData {
	fileData: string
}

interface FileExtension {
	fileExtension: "ply" | "xyz" | "xyzrgb" | "pcd"
}

/**
 * Abstract model for a point cloud (parent).
 * @param fileData Raw data from the point cloud file.
 */
export const Model = ({fileData, fileExtension}: FileData & FileExtension) => {

	const backendState: FileState | undefined = useAppSelector((state: RootState) => state.global.backendState);

	const [_fileData, setFileData] = useState<string>(fileData);
	const [_fileExtension, setFileExtension] = useState<string>(fileExtension);

	useEffect(() => {
		if (backendState === undefined || backendState.version <= 1) return;
		setFileData(createApiURI(backendState.file.url));
		setFileExtension(backendState.file.extension);
	}, [backendState]);

	if (_fileExtension === "ply")        return <ModelPLY fileData={_fileData} />
	else if (_fileExtension === "xyz" || _fileExtension === "xyzrgb")   return <ModelXYZ fileData={_fileData} />
	else if (_fileExtension === "pcd")   return <ModelPCD fileData={_fileData} />
	return                              <>TODO: error - invalid file extension, error should be handled sooner</>
}

const ModelPLY = ({fileData}: FileData) => {
	const geometry: BufferGeometry = useLoader(PLYLoader, fileData, loader => {});
	const material: Material = new PointsMaterial({color: "white", size: 0.1});
	return <Geometry geometry={geometry} material={material} />
}

const ModelXYZ = ({fileData}: FileData) => {
	const geometry: BufferGeometry = useLoader(XYZLoader, fileData, loader => {});
	const material: Material = new PointsMaterial({color: "white", size: 0.1});
	return <Geometry geometry={geometry} material={material} />
}

const ModelPCD = ({fileData}: FileData) => {
	const points: Points<BufferGeometry, Material | Material[]> = useLoader(PCDLoader, fileData);
	const geometry: BufferGeometry = points.geometry;
	const material: Material = points.material as Material;  // TODO: can also be Material[]
	return <Geometry geometry={geometry} material={material} />
}

interface GeometryProps {
	geometry: BufferGeometry,
	material: Material
}

const Geometry = ({geometry, material}: GeometryProps) => {
	// const meshMaterial = new MeshStandardMaterial({color: "white"});

	//const currentBackendFileUrl: string | undefined
	//= useAppSelector((state: RootState) => state.global.currentBackendFileUrl);

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

	useEffect(() => {
		const vectors: Vector3[] = [];
		for (let i = 0; i * 3 < geometry.attributes.position.array.length; i++) {
			const vector: Vector3 = new Vector3().fromArray(geometry.attributes.position.array, i * 3);
			if (vector.x !== 0 && vector.y !== 0 && vector.z !== 0) {  // add only no-null points
				vectors.push(vector);
			}
		}
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

	return (
		<group dispose={null}>
			<points geometry={cleanGeometry} material={material}/>
		</group>
	)
}