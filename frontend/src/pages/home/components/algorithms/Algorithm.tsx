import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {useMutation} from "react-query";
import {apiApplyAlgorithm} from "app/adapters";
import {useEffect, useState} from "react";
import {
	Algorithm as AlgorithmProps,
	BackendState,
	setAlgorithmInProgress,
	setBackendState
} from "app/context/globalSlice";
import {useDispatch} from "react-redux";
import {useAppSelector} from "app/hooks";
import {RootState} from "app/store";
import createSnackbar, {resolveSnackbar, SnackTypes} from "components/Snackbar";
import {Play} from "react-bootstrap-icons"
import sidebarStyles from "../panels/styles/sidebar.module.scss";
import styles from "./algorithm.module.scss";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

export const Algorithm = (props: AlgorithmProps) => {

	const dispatch = useDispatch();
	const backendState: BackendState | undefined = useAppSelector((state: RootState) => state.global.backendState);
	const algorithmInProgress: boolean = useAppSelector((state: RootState) => state.global.algorithmInProgress);

	const [parameters, _setParameters] = useState<string[]>(Array(props.parameters.length).fill(""));

	useEffect(() => {
		_setParameters(Array(props.parameters.length).fill(""));
	}, [props]);

	const setParameters = (parameter: string, i: number) => {
		const _parameters = [...parameters];
		_parameters[i] = parameter;
		_setParameters(_parameters);
	}

	const mutation = useMutation(apiApplyAlgorithm, {
		onSuccess: (response) => {
			dispatch(setBackendState(response.data));
			resolveSnackbar(toastId, "Algorithm has been applied.", true);
		},
		onError: (error) => {
			// TODO: show error from the backend to the user
			console.error(error);
			resolveSnackbar(toastId, "Something went wrong.", false);
		},
		onSettled: () => {
			dispatch(setAlgorithmInProgress(false));
		}
	});

	const toastId = "testToast"

	const applyAlgorithm = () => {
		// TODO: more validation checks (min, max values etc.)
		const apiAlgParams = props.parameters.map((p, i) => [p.apiKey, parseFloat(parameters[i])]);
		for (let i = 0; i < apiAlgParams.length; i++) {
			if (!apiAlgParams[i][1]) {
				createSnackbar(<span><b>{props.parameters[i].placeholder}</b> has invalid value.</span>, SnackTypes.error);
				return;
			}
		}
		dispatch(setAlgorithmInProgress(true));
		createSnackbar("Applying the algorithm...", SnackTypes.loading, 5000, toastId);
		mutation.mutate({
			currentVersion: {
				token: backendState!.token,
				version: backendState!.version,
				highestVersion: backendState!.highestVersion,
				fileExtension: backendState!.fileExtension,
			},
			apiPath: props.apiPath,
			algorithmParameters: Object.fromEntries(apiAlgParams)
		});
	}

	return (<>
		<header className={`${sidebarStyles.sidebarHeader}`}>
			<h2 className={`${sidebarStyles.sidebarTitle}`}>{props.name}</h2>
		</header>
		<hr />
		{props.parameters.map((parameter, i) => (
			<FloatingLabel
				key={`algorithmParameter${i}`}
				label={parameter.placeholder}
				className="mb-3"
			>
				<Form.Control
					className={styles.algorithmParameter}
					type="text"
					placeholder={parameter.placeholder}
					value={parameters[i]}
					onChange={(e) => setParameters(e.currentTarget.value, i)}
				/>
				{parameter.range !== undefined &&
            <Form.Range
                min={parameter.range.min}
                max={parameter.range.max}
                step={parameter.range.step}
                value={parameters[i]} onChange={(e) => setParameters(e.currentTarget.value, i)}
            />
				}
			</FloatingLabel>
		))}
		<OverlayTrigger
			placement="left"
			overlay={
				backendState === undefined
					? <Tooltip>There needs to be a file uploaded before applying an algorithm.</Tooltip>
					:
				algorithmInProgress
					? <Tooltip>There's another algorithm currently running.</Tooltip>
					: <></>
			}
		>
			<div className="d-inline-block">
				<button
					className="btn btn-info"
					onClick={applyAlgorithm}
					disabled={backendState === undefined || algorithmInProgress}
				>
					<div className="d-flex"><Play size={25}/> Run</div>
				</button>
			</div>
		</OverlayTrigger>
		<hr style={{width: "12%"}}/>
	</>)
}