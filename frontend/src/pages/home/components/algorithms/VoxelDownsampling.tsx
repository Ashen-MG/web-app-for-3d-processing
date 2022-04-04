import styles from "../panels/styles/sidebar.module.scss";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {useMutation} from "react-query";
import {apiVoxelDownsampling} from "app/adapters";
import {useState} from "react";
import {FileState, setBackendState} from "app/context/globalSlice";
import {useDispatch} from "react-redux";
import {useAppSelector} from "app/hooks";
import {RootState} from "app/store";

export const VoxelDownsampling = () => {

	const dispatch = useDispatch();
	const backendState: FileState | undefined = useAppSelector((state: RootState) => state.global.backendState);

	const [voxelSize, setVoxelSize] = useState<string>("");

	const mutation = useMutation(apiVoxelDownsampling, {
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
			voxelSize: parseFloat(voxelSize)
		});
	}

	return (<>
		<header>
			<h2 className={`${styles.sidebarHeader}`}>Voxel Downsampling</h2>
		</header>
		<hr />
		{/* <FormRange onChange={(e) => console.log(e.currentTarget.value)} /> */}
		<FloatingLabel
			controlId="floatingInput"
			label="Voxel size"
			className="mb-3"
		>
			<Form.Control
				className="algorithmParameter"
				type="text"
				placeholder="voxel size"
				value={voxelSize}
				onChange={(e) => setVoxelSize((e.currentTarget as HTMLInputElement).value)
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