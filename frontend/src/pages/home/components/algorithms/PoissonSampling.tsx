import styles from "../panels/styles/sidebar.module.scss";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {useMutation} from "react-query";
import {apiPoissonSampling} from "app/adapters";
import {useState} from "react";
import {FileState, setBackendState} from "app/context/globalSlice";
import {useDispatch} from "react-redux";
import {useAppSelector} from "app/hooks";
import {RootState} from "app/store";

export const PoissonSampling = () => {

	const dispatch = useDispatch();
	const backendState: FileState | undefined = useAppSelector((state: RootState) => state.global.backendState);

	const [numberOfPoints, setNumberOfPoints] = useState<string>("");

	const mutation = useMutation(apiPoissonSampling, {
		onSuccess: (response) => {
			dispatch(setBackendState(response.data));
		},
		onError: (error) => {
			console.error(error);
		}
	});

	const applyAlgorithm = () => {
		mutation.mutate({
			token: backendState!.token,
			version: backendState!.version,
			highestVersion: backendState!.highestVersion,
			fileExtension: backendState!.file.extension,
			numberOfPoints: parseInt(numberOfPoints)
		});
	}

	return (<>
		<header>
			<h2 className={`${styles.sidebarHeader}`}>Poisson Sampling</h2>
		</header>
		<hr />
		<FloatingLabel
			controlId="floatingInput"
			label="Number of points"
			className="mb-3"
		>
			<Form.Control
				className="algorithmParameter"
				type="text"
				placeholder="number of points"
				value={numberOfPoints}
				onChange={(e) => setNumberOfPoints(e.currentTarget.value)
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