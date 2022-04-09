import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FormControlProps} from "react-bootstrap/FormControl";

// TODO: range props
export interface AlgorithmParameter extends FormControlProps {
	apiKey: string  // TODO: maybe type in case different than number will come (e.g. File, string)
}

export enum AlgorithmCategory {
	DENOISE = "Denoise",
	SAMPLING = "Sampling"
}

export interface Algorithm {
	name: string,
	apiPath: string,
	parameters: AlgorithmParameter[],
	category: AlgorithmCategory
}

export type Algorithms = Algorithm[];

export interface FileState {
	file: {
		url: string,
		extension: string
	}
	token: string,
	version: number,
	highestVersion: number
}

export enum VISUALIZATION_MODE {
	POINT_CLOUD,
	MESH
}

export interface ExportModal {
	shown: boolean,
	convert: boolean
}

export interface GlobalState {
	fullscreen: boolean,
	exportModal: ExportModal,
	algorithms: Algorithms,
	selectedAlgorithm: number,
	backendState: FileState | undefined,
	visualizationMode: VISUALIZATION_MODE
}

const initialState: GlobalState = {
	fullscreen: false,
	exportModal: {
		shown: false,
		convert: true
	},
	algorithms: [
		{
			name: "Voxel Downsampling",
			category: AlgorithmCategory.SAMPLING,
			apiPath: "/algorithms/voxel-downsampling",
			parameters: [
				{
					placeholder: "Voxel size",
					apiKey: "voxelSize"
				}
			]
		},
		{
			name: "Poisson Sampling",
			category: AlgorithmCategory.SAMPLING,
			apiPath: "/algorithms/poisson-sampling",
			parameters: [
				{
					placeholder: "Number of points",
					apiKey: "numberOfPoints"
				}
			]
		},
		{
			name: "Statistical Outlier Removal",
			category: AlgorithmCategory.DENOISE,
			apiPath: "/algorithms/statistical-outlier-removal",
			parameters: [
				{
					placeholder: "Number of neighbors",
					apiKey: "numberOfNeighbors"
				},
				{
					placeholder: "STD ratio",
					apiKey: "stdRatio"
				}
			]
		},
		{
			name: "Radius Outlier Removal",
			category: AlgorithmCategory.DENOISE,
			apiPath: "/algorithms/radius-outlier-removal",
			parameters: [
				{
					placeholder: "Number of points",
					apiKey: "numberOfPoints"
				},
				{
					placeholder: "Radius",
					apiKey: "radius"
				}
			]
		}
	],
	selectedAlgorithm: -1,
	backendState: undefined,
	visualizationMode: VISUALIZATION_MODE.POINT_CLOUD
}

export const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		setFullscreen: (state, action: PayloadAction<boolean>) => {
			state.fullscreen = action.payload;
		},
		showExportModal: (state) => {
			state.exportModal.shown = true;
			state.exportModal.convert = false;
		},
		showConvertModal: (state) => {
			state.exportModal.shown = true;
			state.exportModal.convert = true;
		},
		hideExportModal: (state) => {
			state.exportModal.shown = false;
		},
		setSelectedAlgorithm: (state, action: PayloadAction<number>) => {
			state.selectedAlgorithm = action.payload;
		},
		setBackendState: (state, action: PayloadAction<FileState>) => {
			state.backendState = action.payload;
		},
		setVisualizationMode: (state, action: PayloadAction<VISUALIZATION_MODE>) => {
			state.visualizationMode = action.payload;
		},
	}
});

export const {
	setFullscreen,
	showExportModal,
	showConvertModal,
	hideExportModal,
	setSelectedAlgorithm,
	setBackendState,
	setVisualizationMode
} = globalSlice.actions;

export default globalSlice.reducer;