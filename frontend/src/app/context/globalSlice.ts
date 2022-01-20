import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export enum Algorithms {
	NONE,
	VOXEL_DOWNSAMPLING
}

export interface GlobalState {
	fullscreen: boolean,
	convertModalShown: boolean,
	selectedAlgorithm: Algorithms
}

const initialState: GlobalState = {
	fullscreen: false,
	convertModalShown: false,
	selectedAlgorithm: Algorithms.NONE
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
	}
});

export const {
	setFullscreen,
	showConvertModal,
	hideConvertModal,
	setSelectedAlgorithm
} = globalSlice.actions;

export default globalSlice.reducer;
