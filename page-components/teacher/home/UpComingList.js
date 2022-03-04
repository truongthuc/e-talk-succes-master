import React, { useState, useEffect } from 'react';
import {
	getUpcomingClass,
	teacherDashboard,
	addScheduleLog,
} from '~/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import { convertDateFromTo as cvDate, checkCancelTime } from '~/utils';
import CancelBookingTeacher from '~components/common/Modal/CancelBookingTeacher';
import LessonCard from '~/components/common/LessonCard';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
import Pagination from 'react-js-pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { i18n, withTranslation } from '~/i18n';

let totalResult = 0;
let pageSize = 0;

const UpComingList = ({ itemShow, t }) => {
	const [state, setState] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [cancelData, setCancelData] = useState(null);
	const [showCancel, setShowcancel] = useState(false);
	const [studentId, setStudentId] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const mdStudentInfo = React.useRef(true);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);

	const showStudentModal = (studentId) => {
		console.log('StudentID: ', studentId);

		setStudentId(studentId);
		if ($) {
			$(mdStudentInfo.current).modal('show');
		}
	};
	const getAPI = async (params) => {
		setIsLoading(true);
		const res = await teacherDashboard(params);
		console.log(res);
		if (res.Code === 200) {
			setState(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		} else {
			setState({});
		}
		setIsLoading(false);
	};

	const handleEnterClass = async (lesson) => {
		try {
			const res = addScheduleLog({ BookingID: lesson.BookingID });
		} catch (error) {
			console.log(error?.message ?? `Can't add schedule log !!`);
		}
		window.location.href = `skype:${lesson.skypeId}?chat`;
	};

	const handleCancelLesson = (lessonData) => {
		setCancelData({
			...lessonData,
			lessonId: lessonData.BookingID,
			lessonName: lessonData.LessionName,
			lessonDate: cvDate(lessonData.ScheduleTimeVN).date,
			lessonStart: cvDate(lessonData.ScheduleTimeVN).fromTime,
			lessonEnd: cvDate(lessonData.ScheduleTimeVN).endTime,
		});
		if ($) {
			const $mdCancel = $('#md-cancel-schedule');
			$mdCancel.modal('show');
		}
	};

	const refreshListUpcoming = (bookingId) => {
		const newUpcomings = [...state].filter(
			(item) => item.BookingID !== bookingId,
		);
		setState(newUpcomings);
	};

	useEffect(() => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		getAPI({
			UID: UID,
			Token: Token,
		});

		UpComingList.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);

	return (
		<>
			<div className="course-horizental">
				<div className="list-wrap ">
					<div className="table-responsive">
						<table className="table table-borderless">
							<thead>
								<tr className="tx-gray-600 tx-normal">
									<th>{t('student-code')}</th>
									<th>{t('student-name')}</th>
									<th>{t('course')}</th>
									<th>{t('lesson')}</th>
									<th>{t('your-time')}</th>
									{/* <th>{t('student')}</th> */}
									<th className="tx-right">{t('actions')}</th>
								</tr>
							</thead>
							<tbody>
								{isLoading ? (
									<tr>
										<td className="wd-50">
											<Skeleton circle={true} width={48} height={48} />
										</td>
										<td>
											<Skeleton count={1} />
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
											<Skeleton count={1} />
										</td>
									</tr>
								) : !!state && state.length > 0 ? (
									[...state].map(
										(ls, index) =>
											index < itemShow.value && (
												<tr key={`${index}`}>
													<td className="clr-time">
														<div className="mg-b-5">
															<span className="student-code">
																{ls.StudentCode}
															</span>
														</div>
													</td>
													<td>
														<div className="student-name">
															<span className="">{ls.StudentName}</span>
														</div>
													</td>
													<td className="clr-lesson">
														<div className="mg-b-5">
															<span className="">{ls.CoursesName}</span>
														</div>
													</td>
													<td>
														<div className="">
															<span className="">{ls.LessonName}</span>
														</div>
													</td>
													<td className="clr-lesson">
														<div className="mg-b-5">
															<span className="">{ls.TimeZoneName}</span>
														</div>
													</td>
													{/* <td className="lg-valign-middle">
														<a
															href={true}
															onClick={(e) => {
																e.preventDefault();
																showStudentModal(ls.StudentUID);
															}}
															className="mg-b-0 d-inline-block tx-black"
														>
															{ls.StudentName}
														</a>
													</td> */}
													<td className="tx-nowrap tx-right">
														<a
															href={true}
															onClick={(e) => {
																e.preventDefault();
																handleEnterClass(ls);
															}}
															href={`skype:${ls.TeacherSkype}?chat`}
															className="btn btn-info btn-sm mg-r-10 "
															target="_blank"
															rel="noopener"
														>
															<FontAwesomeIcon
																className="fab fa-skype"
																icon={['fab', 'skype']}
															/>{' '}
															<span className="d-none d-xl-inline mg-l-5">
																{t('join-class')}
															</span>
														</a>
													</td>
												</tr>
											),
									)
								) : (
									<tr>
										<td colSpan={6}>
											<div className="empty-error tx-center mg-y-30 bg-white mg-x-auto">
												<img
													src="/static/img/no-data.svg"
													alt="no-booking"
													className="wd-200 mg-b-15"
												/>
												<p className=" tx-danger tx-medium">
													{t("There's no have any booked lesson")}
												</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					{totalResult > pageSize && itemShow > 10 && (
						<Pagination
							innerClass=""
							activePage={pageNumber}
							itemsCountPerPage={pageSize}
							totalItemsCount={totalResult}
							pageRangeDisplayed={5}
							onChange={(page) => setPageNumber(page)}
							itemClass="page-item"
							linkClass="page-link"
							activeClass="active"
						/>
					)}
				</div>
			</div>

			<CancelBookingTeacher
				BookingID={cancelData?.lessonId ?? ''}
				name="Warning !!"
				LessionName={cancelData?.lessonName ?? ''}
				start={cancelData?.lessonStart ?? ''}
				end={cancelData?.lessonEnd ?? ''}
				date={cancelData?.lessonDate ?? ''}
				callback={refreshListUpcoming}
			/>

			<StudentInformationModal ref={mdStudentInfo} studentId={studentId} />
		</>
	);
};

// export default UpComingList;

export default withTranslation('common')(UpComingList);
