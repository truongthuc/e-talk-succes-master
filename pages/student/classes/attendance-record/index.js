import React, { useState, useEffect, useRef, useReducer } from 'react';
import { GetAttendanceRecord } from '~/api/studentAPI';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
// import Pagination from 'react-js-pagination';
import Select from 'react-select';
import { appSettings } from '~/config';
import { getStudentLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import './index.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dataHy from '../../../../data/data.json';
import { i18n, withTranslation } from '~/i18n';
import dayjs from 'dayjs';
import DetailRecord from './DetailRecord';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';

// ----------- PHÂN TRANG ---------------

const initialState = {
	page: 1,
	TotalResult: null,
	PageSize: null,
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'ADD_PAGE':
			return {
				...state,
				TotalResult: action.res.TotalResult,
				PageSize: action.res.PageSize,
			};
		case 'SELECT_PAGE':
			return {
				...state,
				page: action.page,
			};
		default:
			throw new Error();
	}
};

// ------------------------------------

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

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		position: 'relative',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		borderRadius: '10px',
		width: '48%!important',
		height: 'auto!important',
		overflowY: 'hidden',
		[theme.breakpoints.down('lg')]: {
			width: '75%!important',
			height: '98%!important',
		},
		[theme.breakpoints.down('sm')]: {
			width: '98%!important',
			padding: '16px 10px 24px 10px',
		},
	},
	btnClose: {
		position: 'absolute',
		bottom: '13px',
		left: '50%',
		transform: 'translateX(-50%)',
	},
	iconClose: {
		position: 'absolute',
		top: '0px',
		right: '0px',
		padding: '15px',
		border: 'none',
		background: 'none',
	},
}));

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
			<td>{data.Name}</td>
			<td>{data.Package}</td>
			<td>{data.Course}</td>
			<td>{data.Date}</td>
			<td>{data.Time}</td>
			<td>{data.Remark}</td>
			<td>{data.Homework}</td>
			<td className="clr-actions tx-center">
				{/* <Link
					href={`/teacher/evaluation/detail/[eid]`}
					as={`/teacher/evaluation/detail/${data.EvaluationID}`}
				>
					
				</Link> */}
				<a
					href={true}
					className="btn btn-sm btn-info rounded-5 mg-sm-r-5-f"
					onClick={openModal}
					teacherID={item.StudentCode}
				>
					Detail
				</a>
			</td>
		</tr>
	);
};

const AttendanceRecord = ({ t }) => {
	const classes = useStyles();
	const [isLoading, setIsLoading] = useState(true);
	const [filterStatusAllClass, setFilterStatusAllClass] = useState(
		statusOptions[0],
	);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState([]);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [studentId, setStudentId] = useState(null);
	const mdStudentInfo = useRef(true);
	const [showAll, setShowAll] = useState(false);
	const [open, setOpen] = React.useState(false);
	const [state, dispatch] = useReducer(reducer, initialState);
	const [dataTeacher, setDataTeacher] = useState(null);

	const [statusSearch, setStatusSearch] = useState(false);

	const closeModal = () => {
		setOpen(false);
	};

	const openModal = (e) => {
		e.preventDefault();

		let teacherID = e.currentTarget.attributes['TeacherID'].value;
		teacherID = parseInt(teacherID);

		setDataTeacher(teacherID);

		setOpen(true);

		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
	};

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
		// loadAllClassesData();
		let fromDate2 = dayjs(fromDate).format('DD/MM/YYYY');
		let toDate2 = dayjs(toDate).format('DD/MM/YYYY');
		setStatusSearch(true);
	};

	const _changeFilterStatusAllClass = (event) => {
		setFilterStatusAllClass(event.target.value);
	};

	const showAllData = () => {
		setFromDate('');
		setToDate('');
		let getNum = showAll;
		getNum++;
		setShowAll(true);
	};

	const loadAllClassesData = async (params) => {
		setIsLoading(true);

		console.log('hello----------------------------------', fromDate);
		try {
			const res = await GetAttendanceRecord(params, {
				Page: parseInt(pageNumber),
				Status: parseInt(filterStatusAllClass.value),
				fromDate: dayjs(fromDate).format('DD/MM/YYYY'),
				toDate: dayjs(toDate).format('DD/MM/YYYY'),
			});

			if (res?.Code && res.Code === 200) {
				dispatch({ type: 'ADD_PAGE', res });
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
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		if (statusSearch) {
			loadAllClassesData({
				fromdate: dayjs(fromDate).format('DD/MM/YYYY'),
				todate: dayjs(toDate).format('DD/MM/YYYY'),
				UID: UID,
				Token: Token,
				Page: 1,
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
		if (showAll) {
			loadAllClassesData({
				fromdate: fromDate,
				todate: toDate,
				UID: UID,
				Token: Token,
				Page: 1,
			});
			setShowAll(false);
		}
	}, [showAll]);

	useEffect(() => {
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		loadAllClassesData({
			fromdate: fromDate == '' ? '' : fromDate,
			todate: toDate == '' ? '' : toDate,
			UID: UID,
			Token: Token,
			Page: state.page,
		});
		setStatusSearch(false);

		if (statusSearch) {
			setStatusSearch(false);
		}
		$('body').removeClass('show-aside');
	}, [state.page, filterStatusAllClass]);

	useEffect(() => {
		AttendanceRecord.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);

	return (
		<>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={open}
				onClose={closeModal}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<div className={classes.paper}>
						<button className={classes.iconClose} onClick={closeModal}>
							<CloseIcon />
						</button>
						<DetailRecord dataTeacher={dataTeacher} />
					</div>
				</Fade>
			</Modal>
			<h1 className="main-title-page">{t('attendance-record')}</h1>
			<div className="d-flex align-items-center justify-content-between mg-b-15 flex-wrap">
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
					<div className="flex-grow-0 tx-right flex-shrink-0  mg-xs-t-0 wrap-btn-attendance">
						<button
							type="button"
							className="btn btn-pink"
							onClick={_onFilterDate}
						>
							<FontAwesomeIcon icon="search" className="fa fa-search" />{' '}
							{t('Search')}
						</button>

						<button
							type="button"
							className="btn btn-pink"
							onClick={showAllData}
							style={{ marginLeft: '10px' }}
						>
							{t('Show all')}
						</button>
					</div>
				</div>
			</div>

			<div className="card mg-b-30">
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-classrooms table-attendance table-borderless  table-hover">
							<thead>
								<tr>
									<th className="clr-id text-left">{t('student-code')}</th>
									<th className="clr-id text-left">{t('teacher-name')}</th>
									<th className="clr-lesson text-left">{t('package')}</th>
									<th className="clr-student text-left">{t('course')}</th>
									<th className="clr-time text-left">{t('date')}</th>
									<th className="clr-status text-left">{t('time')}</th>
									<th className="clr-status text-left">{t('remark')}</th>
									<th className="clr-status text-left">{t('homework')}</th>
									<th className="clr-status text-left">{t('Action')}</th>
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
								) : !!data && !!data.length > 0 ? (
									data.map((item) => (
										<tr>
											<td>{item.StudentCode}</td>
											<td>{item.TeacherName}</td>
											<td>{item.PackageName}</td>
											<td>{item.CourseName}</td>
											<td>{item.Date}</td>
											<td>{item.TimeCourse}</td>
											<td>{item.Remark}</td>
											<td>{item.HomeWork}</td>
											<td className="">
												{/* <Link
													href={`/student/classes/attendance-record/[edit]${item.ID}`}
													as={`/student/classes/attendance-record/${item.ID}`}
												>
													
												</Link> */}
												<a
													href={true}
													className="btn btn-sm btn-info rounded-5 mg-sm-r-5-f"
													onClick={openModal}
													teacherID={item.ID}
												>
													Detail
												</a>
											</td>
										</tr>
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

					{state?.TotalResult > 0 && (
						<Box display={`flex`} justifyContent={`center`} mt={4}>
							<Pagination
								count={Math.ceil(state?.TotalResult / state?.PageSize)}
								color="secondary"
								onChange={(obj, page) =>
									dispatch({ type: 'SELECT_PAGE', page })
								}
								c
							/>
						</Box>
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

export default withTranslation('common')(AttendanceRecord);
