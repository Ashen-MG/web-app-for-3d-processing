import React, {Suspense, useEffect, useState} from "react";
import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import {Model} from "./components/model/Model";
import {UploadedFileProp} from "app/App";
import {useFileReader} from "./hooks";
import sceneStyles from "pages/home/styles/scene.module.scss";
import {getFileExtension} from "../../app/helpers/global";

/**
 * Main 3D scene.
 * Prepare uploaded point cloud.
 * TODO: verify extension, Model.tsx must receive correct point cloud i.e. all checks must be here
 * */
export const Scene = ({uploadedFile}: UploadedFileProp) => {

	const uploadedFileData: string | undefined = useFileReader(uploadedFile);
	const [fileExtension, setFileExtension] = useState<string>("");

	useEffect(() => {
		if (uploadedFile !== undefined)
			setFileExtension(getFileExtension(uploadedFile!.name));
	}, [uploadedFile]);

	// if we want to use redux store in components that are inside react-fiber-three canvas:
	// https://github.com/pmndrs/react-three-fiber/issues/43
	// https://spectrum.chat/react-three-fiber/general/redux-state-to-child-component-of-canvas~a0cce2c2-2254-44a2-82c7-952e37e1a1ff

	return (<>
		<div className={sceneStyles.container}>
			<Suspense fallback={<div>Loading... </div>}>  {/* TODO: some better loading */}
				{/* https://github.com/pmndrs/react-three-fiber/issues/304 */}
				<Canvas style={{width: "100%", height: "100%"}} onCreated={state => state.gl.setClearColor("#000205")}>
					{uploadedFileData !== undefined && ["ply", "xyz", "xyzrgb", "pcd"].includes(fileExtension) &&
						<Model fileData={uploadedFileData} fileExtension={fileExtension as "ply" | "xyz" | "xyzrgb" | "pcd"}/>
					}
					{/*
					<ambientLight intensity={0.5} />
					<Environment
						background={false}
						preset={"lobby"}/>
					*/}

					{/* camera movement control with a mouse */}
					<OrbitControls />
				</Canvas>
			</Suspense>
		</div>
	</>)
}