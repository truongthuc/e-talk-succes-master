import React, { useState, useEffect, useReducer } from 'react';
import { cancelLessonAPI } from '~/api/studentAPI';

const CancelBookingLessonModal = ({
	BookingID,
	LessionName,
	date,
	start,
	end,
	style,
	callback,
}) => {
	const [reason, setReason] = useState('');

	const getAPI = async (params) => {
		/* start: -1 */
		callback && callback(params.BookingID, -1);
		const res = await cancelLessonAPI(params);
		if (res.Code === 1)
			callback &&
				callback(params.BookingID, 1, LessionName, date, start, end, reason);
		else callback && callback(params.BookingID, 0);
	};

	const onSubmitCancelLesson = () => {
		if (reason.length <= 0) {
			return;
		} else {
			getAPI({
				BookingID,
				ReasonCancel: reason,
			});
			$('#md-cancel-schedule').fadeOut(500, function () {
				$('#md-cancel-schedule').modal('hide');
			});
		}
	};

	useEffect(() => {
		setReason('');
	}, [BookingID]);

	return (
		<div
			style={style}
			className="modal fade effect-scale"
			id="md-cancel-schedule"
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
					<div className="modal-header bg-danger">
						<h5 className="modal-title tx-white">Bạn muốn hủy buổi học?</h5>
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
						<p id="newCampaignTitle">
							Tên buổi học:{' '}
							<span className="tx-medium">{LessionName || ''}</span>
						</p>
						<p>
							Ngày học:{' '}
							<span id="js-date-time" className="tx-medium">
								{date || ''}
							</span>
						</p>
						<p>
							Giờ học:{' '}
							<span id="js-start-time" className="tx-medium">{`${
								start || ''
							} - ${end || ''}`}</span>
						</p>
						<div className="metronic-form">
							<div className="form-group">
								<textarea
									className="form-control ht-100"
									placeholder="Lý do hủy"
									value={reason}
									onChange={(e) => setReason(e.target.value)}
								></textarea>
							</div>
						</div>
						<p className="tx-danger">
							Vui lòng điền lý do để chúng tôi hỗ trợ bạn tốt hơn
						</p>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-light"
							data-dismiss="modal"
						>
							Không
						</button>
						<button
							type="button"
							className="btn btn-primary"
							onClick={onSubmitCancelLesson}
						>
							Gửi yêu cầu
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CancelBookingLessonModal;
