import React from 'react';
import { Modal } from 'react-bootstrap';
const CancelSlotModal = ({
	data,
	handleCancelSlot,
	closeModal,
	showModal,
	loading,
}) => {
	const [reason, setReason] = React.useState('');
	const _onSubmit = (e) => {
		e.preventDefault();
		handleCancelSlot(reason);
		setReason('');
	};
	return (
		<Modal
			show={showModal}
			// backdrop="static"   //Prevent close when click overlay
			keyboard={false}
			centered
			onHide={closeModal}
		>
			<Modal.Header closeButton>
				<Modal.Title>Confirm cancel booked</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p className="tx-danger">Please enter cancel reason: </p>

				<div className="form-group mg-b-0">
					<textarea
						rows={3}
						className="form-control"
						placeholder="Your reason..."
						value={reason}
						onChange={(e) => setReason(e.target.value)}
					></textarea>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<button
					type="button"
					className="btn btn-light btn-sm"
					onClick={closeModal}
				>
					Back
				</button>
				<button
					type="button"
					className="btn btn-primary btn-sm tx-primary"
					onClick={_onSubmit}
					disabled={loading}
				>
					Confirm
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default CancelSlotModal;
