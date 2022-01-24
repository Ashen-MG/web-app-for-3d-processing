import React, {useEffect, useRef, useState, Suspense} from 'react';
import {Canvas, useFrame, useLoader} from '@react-three/fiber';
import {Environment, OrbitControls} from '@react-three/drei';
import sceneStyles from "pages/home/styles/scene.module.scss";
import {Model} from "./components/model/Model";
import {socket} from "app/http";
import config from "config";
import {UploadedFileProp} from "../../app/App";
import {useFileReader} from "./hooks";
import {RootState, store} from "../../app/store";
import {Provider} from "react-redux";
import {useAppSelector} from "../../app/hooks";

export const Scene = ({uploadedFile}: UploadedFileProp) => {

	/* socketio example
	const processingResponse = (file: string) => {}
	socket.on("processingResponse", processingResponse);
	useEffect(() => {
		return () => {
			socket.off("processingResponse", processingResponse);
		}
	});
	 */

	// TODO: rename it - original file data url isn't really url
	const fileDataURL = useFileReader(uploadedFile);

	const currentBackendFileUrl: string | undefined
		= useAppSelector((state: RootState) => state.global.currentBackendFileUrl);

	// if we want to use redux story in components that are inside canvas:
	// https://github.com/pmndrs/react-three-fiber/issues/43
	// https://spectrum.chat/react-three-fiber/general/redux-state-to-child-component-of-canvas~a0cce2c2-2254-44a2-82c7-952e37e1a1ff

	return (<>
		<div className={sceneStyles.container}>
			<Suspense fallback={<div>Loading... </div>}>
				{/* https://github.com/pmndrs/react-three-fiber/issues/304 */}
				<Canvas style={{width: "100%", height: "100%"}} onCreated={state => state.gl.setClearColor("#000205")}>
					{
						fileDataURL.length !== 0 &&
							<Model fileDataURL={currentBackendFileUrl === undefined ? fileDataURL: currentBackendFileUrl}/>
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