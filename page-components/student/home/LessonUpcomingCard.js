import React, { useEffect } from 'react';
import styles from './LessonUpcomingCard.module.scss';
import Link from 'next/link';
const LessonUpcomingCard = ({
	BookingID,
	avatar = null,
	TeacherUID,
	TeacherName,
	LessionName,
	LessionMaterial,
	SpecialRequest = null,
	start,
	end,
	date,
	DocumentName = null,
	SkypeID,
	onHandleCancelBooking,
	onHandleRequireLesson,
	lock = {
		id: '',
		lock: false,
	},
	cancelable = false,
}) => {
	const handleRequireLesson = (
		BookingID,
		avatar,
		TeacherUID,
		TeacherName,
		LessionMaterial,
		LessionName,
		SpecialRequest,
		date,
		start,
		end,
		DocumentName,
		SkypeID,
	) => {
		onHandleRequireLesson(
			BookingID,
			avatar,
			TeacherUID,
			TeacherName,
			LessionMaterial,
			LessionName,
			SpecialRequest,
			CourseName,
			date,
			start,
			end,
			DocumentName,
			SkypeID,
		);
	};

	const handleCancelBooking = (e, BookingID, LessionName, date, start, end) => {
		e.preventDefault();
		onHandleCancelBooking(BookingID, LessionName, date, start, end);
	};

	useEffect(() => {
		feather.replace();
	}, []);

	return (
		<li className="cr-item upcoming-lesson lesson-info position-relative">
			<div
				className={`${lock.id === BookingID && lock.lock ? '' : 'd-none'}`}
				style={{
					zIndex: '99',
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
				}}
			></div>
			<div className="media">
				<div className="teacher-information">
					<Link
						href={`/student/teacher-profile/[tid]`}
						as={`/student/teacher-profile/${TeacherUID}`}
					>
						<a href={true} className="teacher-avatar">
							<img
								src={avatar === null ? `/static/assets/img/${avatar}` : avatar}
								className="teacher-image"
								alt="Avatar"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = '/static/assets/img/default-avatar.png';
								}}
							/>
							<p className="course-teacher tx-14 tx-gray-800 tx-normal mg-b-0 tx-center mg-t-5 d-block">
								{TeacherName}
							</p>
						</a>
					</Link>
				</div>
				<div className="media-body mg-l-20 pos-relative">
					<div>
						<h5 className="mg-b-10 mg-t-10 mg-sm-t-0">
							<span className="badge badge-warning">Incoming</span>{' '}
							<span className="no-hl course-name tx-bold">{CourseName}</span>
						</h5>
						<div className="course-information tx-14">
							<span className="mg-r-15 tx-gray-500 d-inline-block">
								<i className="feather-16 mg-r-5" data-feather="calendar"></i>
								{date}
							</span>
							<span className="mg-r-15 tx-gray-500 d-inline-block">
								<i className="feather-16 mg-r-5" data-feather="clock"></i>
								{`Bắt đầu: ${start}`}
							</span>
							<span className="mg-r-15 tx-gray-500 d-inline-block">
								<i className="feather-16 mg-r-5" data-feather="clock"></i>
								{`Kết thúc: ${end}`}
							</span>
						</div>
						{SpecialRequest && (
							<div className="course-note mg-t-15">
								<h6 className="mg-b-3 tx-bold">Ghi chú cho giáo viên:</h6>
								<p className="tx-14 mg-b-0 word-break">{SpecialRequest}</p>
							</div>
						)}
						{!!DocumentName && (
							<div className="course-docs mg-t-15">
								<h6 className="mg-b-3 tx-bold">Tài liệu:</h6>
								<div>
									{' '}
									<a
										href={LessionMaterial}
										target="_blank"
										className="tx-info"
										rel="noreferrer"
									>
										{DocumentName}
									</a>
								</div>
							</div>
						)}
					</div>
					<div className="course-actions mg-t-15">
						<div className="action-left">
							<a
								href={`skype:${SkypeID}?chat`}
								className="btn btn-sm btn-info d-flex justify-content-center align-items-center tx-medium"
								rel="noopener"
							>
								<div>
									<i className="fab fa-skype mg-r-5"></i>VÀO HỌC
								</div>
							</a>
							<a
								href={true}
								className="btn btn-sm btn-success tx-medium"
								data-toggle="modal"
								data-target="#js-md-required"
								onClick={() =>
									handleRequireLesson(
										BookingID,
										avatar,
										TeacherUID,
										TeacherName,
										LessionMaterial,
										LessionName,
										SpecialRequest,
										date,
										start,
										end,
										DocumentName,
										SkypeID,
									)
								}
							>
								<i className="fas fa-edit mg-r-5"></i>GHI CHÚ
							</a>
						</div>
						<div className="action-right">
							{cancelable ? (
								<a
									href={true}
									className="btn btn-sm btn-danger d-flex justify-content-center align-items-center tx-medium"
									rel="noopener"
									data-toggle="tooltip"
									title="Bạn chỉ có thể hủy lớp 30 phút trước khi vào học !!"
									onClick={(e) =>
										handleCancelBooking(
											e,
											BookingID,
											LessionName,
											date,
											start,
											end,
										)
									}
									data-toggle="modal"
									data-target="#md-cancel-schedule"
									data-placement="top"
								>
									<div>
										<i className="fas fa-times-circle"></i> HỦY LỚP
									</div>
								</a>
							) : (
								<button
									disabled
									className="btn btn-block btn-disabled btn-sm"
									data-toggle="tooltip"
									title="Bạn không thể hủy lớp 30 phút trước khi vào học !!"
									data-placement="top"
								>
									<i className="fas fa-times-circle"></i> HỦY LỚP
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</li>
	);
};

export default LessonUpcomingCard;
