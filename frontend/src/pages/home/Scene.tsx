import React, {useEffect, useRef, useState, Suspense} from 'react';
import {Canvas, useFrame, useLoader} from '@react-three/fiber';
import {Environment, OrbitControls} from '@react-three/drei';
import sceneStyles from "pages/home/styles/scene.module.scss";
import {Model} from "./components/model/Model";
import {socket} from "app/http";
import config from "config";
import {UploadedFileProp} from "../../app/App";

/*
To examine:
https://discourse.threejs.org/t/creating-point-cloud-with-a-points-stream-from-server/5460/2
*/

interface ScenePLYProps {
	file?: File
}

// TODO: handle error if extension is correct but file is broken
const ScenePLY = ({file}: ScenePLYProps) => {

	const [fileDataURL, setFileDataURL] = useState<string>("");

	useEffect(() => {
		if (file === undefined)
			return
		if (!config.supportedFileTypesForVisualization.includes(file.name.split(".").pop()!)) {
			alert("Unsupported file type.");
			return
		}
		const reader: FileReader = new FileReader();
		reader.onload = () => {
			// console.log(sizeOf({filename: file.name, type: file.type, content: reader.result}) / 1000_000, "MB");
			// let base64String = reader.result.split(',').pop(); base64 encoding uses [a-z, A-Z, 0-9, +, /]
			// empirically tested - can only send max to `(reader.result as string).length` <= 999_972.
			// socket.emit("fileUpload", {filename: file.name, type: file.type, content: reader.result})

			// TODO: send file by chunks
			setFileDataURL(reader.result as string);
		}
		// result will be string (for readAsArrayBuffer it would be ArrayBuffer)
		reader.readAsDataURL(file as Blob)
	}, [file])

	return (
		<>
			{ fileDataURL.length !== 0 && <Model fileDataURL={fileDataURL}/> }
		</>
	)
}

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

	return (<>
		<div className={sceneStyles.container}>
			<Suspense fallback={<div>Loading... </div>}>
				{/* https://github.com/pmndrs/react-three-fiber/issues/304 */}
				<Canvas style={{width: "100%", height: "100%"}} onCreated={state => state.gl.setClearColor("#000205")}>
					<ScenePLY file={uploadedFile}/>
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