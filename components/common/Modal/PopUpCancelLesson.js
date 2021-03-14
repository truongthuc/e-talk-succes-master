import React from 'react';
const PopUpCancelLesson = ({ LessionName, date, start, end, reason }) => {
	return (
		<div
			className="modal fade effect-scale"
			id="md-cancel-schedule-popup"
			tabIndex="-1"
			role="dialog"
			aria-labelledby="active-slot"
			aria-hidden="true"
		>
			<div
				className="modal-dialog modal-dialog-centered modal-md"
				role="document"
			>
				<div className="modal-content">
					<div className="modal-header bg-gray-600">
						<h5 className="modal-title tx-white">
							Buổi học của bạn đã được hủy
						</h5>
						<button
							type="button"
							className="close"
							data-dismiss="modal"
							aria-label="Close"
						>
							<span className="tx-white" aria-hidden="true">
								&times;
							</span>
						</button>
					</div>
					<div className="modal-body">
						<p>
							Tên buổi học:{' '}
							<span className="tx-medium">{LessionName || ''}</span>
						</p>
						<p>
							Ngày học: <span className="tx-medium">{date || ''}</span>
						</p>
						<p>
							Giờ học:{' '}
							<span className="tx-medium">{`${start || ''} - ${
								end || ''
							}`}</span>
						</p>
						<p>
							Lý do hủy: <span className="tx-medium">{reason || ''}</span>
						</p>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-dark" data-dismiss="modal">
							Đóng
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default PopUpCancelLesson;
