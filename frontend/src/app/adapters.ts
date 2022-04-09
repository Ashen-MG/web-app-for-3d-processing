import {axiosProvider as axios} from "app/axios_provider";
import {AxiosResponse} from "axios";
import {FileState} from "./context/globalSlice";
import {CurveUtils} from "three";

export type DefaultResponse = {
	fileURL: string
};

export interface CurrentVersion {
	token: string,
	version: number,
	highestVersion: number,
	fileExtension: string
}

export const apiUpload = (file: File): Promise<AxiosResponse<FileState>> => {
	const formData = new FormData();
	formData.append("file", file);
	return axios.post("/upload", formData);
}

export const apiApplyAlgorithm = (props: {currentVersion: CurrentVersion, apiPath: string, algorithmParameters: object}): Promise<AxiosResponse<FileState>> => {
	return axios.put(props.apiPath, {...props.currentVersion, ...props.algorithmParameters});
}

export const apiExport = (props: CurrentVersion & {convertTypes: string[]}): Promise<AxiosResponse<DefaultResponse>> => {
	return axios.post("/export", props);
}

export const apiConvert = (props: {file: File, convertTypes: string[]}): Promise<AxiosResponse<DefaultResponse>> => {
	const formData = new FormData();
	formData.append("file", props.file);
	formData.append("convertTypes", JSON.stringify(props.convertTypes));
	return axios.post("/convert", formData);
}