import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ReactNode, ReactText} from "react";

export enum SnackTypes {
	info,
	warning,
	error,
	success,
	loading
}

/** Supported toast refs by types. Order must be the same as in `SnackTypes`. */
const toasts = [toast.info, toast.warn, toast.error, toast.success, toast.loading];

export default function createSnackbar(
	msg: string | ReactNode,
	type: SnackTypes,
	autoClose: number | false = 5000,
	toastId?: string
): ReactText {
	return toasts[type](msg, {
		toastId: toastId,
		position: "bottom-left",
		autoClose: autoClose,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "dark",
		bodyStyle: {color: "white"}
	});
}

export const resolveSnackbar = (toastId: string, msg: string, success: boolean = true) => {
	toast.update(toastId, {
		render: msg,
		type: success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
		autoClose: 3000,
		isLoading: false
	});
}

export const dismissSnackbar = (toastId: string) => {
	toast.dismiss(toastId);
}