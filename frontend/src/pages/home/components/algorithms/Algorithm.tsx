import styles from "../panels/styles/sidebar.module.scss";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {useMutation} from "react-query";
import {apiApplyAlgorithm} from "app/adapters";
import {useEffect, useState} from "react";
import {BackendState, setBackendState} from "app/context/globalSlice";
import {useDispatch} from "react-redux";
import {useAppSelector} from "app/hooks";
import {RootState} from "app/store";
import createSnackbar, {SnackTypes} from "components/Snackbar";
import {Algorithm as AlgorithmProps} from "app/context/globalSlice";
import {Play} from "react-bootstrap-icons"

export const Algorithm = (props: AlgorithmProps) => {

	const dispatch = useDispatch();
	const backendState: BackendState | undefined = useAppSelector((state: RootState) => state.global.backendState);

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
		},
		onError: (error) => {
			console.error(error);
		}
	});

	const applyAlgorithm = () => {
		// TODO: more validation checks (min, max values etc.)
		const apiAlgParams = props.parameters.map((p, i) => [p.apiKey, parseFloat(parameters[i])]);
		for (let i = 0; i < apiAlgParams.length; i++) {
			if (!apiAlgParams[i][1]) {
				createSnackbar(<span><b>{props.parameters[i].placeholder}</b> has invalid value.</span>, SnackTypes.error);
				return;
			}
		}
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
		<header className={`${styles.sidebarHeader}`}>
			<h2 className={`${styles.sidebarTitle}`}>{props.name}</h2>
		</header>
		<hr />
		{props.parameters.map((parameter, i) => (
			<FloatingLabel
				key={`algorithmParameter${i}`}
				label={parameter.placeholder}
				className="mb-3"
			>
				<Form.Control
					className="algorithmParameter"
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
		<button
			className="btn btn-info"
			onClick={applyAlgorithm}
		>
			<div className="d-flex"><Play size={25}/> Run</div>
		</button>
		<hr style={{width: "12%"}}/>
	</>)
}