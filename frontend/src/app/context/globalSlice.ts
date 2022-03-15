import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export enum Algorithms {
	NONE,
	VOXEL_DOWNSAMPLING,
	STATISTICAL_OUTLIER_REMOVAL,
	RADIUS_OUTLIER_REMOVAL
}

export interface FileState {
	file: {
		url: string,
		extension: string
	}
	token: string,
	version: number
}

export enum VISUALIZATION_MODE {
	POINT_CLOUD,
	MESH
}

export interface GlobalState {
	fullscreen: boolean,
	convertModalShown: boolean,
	selectedAlgorithm: Algorithms,
	backendState: FileState | undefined,
	visualizationMode: VISUALIZATION_MODE
}

const initialState: GlobalState = {
	fullscreen: false,
	convertModalShown: false,
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
		showConvertModal: (state) => {
			state.convertModalShown = true;
		},
		hideConvertModal: (state) => {
			state.convertModalShown = false;
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
	showConvertModal,
	hideConvertModal,
	setSelectedAlgorithm,
	setBackendState,
	setVisualizationMode
} = globalSlice.actions;

export default globalSlice.reducer;