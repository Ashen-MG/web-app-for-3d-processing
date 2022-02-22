import styles from "../panels/styles/sidebar.module.scss";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {useMutation} from "react-query";
import {apiRadiusOutlierRemoval} from "app/adapters";
import {useState} from "react";
import {FileState, setBackendState} from "app/context/globalSlice";
import {useDispatch} from "react-redux";
import {useAppSelector} from "app/hooks";
import {RootState} from "app/store";
import createSnackbar, {SnackTypes} from "components/Snackbar";

export const RadiusOutlierRemoval = () => {

	const dispatch = useDispatch();
	const backendState: FileState | undefined = useAppSelector((state: RootState) => state.global.backendState);

	const [numberOfPoints, setNumberOfPoints] = useState<string>("");
	const [radius, setRadius] = useState<string>("");

	const mutation = useMutation(apiRadiusOutlierRemoval, {
		onSuccess: (response) => {
			dispatch(setBackendState(response.data));
		},
		onError: (error) => {
			console.error(error);
		}
	});

	const applyAlgorithm = () => {
		const _numberOfPoints = parseFloat(numberOfPoints);
		const _radius = parseFloat(radius);
		if (!_numberOfPoints || !_radius) {
			createSnackbar("Invalid value of parameter.", SnackTypes.error);
			return;
		}
		mutation.mutate({
			token: backendState!.token,
			version: backendState!.version,
			fileExtension: backendState!.file.extension,
			numberOfPoints: _numberOfPoints,
			radius: _radius
		});
	}

	return (<>
		<header>
			<h2 className={`${styles.sidebarHeader}`}>Radius Outlier Removal</h2>
		</header>
		<hr />
		<FloatingLabel
			controlId="floatingNbPointsInput"
			label="Number of points"
			className="mb-3"
		>
			<Form.Control
				className="algorithmParameter"
				type="text"
				placeholder="Number of points"
				value={numberOfPoints}
				onChange={(e) => setNumberOfPoints((e.currentTarget as HTMLInputElement).value)
				}
			/>
		</FloatingLabel>
		<FloatingLabel
			controlId="floatingRadiusInput"
			label="Radius"
			className="mb-3"
		>
			<Form.Control
				className="algorithmParameter"
				type="text"
				placeholder="Radius"
				value={radius}
				onChange={(e) => setRadius((e.currentTarget as HTMLInputElement).value)
				}
			/>
		</FloatingLabel>
		<button
			className="btn btn-info"
			onClick={applyAlgorithm}
		>
			Run
		</button>
	</>)
}