import React from 'react';
import { Modal } from 'react-bootstrap';
const ActiveSlotModal = ({
	data,
	handleOpenSlot,
	showModal = false,
	closeModal,
	openModal,
}) => {
	const { date = '', start = '', end = '' } = data;
	return (
		<>
			<Modal
				show={showModal}
				// backdrop="static"   //Prevent close when click overlay
				keyboard={false}
				centered
				onHide={closeModal}
				animation={false}
			>
				<Modal.Header closeButton>
					<Modal.Title>Confirm active</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Do you want open slot from:</p>
					<div className="row">
						<div className="col">
							<p>
								Start:{' '}
								<span className="tx-medium" id="js-start-time">
									{start}
								</span>
							</p>
						</div>
						<div className="col">
							<p>
								End:{' '}
								<span className="tx-medium" id="js-end-time">
									{end}
								</span>
							</p>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<button
						type="button"
						className="btn btn-light btn-sm"
						onClick={closeModal}
					>
						Close
					</button>
					<button
						type="button"
						className="btn btn-primary btn-sm tx-primary"
						onClick={handleOpenSlot}
					>
						Open slot
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ActiveSlotModal;
