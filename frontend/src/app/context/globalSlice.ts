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

export interface GlobalState {
	fullscreen: boolean,
	convertModalShown: boolean,
	selectedAlgorithm: Algorithms,
	backendState: FileState | undefined
}

const initialState: GlobalState = {
	fullscreen: false,
	convertModalShown: false,
	selectedAlgorithm: Algorithms.NONE,
	backendState: undefined
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
	}
});

export const {
	setFullscreen,
	showConvertModal,
	hideConvertModal,
	setSelectedAlgorithm,
	setBackendState,
} = globalSlice.actions;

export default globalSlice.reducer;