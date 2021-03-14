import React, { useEffect } from 'react';

import './LessonHistoryCard.module.scss';

const LessonHistoryCard = ({
	onHandleRatingLesson,
	BookingID,
	avatar = '/static/assets/img/default-avatar.png',
	TeacherUID,
	CourseName,
	TeacherName,
	LessionName,
	Status,
	note = '',
	start,
	end,
	date,
	Rate,
}) => {
	const handleRatingLesson = (BookingID, TeacherUID, TeacherName) => {
		onHandleRatingLesson(BookingID, TeacherUID, TeacherName);
	};

	useEffect(() => {
		feather.replace();
	}, []);

	return (
		<>
			<li className="cr-item lesson-history lesson-info">
				<div className="media">
					<div className="teacher-information">
						<a
							className="teacher-avatar"
							href={`/ElearnStudent/teacherDetail?ID=${TeacherUID}`}
						>
							<img
								src={
									avatar === '/static/assets/img/default-avatar.png'
										? `/static/assets/img/${avatar}`
										: avatar
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
						</a>
					</div>
					<div className="media-body mg-l-20 pos-relative">
						<div>
							<h5 className="mg-b-10 mg-t-10 mg-sm-t-0">
								<span className="badge badge-success">Finished</span>{' '}
								<a
									href={`/ElearnStudent/lessonDetail?ID=${BookingID}`}
									className="no-hl course-name tx-bold"
								>
									{item.CourseName}
								</a>
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
							{note && (
								<div className="course-note mg-t-15">
									<h6 className="mg-b-3 tx-bold">Giáo viên ghi chú:</h6>
									<p className="tx-14 mg-b-0">{note}</p>
								</div>
							)}
							<div className="course-rate mg-t-15">
								<h6 className="mg-b-10 tx-bold">Đánh giá buổi học:</h6>
								<div className="rating-wrap ">
									{Status === 3 || Status === 4 ? (
										<span className="tx-danger tx-medium">
											Lớp học này đã bị hủy.
										</span>
									) : Rate ? (
										<div className="rating-stars">
											<span className="empty-stars">
												<i className="star fa fa-star"></i>
												<i className="star fa fa-star"></i>
												<i className="star fa fa-star"></i>
												<i className="star fa fa-star"></i>
												<i className="star fa fa-star"></i>
											</span>
											<span
												className="filled-stars"
												style={{ width: `${Rate * 20}%` }}
											>
												<i className="star fa fa-star"></i>
												<i className="star fa fa-star"></i>
												<i className="star fa fa-star"></i>
												<i className="star fa fa-star"></i>
												<i className="star fa fa-star"></i>
											</span>
										</div>
									) : (
										<a
											href={'#'}
											className="rate-now"
											data-toggle="modal"
											data-target="#js-md-rate"
											onClick={() =>
												handleRatingLesson(BookingID, TeacherUID, TeacherName)
											}
										>
											Để lại đánh giá!
										</a>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</li>
		</>
	);
};

export default LessonHistoryCard;
