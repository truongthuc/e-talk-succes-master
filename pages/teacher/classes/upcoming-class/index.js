import React, { useState, useEffect, useRef, useReducer } from 'react';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
import { getScheduleLog } from '~/api/teacherAPI';

import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import { teacherUpcomingLessons, addScheduleLog } from '~/api/teacherAPI';
import { Popover, OverlayTrigger, Overlay } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dataHy from '../../../../data/data.json';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';

function getData() {
	const andt = dataHy.UpcommingClass;
	return andt;
}

const UpcomingRow = ({ data, showStudentModal }) => {
	const {
		BookingID,
		TeacherSkype,
		ScheduleTimeVN,
		ScheduleTimeUTC,
		StudentName,
		StudentUID,
		DocumentName,
		LessionName,
		StatusName,
		SkypeID,
		VNTime,
		StatusString,
		CourseName,
		LessonName,
		Title,
		Status,
		LessionMaterial,
		GenderID,
		TimeZoneName,
		SpecialRequest,
	} = data;
	const handleEnterClass = async (e) => {
		e.preventDefault();
		try {
			addScheduleLog({ BookingID });
		} catch (error) {
			console.log(error?.message ?? `Can't add schedule log !!`);
		}
		window.location.href = `skype:${SkypeID}?chat`;
	};

	const popover = (
		<Popover id="popover-basic">
			<Popover.Title as="h3">Student note</Popover.Title>
			<Popover.Content>{SpecialRequest}</Popover.Content>
		</Popover>
	);

	return (
		<tr>
			<td className="clr-time">
				<span className="student-code">{data.StudentCode}</span>
			</td>

			<td className="clr-student">
				<p
					// href={true}
					// onClick={(e) => {
					// 	e.preventDefault();
					// 	showStudentModal(StudentUID);
					// }}
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
				</p>
			</td>
			<td className="clr-lesson">
				<div className="mg-b-5">
					<span className=" mg-r-5 tx-medium">Course:</span>
					<span className="">{data.CourseName}</span>
				</div>
				<div className="">
					<span className=" mg-r-5 tx-medium">Lesson:</span>
					<span className="">{data.LessonName}</span>
				</div>
			</td>
			<td>
				<div className="mg-b-5">
					<span className=" mg-r-5 tx-nowrap wd-80 d-inline-block">
						<FontAwesomeIcon icon="clock" className="fa fa-clock tx-primary" />{' '}
						<span className="tx-medium">VN time</span>:
					</span>
					<span className="">{data.VNTime}</span>
				</div>
				<div className="">
					<span className=" mg-r-5 tx-nowrap wd-80 d-inline-block">
						<FontAwesomeIcon icon="clock" className="fa fa-clock tx-primary" />{' '}
						<span className="tx-medium">Your time</span>:
					</span>
					<span className="">{data.VNTime}</span>
				</div>
			</td>
			<td className="clr-student">
				<span className="">{data.Title}</span>
				{SpecialRequest && SpecialRequest !== '' && (
					<OverlayTrigger
						trigger="click"
						placement="auto"
						overlay={popover}
						rootClose
					>
						<a
							href={true}
							className="d-inline-block pd-5 tx-gray-500 text-hover-primary"
							tabIndex="0"
						>
							<FontAwesomeIcon
								icon="file-alt"
								className="fas fa-file-alt tx-24 "
							/>
						</a>
					</OverlayTrigger>
				)}
			</td>
			<td className="clr-status">
				<span>{data.StatusName}</span>
			</td>
			<td className="clr-actions">
				<a
					href={`skype:${data.TeacherSkype}?chat`}
					className=" btn btn-sm btn-info rounded-5"
					onClick={handleEnterClass}
				>
					<FontAwesomeIcon
						icon={['fab', 'skype']}
						className="fab fa-skype clrm-icon"
					/>{' '}
					Join class
				</a>
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

const UpcomingClasses = ({ t }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [studentId, setStudentId] = useState(null);
	const mdStudentInfo = useRef(true);
	const router = useRouter();
	const [state, dispatch] = useReducer(reducer, initialState);

	const showStudentModal = (studentId) => {
		setStudentId(studentId);
		$(mdStudentInfo.current).modal('show');
	};

	const unMountComponents = () => {
		mdStudentInfo.current = false;
	};

	const layData = getData();

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
	const loadUpcomingClasses = async (params) => {
		try {
			const res = await teacherUpcomingLessons(params);
			if (res?.Code && res.Code === 200) {
				dispatch({ type: 'ADD_PAGE', res });
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			} else {
				console.log('Code response khác 1');
			}
			setIsLoading(false);
			return;
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
		setData([]);
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

		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		loadUpcomingClasses({
			page: state.page,
			UID: UID,
			Token: Token,
		});

		$('body').removeClass('show-aside');
		UpcomingClasses.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, [state.page]);

	return (
		<>
			<h1 className="main-title-page">{t('upcoming-lessons')}</h1>
			<div className="card">
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-classrooms table-borderless responsive-table table-hover">
							<thead className="">
								<tr className="">
									<th className="clr-time">{t('student-code')}</th>
									<th className="clr-student">{t('student')}</th>
									<th className="clr-lesson">{t('lesson')}</th>
									<th className="clr-lesson">{t('time')}</th>
									<th className="clr-status">{t('status')}</th>
									<th className="clr-action">{t('actions')}</th>
								</tr>
							</thead>
							{/*1 item*/}
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
										<UpcomingRow
											key={`${item.BookingID}`}
											data={item}
											showStudentModal={showStudentModal}
										/>
									))
								) : (
									<tr className="bg-white-f">
										<td colSpan={6}>
											<div className="empty-error tx-center mg-t-30 bg-white mg-x-auto">
												<img
													src="/static/img/no-data.svg"
													alt="no-booking"
													className="wd-200 mg-b-15"
												/>
												<p className=" tx-danger tx-medium">
													You don't have any booked lessons with students
												</p>
											</div>
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

// UpcomingClasses.getLayout = getLayout;
// export default UpcomingClasses;

UpcomingClasses.getLayout = getLayout;

export default withTranslation('common')(UpcomingClasses);
