import React, { useState, useEffect } from 'react';
import { cancelLesson } from '~/api/optionAPI';
import { toast } from 'react-toastify';
import { toastInit } from '~/utils';

const CancelBookingTeacher = ({
	BookingID,
	LessionName,
	date,
	start,
	end,
	style,
	callback,
}) => {
	const [reason, setReason] = useState('');
	const cancelToastSuccess = () =>
		toast.success('You have canceled a lesson successfully', {
			position: toast.POSITION.TOP_CENTER,
			autoClose: 2000,
		});

	const cancelToastFail = () =>
		toast.error('Cancel lesson fail, some errors happened!', toastInit);

	const reasonTooShortAlert = () => toast('Please fill the reason!', toastInit);

	const getAPI = async (params) => {
		/* start: -1 */
		let status = -1;
		const lessons = await cancelLesson(params);
		status = lessons.Code; /* success:1 , fail: 0*/
		if (status === 1) {
			cancelToastSuccess();
			callback && callback(params.BookingID, status);
		} else {
			toast.error(
				lessons?.Message ?? 'Cancel lesson fail, some errors happened!',
				{
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				},
			);
		}
	};

	const onSubmitCancelLesson = () => {
		if (reason.length <= 0) {
			reasonTooShortAlert();
		} else {
			getAPI({
				BookingID,
				ReasonCancleOfTeacher: reason,
			});
			// $('#md-cancel-schedule').fadeOut(500, function () {
			// 	$('#md-cancel-schedule').modal('hide');
			// });
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
			<div className="modal-dialog modal-dialog-centered" role="document">
				<div className="modal-content">
					<div className="modal-header bg-danger">
						<h5 className="modal-title tx-white">Warning</h5>
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
							Lesson Name:{' '}
							<span className="tx-medium">{LessionName || ''}</span>
						</p>
						<p>
							Date:{' '}
							<span id="js-date-time" className="tx-medium">
								{date || ''}
							</span>
						</p>
						<div className="row">
							<p className="col">
								Start time:{' '}
								<span id="js-start-time" className="tx-medium">
									{start || ''}
								</span>
							</p>
							<p className="col">
								End time:{' '}
								<span id="js-end-time" className="tx-medium">
									{end || ''}
								</span>
							</p>
						</div>

						<div className="form-group">
							<textarea
								rows={3}
								className="form-control"
								placeholder="Reason"
								value={reason}
								onChange={(e) => setReason(e.target.value)}
							></textarea>
						</div>
						<p className="tx-danger">Are you sure to cancel this lesson?</p>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-light"
							data-dismiss="modal"
						>
							No
						</button>
						<button
							type="button"
							className="btn btn-primary"
							onClick={onSubmitCancelLesson}
						>
							Yes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CancelBookingTeacher;
