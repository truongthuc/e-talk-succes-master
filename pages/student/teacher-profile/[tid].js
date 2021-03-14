import React, { useState, useEffect, useReducer } from 'react';
import { getStudentLayout } from '~/components/Layout';
import StudentComment from '~/page-components/student/teacher-profile/StudentComment';
import BookingSchedule from '~/page-components/student/teacher-profile/BookingSchedule';
import BookingScheduleMobile from '~/page-components/student/teacher-profile/BookingScheduleMobile';
import TeacherInformation from '~/page-components/student/teacher-profile/TeacherInformation';
import CancelBookingLessonModal from '~/components/common/Modal/CancelBookingLessonModal';
import BookingLessonModal from '~/components/common/Modal/BookingLessonModal';
import PopUpCancelLesson from '~/components/common/Modal/PopUpCancelLesson';

import SkeletonLessonCard from '~/page-components/student/teacher-profile/SkeletonLessonCard';

import { nationMapToFlag, randomId } from '~/utils';
import { GetListTeacher } from '~/api/studentAPI';

import { ToastContainer } from 'react-toastify';
import './index.module.scss';
import { useWindowSize } from '~/hooks/useWindowSize';
import { useRouter } from 'next/router';
import { i18n, withTranslation } from '~/i18n';
const initialCancelLesson = {
	BookingID: '',
	LessionName: '',
	date: '',
	start: '',
	end: '',
	reason: '',
};

const initialBookLesson = {
	TeacherUID: '',
	TeacherName: '',
	TeacherIMG: '',
	AccountNational: '',
	Rate: '',
	RateNumber: null,
	TotalRow: '',
};

const initialOnBookState = {
	id: null,
};

const initialOnCancelState = {
	id: null,
};

const TeacherProfile = ({ t }) => {
	const [state, setState] = useState(null);
	const [stateCancelLesson, setStateCancelLesson] = useState(
		initialCancelLesson,
	);
	const [stateBookLesson, setStateBookLesson] = useState(initialBookLesson);
	const [onBookState, setOnBookState] = useState(initialOnBookState);
	const [onCancelState, setOnCancelState] = useState(initialOnCancelState);
	const [loading, setLoading] = useState(false);
	const [showTab, setShowTab] = useState(1);
	const { width, height } = useWindowSize();
	const router = useRouter();
	const { tid } = router.query;
	console.log(tid);
	const getAPI = async (params) => {
		setLoading(true);
		const res = await GetListTeacher(params);
		if (res.Code === 1) {
			setState(res.Data);
			$('#js-video-modal iframe').attr('src', res.Data.LinkVideoIntroduce);
		}
		setLoading(false);
	};

	const onHandleBookLesson = (StudyTimeID, LessionName, date, start, end) => {
		setStateBookLesson({
			...stateBookLesson,
			StudyTimeID,
			LessionName,
			TeacherUID: state && state.TeacherUID,
			TeacherIMG: state && state.TeacherIMG,
			TeacherName: state && state.TeacherName,
			date,
			start,
			end,
		});
	};

	const onBook = (TeacherUID, StudyTimeID, date, status) => {
		setOnBookState({
			id: randomId(),
		});
	};

	const onCancel = (id, status, LessionName, date, start, end, reason) => {
		if (status === 1) {
			setOnCancelState({
				id,
			});
			setStateCancelLesson({
				...stateCancelLesson,
				reason,
			});
		} else if (status === 0) {
			setOnCancelState({
				id: 'fail',
			});
		}
	};

	const onHandleCancelLesson = (BookingID, LessionName, date, start, end) => {
		setStateCancelLesson({
			...stateCancelLesson,
			BookingID,
			LessionName,
			date,
			start,
			end,
		});
	};

	useEffect(() => {
		if (!localStorage.getItem('isLogin')) {
			router.push({
				pathname: '/',
			});
		} else {
			let RoleID = parseInt(localStorage.getItem('RoleID'));
			if (RoleID !== 5) {
				localStorage.clear();
				router.push({
					pathname: '/',
				});
			}
		}
		// let search = window.location.search;
		// let params = new URLSearchParams(search);
		// let ID = params.get('ID');
		getAPI({
			TeacherUID: 20,
		});
	}, []);
	return loading ? (
		<SkeletonLessonCard />
	) : (
		<>
			{
				<div className="card">
					<div className="card-body">
						<div className="teacher__detail__wrap ">
							<div className="teacher__detail">
								<div className="teacher-header">
									<div className="teacher-avatar">
										<img
											src={
												!!state && state.TeacherIMG
													? state.TeacherIMG
													: '/static/assets/img/default-avatar.png'
											}
											onError={(e) => {
												e.target.onerror = null;
												e.target.src = '/static/assets/img/default-avatar.png';
											}}
											alt="avatar"
										/>
									</div>
									{!!state && (
										<div className="teacher-info">
											<div className="teacher-name">
												<h5 className="name">{state.TeacherName}</h5>
												<div className="nation">
													<span className="badge badge-light">
														<span className="tx-success">
															<i className="fa fa-check-circle"></i> Verified
														</span>
													</span>
												</div>
											</div>
											<div className="teacher-summary">
												<a
													href="#js-video-modal"
													data-toggle="modal"
													data-target="#js-video-modal"
													data-src={state.LinkVideoIntroduce}
													className="tx-primary"
													id="video-teacher"
												>
													<i className="fas fa-play-circle mg-r-5"></i>Xem video
													giới thiệu
												</a>
												<p className="mg-b-0 mg-t-10">
													{state.IntroduceContent}
												</p>
											</div>
										</div>
									)}
								</div>
								<div className="teacher-body">
									<div className="tab-navigation">
										<ul
											className="list-tab align-items-stretch"
											id="js-list-tab"
										>
											<li className="tab-item h-auto">
												<a
													href={'#'}
													className={`${
														showTab === 1 ? 'active' : ''
													} tab-link h-100`}
													data-index="0"
													onClick={(e) => {
														e.preventDefault();
														setShowTab(1);
													}}
												>
													<i className="fas fa-user mg-r-5"></i>
													{t('booking-schedule')}
												</a>
											</li>
											<li className="tab-item h-auto">
												<a
													href={'#'}
													className={`${
														showTab === 2 ? 'active' : ''
													} tab-link h-100`}
													data-index="1"
													onClick={(e) => {
														e.preventDefault();
														setShowTab(2);
													}}
												>
													<i className="fas fa-calendar mg-r-5"></i>
													{t('information-staff')}
												</a>
											</li>
											<li className="tab-item h-auto">
												<a
													href={'#'}
													className={`${
														showTab === 3 ? 'active' : ''
													} tab-link h-100`}
													data-index="2"
													onClick={(e) => {
														e.preventDefault();
														setShowTab(3);
													}}
												>
													<i className="fas fa-comment mg-r-5"></i>
													{t('commented-students')}
												</a>
											</li>
										</ul>
									</div>
									<div className="tab-navigation-content">
										<div className="swiper-container" id="js-teacher__info">
											<div className="teacher__info-wrap swiper-wrapper">
												<div
													className={`${
														showTab === 1 ? 'active' : ''
													} swiper-slide`}
												>
													<div className="slide-tab-content">
														{!!state &&
															state.TeacherUID &&
															(width > 768 ? (
																<BookingSchedule
																	TeacherUID={!!state && state.TeacherUID}
																	onBookingId={onBookState.id}
																	onCancelId={onCancelState.id}
																	handleBookLesson={onHandleBookLesson}
																	handleCancelLesson={onHandleCancelLesson}
																/>
															) : (
																<BookingScheduleMobile
																	TeacherUID={!!state && state.TeacherUID}
																	onBookingId={onBookState.id}
																	handleBookLesson={onHandleBookLesson}
																/>
															))}
														<div className="note mg-t-30">
															<h5 className="sub-title">
																<i className="fas fa-sticky-note"></i>
																{t('notes')}:
															</h5>
															<div className="annotate_wrap mg-b-10 d-flex flex-wrap align-items-center">
																<span className="annotate annotate-available"></span>
																<span>Tiết học có sẵn</span>
																<span className="annotate annotate-others"></span>
																<span>Tiết học đã được đăng ký</span>
																<span className="annotate annotate-me"></span>
																<span>Tiết học bạn đã đăng ký</span>
															</div>
															<ul className="note-list pd-x-20">
																<li className="mg-b-10">
																	Mỗi lớp học kéo dài trong 25 phút.
																</li>
																<li className="mg-b-10">
																	Chọn tiết học có sẵn, bấm vào bút "Book" để
																	đăng ký lớp học
																</li>
																<li className="mg-b-10">
																	Chọn tiết học đã đăng ký, bấm vào bút "Cancel"
																	để hủy lớp học
																</li>
																<li className="mg-b-10">
																	Bạn chỉ có thể đăng ký lớp học ít nhất 30 phút
																	trước khi bắt đầu học
																</li>
																<li className="mg-b-10">
																	Bạn chỉ có thể hủy lớp học ít nhất 30 phút
																	trước khi bắt đầu học
																</li>
															</ul>
														</div>
													</div>
												</div>
												<div
													className={`${
														showTab === 2 ? 'active' : ''
													} swiper-slide`}
												>
													<div className="slide-tab-content">
														<TeacherInformation
															IntroduceContent={
																!!state && state.IntroduceContent
															}
															Experience={!!state && state.Experience}
															Certificate={!!state && state.Certificate}
														/>
													</div>
												</div>
												<div
													className={`${
														showTab === 3 ? 'active' : ''
													} swiper-slide`}
												>
													<div className="slide-tab-content">
														{showTab == 3 && (
															<StudentComment
																TeacherUID={!!state && state.TeacherUID}
															/>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<CancelBookingLessonModal
								BookingID={stateCancelLesson.BookingID}
								LessionName={stateCancelLesson.LessionName}
								date={stateCancelLesson.date}
								start={stateCancelLesson.start}
								end={stateCancelLesson.end}
								callback={onCancel}
							/>

							<BookingLessonModal
								StudyTimeID={stateBookLesson.StudyTimeID}
								LessionName={stateBookLesson.LessionName}
								TeacherUID={stateBookLesson.TeacherUID}
								TeacherIMG={stateBookLesson.TeacherIMG}
								TeacherName={stateBookLesson.TeacherName}
								Rate={stateBookLesson.Rate}
								date={stateBookLesson.date}
								start={stateBookLesson.start}
								end={stateBookLesson.end}
								onBook={onBook}
							/>

							<PopUpCancelLesson
								LessionName={stateCancelLesson.LessionName}
								date={stateCancelLesson.date}
								start={stateCancelLesson.start}
								end={stateCancelLesson.end}
								reason={stateCancelLesson.reason}
							/>

							<ToastContainer />
						</div>
					</div>
				</div>
			}
		</>
	);
};
// TeacherProfile.getLayout = getStudentLayout;
// export default TeacherProfile;

TeacherProfile.getLayout = getStudentLayout;
TeacherProfile.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});

export default withTranslation('common')(TeacherProfile);
