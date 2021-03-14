import React, { useState, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/scss/main.scss';
import { toastInit } from '~/utils';
import { bookingLessonAPI, getLessonBookAPI } from '~/api/studentAPI';
import { FETCH_ERROR, MAX_200 } from '~components/common/Constant/toast';

import './BookingLessonModal.module.scss';

const BookingLessonModal = ({
	style,
	StudyTimeID,
	LessionName = '',
	LessionMaterial = '',
	TeacherUID,
	TeacherIMG = null,
	TeacherName,
	Rate,
	date,
	start,
	end,
	note = '',
	DocumentName = '',
	BookingID,
	onBook,
}) => {
	const [state, setState] = useState('');
	const [bookState, setBookState] = useState(null);
	const bookingToastFail = () => toast.error(FETCH_ERROR, toastInit);
	const bookingToastFail2 = (text) => toast.error(text, toastInit);
	const requireLessonAlert = () => toast.warn(MAX_200, toastInit);

	const fetchAPI = async (params) => {
		const res = await bookingLessonAPI(params);
		if (res.Code === 1)
			onBook && onBook(TeacherUID, StudyTimeID, date, res.Code);
		else if (!!res && res.Message) bookingToastFail2(res.Message);
		else bookingToastFail();
	};

	const getLessonToBookingAPI = async () => {
		const res = await getLessonBookAPI();
		if (res.Code === 1) {
			setBookState({
				...res.Data,
				Code: 1,
			});
		} else if (res.Code === 0) {
			setBookState({
				Message: res.Message,
				Code: 0,
			});
		}
	};

	const handleBookingLesson = () => {
		if (state.length > 200) {
			requireLessonAlert();
		} else {
			fetchAPI({
				TeacherUID,
				Date: date,
				StudyTimeID,
				DocumentID: bookState.DocumentID,
				DocumentDetailID: bookState.ID,
				SpecialRequest: state,
			});
			$('#md-book-schedule').fadeOut(500, function () {
				$('#md-book-schedule').modal('hide');
			});
		}
	};

	useEffect(() => {
		getLessonToBookingAPI();
		setState('');
		feather.replace();
	}, [TeacherUID, StudyTimeID, date]);

	useEffect(() => {
		getLessonToBookingAPI();
	}, []);

	return !!bookState ? (
		bookState.Code === 0 ? (
			<div
				className="modal fade effect-scale"
				id="md-book-schedule"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="active-slot"
				aria-hidden="true"
			>
				<div
					className="modal-dialog modal-dialog-centered modal-sm"
					role="document"
				>
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
							<p className="tx-danger">{bookState.Message}</p>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-primary"
								data-dismiss="modal"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		) : (
			<div
				className="modal effect-scale"
				tabIndex="-1"
				role="dialog"
				id="md-book-schedule"
			>
				<div
					className="modal-dialog modal-dialog-centered modal-lg"
					role="document"
				>
					<div className="modal-content">
						<form action="" className="">
							<div className="modal-body">
								<div className="cr-item lesson-info">
									<div className="media">
										<div className="teacher-information">
											<a
												className="teacher-avatar"
												href={`teacherDetail?ID=${TeacherUID}`}
											>
												<img
													src={
														TeacherIMG === null
															? `/static/assets/img/${TeacherIMG}`
															: TeacherIMG
													}
													className="teacher-image"
													alt=""
													onError={(e) => {
														e.target.onerror = null;
														e.target.src =
															'/static/assets/img/default-avatar.png';
													}}
												/>
												<p className="course-teacher tx-14 tx-gray-800 tx-normal mg-b-0 tx-center mg-t-5 d-block">
													{TeacherName}
												</p>
											</a>
										</div>
										<div className="media-body  mg-l-20 pos-relative pd-b-0-f">
											<h5 className="mg-b-10 d-flex align-items-center">
												<span className="badge badge-warning mg-r-5">
													Incoming
												</span>{' '}
												<span className="no-hl course-name tx-bold">
													{bookState.LessionName}
												</span>
											</h5>
											<div className="course-information tx-14">
												<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
													<i
														className="feather-16 mg-r-5"
														data-feather="calendar"
													></i>
													{date}
												</span>
												<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
													<i
														className="feather-16 mg-r-5"
														data-feather="clock"
													></i>
													{`Bắt đầu: ${start}`}
												</span>
												<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
													<i
														className="feather-16 mg-r-5"
														data-feather="clock"
													></i>
													{`Kết thúc: ${end}`}
												</span>
											</div>
											{/*
                        note && <div className="course-note mg-t-15">
                          <h6 className="mg-b-3">Lesson notes:</h6>
                          <p className="tx-14 mg-b-0">{note}</p>
                        </div>
                      */}
											{/*
                        DocumentName && <div className="course-docs mg-t-15">
                          <h6 className="mg-b-3">Documents:</h6>
                          <div>
                            <a href={LessionMaterial} target="_blank">{DocumentName}</a>
                          </div>
                        </div>
                      */}
											<div className="required-list mg-t-15 bd-t pd-t-15">
												<div className="required-text-box metronic-form">
													<label className="tx-medium">
														Ghi chú cho giáo viên:
													</label>
													<label className="tx-danger d-block">
														Vui lòng viết bằng Tiếng Anh (tối đa 200 ký tự)
													</label>
													<div className="form-group mg-b-5-f">
														<textarea
															name="message"
															rows="4"
															className="form-control"
															placeholder="Nội dung..."
															value={state}
															onChange={(e) => setState(e.target.value)}
														></textarea>
													</div>
													<label className="text-right d-block">
														{`${
															state.length > 0
																? `Bạn đã nhập ${state.length} ký tự`
																: '*'
														}`}
													</label>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-light"
									data-dismiss="modal"
								>
									Đóng
								</button>
								<button
									type="button"
									className="btn btn-primary"
									onClick={handleBookingLesson}
								>
									Đăng ký
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	) : (
		<div
			className="modal fade effect-scale"
			id="md-book-schedule"
			tabIndex="-1"
			role="dialog"
			aria-labelledby="active-slot"
			aria-hidden="true"
		>
			<div
				className="modal-dialog modal-dialog-centered modal-sm"
				role="document"
			>
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
						<p className="tx-danger">Đã có lỗi xảy ra, xin vui lòng thử lại</p>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-primary"
							data-dismiss="modal"
						>
							Đóng
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookingLessonModal;
