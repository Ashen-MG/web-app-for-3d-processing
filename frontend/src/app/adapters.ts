import {axiosProvider as axios} from "app/axios_provider";
import {AxiosResponse} from "axios";
import {FileState} from "./context/globalSlice";

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

export const apiVoxelDownsampling = (props: CurrentVersion & {voxelSize: number}): Promise<AxiosResponse<FileState>> => {
	return axios.put("/algorithms/voxel-downsampling", props);
}

export const apiPoissonSampling = (props: CurrentVersion & {numberOfPoints: number}): Promise<AxiosResponse<FileState>> => {
	return axios.put("/algorithms/poisson-sampling", props);
}

export const apiStatisticalOutlierRemoval = (
	props: CurrentVersion & {numberOfNeighbors: number, stdRatio: number}
): Promise<AxiosResponse<FileState>> => {
	return axios.put("/algorithms/statistical-outlier-removal", props);
}

export const apiRadiusOutlierRemoval = (
	props: CurrentVersion & {numberOfPoints: number, radius: number}
): Promise<AxiosResponse<FileState>> => {
	return axios.put("/algorithms/radius-outlier-removal", props);
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