import styles from "./styles/sidebar.module.scss";
import {useAppSelector} from "app/hooks";
import {RootState} from "app/store";
import {Algorithms} from "app/context/globalSlice";
import {VoxelDownsampling} from "../algorithms/VoxelDownsampling";
import {StatisticalOutlierRemoval} from "../algorithms/StatisticalOutlierRemoval";
import {RadiusOutlierRemoval} from "../algorithms/RadiusOutlierRemoval";
import {PoissonSampling} from "../algorithms/PoissonSampling";

/** Sidebar algorithm and its parameters control panel. */
export const SidebarControlPanel = () => {

	const algorithm: Algorithms = useAppSelector((state: RootState) => state.global.selectedAlgorithm);

	const renderSwitch = (algorithm: Algorithms) => {
		switch (algorithm) {
			case Algorithms.VOXEL_DOWNSAMPLING:             return <VoxelDownsampling />;
			case Algorithms.STATISTICAL_OUTLIER_REMOVAL:    return <StatisticalOutlierRemoval />;
			case Algorithms.RADIUS_OUTLIER_REMOVAL:         return <RadiusOutlierRemoval />;
			case Algorithms.POISSON_SAMPLING:               return <PoissonSampling />;
			default:
				return <NoAlgorithm />;
		}
	}

	return (
		<aside className={`${styles.sidebar}`}>
			{ renderSwitch(algorithm) }
		</aside>
	)
}

const NoAlgorithm = () => {
	return (
		<small>Algorithm parameters will show up here.</small>
	)
}