import React, { useState, useEffect } from 'react';
import { getStudentLayout } from '~/components/Layout';
import { GetBookingScheduleForStudent } from '~/api/studentAPI';
import Pagination from 'react-js-pagination';
import {
	convertDateFromTo as cvDate,
	getDifferentMinBetweenTime,
} from '~/utils';
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './table.module.scss';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { i18n, withTranslation } from '~/i18n';
const fakeData = [
	{
		BookingID: 2,
		TeacherUID: 1,
		TeacherName: 'Trương Công Thức',
		StudentUID: 0,
		StudentName: null,
		ScheduleTimeVN: '24/06/2020 14:00 - 14:25',
		DocumentName: 'React JS in future',
		LessonName: 'Lession 3: Complete React Hook',
		LessionMaterial: '',
		SkypeID: 'live:123123',
		SpecialRequest: '',
		Status: 0,
		FinishType: 0,
	},
	{
		BookingID: 3,
		TeacherUID: 1,
		TeacherName: 'Trương Công Thức',
		StudentUID: 0,
		StudentName: null,
		ScheduleTimeVN: '25/06/2020 14:00 - 14:25',
		DocumentName: 'React JS in future',
		LessonName: 'Lession 3: Complete React Hook',
		LessonMaterial: '',
		SkypeID: 'live:123123',
		SpecialRequest: '',
		Status: 0,
		FinishType: 0,
	},
	{
		BookingID: 4,
		TeacherUID: 1,
		TeacherName: 'Trương Công Thức',
		StudentUID: 0,
		StudentName: null,
		ScheduleTimeVN: '24/06/2020 14:00 - 14:25',
		DocumentName: 'React JS in future',
		LessonName: 'Lession 3: Complete React Hook',
		LessionMaterial: '',
		SkypeID: 'live:123123',
		SpecialRequest: '',
		Status: 0,
		FinishType: 0,
	},
	{
		BookingID: 5,
		TeacherUID: 1,
		TeacherName: 'Trương Công Thức',
		StudentUID: 0,
		StudentName: null,
		ScheduleTimeVN: '25/06/2020 14:00 - 14:25',
		DocumentName: 'React JS in future',
		LessonName: 'Lession 3: Complete React Hook',
		LessonMaterial: '',
		SkypeID: 'live:123123',
		SpecialRequest: '',
		Status: 0,
		FinishType: 0,
	},
	{
		BookingID: 6,
		TeacherUID: 1,
		TeacherName: 'Trương Công Thức',
		StudentUID: 0,
		StudentName: null,
		ScheduleTimeVN: '24/06/2020 14:00 - 14:25',
		DocumentName: 'React JS in future',
		LessonName: 'Lession 3: Complete React Hook',
		LessionMaterial: '',
		SkypeID: 'live:123123',
		SpecialRequest: '',
		Status: 0,
		FinishType: 0,
	},
	{
		BookingID: 3,
		TeacherUID: 1,
		TeacherName: 'Trương Công Thức',
		StudentUID: 0,
		StudentName: null,
		ScheduleTimeVN: '25/06/2020 14:00 - 14:25',
		DocumentName: 'React JS in future',
		LessonName: 'Lession 3: Complete React Hook',
		LessonMaterial: '',
		SkypeID: 'live:123123',
		SpecialRequest: '',
		Status: 0,
		FinishType: 0,
	},
];

const checkCancelTime = (startDate) => {
	const oneMinutes = 1000 * 60 * 60;
	const startTime = startDate.getTime();
	const now = new Date().getTime();
	const diffTime = startTime - now;
	return Math.round(diffTime / oneMinutes) > 30 ? true : false;
};

const TableView = ({ t }) => {
	const [schedules, setSchedules] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [data, setData] = useState();
	const getAPI = async (params) => {
		setIsLoading(true);
		const res = await GetBookingScheduleForStudent(params);
		console.log(res);
		if (res.Code === 200) {
			setData(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		} else {
			setData({});
		}
		setIsLoading(false);
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
			fromdate: '',
			todate: '',
			UID: UID,
			Page: 1,
			Token: Token,
		});
	}, []);

	return (
		<>
			<h1 className="main-title-page color-black">{t('booked-schedule')}</h1>
			<div className="card">
				<div className="card-body bg-white-radius">
					<div
						className="d-flex from-to-group mg-b-15 flex-wrap absoulute-date"
						id="filter-time"
					>
						<div className="d-flex flex-wrap-0">
							<div className="wd-sm-200 mg-sm-r-10 wd-100p mg-b-10 mg-sm-b-0">
								<DatePicker
									dateFormat="dd/MM/yyyy"
									className="form-control"
									placeholderText={`From date`}
									selected={fromDate}
									onChange={(date) => setFromDate(date)}
									selectsStart
									isClearable={!!fromDate ? true : false}
									startDate={fromDate}
									endDate={toDate}
								/>
							</div>
							<div className="wd-sm-200 wd-sm-240 mg-sm-r-10 wd-100p">
								<DatePicker
									dateFormat="dd/MM/yyyy"
									className="form-control"
									placeholderText={`To date`}
									selected={toDate}
									onChange={(date) => setToDate(date)}
									selectsEnd
									isClearable={!!toDate ? true : false}
									startDate={fromDate}
									endDate={toDate}
									minDate={fromDate}
								/>
							</div>
						</div>
						<div className="flex-grow-0 tx-right flex-shrink-0 wd-100p wd-sm-auto tx-left mg-t-10 mg-sm-t-0">
							<button
								type="button"
								className="btn btn-primary wd-100p wd-sm-auto btn-ab"
								// onClick={getUpcomingSchedule}
							>
								<FontAwesomeIcon icon="search" className="fa fa-search" />{' '}
							</button>
						</div>
					</div>
					<div className="table-responsive">
						<table className="table table-borderless responsive-table">
							<thead>
								<tr>
									<th>{t('teacher')}</th>
									<th>{t('school-package')}</th>
									<th>{t('course')}</th>
									<th>{t('curriculum')}</th>
									<th>{t('time')}</th>
									<th>{t('day')}</th>
									<th>{t('hour')}</th>
									<th>{t('class')}</th>
									<th>{t('status')}</th>
								</tr>
							</thead>
							<PerfectScrollbar component="tbody">
								{isLoading ? (
									<tr>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
									</tr>
								) : !!data && data.length > 0 ? (
									data.map((ls, index) => (
										<tr key={`${index}`}>
											<td>{ls.TeacherName}</td>
											<td>{ls.PackageName}</td>
											<td>{ls.DocumentDetailName}</td>
											<td>{ls.DocumentName}</td>
											<td>{ls.TimeCourse}</td>
											<td>{ls.Date}</td>
											<td>{ls.TimeStudy}</td>
											<td>{ls.ClassName}</td>
											<td>{ls.StatusName}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={9}>
											<div className="empty-error tx-center mg-y-30 bg-white mg-x-auto">
												<img
													src="/static/img/no-data.svg"
													alt="no-booking"
													className="wd-200 mg-b-15"
												/>
												<p className=" tx-danger tx-medium">
													You don't have any booked lessons.
												</p>
											</div>
										</td>
									</tr>
								)}
							</PerfectScrollbar>
						</table>
					</div>
					{totalResult > pageSize && (
						<Pagination
							innerClass="pagination mg-t-15"
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
		</>
	);
};

// TableView.getLayout = getStudentLayout;

// export default TableView;

TableView.getLayout = getStudentLayout;
TableView.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});

export default withTranslation('common')(TableView);
