import React, { useEffect } from 'react';
import styles from './LessonUpcomingCard.module.scss';
import Link from 'next/link';
import { i18n, withTranslation } from '~/i18n';

const LessonUpcomingCard = ({
	Avatar,
	BookingID,
	CourseName,
	EndTime,
	StartTime,
	Status,
	StudentName,
	TeacherID,
	TeacherName,
	TeacherSkype,
	TimeStudy,
	t,
}) => {
	// const handleCancelBooking = (e, BookingID, LessionName, date, start, end) => {
	// 	e.preventDefault();
	// 	onHandleCancelBooking(BookingID, LessionName, date, start, end);
	// };

	useEffect(() => {
		// feather.replace();
		LessonUpcomingCard.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);
	const handleEnterClass = async (lesson) => {
		// try {
		// 	const res = addScheduleLog({ BookingID: lesson.BookingID });
		// } catch (error) {
		// 	console.log(error?.message ?? `Can't add schedule log !!`);
		// }
		console.log('LESSON: ', lesson);
		window.location.href = `skype:${lesson}?chat`;
	};

	return (
		<li className="cr-item upcoming-lesson lesson-info position-relative">
			<div
			// className={`${lock.id === BookingID && lock.lock ? '' : 'd-none'}`}
			></div>
			<div className="media">
				<div className="teacher-information">
					<div className="teacher-avatar">
						<img
							src={
								Avatar === null
									? `/static/assets/img/default-avatar.png`
									: Avatar
							}
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
					</div>
				</div>
				<div className="media-body mg-l-20 pos-relative">
					<div>
						<h5 className="mg-b-10 mg-t-10 mg-sm-t-0">
							<span className="badge badge-warning">Incoming</span>{' '}
							<span className="no-hl course-name tx-bold">{CourseName}</span>
						</h5>
						<div className="course-information tx-14">
							<span
								className="mg-r-15 tx-gray-500 d-block"
								style={{ marginBottom: '10px' }}
							>
								<i className="feather-16 mg-r-5" data-feather="calendar"></i>
								{TimeStudy}
							</span>
							<span className="mg-r-15 tx-gray-500 d-inline-block">
								<i className="feather-16 mg-r-5" data-feather="clock"></i>
								{`${t('Start')}: ${StartTime}`}
							</span>
							<span className="mg-r-15 tx-gray-500 d-inline-block">
								<i className="feather-16 mg-r-5" data-feather="clock"></i>
								{`${t('End')}: ${EndTime}`}
							</span>
						</div>
						{/* {SpecialRequest && (
							<div className="course-note mg-t-15">
								<h6 className="mg-b-3 tx-bold">Ghi chú cho giáo viên:</h6>
								<p className="tx-14 mg-b-0 word-break">{SpecialRequest}</p>
							</div>
						)} */}
						{/* {!!DocumentName && (
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
						)} */}
					</div>
					<div className="course-actions mg-t-15">
						<div className="action-left">
							<a
								href={true}
								className=" btn btn-sm btn-info d-flex justify-content-center align-items-center tx-medium"
								rel="noopener"
								target="_blank"
								style={{ cursor: 'pointer' }}
								onClick={(e) => {
									e.preventDefault();
									handleEnterClass(TeacherSkype);
								}}
							>
								{t('Join Class')}
							</a>
							{/* <a
								style={{ cursor: 'pointer' }}
								href={true}
								className="btn btn-sm btn-success tx-medium"
								data-toggle="modal"
								data-target="#js-md-required"
								
							>
								<i className="fas fa-edit mg-r-5"></i>GHI CHÚ
							</a> */}
						</div>
						{/* <div className="action-right">
							{cancelable ? (
								<a
									href={true}
									className="btn btn-sm btn-danger d-flex justify-content-center align-items-center tx-medium"
									rel="noopener"
									data-toggle="tooltip"
									title="Bạn chỉ có thể hủy lớp 30 phút trước khi vào học !!"
									// onClick={(e) =>
									// 	handleCancelBooking(
									// 		e,
									// 		BookingID,
									// 		LessionName,
									// 		date,
									// 		start,
									// 		end,
									// 	)
									// }
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
						</div> */}
					</div>
				</div>
			</div>
		</li>
	);
};

export default withTranslation('common')(LessonUpcomingCard);
