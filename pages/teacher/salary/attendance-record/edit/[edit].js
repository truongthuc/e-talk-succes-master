import React, { useState, useEffect, useRef } from 'react';
import { GetDetailAttendanceRecord, addScheduleLog } from '~/api/teacherAPI';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
import Pagination from 'react-js-pagination';
import { appSettings } from '~/config';
import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';
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
		BookingID = '',
		LessionName = '',
		Date = '',
		Time = '',
		CourseName = '',
		StudentCode = '',
		ClassTime = '',
		Studentname = '',
		Curriculum = '',
		SkypeID,
		Remark = '',
		Class = '',
		PackageName = '',
		StudentName = '',
		TeacherName = '',
		StudentUID,
		ClassStatus = '',
		DocumentName = '',
		GenderID,
	} = data;
	console.log('DAta an: ', data);
	return (
		<tr>
			<td>{StudentCode}</td>
			<td>{data.Studentname}</td>
			<td>{data.TeacherName}</td>
			<td>{data.PackageName}</td>
			<td>{data.CourseName}</td>
			<td>{data.Curriculum}</td>
			<td>{data.ClassTime}</td>
			<td>{data.Date}</td>
			<td>{data.Time}</td>
			<td>{data.Class}</td>
			<td>{data.ClassStatus}</td>
			<td>{data.Remark}</td>
		</tr>
	);
};

const AttendanceRecordDetail = ({ t }) => {
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

	console.log('DATA ne: ', data);

	const getAPI = async (params) => {
		setIsLoading(true);
		const res = await GetDetailAttendanceRecord(params);
		console.log(res);
		if (res.Code === 200) {
			setData(res.Data);
		} else {
			setData({});
		}
		setIsLoading(false);
	};

	useEffect(() => {
		console.log(filterStatusAllClass);
	}, [filterStatusAllClass]);

	useEffect(() => {
		let linkClone = null;
		let link = window.location.href;
		console.log('linh nè:', link);
		link = link.split('/');
		link = link[link.length - 2];
		link = parseInt(link);
		console.log('linh nè hyr:', link);
		
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		getAPI({
			BookingID: link,
			UID: UID,
			Token: Token,
		});
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
									<th className="text-left">Student Code</th>
									<th className="text-left">Student</th>
									<th className="text-left">Teacher</th>
									<th className="text-left">Package</th>
									<th className="text-left">Course</th>
									<th className="text-left">Curriculum</th>
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
								) : data ? (
									<AllClassRow data={data} />
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

			<StudentInformationModal ref={mdStudentInfo} studentId={studentId} />
		</>
	);
};

// AttendanceRecord.getLayout = getLayout;
// export default AttendanceRecord;

AttendanceRecordDetail.getLayout = getLayout;
AttendanceRecordDetail.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(AttendanceRecordDetail);
