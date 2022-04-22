import React from "react";
import {Modal} from "react-bootstrap";

interface YesNoModalProps {
	text: string,
	handleYes: Function,
	show: boolean,
	setShow: React.Dispatch<React.SetStateAction<boolean>>
}

export const YesNoModal = ({show, setShow, text, handleYes}: YesNoModalProps) => {

	const handleClose = () => setShow(false);

	return (
		<Modal
			show={show}
			onHide={handleClose}
		>
			<Modal.Header closeButton className="border-none" />
			<Modal.Body>
				<div className="text-center">
					<span>{text}</span>
				</div>
			</Modal.Body>
			<Modal.Footer className="border-none">
				<div>
					<button type="button" className="btn btn-primary me-2"
									onClick={() => {
										handleYes();
										handleClose();
									}}
					>
						Yes
					</button>
					<button type="button" className="btn btn-dark" onClick={handleClose}>No</button>
				</div>
			</Modal.Footer>
		</Modal>
	);
}