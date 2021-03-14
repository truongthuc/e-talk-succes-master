import React, { useState, useEffect, useRef } from 'react';
import { teacherAttendanceRecord, addScheduleLog } from '~/api/teacherAPI';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
import Pagination from 'react-js-pagination';
import Select from 'react-select';
import { appSettings } from '~/config';
import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import './index.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dataHy from '../../../data/data.json';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';

function getData() {
	const andt = dataHy.AttendanceRecord;
	return andt;
}

const DateTimeFormat = new Intl.DateTimeFormat('vi-VN', {
	month: '2-digit',
	day: '2-digit',
	year: 'numeric',
});

const statusOptions = [
	{
		value: 0,
		label: 'All status',
	},
	{
		value: 1,
		label: 'Booked',
	},
	{
		value: 2,
		label: 'Finished',
	},
	{
		value: 3,
		label: 'Teacher no show',
	},
	{
		value: 4,
		label: 'Student no show',
	},
	{
		value: 5,
		label: 'IT problem',
	},
];

const AllClassRow = ({ data, showStudentModal }) => {
	const {
		Status,
		StatusString,
		FinishTypeString,
		ScheduleTimeVN = '',
		ScheduleTimeUTC = '',
		LessionMaterial = '',
		BookingID = '',
		LessionName = '',
		Date = '',
		Time = '',
		CourseName = '',
		StudentCode = '',
		ClassTime = '',
		Curriculum = '',
		SkypeID,
		Remark = '',
		ClassName = '',
		PackageName = '',
		StudentName = '',
		TeacherName = '',
		StudentUID,
		ClassStatus = '',
		DocumentName = '',
		GenderID,
	} = data;

	const handleEnterClass = async (e) => {
		e.preventDefault();
		try {
			const res = addScheduleLog({ BookingID });
		} catch (error) {
			console.log(error?.message ?? `Can't add schedule log !!`);
		}
		window.location.href = `skype:${SkypeID}?chat`;
	};

	return (
		<tr>
			<td>{data.StudentCode}</td>
			<td>{data.StudentName}</td>
			<td>{data.TeacherName}</td>
			<td>{data.PackageName}</td>
			<td>{data.CourseName}</td>
			<td>{data.Curriculum}</td>
			<td>{data.ClassTime}</td>
			<td>{data.Date}</td>
			<td>{data.Time}</td>
			<td>{data.ClassName}</td>
			<td>{data.ClassStatus}</td>
			<td>{data.Remark}</td>
		</tr>
	);
};

const SearchBox = ({ submitSearch }) => {
	const [state, setState] = useState('');
	const _handleSubmit = () => {
		submitSearch(state);
	};
	return (
		<>
			<input
				type="search"
				className="form-control"
				placeholder="Enter student code..."
				onChange={(e) => setState(e.target.value)}
			/>
			<button
				className="btn pd-x-15-f bg-primary text-white"
				type="button"
				onClick={_handleSubmit}
			>
				<FontAwesomeIcon icon="search" />
			</button>
		</>
	);
};

const AttendanceRecord = ({ t }) => {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(true);
	const [filterStatusAllClass, setFilterStatusAllClass] = useState(
		statusOptions[0],
	);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState([]);
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [studentId, setStudentId] = useState(null);
	const mdStudentInfo = useRef(true);

	const showStudentModal = (studentId) => {
		setStudentId(studentId);
		$(mdStudentInfo.current).modal('show');
	};

	const unMountComponents = () => {
		mdStudentInfo.current = false;
	};

	const layData = getData();
	console.log('tu hy', layData);

	useEffect(() => {
		if (!localStorage.getItem('isLogin')) {
			router.push({
				pathname: '/',
			});
		} else {
			let RoleID = parseInt(localStorage.getItem('RoleID'));
			if (RoleID !== 4) {
				localStorage.clear();
				router.push({
					pathname: '/',
				});
			}
		}
		return unMountComponents;
	}, []);

	const _onFilterDate = (e) => {
		e.preventDefault();
		loadAllClassesData();
	};

	const _changeFilterStatusAllClass = (event) => {
		setFilterStatusAllClass(event.target.value);
	};

	const getAPI = async (params) => {
		setIsLoading(true);
		console.log(fromDate);
		try {
			const res = await teacherAttendanceRecord({
				params,
				Page: parseInt(pageNumber),
				Status: parseInt(filterStatusAllClass.value),
				fromDate: fromDate ? DateTimeFormat.format(new Date(fromDate)) : '',
				toDate: toDate ? DateTimeFormat.format(new Date(toDate)) : '',
			});
			if (res?.Code && res.Code === 200) {
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			} else {
				console.log('Code response khác 1');
			}
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};
	useEffect(() => {
		console.log(filterStatusAllClass);
	}, [filterStatusAllClass]);

	useEffect(() => {
		getAPI({
			studentid: 1071,
			UID: 61230,
			fromdate: '',
			todate: '',
			Token: '',
			page: 1,
			UID: '',
		});
	}, [pageNumber, filterStatusAllClass]);

	return (
		<>
			<h1 className="main-title-page">{t('attendance-record')}</h1>
			<div className="d-flex align-items-center justify-content-between mg-b-15 flex-wrap">
				<div className="wd-sm-250 mg-b-15 mg-md-b-0">
					<div className="search-form">
						<SearchBox />
					</div>
				</div>
				<div
					className="d-flex from-to-group wd-100p flex-md-nowrap flex-wrap wd-md-500"
					id="filter-time"
				>
					<div className="form-row flex-grow-1 mg-sm-r-5">
						<div className="col">
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
							{/* <input type="text" name="start-day " onChange={(value) =>  setFromDate(value)} className="form-control datetimepicker from-date" placeholder="From date" /> */}
						</div>
						<div className="col">
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
					<div className="flex-grow-0 tx-right flex-shrink-0 mg-t-30 mg-xs-t-0">
						<button
							type="button"
							className="btn btn-primary "
							onClick={_onFilterDate}
						>
							<FontAwesomeIcon icon="filter" className="fa fa-filter" /> Filter
						</button>
					</div>
				</div>
			</div>

			<div className="card mg-b-30">
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-classrooms table-borderless responsive-table table-hover">
							<thead>
								<tr>
									<th className="text-left">Student Code</th>
									<th className="text-left">Student</th>
									<th className="text-left">Teacher</th>
									<th className="text-left">Package</th>
									<th className="text-left">Course</th>
									<th className="text-left">Circulum</th>
									<th className="text-left">Class Times</th>
									<th className="text-left">Date</th>
									<th className="text-left">Time</th>
									<th className="text-left">Class</th>
									<th className="text-left">Class Status</th>
									<th className="">Remark</th>
								</tr>
							</thead>
							<tbody>
								{isLoading ? (
									<>
										<tr>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
										</tr>
										<tr>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
										</tr>
										<tr>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
										</tr>
									</>
								) : !!data && !!data.length > 0 ? (
									data.map((item) => (
										<AllClassRow
											key={`${item.BookingID}`}
											data={item}
											showStudentModal={showStudentModal}
										/>
									))
								) : (
									<tr>
										<td colSpan={8}>
											<span className="tx-danger d-block tx-center tx-medium tx-16">
												No attendance record.
											</span>
										</td>
									</tr>
								)}
							</tbody>
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

			<StudentInformationModal ref={mdStudentInfo} studentId={studentId} />
		</>
	);
};

// AttendanceRecord.getLayout = getLayout;
// export default AttendanceRecord;

AttendanceRecord.getLayout = getLayout;
AttendanceRecord.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(AttendanceRecord);
