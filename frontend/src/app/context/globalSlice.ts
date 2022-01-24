import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createApiURI} from "../helpers/global";

export enum Algorithms {
	NONE,
	VOXEL_DOWNSAMPLING
}

export interface GlobalState {
	fullscreen: boolean,
	convertModalShown: boolean,
	selectedAlgorithm: Algorithms,
	originalUploadedFileUrl: string | undefined,
	currentBackendFileUrl: string | undefined
}

const initialState: GlobalState = {
	fullscreen: false,
	convertModalShown: false,
	selectedAlgorithm: Algorithms.NONE,
	originalUploadedFileUrl: undefined,
	currentBackendFileUrl: undefined
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
		setOriginalUploadedFileUrl: (state, action: PayloadAction<string>) => {
			state.originalUploadedFileUrl = action.payload;
		},
		setCurrentBackendFileUrl: (state, action: PayloadAction<string>) => {
			state.currentBackendFileUrl = createApiURI(action.payload);
		},
	}
});

export const {
	setFullscreen,
	showConvertModal,
	hideConvertModal,
	setSelectedAlgorithm,
	setOriginalUploadedFileUrl,
	setCurrentBackendFileUrl
} = globalSlice.actions;

export default globalSlice.reducer;
