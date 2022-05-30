import {useEffect, useState} from "react";
import {UploadFile} from "app/App";

export const useFileReader = (uploadedFile: UploadFile): string | undefined => {

	const [fileData, setFileData] = useState<string | undefined>();

	useEffect(() => {
		if (uploadedFile === undefined)
			return;
		const reader: FileReader = new FileReader();
		reader.onload = () => {
			setFileData(reader.result as string);
		}
		reader.readAsDataURL(uploadedFile)
	}, [uploadedFile]);

	return fileData;
}