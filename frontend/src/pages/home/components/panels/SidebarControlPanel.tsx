import styles from "./styles/sidebar.module.scss";
import {useAppSelector} from "app/hooks";
import {RootState} from "app/store";
import {Algorithms} from "app/context/globalSlice";
import {Algorithm} from "../algorithms/Algorithm";

/** Sidebar algorithm and its parameters control panel. */
export const SideControlPanel = () => {

	const algorithms: Algorithms = useAppSelector((state: RootState) => state.global.algorithms);
	const selectedAlgorithmIndex: number = useAppSelector((state: RootState) => state.global.selectedAlgorithm);

	return (
		<aside className={`${styles.sidebar}`}>
			{selectedAlgorithmIndex === -1 ? <NoAlgorithm/> : <Algorithm {...algorithms[selectedAlgorithmIndex]}/>}
		</aside>
	)
}

const NoAlgorithm = () => <small>Algorithm parameters will show up here.</small>