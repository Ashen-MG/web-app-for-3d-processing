import styles from "./styles/sidebar.module.scss";
import {useAppSelector} from "app/hooks";
import {RootState} from "app/store";
import {Algorithms} from "app/context/globalSlice";
import {VoxelDownsampling} from "../algorithms/VoxelDownsampling";

/** Sidebar algorithm and its parameters control panel. */
export const SidebarControlPanel = () => {

	const algorithm: Algorithms = useAppSelector((state: RootState) => state.global.selectedAlgorithm);

	const renderSwitch = (algorithm: Algorithms) => {
		switch (algorithm) {
			case Algorithms.VOXEL_DOWNSAMPLING:
				return <VoxelDownsampling />;
			default:
				return <NoAlgorithmSelected />;
		}
	}

	return (
		<aside className={`${styles.sidebar}`}>
			{ renderSwitch(algorithm) }
		</aside>
	)
}

const NoAlgorithmSelected = () => {
	return (
		<small>Algorithm parameters will show up here.</small>
	)
}