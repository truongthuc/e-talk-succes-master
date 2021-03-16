import React, { useState, useEffect, useRef } from 'react';
import { studentGetDetailAttendanceRecord } from '~/api/studentAPI';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
import Pagination from 'react-js-pagination';
import Select from 'react-select';
import { appSettings } from '~/config';
import { getStudentLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { i18n, withTranslation } from '~/i18n';

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
		StudentName = '',
		BookingID = '',
		LessionName = '',
		SkypeID,
		TeacherName = '',
		ID = '',
		StudentUID,
		DocumentName = '',
		GenderID,
	} = data;

	const handleEnterClass = async (e) => {
		e.preventDefault();
		try {
			const res = GetAttendanceRecord;
		} catch (error) {
			console.log(error?.message ?? `Can't add schedule log !!`);
		}
		window.location.href = `skype:${SkypeID}?chat`;
	};

	return (
		<tr>
			<td>{data.TeacherName}</td>
			<td>{data.PackageName}</td>
			<td>{data.CourseName}</td>
			<td>{data.Date}</td>
			<td>{data.Time}</td>
			<td>{data.Remark}</td>
			<td>{data.HomeWork}</td>
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

	useEffect(() => {
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
		const res = await studentGetDetailAttendanceRecord(params);
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
		// --- Get ID ---
		let linkClone = null;
		let link = window.location.href;
		link = link.split('/');
		let BookingID = parseInt(link[link.length - 2]);

		console.log('GET BOOKING ID: ', BookingID);

		// let postID = parseInt(linkClone);

		// --------------
		console.log(UID);
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		getAPI({
			BookingID: BookingID,
			UID: UID,
			Token: Token,
		});
	}, []);
	const loadAllClassesData = async () => {
		setIsLoading(true);
		console.log(fromDate);
		try {
			const res = await GetAttendanceRecord({
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
		} catch (error) {}
		setIsLoading(false);
	};
	useEffect(() => {
		console.log(filterStatusAllClass);
	}, [filterStatusAllClass]);

	useEffect(() => {
		loadAllClassesData();
	}, [pageNumber, filterStatusAllClass]);

	return (
		<>
			<h1 className="main-title-page">Attendance Record Detail</h1>

			<div className="card mg-b-30">
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-classrooms table-borderless responsive-table table-hover">
							<thead>
								<tr>
									<th className="clr-id text-left">{t('teacher-name')}</th>
									<th className="clr-lesson text-left">{t('package')}</th>
									<th className="clr-student text-left">{t('course')}</th>
									<th className="clr-time text-left">{t('date')}</th>
									<th className="clr-status text-left">{t('time')}</th>
									<th className="clr-status text-left">{t('remark')}</th>
									<th className="clr-status text-center">{t('homework')}</th>
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
										</tr>
									</>
								) : data ? (
									<AllClassRow data={data} />
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

// AttendanceRecord.getLayout = getStudentLayout;

// export default AttendanceRecord;
AttendanceRecord.getLayout = getStudentLayout;
AttendanceRecord.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});

export default withTranslation('common')(AttendanceRecord);
