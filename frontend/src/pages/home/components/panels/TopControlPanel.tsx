import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Switch from "react-bootstrap/Switch";
import styles from "./styles/navbar.module.scss";
import {useDispatch} from "react-redux";
import {
	AlgorithmCategory,
	Algorithms,
	BackendState,
	setBackendState,
	setFullscreen,
	setSelectedAlgorithm,
	setVisualizationMode,
	showConvertModal,
	showExportModal,
	VISUALIZATION_MODE
} from "app/context/globalSlice";
import {useAppSelector} from "app/hooks";
import {RootState} from "app/store";
import config from "config";
import React, {ChangeEvent, useRef, useState} from "react";
import {UploadFileProps} from "app/App";
import {useMutation} from "react-query";
import {apiUpload} from "app/adapters";
import createSnackbar, {SnackTypes} from "components/Snackbar";
import Select from "react-select";
import {YesNoModal} from "../../../../components/YesNoModal";

interface VisualizationModeOptions {
	value: VISUALIZATION_MODE,
	label: string
}


/** Top control panel = navigation menu.
 *  Functionality:
 *    - upload to frontend and backend
 *    - pick algorithms
 *    - convert
 *    - switch fullscreen mode.
 * */
export const TopControlPanel = ({uploadedFile, setUploadedFile}: UploadFileProps) => {

	const dispatch = useDispatch();
	const fullscreenOn: boolean = useAppSelector((state: RootState) => state.global.fullscreen);
	const visualizationMode: VISUALIZATION_MODE = useAppSelector((state: RootState) => state.global.visualizationMode);
	const backendState: BackendState | undefined = useAppSelector((state: RootState) => state.global.backendState);
	const algorithms: Algorithms = useAppSelector((state: RootState) => state.global.algorithms);

	const uploadInputFile = useRef<HTMLInputElement | null>(null);
	const openUploadFileDialog = () => {

		uploadInputFile.current?.click();
	}

	const loadInputJsonFile = useRef<HTMLInputElement | null>(null);
	const openLoadJsonFileDialog = () => loadInputJsonFile.current?.click();

	const [showYesNoModal, setShowYesNoModal] = useState<boolean>(false);

	const uploadMutation = useMutation(apiUpload, {
		onSuccess: (response) => {
			dispatch(setBackendState(response.data));
		},
		onError: () => {
			createSnackbar("Uploading to server wasn't successful.", SnackTypes.error);
		},
	});

	const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
		// file will be undefined if user closes a file dialog without picking some file
		const file: File | undefined = e.target.files?.[0];
		if (file !== undefined) {
			setUploadedFile(file);
			uploadMutation.mutate(file);
		}
	}

	const handleJsonFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
		// file will be undefined if user closes a file dialog without picking some file
		const file: File | undefined = e.target.files?.[0];
		if (file !== undefined) {
			const reader: FileReader = new FileReader();
			reader.onload = () => {
				// TODO: json doesn't have to be correct
				dispatch(setBackendState(JSON.parse(reader.result as string)));
			}
			reader.readAsText(file)
		}
	}

	const handleConvertClick = () => {
		dispatch(setFullscreen(false));  // modal isn't shown in fullscreen mode
		dispatch(showConvertModal());
	}

	const handleExportClick = () => {
		dispatch(setFullscreen(false));  // modal isn't shown in fullscreen mode
		dispatch(showExportModal());
	}

	const handlePrevClick = () => {
		const newBackendState: BackendState = JSON.parse(JSON.stringify(backendState!));
		newBackendState.version--;
		dispatch(setBackendState(newBackendState));
	}

	const handleNextClick = () => {
		const newBackendState: BackendState = JSON.parse(JSON.stringify(backendState!));
		newBackendState.version++;
		dispatch(setBackendState(newBackendState));
	}

	const handleResetClick = () => {
		const newBackendState: BackendState = JSON.parse(JSON.stringify(backendState!));
		newBackendState.version = 1;
		dispatch(setBackendState(newBackendState));
	}

	const visualizationModeOptions: VisualizationModeOptions[] = [
		{value: VISUALIZATION_MODE.POINT_CLOUD, label: "point cloud"},
		{value: VISUALIZATION_MODE.MESH, label: "mesh"}
	]

	const renderedCategories = new Set<AlgorithmCategory>();

	return (
	  <Navbar bg="dark" variant="dark" className={`${styles.navbar}`}>
		  <Container fluid={true}>
			  <Nav className="me-auto ms-3" as="ul">
				  <Nav.Item as="li">
					  <Nav.Link onClick={() => setShowYesNoModal(true)}>Upload</Nav.Link>
						<input type="file"
									 onChange={handleFileUpload}
									 accept={config.acceptedFileExtensionsForVisualization}
									 ref={uploadInputFile}
									 hidden
						/>
						<YesNoModal show={showYesNoModal}
												setShow={setShowYesNoModal}
												text="Uploading new object will overwrite your current state of work. Make sure you save it before upload a new model.
												Do you wish to continue?"
												handleYes={openUploadFileDialog}
						/>
				  </Nav.Item>
				  <NavDropdown title="Algorithms" as="li">
						{algorithms.map((algorithm, i) => {
							const categoryIsRendered: boolean = renderedCategories.has(algorithm.category);
							if (!categoryIsRendered)
								renderedCategories.add(algorithm.category);
							return <div key={`menu-algorithm-${i}`}>
								{!categoryIsRendered && <NavDropdown.Header>{algorithm.category}</NavDropdown.Header>}
								<NavDropdown.Item onClick={() => dispatch(setSelectedAlgorithm(i))}>
									{algorithm.name}
								</NavDropdown.Item>
							</div>;
						})}
				  </NavDropdown>
				  <Nav.Item as="li">
					  <Nav.Link onClick={handleConvertClick}>Convert</Nav.Link>
				  </Nav.Item>
				  <Nav.Item as="li">
					  <Nav.Link onClick={handleExportClick} disabled={backendState === undefined}>Export</Nav.Link>
				  </Nav.Item>
				  <Nav.Item as="li">
					  <Select
						  options={visualizationModeOptions}
						  defaultValue={visualizationModeOptions.find(v => v.value === visualizationMode)}
						  onChange={(selectedOption) => {
						  	if (selectedOption) dispatch(setVisualizationMode(selectedOption.value))
						  }}
					  />
				  </Nav.Item>
					<Nav.Item as="li">
						{backendState === undefined
							? <Nav.Link disabled>Save</Nav.Link>
							: <Nav.Link
									href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backendState))}`}
									download={`3d_model_v${backendState!.version}.json`}
								>
									Save
								</Nav.Link>
						}
					</Nav.Item>
					<Nav.Item as="li">
						<Nav.Link onClick={openLoadJsonFileDialog} disabled={backendState === undefined}>
							Load
						</Nav.Link>
						<input type="file"
									 onChange={handleJsonFileUpload}
									 accept=".json"
									 ref={loadInputJsonFile}
									 hidden
						/>
					</Nav.Item>
			  </Nav>
			  <Nav className="me-3 align-items-center" as="ul">
				  {/* TODO: icons */}
				  <Nav.Item as="li">
					  <Nav.Link onClick={handlePrevClick} disabled={backendState === undefined || backendState.version === 1}>prev</Nav.Link>
				  </Nav.Item>
				  <Nav.Item as="li">
					  <Nav.Link onClick={handleNextClick} disabled={backendState === undefined || backendState.version === backendState.highestVersion}>
							next
						</Nav.Link>
				  </Nav.Item>
				  <Nav.Item as="li">
					  <Nav.Link onClick={handleResetClick} disabled={backendState === undefined || backendState.version === 1}>reset</Nav.Link>
				  </Nav.Item>
				  <Nav.Item as="li">
					  <Switch
						  checked={fullscreenOn}
						  onChange={(e) =>
							  dispatch(setFullscreen((e.currentTarget as HTMLInputElement).checked))}
					  />
				  </Nav.Item>
			  </Nav>
		  </Container>
	  </Navbar>
  )
}