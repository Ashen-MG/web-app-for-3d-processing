import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export enum Algorithms {
	NONE,
	VOXEL_DOWNSAMPLING,
	STATISTICAL_OUTLIER_REMOVAL,
	RADIUS_OUTLIER_REMOVAL,
	POISSON_SAMPLING
}

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
	selectedAlgorithm: Algorithms,
	backendState: FileState | undefined,
	visualizationMode: VISUALIZATION_MODE
}

const initialState: GlobalState = {
	fullscreen: false,
	exportModal: {
		shown: false,
		convert: true
	},
	selectedAlgorithm: Algorithms.NONE,
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
		setSelectedAlgorithm: (state, action: PayloadAction<Algorithms>) => {
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