import styles from "../panels/styles/sidebar.module.scss";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {useMutation} from "react-query";
import {apiStatisticalOutlierRemoval} from "app/adapters";
import {useState} from "react";
import {FileState, setBackendState} from "app/context/globalSlice";
import {useDispatch} from "react-redux";
import {useAppSelector} from "app/hooks";
import {RootState} from "app/store";
import createSnackbar, {SnackTypes} from "components/Snackbar";

export const StatisticalOutlierRemoval = () => {

	const dispatch = useDispatch();
	const backendState: FileState | undefined = useAppSelector((state: RootState) => state.global.backendState);

	const [numberOfNeighbors, setNumberOfNeighbors] = useState<string>("");
	const [stdRatio, setStdRatio] = useState<string>("");

	const mutation = useMutation(apiStatisticalOutlierRemoval, {
		onSuccess: (response) => {
			dispatch(setBackendState(response.data));
		},
		onError: (error) => {
			console.error(error);
		}
	});

	const applyAlgorithm = () => {
		const _numberOfNeighbors = parseFloat(numberOfNeighbors);
		const _stdRatio = parseFloat(stdRatio);
		if (!_numberOfNeighbors || !_stdRatio) {
			createSnackbar("Invalid value of parameter.", SnackTypes.error);
			return;
		}
		mutation.mutate({
			token: backendState!.token,
			version: backendState!.version,
			fileExtension: backendState!.file.extension,
			numberOfNeighbors: _numberOfNeighbors,
			stdRatio: _stdRatio
		});
	}

	return (<>
		<header>
			<h2 className={`${styles.sidebarHeader}`}>Statistical Outlier Removal</h2>
		</header>
		<hr />
		<FloatingLabel
			controlId="floatingNbNeighborsInput"
			label="Number of neighbors"
			className="mb-3"
		>
			<Form.Control
				className="algorithmParameter"
				type="text"
				placeholder="Number of neighbors"
				value={numberOfNeighbors}
				onChange={(e) => setNumberOfNeighbors((e.currentTarget as HTMLInputElement).value)
				}
			/>
		</FloatingLabel>
		<FloatingLabel
			controlId="floatingStdRatioInput"
			label="STD ratio"
			className="mb-3"
		>
			<Form.Control
				className="algorithmParameter"
				type="text"
				placeholder="STD ratio"
				value={stdRatio}
				onChange={(e) => setStdRatio((e.currentTarget as HTMLInputElement).value)
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