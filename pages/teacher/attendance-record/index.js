import React, { useState, useEffect, useRef, useReducer } from 'react';
import { teacherAttendanceRecord, addScheduleLog } from '~/api/teacherAPI';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
// import Pagination from 'react-js-pagination';
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
import dataHy from '../../../data/data.json';
import { i18n, withTranslation } from '~/i18n';
import { toastInit } from '~/utils';
import dayjs from 'dayjs';

import DetailRecord from './DetailRecord';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';

import {
	FETCH_ERROR,
	SEARCH_ATT,
	CHANGE_PASSWORD_SUCCESS,
	FILL_PASSWORD,
	INCORRECT_PASSWORD,
	DIFFERENT_PASSWORD,
	CONFIRM_PASSWORD,
	UPDATE_PROFILE_SUCCESS,
} from '~/components/common/Constant/toast';

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
const DateTimeFormat = new Intl.DateTimeFormat('vi-VN', {
	month: '2-digit',
	day: '2-digit',
	year: 'numeric',
});

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

const AllClassRow = ({ data, showStudentModal, location }) => {
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

	const closeModal = () => {
		setOpen(false);
	};

	const classes = useStyles();

	const [open, setOpen] = React.useState(false);

	const [dataTeacher, setDataTeacher] = useState(null);

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

	const handleEnterClass = async (e) => {
		e.preventDefault();
		try {
			const res = addScheduleLog({ BookingID });
		} catch (error) {
			console.log(error?.message ?? `Can't add schedule log !!`);
		}
		window.location.href = `skype:${SkypeID}?chat`;
	};

	// useEffect(() => {
	// 	const testBreakLine = () => {
	// 		// let characterCount = data.HomeWork.length + numberOfLineBreaks;
	// 		let numberOfLineBreaksRemark = (data?.Remark.match(/\n/g) || []).length;
	// 		let numberOfLineBreaksHomework = (data?.HomeWork.match(/\n/g) || [])
	// 			.length;

	// 		const remarkOutput = document.querySelectorAll('.remarkOutput');
	// 		const homeworkOutput = document.querySelectorAll('.homeworkOutput');

	// 		// ----- Check remark ----
	// 		if (numberOfLineBreaksRemark > 0) {
	// 			let lines = data?.Remark.split('\n');
	// 			console.log('Lines: ', lines);

	// 			let ul = document.createElement('ul');
	// 			ul.style.paddingLeft = '0';
	// 			remarkOutput[location].appendChild(ul);

	// 			for (const [index, value] of lines.entries()) {
	// 				let li = document.createElement('li');
	// 				let text = document.createTextNode(value);
	// 				ul.appendChild(li);
	// 				li.appendChild(text);
	// 			}
	// 		} else {
	// 			remarkOutput[location].innerHTML = data?.Remark;
	// 		}

	// 		// ---- Check Homework ----
	// 		if (numberOfLineBreaksHomework > 0) {
	// 			let lines = data?.HomeWork.split('\n');
	// 			console.log('Lines: ', lines);

	// 			let ul = document.createElement('ul');
	// 			ul.style.paddingLeft = '0';

	// 			homeworkOutput[location].appendChild(ul);

	// 			for (const [index, value] of lines.entries()) {
	// 				let li = document.createElement('li');
	// 				let text = document.createTextNode(value);
	// 				ul.appendChild(li);
	// 				li.appendChild(text);
	// 			}
	// 		} else {
	// 			homeworkOutput[location].innerHTML = data?.HomeWork;
	// 		}
	// 	};

	// 	if (data) {
	// 		testBreakLine();
	// 	}
	// }, [data]);

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
			<tr>
				{/* <td className="clr-actions tx-center" style={{ width: '3%' }}>
					<a
						href={true}
						className="btnIcon"
						onClick={openModal}
						teacherID={data.BookingID}
					>
						<SearchOutlinedIcon />
					</a>
				</td> */}
				<td>{data.StudentCode}</td>
				<td>{data.StudentName}</td>
				<td>{data.TeacherName}</td>
				<td>{data.PackageName}</td>
				<td>{data.CourseName}</td>
				<td>{data.Curriculum}</td>

				<td>{data.Date}</td>
				<td>{data.Time}</td>
				<td>{data.ClassName}</td>
				<td>{data.ClassStatus}</td>
				{/* <td class="remarkOutput"></td>
				<td class="homeworkOutput"></td> */}
				<td>{data.NoteHome}</td>
				{/* <td>{data.Remark}</td> */}
				<td>
					{' '}
					<a
						href={true}
						className="btn btn-sm btn-success rounded-5 mg-sm-r-5-f"
						onClick={openModal}
						teacherID={data.BookingID}
					>
						Detail
					</a>
				</td>
			</tr>
		</>
	);
};

const AttendanceRecord = ({ t }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [isLoading, setIsLoading] = useState(true);
	const [filterStatusAllClass, setFilterStatusAllClass] = useState(
		statusOptions[0],
	);

	console.log('STATE: ', state);

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

	const [values, setValues] = useState({
		studentid: '',
		fromdate: '',
		todate: '',
		UID: '',
		Token: '',
		page: '',
	});

	const submitSearchSuccess = () =>
		toast.success(UPDATE_PROFILE_SUCCESS, toastInit);
	const submitSearchFail = () => toast.error('Not success', toastInit);

	const handleChange_getValue = (e) => {
		setValues({
			...values,
			studentid: e.target.value,
		});
	};

	const StatelessTextarea = (props) => {
		const [state, setState] = useState(props?.defaultValue ?? '');
		return (
			<input
				{...props}
				// onChange={(e) => setState(e.target.value)}
				// value={state}
				// onBlur={props.handleChangeValue}
				onChange={handleChange_getValue}
			/>
		);
	};

	function handleChange(evt) {
		const valueInput = evt.target.value;

		setValues({
			...values,
			[evt.target.name]: valueInput,
		});
	}

	const _handleSubmit = async (e) => {
		e.preventDefault();

		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		// this.keyPress = this.keyPress.bind(this);

		console.log('Values khi submit: ', values);
		try {
			const res = await teacherAttendanceRecord({
				studentid: values.studentid,
				fromdate: fromDate !== null ? dayjs(fromDate).format('DD/MM/YYYY') : '',
				todate: toDate !== null ? dayjs(toDate).format('DD/MM/YYYY') : '',
				UID: UID,
				Token: Token,
				Page: state.page,
			});
			if (res?.Code && res.Code === 200) {
				dispatch({ type: 'ADD_PAGE', res });
				setData(res.Data);
				if (res.Data.length === 0) {
					toast.error("There's no data", toastInit);
				} else {
					// submitSearchSuccess();
					toast.success('Find success', toastInit);
				}
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
		AttendanceRecord.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
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

	const loadAllClassesData = async (params) => {
		setIsLoading(true);

		console.log('this is params: ', params);

		try {
			const res = await teacherAttendanceRecord(params, values, {
				studentid: values.studentid,
				Page: params.page,
				Status: parseInt(filterStatusAllClass.value),
				fromDate: dayjs(fromDate).format('DD/MM/YYYY'),
				toDate: dayjs(toDate).format('DD/MM/YYYY'),
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
			studentid: values.studentid,
			fromdate: fromDate !== null ? dayjs(fromDate).format('DD/MM/YYYY') : '',
			todate: toDate !== null ? dayjs(toDate).format('DD/MM/YYYY') : '',
			UID: UID,
			Token: Token,
			page: state.page,
		});
		setStatusSearch(false);

		if (statusSearch) {
			setStatusSearch(false);
		}
	}, [state.page, filterStatusAllClass]);

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

		// loadAllClassesData({
		// 	studentid: '',
		// 	fromdate: dayjs(fromDate).format('DD/MM/YYYY'),
		// 	todate: dayjs(toDate).format('DD/MM/YYYY'),
		// 	UID: UID,
		// 	Token: Token,
		// 	page: 1,
		// });

		$('body').removeClass('show-aside');
	}, []);

	// useEffect(() => {
	// 	let UID = null;
	// 	let Token = null;
	// 	if (localStorage.getItem('UID')) {
	// 		UID = localStorage.getItem('UID');
	// 		Token = localStorage.getItem('token');
	// 	}
	// 	loadAllClassesData({
	// 		studentid: '',
	// 		fromdate: dayjs(fromDate).format('DD/MM/YYYY'),
	// 		todate: dayjs(toDate).format('DD/MM/YYYY'),
	// 		UID: UID,
	// 		Token: Token,
	// 		page: pageNumber,
	// 	});
	// 	setSubmitBox(false);

	// 	if (submitBox) {
	// 		setSubmitBox(false);
	// 	}
	// }, [pageNumber, filterStatusAllClass]);

	return (
		<>
			<h1 className="main-title-page">{t('attendance-record')}</h1>
			<div className="d-flex align-items-center justify-content-between mg-b-15 flex-wrap">
				<div className="wd-sm-250 mg-b-15 mg-md-b-0">
					<form onSubmit={_handleSubmit} className="search-form">
						<input
							className="textarea-custom form-control"
							onChange={handleChange_getValue}
							placeholder="Search.."
						></input>
						<button
							className="btn pd-x-15-f bg-primary text-white"
							type="submit"
						>
							<FontAwesomeIcon icon="search" />
						</button>
					</form>
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
					<div className="flex-grow-0 tx-right flex-shrink-0 mg-t-30 mg-xs-t-0 w-100-respon">
						<button
							type="button"
							className="btn btn-primary "
							onClick={_onFilterDate}
						>
							<FontAwesomeIcon icon="filter" className="fa fa-filter" />{' '}
							{t('Filter')}
						</button>
					</div>
				</div>
			</div>

			<div className="card mg-b-30">
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-classrooms table-borderless  table-hover">
							<thead>
								<tr>
									{/* <th className=""></th> */}
									<th className="text-left">{t('Student Code')}</th>
									<th className="text-left">{t('Student Name')}</th>
									<th className="text-left">{t('Teacher')}</th>
									<th className="text-left">{t('Package')}</th>
									<th className="text-left">{t('Course')}</th>
									<th className="text-left">{t('Curriculum')}</th>

									<th className="text-left">{t('Date')}</th>
									<th className="text-left">{t('Time')}</th>
									<th className="text-left">{t('Class')}</th>
									<th className="text-left">{t('Class Status')}</th>
									{/* <th className="text-left">{t('Remark')}</th>
									<th className="text-left">{t('Homework')}</th> */}
									<th className="text-left">{t('Note')}</th>
									<th className="text-left">{t('Action')}</th>
									{/* <th className="">Remark</th> */}
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
									data.map((item, index) => (
										<AllClassRow
											key={`${item.BookingID}`}
											data={item}
											location={index}
											showStudentModal={showStudentModal}
										/>
									))
								) : (
									<tr>
										<td colSpan={14}>
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
			<ToastContainer
				position="top-right"
				autoClose={1000}
				hideProgressBar={true}
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

export default withTranslation('common')(AttendanceRecord);
