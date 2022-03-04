import React, { useState, useEffect, useRef } from 'react';
import { teacherAttendanceRecord, addScheduleLog } from '~/api/teacherAPI';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
import Pagination from 'react-js-pagination';
import Select from 'react-select';
import TextareaAutosize from 'react-autosize-textarea';
import { appSettings } from '~/config';
import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import './index.module.scss';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { i18n, withTranslation } from '~/i18n';
import { toastInit } from '~/utils';
import dayjs from 'dayjs';

import {
	FETCH_ERROR,
	// SEARCH_ATT,
	CHANGE_PASSWORD_SUCCESS,
	FILL_PASSWORD,
	INCORRECT_PASSWORD,
	DIFFERENT_PASSWORD,
	CONFIRM_PASSWORD,
	UPDATE_PROFILE_SUCCESS,
} from '~/components/common/Constant/toast';
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
		ID = '',
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
			<td className="clr-actions tx-center">
				<Link
					href={`/teacher/attendance-record/edit/[edit]`}
					as={`/teacher/attendance-record/edit/${data.BookingID}`}
				>
					<a
						href={true}
						className="btn btn-sm btn-success rounded-5 mg-sm-r-5-f"
					>
						<FontAwesomeIcon
							icon="vote-yea"
							className="fas fa-vote-yea mg-r-5"
						/>{' '}
						Detail
					</a>
				</Link>
			</td>
		</tr>
	);
};

const AttendanceRecord = ({ t }) => {
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
	const [statusSearch, setStatusSearch] = useState(false);
	const [submitBox, setSubmitBox] = useState(false);

	const showStudentModal = (studentId) => {
		setStudentId(studentId);
		$(mdStudentInfo.current).modal('show');
	};

	const submitSearchSuccess = () =>
		toast.success(UPDATE_PROFILE_SUCCESS, toastInit);
	// const submitSearchFail = () => toast.error(SEARCH_ATT, toastInit);

	const StatelessTextarea = (props) => {
		const [state, setState] = useState(props?.defaultValue ?? '');
		return (
			<TextareaAutosize
				{...props}
				onChange={(e) => setState(e.target.value)}
				value={state}
				onBlur={props.handleChangeValue}
			/>
		);
	};

	const [values, setValues] = useState({
		studentid: '',
		fromdate: '',
		todate: '',
		UID: '',
		Token: '',
		page: '',
	});

	function handleChange(evt) {
		const valueInput = evt.target.value;

		setValues({
			...values,
			[evt.target.name]: valueInput,
		});
	}

	const _handleSubmit = async () => {
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		// this.keyPress = this.keyPress.bind(this);

		console.log('Values khi submit: ', values);
		try {
			const res = await teacherAttendanceRecord(values, {
				studentid: values.studentid,
				fromdate: '',
				todate: '',
				UID: UID,
				Token: Token,
				Page: 1,
			});
			if (res?.Code && res.Code === 200) {
				submitSearchSuccess();

				setData(res.Data);
				// setPageSize(res.PageSize);
				// setTotalResult(res.TotalResult);
			} else {
				submitSearchFail();
			}
		} catch (error) {
			console.log(error);
		}
		setSubmitBox(true);
	};

	const unMountComponents = () => {
		mdStudentInfo.current = false;
	};

	useEffect(() => {
		return unMountComponents;
	}, []);

	const _onFilterDate = (e) => {
		e.preventDefault();
		// loadAllClassesData();
		let fromDate2 = dayjs(fromDate).format('DD/MM/YYYY');
		let toDate2 = dayjs(toDate).format('DD/MM/YYYY');
		setStatusSearch(true);
		console.log('todate nè Hỷ ơi', toDate2);
	};

	const _changeFilterStatusAllClass = (event) => {
		setFilterStatusAllClass(event.target.value);
	};

	const loadAllClassesData = async (params) => {
		setIsLoading(true);
		console.log('hello----------------------------------', fromDate);
		console.log('student id nè Hỷ ơi:', values.studentid);
		try {
			const res = await teacherAttendanceRecord(params, values, {
				studentid: values.studentid,
				Page: parseInt(pageNumber),
				Status: parseInt(filterStatusAllClass.value),
				fromDate: dayjs(fromDate).format('DD/MM/YYYY'),
				toDate: dayjs(toDate).format('DD/MM/YYYY'),
			});
			console.log('r', res);
			if (res?.Code && res.Code === 200) {
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			} else {
				console.log('Code response khác 1');
			}
		} catch (error) {}
		setIsLoading(false);
	};

	useEffect(() => {
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		if (statusSearch) {
			loadAllClassesData({
				studentid: values.studentid,
				fromdate: dayjs(fromDate).format('DD/MM/YYYY'),
				todate: dayjs(toDate).format('DD/MM/YYYY'),
				UID: UID,
				Token: Token,
				page: 1,
			});
			setStatusSearch(false);
		}
	}, [statusSearch]);

	useEffect(() => {
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		loadAllClassesData({
			studentid: '',
			fromdate: fromDate,
			todate: toDate,
			UID: UID,
			Token: Token,
			page: 1,
		});
		setStatusSearch(false);

		if (statusSearch) {
			setStatusSearch(false);
		}
	}, [pageNumber, filterStatusAllClass]);

	useEffect(() => {
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		setValues({
			...values,
			fromdate: '',
			todate: '',
			UID: UID,
			Token: Token,
			page: 1,
		});

		loadAllClassesData({
			studentid: '',
			fromdate: dayjs(fromDate).format('DD/MM/YYYY'),
			todate: dayjs(toDate).format('DD/MM/YYYY'),
			UID: UID,
			Token: Token,
			page: 1,
		});
	}, []);

	useEffect(() => {
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		loadAllClassesData({
			studentid: '',
			fromdate: fromDate,
			todate: toDate,
			UID: UID,
			Token: Token,
			page: 1,
		});
		setSubmitBox(false);

		if (submitBox) {
			setSubmitBox(false);
		}
	}, [pageNumber, filterStatusAllClass]);

	return (
		<>
			<h1 className="main-title-page">{t('attendance-record')}</h1>
			<div className="d-flex align-items-center justify-content-between mg-b-15 flex-wrap">
				<div className="wd-sm-250 mg-b-15 mg-md-b-0">
					<div className="search-form">
						<StatelessTextarea
							placeholder="Nhập mã Student ID"
							className="textarea-custom form-control"
							name="studentid"
							defaultValue={values.studentid}
							value={values.studentid}
							handleChangeValue={handleChange}
							id="enterSearch"
						></StatelessTextarea>
						<button
							className="btn pd-x-15-f bg-primary text-white"
							type="button"
							onClick={_handleSubmit}
						>
							<FontAwesomeIcon icon="search" />
						</button>
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
									<th className=""></th>
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
										<td colSpan={13}>
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
			<ToastContainer
				position="top-right"
				autoClose={1000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>

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
