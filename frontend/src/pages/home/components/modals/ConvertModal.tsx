import Select from "react-select";
import React, {ChangeEvent, useState} from "react";
import makeAnimated from "react-select/animated";
import {Modal} from "react-bootstrap";
import {useAppSelector} from "app/hooks";
import {RootState} from "app/store";
import {useDispatch} from "react-redux";
import {
	ExportModal,
	hideExportModal, setAlgorithmInProgress, setBackendState
} from "app/context/globalSlice";
import {UploadFile} from "app/App";
import {useMutation} from "react-query";
import {apiConvert, apiExport} from "app/adapters";
import {createApiURI} from "app/helpers/global";
import styles from "./styles/convert_modal.module.scss";
import config from "config";
import createSnackbar, {resolveSnackbar, SnackTypes} from "components/Snackbar";
import {AxiosError, AxiosResponse} from "axios";

type ModalMode = "Export" | "Convert";

/** Modal for creating exports or conversions. */
export const ConvertModal = () => {

	const dispatch = useDispatch();
	const exportModal: ExportModal = useAppSelector((state: RootState) => state.global.exportModal);
	const mode: ModalMode = exportModal.convert ? "Convert" : "Export";

  return (
	  <Modal
		  show={exportModal.shown}
		  onHide={() => dispatch(hideExportModal())}
		  size="lg"
		  aria-labelledby="contained-modal-title-vcenter"
		  centered
	  >
		  <Modal.Header closeButton>
			  <Modal.Title id="contained-modal-title-vcenter" style={{lineHeight: ".5"}}>
					<h4>{`${mode} ${!exportModal.convert ? "uploaded": ""} file`}</h4>
					{exportModal.convert
						?
							<small style={{fontSize: ".5em", color: "rgba(0, 0, 0, .75)"}}>
								Convert a file without the need for initial uploading and visualization.
								This method is faster to use if you want to do conversion only.
							</small>
						:
							<small style={{fontSize: ".5em", color: "rgba(0, 0, 0, .75)"}}>
								Export your current version of the 3D model. If it's a mesh, only a PLY data format will be exported.
							</small>
					}
			  </Modal.Title>
		  </Modal.Header>
		  <Modal.Body>
			  <ModalBody mode={mode}/>
		  </Modal.Body>
		  <Modal.Footer>
			  <button className="btn btn-dark" onClick={() => dispatch(hideExportModal())}>
				  Close
			  </button>
		  </Modal.Footer>
	  </Modal>
  )
}

export interface ConversionOptions {
	value: string,
	label: string
}

const animatedComponents = makeAnimated();

const conversionOptions: ConversionOptions[] = config.acceptedFileExtensionsForConversionOnly.split(",").map(
	fileExtension => {
		const value = fileExtension.trim().replace(".", "");
		return {value: value, label: value }
	}
);

const ModalBody = ({mode}: {mode: ModalMode}) => {

	const backendState = useAppSelector((state: RootState) => state.global.backendState);
	const exportModal: ExportModal = useAppSelector((state: RootState) => state.global.exportModal);
	const [selectedConversionOptions, setSelectedConversionOptions] = useState<ConversionOptions[]>([]);
	const [downloadURI, setDownloadURI] = useState<string | undefined>();
	const [convertFile, setConvertFile] = useState<UploadFile>();
	const [conversionInProgress, setConversionInProgress] = useState<boolean>(false);

	const toastId = "conversionInProgressToast";

	const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
		// file will be undefined if user closes a file dialog without picking some file
		const file: File | undefined = e.target.files?.[0];
		if (file !== undefined)
			setConvertFile(file);
	}

	const handleMutationResponse = {
		onSuccess: (response: AxiosResponse) => {
			resolveSnackbar(toastId, `${exportModal.convert ? "Conversion" : "Export"} finished.`, true);
			setDownloadURI(createApiURI(response.data.fileURL));
		},
		onError: (error: AxiosError) => {
			resolveSnackbar(toastId, `${error.response === undefined ? "Something went wrong." : `${error.response.data.message}`}`, false);
		},
		onSettled: () => {
			setConversionInProgress(false);
		}
	}

	const exportMutation = useMutation(apiExport, handleMutationResponse);
	const convertMutation = useMutation(apiConvert, handleMutationResponse);

	const handleExportClick = () => {
		if (selectedConversionOptions.length === 0) {
			createSnackbar("You have to pick some conversion types.", SnackTypes.warning);
			return;
		}
		if (exportModal.convert) {
			if (convertFile === undefined) return;
			createSnackbar("Converting...", SnackTypes.loading, 5000, toastId);
			convertMutation.mutate({
				file: convertFile,
				convertTypes: selectedConversionOptions.map((convertType) => convertType.value)
			});
		}
		else {
			createSnackbar("Exporting...", SnackTypes.loading, 5000, toastId);
			exportMutation.mutate({
				token: backendState!.token,
				version: backendState!.version,
				highestVersion: backendState!.highestVersion,
				fileExtension: backendState!.fileExtension,
				convertTypes: selectedConversionOptions.map((convertType) => convertType.value)
			});
		}
		setConversionInProgress(true);
	}

	return (<>
		{exportModal.convert &&
        <div className="mb-3">
						<input type="file"
               onChange={handleFileUpload}
               accept={config.acceptedFileExtensionsForConversionOnly}
        		/>
				</div>
		}
		<Select
			className={`${styles.multiselect}`}
			isMulti
			options={conversionOptions}
			isClearable={true}
			components={animatedComponents}
			onChange={(selectedOptions) => setSelectedConversionOptions(selectedOptions as ConversionOptions[])}
		/>
		<div className={`d-flex align-items-baseline mt-3`}>
			<div>
				<button
					onClick={handleExportClick}
					disabled={selectedConversionOptions.length === 0 || (backendState === undefined && !exportModal.convert) ||
										(convertFile === undefined && exportModal.convert) || conversionInProgress
									 }
					className="btn btn-primary"
				>
					{mode}
				</button>
			</div>
			<div className={`ms-4`}>
				{downloadURI !== undefined && <a href={downloadURI} target="_blank">Download</a>}
			</div>
		</div>
	</>)
}