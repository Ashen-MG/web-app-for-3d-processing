import {useEffect, useState} from "react";
import config from "config";
import {UploadFile} from "app/App";

// TODO: handle error if extension is correct but file is broken
export const useFileReader = (uploadedFile: UploadFile): string => {

	console.log(uploadedFile);

	const [fileDataURL, setFileDataURL] = useState<string>("");

	useEffect(() => {
		if (uploadedFile === undefined)
			return
		if (!config.supportedFileTypesForVisualization.includes(uploadedFile.name.split(".").pop()!)) {
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
		// reader.readAsDataURL(uploadedFile as Blob)
		reader.readAsDataURL(uploadedFile)
	}, [uploadedFile]);

	return fileDataURL;
}