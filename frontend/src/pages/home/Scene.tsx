import React, {Suspense, useEffect, useState} from "react";
import {Canvas} from "@react-three/fiber";
import {Model} from "./components/model/Model";
import {UploadedFileProp} from "app/App";
import {useFileReader} from "./hooks";
import sceneStyles from "pages/home/styles/scene.module.scss";
import {getFileExtension} from "app/helpers/global";
import {Provider} from "react-redux";
import {store} from "app/store";

// If we want to use redux store in components that are inside react-fiber-three canvas:
// https://github.com/pmndrs/react-three-fiber/issues/43
// https://spectrum.chat/react-three-fiber/general/redux-state-to-child-component-of-canvas~a0cce2c2-2254-44a2-82c7-952e37e1a1ff

/** Main 3D scene. */
export const Scene = ({uploadedFile}: UploadedFileProp) => {

	const uploadedFileData: string | undefined = useFileReader(uploadedFile);
	const [fileExtension, setFileExtension] = useState<string>("");

	useEffect(() => {
		if (uploadedFile !== undefined)
			setFileExtension(getFileExtension(uploadedFile.name));
	}, [uploadedFile]);

	return (<>
		<div className={sceneStyles.container}>
			<Suspense fallback={<Loader/>}>
				{/* https://github.com/pmndrs/react-three-fiber/issues/304 */}
				<Canvas
					style={{width: "100%", height: "100%", paddingRight: "280px"}}
					onCreated={state => state.gl.setClearColor("#0a0a0a")}
				>
					<Provider store={store}>
						<Model fileData={uploadedFileData} fileExtension={fileExtension as "ply" | "xyz" | "xyzrgb" | "pcd"}/>
					</Provider>
				</Canvas>
			</Suspense>
		</div>
	</>)
}

const Loader = () => {
	return (
		<div style={{position: "absolute", width: "100%", height: "100%", color: "white", zIndex: 1}}
								className="d-flex align-content-center justify-content-center flex-wrap"
		>
			Loading 3D scene...
		</div>
	)
}