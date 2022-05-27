import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FormControlProps} from "react-bootstrap/FormControl";

export interface AlgorithmParameterRange {
	min: number,
	max: number,
	step: number
}

export interface AlgorithmParameter extends FormControlProps {
	apiKey: string,
	range?: AlgorithmParameterRange
}

export enum AlgorithmCategory {
	DENOISE = "Denoise",
	SAMPLING = "Sampling",
	POINT_CLOUD_TO_MESH = "Point cloud to mesh",
	MESH_EDGE_EXTRACTION = "Edge extraction from mesh",
	DEEP_LEARNING = "Deep learning"
}

export interface Algorithm {
	name: string,
	apiPath: string,
	parameters: AlgorithmParameter[],
	category: AlgorithmCategory
}

export type Algorithms = Algorithm[];

export interface BackendState {
	token: string,
	fileExtension: string,
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
	algorithmInProgress: boolean,
	backendState: BackendState | undefined,
	visualizationMode: VISUALIZATION_MODE
}

class LocalStorage {
	public static getVisualizationMode = (): VISUALIZATION_MODE => {
		const visualizationMode: string | null = localStorage.getItem("visualizationMode");
		return visualizationMode === null ? VISUALIZATION_MODE.POINT_CLOUD : JSON.parse(visualizationMode);
	}

	public static setVisualizationMode = (visualizationMode: VISUALIZATION_MODE) =>
		localStorage.setItem("visualizationMode", JSON.stringify(visualizationMode));

	public static getBackendState = (): BackendState | undefined => {
		const backendState: string | null = localStorage.getItem("backendState");
		return backendState === null ? undefined : JSON.parse(backendState);
	}

	public static setBackendState = (backendState: BackendState) =>
		localStorage.setItem("backendState", JSON.stringify(backendState));
}

const initialState: GlobalState = {
	fullscreen: false,
	exportModal: {
		shown: false,
		convert: true
	},
	selectedAlgorithm: -1,
	algorithmInProgress: false,
	backendState: LocalStorage.getBackendState(),
	visualizationMode: LocalStorage.getVisualizationMode(),
	algorithms: [
		{
			name: "Voxel Downsampling",
			category: AlgorithmCategory.SAMPLING,
			apiPath: "/algorithms/voxel-downsampling",
			parameters: [
				{
					placeholder: "Voxel size",
					apiKey: "voxelSize",
					range: {
						min: 0.01,
						max: 10,
						step: 0.01
					}
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
					apiKey: "numberOfPoints",
					range: {
						min: 1,
						max: 100000,
						step: 1
					}
				}
			]
		},
		{
			name: "Fixed Sampling",
			category: AlgorithmCategory.SAMPLING,
			apiPath: "/algorithms/fixed-sampling",
			parameters: [
				{
					placeholder: "Number of points",
					apiKey: "numberOfPoints",
					range: {
						min: 1,
						max: 100000,
						step: 1
					}
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
		},
		{
			name: "Poisson Surface Reconstruction",
			category: AlgorithmCategory.POINT_CLOUD_TO_MESH,
			apiPath: "/algorithms/poisson-surface-reconstruction",
			parameters: [
				{
					placeholder: "Depth",
					apiKey: "depth",
					range: {
						min: 1,
						max: 10,
						step: 1
					}
				}
			]
		},
		{
			name: "Edge Extraction",
			category: AlgorithmCategory.MESH_EDGE_EXTRACTION,
			apiPath: "/algorithms/edge-extraction",
			parameters: [
				{
					placeholder: "Feature angle",
					apiKey: "featureAngle",
					range: {
						min: 1,
						max: 100,
						step: 1
					}
				}
			]
		},
		{
			name: "Sharpen Point Cloud",
			category: AlgorithmCategory.DEEP_LEARNING,
			apiPath: "/algorithms/ml/sharpen-point-cloud",
			parameters: []
		},
		{
			name: "Sharpen Point Cloud Edges",
			category: AlgorithmCategory.DEEP_LEARNING,
			apiPath: "/algorithms/ml/sharpen-point-cloud-edges",
			parameters: []
		}
	]
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
		setAlgorithmInProgress: (state, action: PayloadAction<boolean>) => {
			state.algorithmInProgress = action.payload;
		},
		setBackendState: (state, action: PayloadAction<BackendState>) => {
			LocalStorage.setBackendState(action.payload);
			state.backendState = action.payload;
		},
		setVisualizationMode: (state, action: PayloadAction<VISUALIZATION_MODE>) => {
			LocalStorage.setVisualizationMode(action.payload);
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
	setAlgorithmInProgress,
	setBackendState,
	setVisualizationMode
} = globalSlice.actions;

export default globalSlice.reducer;