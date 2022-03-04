import React, { useState, useEffect, useReducer } from 'react';
// import Pagination from 'react-js-pagination';
import Skeleton from 'react-loading-skeleton';
import { GetPackageHistory } from '~/api/studentAPI';
import { appSettings } from '~/config';
import { getStudentLayout } from '~/components/Layout';
import dayjs from 'dayjs';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';
// function getData() {
// 	const data = GetListPackage;
// 	return data;
// }

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

// const data = {
// 	ID: '',
// 	CoursesName: '',
// 	CoursesPromotionPrice: '',
// 	DayNumber: '',
// 	TimeCourse: '',
// 	StudyDay: '',
// 	TypeCourse: '',
// 	TotalRow: '',
// };
// const reducer = (prevState, { type, payload }) => {
// 	switch (type) {
// 		case 'STATE_CHANGE': {
// 			return {
// 				...prevState,
// 				[payload.key]: payload.value,
// 			};
// 		}
// 		default:
// 			return prevState;
// 			break;
// 	}
// };
const Package = ({ t }) => {
	const router = useRouter();
	const [state, dispatch] = useReducer(reducer, initialState);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	// const [searchInput, dispatch] = useReducer(reducer);
	const handlePageChange = (pageNumber) => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			getAPI({
				Page: pageNumber,
			});
		}
	};

	// const [initialState, setinitialState] = useState(initialState);

	// const returnStatus = {
	// 	1: 'Chưa hoàn thành',
	// 	3: 'Hoàn thành',
	// 	4: 'Chưa đóng học phí',
	// 	5: 'Đã đóng học phí',
	// };

	const returnStatus = (status) => {
		let text = '';
		if (status === 1) {
			text = 'Chưa hoàn thành';
		} else if (status === 3) {
			text = 'Hoàn thành';
		} else if (status === 4) {
			text = 'Chưa đóng học phí';
		} else {
			text = 'Đã đóng học phí';
		}
		return text;
	};

	const getAPI = async (params) => {
		setLoading(true);

		const res = await GetPackageHistory(params);
		console.log(res);
		if (res.Code === 200) {
			setData(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
			dispatch({ type: 'ADD_PAGE', res });
		} else {
			setData({});
		}
		setLoading(false);
	};
	useEffect(() => {
		if (!localStorage.getItem('isLogin')) {
			router.push({
				pathname: '/',
			});
		} else {
			let RoleID = parseInt(localStorage.getItem('RoleID'));
			if (RoleID !== 5) {
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
		console.log(UID);
		getAPI({
			Search: '',
			UID: UID,
			Page: state.page,
			Token: Token,
		});

		$('body').removeClass('show-aside');
		Package.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, [state.page]);

	return (
		<>
			<h1 className="main-title-page">{t('registered-package')}</h1>
			<div className="card">
				<div className="card-body">
					<div className="table-tiket">
						<div className="table-responsive">
							<table className="table table-fb">
								<thead className="">
									<tr>
										<th className=" tx-left">{t('course')}</th>
										<th>{t('number-of-sessions')}</th>
										<th>{t('number-of-extra-sessions')} </th>
										<th>{t('Booked')}</th>
										<th>{t('Remain')}</th>
										<th>{t('start')}</th>
										<th>{t('end')}</th>
										<th>{t('status')}</th>
									</tr>
								</thead>
								<tbody>
									{loading ? (
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
									) : !!data && Array.isArray(data) && data.length > 0 ? (
										data.map((item, index) => (
											<tr key={index}>
												<td className="tx-left mw-200">
													<span
														className="d-block tx-medium tx-primary"
														style={{ whiteSpace: 'normal' }}
													>
														{item.CoursesName}
													</span>
												</td>
												<td>{item.StudyDay}</td>
												<td>{item.BonusStudyDay}</td>
												<td>{item.Booked}</td>
												<td>{item.Remain}</td>
												<td>
													<span className="d-block tx-normal">
														<span className="mg-l-5">{`${
															item.StartDate && item.StartDate.split(' ')[0]
														}`}</span>
													</span>
												</td>
												<td>
													<span className="d-block tx-normal">
														<span className="mg-l-5">{`${
															item.EndDate && item.EndDate.split(' ')[0]
														}`}</span>
													</span>
												</td>

												<td className="text-right">
													<span className="badge badge-warning badge-beauty">
														{
															// item.Status == 1 && "Chưa hoàn thành"
															// item.Status == 3 && "Hoàn thành khóa học"
															returnStatus(item.Status)
														}
													</span>
												</td>
											</tr>
										))
									) : !data ? (
										<tr className="bg-transparent">
											<td colSpan="9">
												<span className="d-block tx-danger tx-medium">
													Đã có lỗi xảy ra, xin vui lòng thử lại
												</span>
												<img
													src="/static/assets/img/error.svg"
													alt="error"
													className="wd-200 mg-b-15"
												/>
											</td>
										</tr>
									) : (
										<tr className="bg-transparent">
											<td colSpan="9">
												<img
													src="/static/img/no-data.svg"
													alt="error"
													className="wd-200 mg-b-15"
												/>
												<span className="d-block tx-danger tx-medium">
													Bạn chưa mua khóa học nào
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
			</div>
		</>
	);
};

// Package.getLayout = getStudentLayout;

// export default Package;
Package.getLayout = getStudentLayout;

export default withTranslation('common')(Package);
