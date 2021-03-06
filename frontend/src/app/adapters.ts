/** Adapters, functions that call the back-end API. */

import {axiosProvider as axios} from "app/axios_provider";
import {AxiosResponse} from "axios";
import {BackendState} from "./context/globalSlice";
import {getRandomString} from "./helpers/global";

export type DefaultResponse = {
	fileURL: string
};

export const apiUpload = (file: File): Promise<AxiosResponse<BackendState>> => {
	const formData = new FormData();
	formData.append("file", file);
	return axios.post("/upload", formData);
}

export const apiApplyAlgorithm = (props: {currentVersion: BackendState, apiPath: string, algorithmParameters: object}): Promise<AxiosResponse<BackendState>> => {
	return axios.put(props.apiPath, {...props.currentVersion, ...props.algorithmParameters});
}

export const apiExport = (props: BackendState & {convertTypes: string[]}): Promise<AxiosResponse<DefaultResponse>> => {
	return axios.post("/export", props);
}

export const apiConvert = (props: {file: File, convertTypes: string[]}): Promise<AxiosResponse<DefaultResponse>> => {
	const formData = new FormData();
	formData.append("file", props.file);
	formData.append("convertTypes", JSON.stringify(props.convertTypes));
	return axios.post("/convert", formData);
}

/** Access back-end file based on `backendState`.
 *  Note: Random string as query parameter is added to prevent browser from showing cached results. */
export const getStaticURI = (backendState: BackendState): string =>
	`/static/uploads/${backendState.token}/v${backendState.version}.${backendState.fileExtension}?=${getRandomString(32)}`;