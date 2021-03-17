import React, { useState, useEffect, useRef, useReducer } from 'react';

import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import { teacherMissingFeedback } from '~/api/teacherAPI';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dataHy from '../../../../data/data.json';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';

function getData() {
	const andt = dataHy.MissingEvaluationClasses;
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

const MissingFeedbackRow = ({ data }) => {
	const {
		BookingID,
		ScheduleTimeVN,
		ScheduleTimeUTC,
		DocumentName,
		LessionName,
		EvaluationStatus,
	} = data;
	return (
		<tr>
			<td className="clr-feedbackStatus">
				<div className="mg-b-5">
					<span className="tx-success">{data.IDStudent}</span>
				</div>
			</td>
			<td className="clr-feedbackStatus">
				<span className="tx-success">{data.StudentName}</span>
			</td>
			<td className="clr-time">
				<div className="mg-b-5">
					<span className=" mg-r-5 tx-nowrap wd-80 d-inline-block">
						<FontAwesomeIcon icon="clock" className="fa fa-clock tx-primary" />{' '}
						<span className="tx-medium">Start date</span>:
					</span>
					<span className="">{data.StartDate}</span>
				</div>
				<div className="">
					<span className=" mg-r-5 tx-nowrap wd-80 d-inline-block">
						<FontAwesomeIcon icon="clock" className="fa fa-clock tx-primary" />{' '}
						<span className="tx-medium">End date</span>:
					</span>
					<span className="">{data.EndDate}</span>
				</div>
			</td>
			<td className="clr-lesson">
				<div className="mg-b-5">
					<span className=" mg-r-5 tx-medium">Course:</span>
					<span className="">{data.CourseName}</span>
				</div>
				<div className="">
					<span className=" mg-r-5 tx-medium">Lesson:</span>
					<span className="">{data.PackageName}</span>
				</div>
			</td>

			<td className="clr-actions">
				<Link href={`/teacher/evaluation/edit/${data.CourseStudentID}`}>
					<a href={true} className="btn btn-sm btn-secondary rounded-5">
						<FontAwesomeIcon
							icon="file-signature"
							className="fas fa-file-signature clrm-icon"
						/>{' '}
						Evaluate
					</a>
				</Link>
			</td>
		</tr>
	);
};

const MissingFeedbackClasses = ({ t }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [state, dispatch] = useReducer(reducer, initialState);

	const loadMissingFeedback = async (params) => {
		try {
			const res = await teacherMissingFeedback(params);
			if (res?.Code && res.Code === 200) {
				dispatch({ type: 'ADD_PAGE', res });
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			} else {
				console.log('Code response khác 1');
			}
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
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

		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		loadMissingFeedback({
			page: state.page,
			UID: UID,
		});
	}, [state.page]);

	return (
		<>
			<h1 className="main-title-page">{t('missing-evaluation-classes')}</h1>
			<div className="card">
				<div className="card-body">
					<>
						<div className="table-responsive ">
							<table className="table table-classrooms table-borderless responsive-table table-hover">
								<thead className="">
									<tr className="">
										<th className="clr-time">Student Code</th>
										<th className="clr-time">Student</th>
										<th className="clr-lesson">Time</th>
										<th className="clr-feedbackStatus">{t('package')} </th>
										<th className="clr-actions">{t('actions')}</th>
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
											<MissingFeedbackRow
												key={`${item.BookingID}`}
												data={item}
											/>
										))
									) : (
										<tr className="bg-white-f">
											<td colSpan={4}>
												<div className="empty-error tx-center mg-t-30 bg-white mg-x-auto">
													<img
														src="/static/img/no-data.svg"
														alt="no-booking"
														className="wd-200 mg-b-15"
													/>
													<p className=" tx-danger tx-medium">
														Greate, all courses are evaluated.
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
					</>
				</div>
			</div>
		</>
	);
};

// MissingFeedbackClasses.getLayout = getLayout;
// export default MissingFeedbackClasses;

MissingFeedbackClasses.getLayout = getLayout;
MissingFeedbackClasses.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(MissingFeedbackClasses);
