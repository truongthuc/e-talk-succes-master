import React, { useState, useEffect, useRef, useReducer } from 'react';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
import { getScheduleLog } from '~/api/teacherAPI';
// import Pagination from 'react-js-pagination';
import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import {
	teacherEvaluatedClasses,
	addScheduleLog,
	teacherDeleteEvaluation,
} from '~/api/teacherAPI';
import { Popover, OverlayTrigger, Overlay } from 'react-bootstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dataHy from '../../../../data/data.json';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';
import { toast, ToastContainer } from 'react-toastify';
import { toastInit } from '~/utils';

function getData() {
	const andt = dataHy.evaluationClass;
	return andt;
}

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

const FinishedRow = ({ data, showStudentModal, statusDelete }) => {
	const {
		EvaluationID,
		BookingID,
		ScheduleTimeVN,
		ScheduleTimeUTC,
		StudentName,
		StudentUID,
		LessonName,
		CourseName,
		DocumentName,
		TimeZoneName,
		VNTime,
		LessionName,
		SkypeID,

		StudentCode,
		StatusString,
		Status,
		FinishedType,
		LessionMaterial,
		GenderID,
		SpecialRequest,
	} = data;

	console.log('IDDDD: ', EvaluationID);

	const handleEnterClass = async (e) => {
		e.preventDefault();
		try {
			addScheduleLog({ BookingID });
		} catch (error) {
			console.log(error?.message ?? `Can't add schedule log !!`);
		}
		window.location.href = `skype:${SkypeID}?chat`;
	};

	const deleteItem = (e) => {
		e.preventDefault();

		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		(async () => {
			try {
				const res = await teacherDeleteEvaluation({
					UID: UID,
					Token: Token,
					EvaluationID: EvaluationID,
				});

				if (res.Code === 200) {
					statusDelete();
					toast.success('Update feedback success!', {
						position: toast.POSITION.TOP_CENTER,
						autoClose: 2000,
					});
				}
			} catch (error) {
				console.log('Error: ', error);
			}
		})();
	};

	return (
		<tr>
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<td className="clr-time">
				<div className="mg-b-5">
					<span className="">{data.StudentCode}</span>
				</div>
			</td>
			<td className="clr-lesson">
				<div className="mg-b-5">
					<span className=" mg-r-5 tx-medium">Course:</span>
					<span className="">{data.CoursesName}</span>
				</div>
				<div className="">
					<span className=" mg-r-5 tx-medium">Lesson:</span>
					<span className="">{data.LessonName}</span>
				</div>
			</td>
			<td className="clr-student">
				<a
					href={true}
					onClick={(e) => {
						e.preventDefault();
						showStudentModal(StudentUID);
					}}
					className="clrm-studentname tx-info"
				>
					{StudentName}
					<FontAwesomeIcon
						icon={
							GenderID === 1 ? 'mars' : GenderID === 2 ? 'venus' : 'genderless'
						}
						className={`fa fa-${
							GenderID === 1 ? 'mars' : GenderID === 2 ? 'venus' : 'genderless'
						} mg-l-10 clrm-icon-male`}
					/>
				</a>
			</td>

			<td className="clr-status tx-center">
				<span className={`badge badge-secondary pd-5 tx-12`}>
					{StatusString && StatusString.toString().toUpperCase()}
				</span>
				{<span className="badge badge-success pd-5">{data.FinishedType}</span>}
			</td>
			<td className="clr-actions tx-center">
				<Link
					href={`/teacher/evaluation/detail/[eid]`}
					as={`/teacher/evaluation/detail/${data.EvaluationID}`}
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
				<Link
					href={`/teacher/evaluation/detail/[eid]`}
					as={`/teacher/evaluation/detail/${BookingID}`}
				>
					<a
						href={true}
						onClick={deleteItem}
						className="btn btn-sm btn-danger rounded-5"
					>
						<FontAwesomeIcon
							icon="trash-alt"
							className="fas fa-trash-alt mg-r-5"
						/>{' '}
						Delete
					</a>
				</Link>
			</td>
		</tr>
	);
};

const EvaluatedClasses = ({ t }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [studentId, setStudentId] = useState(null);
	const mdStudentInfo = useRef(true);
	const [state, dispatch] = useReducer(reducer, initialState);

	const [statusDelete, setStatusDelete] = useState(false);

	const showStudentModal = (studentId) => {
		setStudentId(studentId);
		$(mdStudentInfo.current).modal('show');
	};

	const layData = getData();

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

	const loadFinishedClass = async (params) => {
		try {
			const res = await teacherEvaluatedClasses(params);
			if (res.Code === 200) {
				dispatch({ type: 'ADD_PAGE', res });
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			}
			if (res.Code === 403) {
				localStorage.clear();
				router.push({
					pathname: '/',
				});
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
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		if (statusDelete) {
			loadFinishedClass({
				page: state.page,
				UID: UID,
			});
		}
	}, [statusDelete]);

	useEffect(() => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		loadFinishedClass({
			page: state.page,
			UID: UID,
		});
	}, [state.page, statusDelete]);

	return (
		<>
			<h1 className="main-title-page">{t('evaluated-classes')}</h1>
			<div className="card">
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-classrooms table-borderless responsive-table table-hover">
							<thead className="">
								<tr className="">
									<th className="clr-time">Student Code</th>
									<th className="clr-lesson">{t('lesson')}</th>
									<th className="clr-student">{t('student')}</th>
									<th className="clr-status tx-center">{t('finished-type')}</th>
									<th className="clr-action tx-center">{t('actions')}</th>
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
										</tr>
									</>
								) : !!data && !!data.length > 0 ? (
									data.map((item) => (
										<FinishedRow
											key={`${item.BookingID}`}
											data={item}
											showStudentModal={showStudentModal}
											statusDelete={() => setStatusDelete(true)}
										/>
									))
								) : (
									<tr className="bg-white-f">
										<td colSpan={5}>
											<div className="empty-error tx-center mg-t-30 bg-white mg-x-auto">
												<img
													src="/static/img/no-data.svg"
													alt="no-booking"
													className="wd-200 mg-b-15"
												/>
												<p className=" tx-danger tx-medium">
													You don't have any finished classes.
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

// EvaluatedClasses.getLayout = getLayout;
// export default EvaluatedClasses;

EvaluatedClasses.getLayout = getLayout;
EvaluatedClasses.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(EvaluatedClasses);
