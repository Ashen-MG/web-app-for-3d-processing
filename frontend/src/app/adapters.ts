import {axiosProvider as axios} from "app/axios_provider";
import {AxiosResponse} from "axios";
import {NewVersionState} from "./context/globalSlice";

export type DefaultResponse = {
	fileURL: string
};

export interface CurrentVersion {
	token: string,
	version: number,
	fileExtension: string
}

export const apiUpload = (file: File): Promise<AxiosResponse<NewVersionState>> => {
	const formData = new FormData();
	formData.append("file", file);
	return axios.post("/upload", formData);
}

export const apiVoxelDownsampling = (props: CurrentVersion & {voxelSize: number}): Promise<AxiosResponse<NewVersionState>> => {
	return axios.put("/algorithms/voxel-downsampling", props);
}

export const apiConvert = (convertTypes: string[]): Promise<AxiosResponse<DefaultResponse>> => {
	return axios.post("/convert", {
		convertTypes: convertTypes
	});
}