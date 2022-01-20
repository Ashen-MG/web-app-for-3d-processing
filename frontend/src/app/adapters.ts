import {axiosProvider as axios} from "app/axios_provider";
import {AxiosResponse} from "axios";

export type DefaultResponse = any;

export const apiUpload = (file: File): Promise<AxiosResponse<DefaultResponse>> => {
	const formData = new FormData();
	formData.append("file", file);
	return axios.post("/upload", formData);
}

export const apiVoxelDownsampling = (voxelSize: number): Promise<AxiosResponse<DefaultResponse>> => {
	return axios.post("/algorithms/voxel-downsampling", {
		voxelSize: voxelSize
	});
}