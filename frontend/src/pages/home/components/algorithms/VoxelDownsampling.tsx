import styles from "../panels/styles/sidebar.module.scss";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {useMutation} from "react-query";
import {apiVoxelDownsampling} from "app/adapters";
import {useState} from "react";

export const VoxelDownsampling = () => {

	const [voxelSize, setVoxelSize] = useState<string>("");

	const { mutateAsync: asyncApiCall } = useMutation(["algorithm_voxel_downsampling", voxelSize],
		() => apiVoxelDownsampling(parseFloat(voxelSize)),
		{
			onSuccess: (response) => {
				console.log(response);
			},
			onError: (error) => {
				console.log(error);
			}
		}
	);

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
			onClick={() => asyncApiCall()}
		>
			Run
		</button>
	</>)
}