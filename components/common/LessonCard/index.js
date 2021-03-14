import React from 'react';
import ReactDOM from 'react-dom';
import { addScheduleLog } from '~/api/teacherAPI';
const LessonCard = ({
	lessonId,
	teacherAvatar,
	teacherName,
	teacherNote,
	studentName,
	studentNote,
	courseName,
	lessonName,
	lessonStatus,
	lessonDate,
	lessonStart,
	lessonEnd,
	cancellable,
	rating,
	documents,
	skypeId,
	StudentUID,
	actionDisplay = true,
	handleCancelLesson = null,
	showStudentModal,
}) => {
	const _onClickCancel = (e) => {
		e.preventDefault();
		handleCancelLesson({
			lessonId,
			lessonDate,
			lessonStart,
			lessonEnd,
			lessonName,
			courseName,
		});
	};

	const handleEnterClass = async (e) => {
		e.preventDefault();
		try {
			const res = await addScheduleLog({ BookingID: lessonId });
			if (res.Code === 1) {
				window.location.href = `skype:${skypeId}?chat`;
			}
		} catch (error) {
			console.log(error?.message ?? `Can't add schedule log !!`);
		}
	};

	return (
		<>
			<div className="cr-item lesson-info mg-b-30">
				<div className="media">
					{!!teacherAvatar && (
						<div className="teacher-information mg-r-20">
							<a className="teacher-avatar" href="#">
								<img src={teacherAvatar} className="teacher-image" alt="" />
								<p className="course-teacher tx-14 tx-gray-800 tx-normal mg-b-0 tx-center mg-t-5 d-block">
									{teacherName}
								</p>
							</a>
						</div>
					)}

					<div
						className={`media-body   pos-relative ${
							!actionDisplay ? `pd-b-0-f` : ``
						}`}
					>
						<h5
							className="mg-b-10 d-flex align-items-center flex-wrap"
							style={{ lineHeight: '1.5' }}
						>
							{lessonStatus === 'Finished' ? (
								<span className="badge badge-success  mg-r-10 pd-x-10 pd-y-5 tx-12">
									Finished
								</span>
							) : lessonStatus === 'Incoming' ? (
								<span className="badge badge-warning  mg-r-10 pd-x-10 pd-y-5 tx-12">
									Incoming
								</span>
							) : (
								<span className="badge badge-warning  mg-r-10 pd-x-10 pd-y-5 tx-12">
									{lessonStatus}
								</span>
							)}
							<a
								href={`/ElearnTeacher/EvaluationLesson?ID=${lessonId}`}
								className="course-name tx-bold"
							>
								{courseName} - {lessonName}
							</a>
							{!!studentName && (
								<>
									<span className="tx-gray-400 tx-normal valign-middle mg-x-10">
										with
									</span>
									<a
										href={true}
										onClick={(e) => {
											e.preventDefault();
											showStudentModal(StudentUID);
										}}
										className="course-teacher tx-16 tx-info tx-medium valign-middle d-inline-block tx-nowrap"
									>
										{studentName}
									</a>
								</>
							)}
						</h5>
						<div className="course-information tx-14">
							<span className="mg-r-15 tx-gray-600 tx-medium">
								<i className="fa fa-calendar  tx-info mg-r-5" /> {lessonDate}
							</span>
							<span className="mg-r-15 tx-gray-600 tx-medium">
								<i className="fa fa-clock  tx-info mg-r-5" /> Start:{' '}
								{lessonStart}
							</span>
							<span className="mg-r-15 tx-gray-600 tx-medium">
								<i className="fa fa-clock  tx-info mg-r-5" /> End: {lessonEnd}
							</span>
						</div>

						{!!studentNote && (
							<div className="course-note mg-t-15">
								<h6 className="mg-b-3">Student notes:</h6>
								<p className="tx-14 mg-b-0">{studentNote}</p>
							</div>
						)}

						{!!documents && (
							<div className="course-docs mg-t-15">
								<h6 className="mg-b-3">Documents:</h6>
								<div className="docs-lists">
									{documents.length > 0 &&
										documents.map((doc, index) => (
											<a
												key={`${doc.id}`}
												href={doc.link}
												className="file-doc"
												target="_blank"
												rel="noopener"
											>
												<i className="fa fa-file mg-r-5" />
												<span className="file-name">Material</span>
												{/* <span className="file-ext">.{doc.extension}</span> */}
											</a>
										))}
								</div>
							</div>
						)}

						{!!teacherNote && (
							<div className="course-note mg-t-15">
								<h6 className="mg-b-3">Teacher note:</h6>
								<p className="tx-14 mg-b-0">{teacherNote}</p>
							</div>
						)}

						{!!rating && lessonStatus === 'Finished' && (
							<div className="course-rate mg-t-15">
								<h6 className="mg-b-3">Rating lesson:</h6>
								<div className="rating-wrap">
									<div className="rating justify-content-end">
										<i className="fas fa-star-half-alt" />
										<i className="fas fa-star" />
										<i className="fas fa-star" />
										<i className="fas fa-star" />
										<i className="fas fa-star" />
									</div>
									<a
										href="#"
										className="rate-now"
										data-toggle="modal"
										data-target="#js-md-rate"
									>
										{' '}
										Rating now!
									</a>
								</div>
							</div>
						)}
						{actionDisplay === true && (
							<div className="course-actions">
								<div className="action-left">
									{lessonStatus === 'Finished' ? (
										<a
											href={`/ElearnTeacher/EvaluationLesson?ID=${lessonId}`}
											className="btn btn-sm btn-warning mg-r-10"
											target="_blank"
											rel="noopener"
										>
											<i className="fas fa-vote-yea mg-r-5" /> Detail lesson
										</a>
									) : !!studentNote ? (
										<>
											<a
												href={`skype:${skypeId}?chat`}
												onClick={handleEnterClass}
												className="btn btn-sm btn-info mg-r-10"
												target="_blank"
												rel="noopener"
											>
												<i className="fab fa-skype mg-r-5"></i> Join class
											</a>
											{/* <a href="#js-md-note" className="btn btn-sm btn-success" data-toggle="modal">
                                        <i className="fas fa-edit mg-r-5" /> Note for students 
                                    </a> */}
										</>
									) : (
										<>
											<a
												href={`skype:${skypeId}?chat`}
												onClick={handleEnterClass}
												className="btn btn-sm btn-info mg-r-10"
												target="_blank"
												rel="noopener"
											>
												<i className="fab fa-skype mg-r-5"></i> Join class
											</a>
											{/* <a href="#js-md-required" className="btn btn-sm btn-success" data-toggle="modal"><i className="fas fa-edit mg-r-5"></i> Checking lesson booking </a> */}
										</>
									)}
								</div>
								<div className="action-right">
									{lessonStatus !== 'Finished' &&
										(!!cancellable ? (
											<a
												href={`#`}
												onClick={_onClickCancel}
												className="btn btn-sm btn-outline-danger"
												data-toggle="tooltip"
												title="You can only cancel this lesson before start for 30 minutes !!"
												data-placement="top"
											>
												<i data-feather="x"></i> Cancel lesson
											</a>
										) : (
											<span className="tx-danger">Unavailable to cancel</span>
										))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default LessonCard;
