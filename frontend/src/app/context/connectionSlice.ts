import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Socket} from "socket.io-client";

export interface ConnectionState {
	socket: Socket | null
}

const initialState: ConnectionState = {
	socket: null
};

export const connectionSlice = createSlice({
	name: "connection",
	initialState,
	reducers: {
		setSocket: (state, action: PayloadAction<Socket>) => {
			//state.socket = action.payload;
		}
	}
});

export const { setSocket } = connectionSlice.actions;

export default connectionSlice.reducer;
