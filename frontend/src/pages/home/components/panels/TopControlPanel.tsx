import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Switch from "react-bootstrap/Switch";
import styles from "./styles/navbar.module.scss";
import {useDispatch} from "react-redux";
import {
	Algorithms,
	NewVersionState,
	setBackendState,
	setFullscreen,
	setSelectedAlgorithm,
	showConvertModal
} from "app/context/globalSlice";
import {useAppSelector} from "app/hooks";
import {RootState} from "app/store";
import config from "config";
import React, {useRef} from "react";
import {UploadFileProps} from "app/App";
import {useMutation} from "react-query";
import {apiUpload} from "app/adapters";
import createSnackbar, {SnackTypes} from "components/Snackbar";

/** Top control panel = navigation menu.
 *  Options:
 *    - upload to frontend and backend
 *    - pick algorithms
 *    - convert
 *    - switch fullscreen mode.
 * */
export const TopControlPanel = ({uploadedFile, setUploadedFile}: UploadFileProps) => {

	const dispatch = useDispatch();
	const fullscreenOn: boolean = useAppSelector((state: RootState) => state.global.fullscreen);
	const backendState: NewVersionState | undefined = useAppSelector((state: RootState) => state.global.backendState);

	const inputFile = useRef<HTMLInputElement | null>(null);

	const openFileDialog = () => inputFile.current?.click();

	const uploadMutation = useMutation(apiUpload, {
		onSuccess: (response) => {
			dispatch(setBackendState(response.data));
		},
		onError: (error) => {
			console.error(error);
			createSnackbar("Uploading to server wasn't successful.", SnackTypes.error);
		},
	});

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		// file will be undefined if user close the file dialog without picking some file
		const file: File | undefined = e.target.files?.[0];
		if (file !== undefined) {
			setUploadedFile(file);
			uploadMutation.mutate(file);
		}
	}

	return (
	  <Navbar bg="dark" variant="dark" className={`${styles.navbar}`}>
		  <Container fluid={true}>
			  <Nav className="me-auto ms-3" as="ul">
				  <Nav.Item as="li">
					  <Nav.Link onClick={openFileDialog}>Upload</Nav.Link>
				  </Nav.Item>
				  <input type="file"
				         onChange={handleFileUpload}
				         accept={config.acceptedFileExtensions}
				         ref={inputFile}
				         hidden
				  />
				  <NavDropdown title="Algorithms" id="collasible-nav-dropdown" as="li">
					  {/* TODO: option to see outliers with different color (maybe in sidebar as checkbox) */}
					  <NavDropdown.Header>Downscale</NavDropdown.Header>
					  <NavDropdown.Item
						  onClick={() => dispatch(setSelectedAlgorithm(Algorithms.VOXEL_DOWNSAMPLING))}
					  >
						  Voxel downsampling
					  </NavDropdown.Item>
					  <NavDropdown.Header>Denoise</NavDropdown.Header>
					  <NavDropdown.Item href="#action/3.1">Statistical outlier removal</NavDropdown.Item>
					  <NavDropdown.Item href="#action/3.2">Radius outlier removal</NavDropdown.Item>
				  </NavDropdown>
				  <Nav.Item as="li">
					  <Nav.Link
						  onClick={() => dispatch(showConvertModal())}
						  disabled={uploadedFile === undefined || backendState === undefined}
					  >
						  Convert
					  </Nav.Link>
				  </Nav.Item>
			  </Nav>
			  <Nav className="me-3" as="ul">
				  <Switch
					  checked={fullscreenOn}
					  onChange={(e) =>
						  dispatch(setFullscreen((e.currentTarget as HTMLInputElement).checked))}
				  />
			  </Nav>
		  </Container>
	  </Navbar>
  )
}