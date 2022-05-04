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
import {YesNoModal} from "components/YesNoModal";
import defaultStyles from "app/styles/defaults.module.scss";
import {
	ArrowClockwise,
	ArrowLeft,
	ArrowRight,
	CaretDownFill,
	Check,
	FileEarmarkZip,
	FiletypeJson,
	Folder2Open
} from "react-bootstrap-icons";

/** Top control panel = navigation menu.
 *  Functionality:
 *    - upload to frontend and backend
 *    - pick algorithms
 *    - convert
 *    - switch fullscreen mode.
 * */
export const TopControlPanel = ({setUploadedFile}: UploadFileProps) => {

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

	const renderedCategories = new Set<AlgorithmCategory>();

	return (
	  <Navbar variant="dark" className={`${styles.navbar}`}>
		  <Container fluid={true}>
			  <Nav className="me-auto ms-3" as="ul">
				  <Nav.Item as="li">
					  <Nav.Link onClick={() => backendState === undefined ? openUploadFileDialog() : setShowYesNoModal(true)}>
							<div className="d-flex align-items-center">
								<Folder2Open size={22} color={defaultStyles.textColor} className="me-1"/>
								Upload
							</div>
						</Nav.Link>
						<input type="file"
									 onChange={handleFileUpload}
									 accept={config.acceptedFileExtensionsForVisualization}
									 ref={uploadInputFile}
									 hidden
						/>
						<YesNoModal show={showYesNoModal}
												setShow={setShowYesNoModal}
												headline="Do you wish to continue?"
												text="Uploading a new object will overwrite your current state of work. Do you wish to continue?"
												handleYes={openUploadFileDialog}
						/>
				  </Nav.Item>
					<Nav.Item as="li">
						<Nav.Link onClick={openLoadJsonFileDialog}>
							<div className="d-flex align-items-center">
								<Folder2Open size={22} color={defaultStyles.textColor} className="me-1"/>
								Load State
							</div>
						</Nav.Link>
						<input type="file"
									 onChange={handleJsonFileUpload}
									 accept=".json"
									 ref={loadInputJsonFile}
									 hidden
						/>
					</Nav.Item>
				  <NavDropdown title={
						<div className="d-flex align-items-center">
							<CaretDownFill size={18} color={defaultStyles.textColor} className="me-1" />
							Algorithms
						</div>
					} as="li">
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
					  <Nav.Link onClick={handleConvertClick}>
							<div className="d-flex align-items-center">
								<FileEarmarkZip size={21} color={defaultStyles.textColor} className="me-1" />
								Convert
							</div>
						</Nav.Link>
				  </Nav.Item>
				  <Nav.Item as="li">
					  <Nav.Link onClick={handleExportClick} disabled={backendState === undefined}>
							<div className="d-flex align-items-center">
								<FileEarmarkZip size={21} color={defaultStyles.textColor} className="me-1" />
								Export
							</div>
						</Nav.Link>
				  </Nav.Item>
					<Nav.Item as="li">
						{backendState === undefined
							? <Nav.Link disabled>
									<div className="d-flex align-items-center">
										<FiletypeJson size={21} color={defaultStyles.textColor} className="me-1" />
										Save
									</div>
								</Nav.Link>
							: <Nav.Link
									href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backendState))}`}
									download={`3d_model_v${backendState!.version}.json`}
								>
								<div className="d-flex align-items-center">
									<FiletypeJson size={21} color={defaultStyles.textColor} className="me-1" />
									Save
								</div>
								</Nav.Link>
						}
					</Nav.Item>
					<NavDropdown title={
						<div className="d-flex align-items-center">
							<CaretDownFill size={18} color={defaultStyles.textColor} className="me-1" />
							Visualization
						</div>
					} as="li">
						<NavDropdown.Item onClick={() => dispatch(setVisualizationMode(VISUALIZATION_MODE.POINT_CLOUD))}>
							<div className="d-flex align-items-center justify-content-between">
								Point cloud
								{visualizationMode === VISUALIZATION_MODE.POINT_CLOUD && <Check size={24} />}
							</div>
						</NavDropdown.Item>
						<NavDropdown.Item onClick={() => dispatch(setVisualizationMode(VISUALIZATION_MODE.MESH))}>
							<div className="d-flex align-items-center justify-content-between">
								Mesh
								{visualizationMode === VISUALIZATION_MODE.MESH && <Check size={24} />}
							</div>
						</NavDropdown.Item>
					</NavDropdown>
			  </Nav>
			  <Nav className="me-3 align-items-center" as="ul">
				  <Nav.Item as="li">
					  <Nav.Link onClick={handlePrevClick} disabled={backendState === undefined || backendState.version === 1}>
							<ArrowLeft size={21} color={defaultStyles.textColor} />
						</Nav.Link>
				  </Nav.Item>
				  <Nav.Item as="li">
					  <Nav.Link onClick={handleNextClick} disabled={backendState === undefined || backendState.version === backendState.highestVersion}>
							<ArrowRight size={21} color={defaultStyles.textColor} />
						</Nav.Link>
				  </Nav.Item>
				  <Nav.Item as="li">
					  <Nav.Link onClick={handleResetClick} disabled={backendState === undefined || backendState.version === 1}>
							<ArrowClockwise size={21} color={defaultStyles.textColor} />
						</Nav.Link>
				  </Nav.Item>
				  <Nav.Item as="li" className="ms-3">
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