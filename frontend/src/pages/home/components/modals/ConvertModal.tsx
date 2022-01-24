import Select from "react-select";
import React, {useState} from "react";
import makeAnimated from "react-select/animated";
import {socket} from "app/http";
import {Modal} from "react-bootstrap";
import {useAppSelector} from "app/hooks";
import {RootState} from "app/store";
import {useDispatch} from "react-redux";
import {hideConvertModal, setCurrentBackendFileUrl, showConvertModal} from "app/context/globalSlice";
import {UploadedFileProp} from "app/App";
import {useMutation} from "react-query";
import {apiConvert, apiUpload} from "app/adapters";

export const ConvertModal = ({uploadedFile}: UploadedFileProp) => {

	const dispatch = useDispatch();
	const modalShown: boolean = useAppSelector((state: RootState) => state.global.convertModalShown);

	// TODO: show info about uploaded file in the modal
	// TODO: modal isn't shown in fullscreen mode

  return (
	  <Modal
		  show={modalShown}
		  onHide={() => dispatch(hideConvertModal())}
		  size="lg"
		  aria-labelledby="contained-modal-title-vcenter"
		  centered
	  >
		  <Modal.Header closeButton>
			  <Modal.Title id="contained-modal-title-vcenter">
				  Convert uploaded file
			  </Modal.Title>
		  </Modal.Header>
		  <Modal.Body>
			  <ModalBody uploadedFile={uploadedFile} />
		  </Modal.Body>
		  <Modal.Footer>
			  <button className="btn btn-dark" onClick={() => dispatch(hideConvertModal())}>
				  Close
			  </button>
		  </Modal.Footer>
	  </Modal>
  )
}

export type ConversionOptions = {
	value: string,
	label: string
}

const animatedComponents = makeAnimated();

// TODO: load labels from config
const conversionOptions: ConversionOptions[] = [
	{value: "ply", label: "ply"},
	{value: "xyz", label: "xyz"},
	{value: "xyzrgb", label: "xyzrgb"},
	{value: "pts", label: "pts"},
	{value: "pcd", label: "pcd"}
]

const ModalBody = ({uploadedFile}: UploadedFileProp) => {

	const [selectedConversionOptions, setSelectedConversionOptions] = useState<ConversionOptions[]>([]);

	const { mutateAsync: asyncApiConvert } = useMutation(["convert", selectedConversionOptions],
		() => apiConvert(
			selectedConversionOptions.map((convertType) => convertType.value)
		),
		{
			onSuccess: (response) => {
				// TODO: disable convert button and enable here
				console.log(response);
			},
			onError: (error) => {
				console.log(error);
			}
		}
	);

	const handleConvertClick = () => {
		if (selectedConversionOptions.length !== 0) {
			asyncApiConvert();
			// socket.emit("convert");
		}
		// TODO: else snackbar: Pick some conversion types
	}

	return (<>
		<div style={{width: "400px"}}>
			<Select
				isMulti
				options={conversionOptions}
				isClearable={true}
				components={animatedComponents}
				onChange={(selectedOptions) => setSelectedConversionOptions(selectedOptions as ConversionOptions[])}
			/>
		</div>
		<div>
			<button
				onClick={handleConvertClick}
				disabled={selectedConversionOptions.length === 0 || uploadedFile === undefined}
				className="btn btn-primary mt-3"
			>
				Convert
			</button>
		</div>
	</>)
}