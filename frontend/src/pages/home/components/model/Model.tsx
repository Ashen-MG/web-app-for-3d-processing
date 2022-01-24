import React, {useEffect, useState} from "react";
import {BufferGeometry, MeshStandardMaterial, PointsMaterial, Vector3} from "three";
import {useLoader} from "@react-three/fiber";
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";
import {XYZLoader} from "three/examples/jsm/loaders/XYZLoader";  // supports xyz and xyzrgb
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader";
import {RootState} from "app/store";
import {useAppSelector} from "app/hooks";

interface ModelProps {
	fileDataURL: string
}

/**
 * Abstract model (parent). TODO:  pcd, ply, xyz, xyzrgb 'child' models.
 * @param fileDataURL
 * @constructor
 */
export const Model = ({fileDataURL}: ModelProps) => {

	console.log(fileDataURL);

	const meshMaterial = new MeshStandardMaterial({color: "white"});

	const material = new PointsMaterial({color: "white", size: 0.1});
	const geometryPLY = useLoader(PLYLoader, fileDataURL, loader => {});
	const [geometry, setGeometry] = useState<BufferGeometry>();

	//const geometryPCD: Points<BufferGeometry, Material | Material[]> = useLoader(PCDLoader, fileDataURL);

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
		for (let i = 0; i * 3 < geometryPLY.attributes.position.array.length; i++) {
			const vector: Vector3 = new Vector3().fromArray(geometryPLY.attributes.position.array, i * 3);
			if (vector.x !== 0 && vector.y !== 0 && vector.z !== 0) {  // add only no-null points
				vectors.push(vector);
			}
		}
		const geometry: BufferGeometry = new BufferGeometry();
		geometry.setFromPoints(vectors);
		setGeometry(geometry);
	}, [geometryPLY]);

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
			<points geometry={geometry} material={material}/>
		</group>
	)
}