import React, { useState, useEffect } from 'react';
import LessonCard from '~components/LessonCard';
import SkeletonLessonCard from '../common/Skeleton/SkeletonLessonCard';
import { getUpcomingClass } from '~src/api/teacherAPI';
import { convertDateFromTo as cvDate, checkCancelTime } from '~src/utils';
import Flatpickr from 'react-flatpickr';
import CancelBookingTeacher from '~components/CancelBookingTeacher';
import Pagination from 'react-js-pagination';
import StudentInformationModal from '~components/StudentInformationModal';

const BookingRequest = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [lessons, setLessons] = useState(null);
	const [courseSelect, setCourseSelect] = useState('1');
	const [pageNumber, setPageNumber] = useState(1);
	const [cancelData, setCancelData] = useState(null);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [pageSize, setPageSize] = useState(null);
	const [totalResult, setTotalResult] = useState(null);
	const [studentId, setStudentId] = React.useState(null);

	const mdStudentInfo = React.useRef(true);

	const showStudentModal = (studentId) => {
		setStudentId(studentId);
		$(mdStudentInfo.current).appendTo('body').modal('show');
	};

	const loadBookingRequestData = async () => {
		setIsLoading(true);
		try {
			const res = await getUpcomingClass({
				Page: pageNumber,
			});
			if (res?.Code && res.Code === 1) {
				setLessons(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			} else {
				console.log(res);
			}
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	const $mdCancel = $('#md-cancel-schedule');

	const handleCancelLesson = (lessonData) => {
		console.log(lessonData);
		setCancelData(lessonData);
		$mdCancel.appendTo('body').modal('show');
	};

	const refreshListUpcoming = (bookingId) => {
		const newUpcomings = [...lessons].filter(
			(item) => item.BookingID !== bookingId,
		);
		setLessons(newUpcomings);
	};

	useEffect(() => {
		loadBookingRequestData();
	}, [pageNumber]);

	return (
		<>
			<div className="course-horizental">
				{/* <div className="fb-summary-container pd-x-20-f pd-b-0-f pd-t-20-f ">
                    <form method="get" className="st-date">
                        <div className="row from-to-group">
                            <div className="col-12 col-md-3 form-group">
                                <select value={courseSelect} className="form-control" onChange={(event) => setCourseSelect(event.target.value)}>
                                    <option value="1">All course</option>
                                    <option value="2">IELTS 8.0 Professional</option>
                                </select>
                            </div>
                            <div className="col-12 col-sm-6 col-md-3 form-group">
                                <Flatpickr
                                    placeholder="To date"
                                    options={{
                                        dateFormat: "d/m/Y",
                                    }}
                                    className="form-control"
                                    onChange={(date) => setFromDate(date)}
                                />
                            </div>
                            <div className="col-12 col-sm-6 col-md-3 form-group">
                                <Flatpickr
                                    placeholder="To date"
                                    options={{
                                        dateFormat: "d/m/Y",
                                        onOpen: function (selectedDates, dateStr, instance) {
                                            console.log(instance);
                                            if (fromDate === '') return;
                                            instance.set("minDate", new Date(fromDate));

                                        }
                                    }}
                                    className="form-control"
                                    onChange={(date) => setToDate(date)}
                                />
                            </div>

                            <div className="form-group col-md-3">
                                <button className="btn btn-info btn-block"><i className="fa fa-search mg-r-5" /> Search</button>
                            </div>
                        </div>
                    </form>
                </div> */}
				<div className="list-wrap ">
					<div className="row">
						{isLoading ? (
							<>
								<div className="col-lg-6">
									<SkeletonLessonCard />
								</div>
								<div className="col-lg-6">
									<SkeletonLessonCard />
								</div>
							</>
						) : (
							<>
								{!!lessons && !!lessons.length > 0 ? (
									lessons.map((lesson) => (
										<div key={`${lesson.BookingID}`} className="col-lg-6">
											<LessonCard
												lessonId={lesson.BookingID}
												courseName={lesson?.DocumentName ?? ''}
												studentName={lesson?.StudentName ?? ''}
												lessonName={lesson?.LessionName ?? ''}
												lessonDate={cvDate(lesson.ScheduleTimeVN).date}
												lessonStart={cvDate(lesson.ScheduleTimeVN).fromTime}
												lessonEnd={cvDate(lesson.ScheduleTimeVN).endTime}
												lessonStatus={lesson.lessionName}
												// cancellable={checkCancelTime(cvDate(lesson.ScheduleTimeVN).dateObject)}
												cancellable={true} //Only for test cancel action, use above code for production
												skypeId={lesson.SkypeID}
												studentNote={lesson.SpecialRequest}
												documents={[
													{
														id: randomId(),
														name: 'Tài liệu',
														extension: '',
														link: lesson.LessionMaterial,
													},
												]}
												handleCancelLesson={handleCancelLesson}
												showStudentModal={showStudentModal}
												StudentUID={lesson.StudentUID}
											/>
										</div>
									))
								) : (
									<div className="empty-error tx-center mg-y-30 bg-white mg-x-auto">
										<img
											src="../assets/img/no-booking.svg"
											alt="image"
											className="wd-200 mg-b-15"
										/>
										<p className=" tx-danger tx-medium">
											You don't have any book lesson with student
										</p>
									</div>
								)}
							</>
						)}
					</div>
					{!!totalResult && totalResult >= pageSize && (
						<Pagination
							innerClass="pagination justify-content-end"
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
				start={cancelData?.lessonStart ?? ''}
				end={cancelData?.lessonEnd ?? ''}
				date={cancelData?.lessonDate ?? ''}
				LessionName={cancelData?.lessonName ?? ''}
				callback={refreshListUpcoming}
			/>
			<StudentInformationModal ref={mdStudentInfo} studentId={studentId} />
		</>
	);
};

export default BookingRequest;
