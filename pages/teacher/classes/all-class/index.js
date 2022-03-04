import React, { useState, useEffect, useRef, useReducer } from 'react';
import { teacherAllClass, addScheduleLog } from '~/api/teacherAPI';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
// import Pagination from 'react-js-pagination';
import Select from 'react-select';
import { appSettings } from '~/config';
import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import './index.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dataHy from '../../../../data/data.json';
import { i18n, withTranslation } from '~/i18n';
import Pagination from '@material-ui/lab/Pagination';
import Box from '@material-ui/core/Box';

import Router, { useRouter } from 'next/router';

function getData() {
	const andt = dataHy.allClass;
	return andt;
}

const DateTimeFormat = new Intl.DateTimeFormat('vi-VN', {
	month: '2-digit',
	day: '2-digit',
	year: 'numeric',
});

const statusOptions = [
	{
		value: 1,
		label: 'Student is PRESENT',
	},
	{
		value: 2,
		label: 'Teacher is absent',
	},
	{
		value: 3,
		label: 'STUDENT IS ABSENT without notice',
	},
	{
		value: 4,
		label: 'NO INTERNET/POWER INTERRUPTION',
	},
	{
		value: 5,
		label: 'Teacher have not set up status',
	},
	{
		value: 6,
		label: 'Booked',
	},
];

const AllClassRow = ({ data, showStudentModal, Status }) => {
	console.log('TEST data trong này: ', data);

	const {
		StatusString,
		FinishTypeString,
		VNTime = '',
		TimeZoneName = '',
		ScheduleTimeUTC = '',
		LessionMaterial = '',
		Curriculumn,
		StudentCode,
		StudentName = '',
		BookingID = '',
		LessionName = '',
		CoursesName = '',
		SkypeID,
		StudentID,
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

	const returnClass = () => {
		let cl = '';
		if (Status === 1) {
			cl = 'color-a';
		} else if (Status === 2) {
			cl = 'color-b';
		} else if (Status === 3) {
			cl = 'color-c';
		} else if (Status === 4) {
			cl = 'color-d';
		} else if (Status === 5) {
			cl = 'color-f';
		} else {
			cl = 'color-g';
		}
		return cl;
	};

	return (
		<tr>
			<td className="clr-id">
				<span className="student-code">{StudentCode}</span>
			</td>
			<td className="clr-lesson">
				<div className="mg-b-5">
					<span className="">{data.CoursesName}</span>
				</div>
			</td>
			<td>
				<div className="">
					<span className="">{data.DocumentName}</span>
				</div>
			</td>
			<td className="clr-lesson">
				<span
					// href={true}
					// onClick={(e) => {
					// 	e.preventDefault();
					// 	showStudentModal(StudentID);
					// }}
					style={{ cursor: 'inherit' }}
					className="clrm-studentname student-name"
				>
					{data.StudentName}
					{/* <FontAwesomeIcon
						icon={
							GenderID === 1 ? 'mars' : GenderID === 2 ? 'venus' : 'genderless'
						}
						className={`fa fa-${
							GenderID === 1 ? 'mars' : GenderID === 2 ? 'venus' : 'genderless'
						} mg-l-10 clrm-icon-male`}
					/> */}
				</span>
			</td>
			<td className="clr-time">
				<div className="mg-b-5">
					<span className="">{Curriculumn}</span>
				</div>
			</td>
			<td>
				<div className="">
					<span className="">{data.VNTime}</span>
				</div>
			</td>
			<td className="clr-status">
				<span className={`btnStatus ${returnClass()}`}>
					{Status === 1
						? 'Student is PRESENT'
						: Status === 2
						? 'Teacher is absent'
						: Status === 3
						? 'STUDENT IS ABSENT without notice'
						: Status === 4
						? 'NO INTERNET/POWER INTERRUPTION'
						: Status === 5
						? 'Teacher have not set up status'
						: 'Booked'}
				</span>
				{/* {Status === 1 && <span className="badge badge-warning pd-5">BOOKED</span>}
                {Status === 2 && <span className="badge badge-success pd-5">FINISHED</span>} */}
			</td>
		</tr>
	);
};

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

const AllClasses = ({ t }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [filterStatusAllClass, setFilterStatusAllClass] = useState(
		statusOptions[5],
	);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState([]);
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [studentId, setStudentId] = useState(null);
	const mdStudentInfo = useRef(true);

	const [state, dispatch] = useReducer(reducer, initialState);

	console.log('STATE: ', state);

	const layData = getData();

	const showStudentModal = (studentId) => {
		setStudentId(studentId);
		$(mdStudentInfo.current).modal('show');
	};

	const unMountComponents = () => {
		mdStudentInfo.current = false;
	};

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

	const loadAllClassesData = async (params) => {
		setIsLoading(true);
		console.log(fromDate);
		try {
			const res = await teacherAllClass(params);
			if (res.Code === 200) {
				dispatch({ type: 'ADD_PAGE', res });
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
	// useEffect(() => {
	// 	let UID = null;
	// 	let Token = null;

	// 	// GET UID and Token
	// 	if (localStorage.getItem('UID')) {
	// 		UID = localStorage.getItem('UID');
	// 		Token = localStorage.getItem('token');
	// 	}

	// 	loadAllClassesData({
	// 		status: filterStatusAllClass.value,
	// 		fromdate: '',
	// 		todate: '',
	// 		UID: UID,
	// 		page: 1,
	// 		token: Token,
	// 	});
	// }, [filterStatusAllClass]);

	useEffect(() => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		loadAllClassesData({
			status: filterStatusAllClass?.value,
			fromdate: '',
			todate: '',
			UID: UID,
			page: state.page,
		});

		$('body').removeClass('show-aside');
		AllClasses.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, [state.page, filterStatusAllClass]);

	return (
		<>
			<h1 className="main-title-page">{t('All Class')}</h1>
			<div className="d-flex align-items-center justify-content-between mg-b-15 flex-wrap">
				<div className="wd-300 order-1 mg-t-15 mg-md-t-0 m-g-l-auto">
					<Select
						options={statusOptions}
						defaultValue={filterStatusAllClass}
						onChange={(values) => setFilterStatusAllClass(values)}
						styles={appSettings.selectStyle}
					/>
					{/* <select name="language" id=""
                        value={filterStatusAllClass}
                        className="form-control" onChange={_changeFilterStatusAllClass}>
                        <option value="0">All status</option>
                        <option value="1">Booked</option>
                        <option value="2">Finished</option>
                    </select> */}
				</div>
			</div>

			<div className="card mg-b-30">
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-classrooms table-borderless  table-hover">
							<thead>
								<tr>
									<th className="clr-id">{t('student-code')}</th>
									<th className="clr-lesson">{t('course')}</th>
									<th className="clr-lesson">{t('lesson')}</th>
									<th className="clr-lesson">{t('student')}</th>
									<th className="clr-lesson">{t('curriculum')}</th>
									<th className="clr-time">{t('your-time')} </th>
									<th className="clr-status">{t('status')}</th>
									{/* <th className="clr-finishType">Finish Type</th> */}
									{/* <th className="clr-actions">{t('actions')}</th> */}
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
										</tr>
									</>
								) : !!data && !!data.length > 0 ? (
									data.map((item) => (
										<AllClassRow
											key={`${item.BookingID}`}
											data={item}
											Status={filterStatusAllClass.value}
											showStudentModal={showStudentModal}
										/>
									))
								) : (
									<tr>
										<td colSpan={7}>
											<span className="tx-danger d-block tx-center tx-medium tx-16">
												No classes.
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

// AllClasses.getLayout = getLayout;

// export default AllClasses;

AllClasses.getLayout = getLayout;

export default withTranslation('common')(AllClasses);
