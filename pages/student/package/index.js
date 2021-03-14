import React, { useState, useEffect, useReducer } from 'react';
import Pagination from 'react-js-pagination';
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
const fakeData = [
	{
		PlanName: 'Tiếng Anh giao tiếp cơ bản trong 10 ngày',
		TotalLesson: 20,
		BookedLesson: 15,
		StartDate: '10/06/2020 10:30 - 20:30',
		EndDate: '10/12/2020 10:30 - 20:30',
		Status: 1,
	},
	{
		PlanName: 'Tiếng Anh nói như người Anh trong 20 ngày',
		TotalLesson: 30,
		BookedLesson: 20,
		StartDate: '10/06/2020 10:30 - 20:30',
		EndDate: '10/12/2020 10:30 - 20:30',
		Status: 1,
	},
	{
		PlanName: 'Dành riêng cho người Việt sang Anh du học',
		TotalLesson: 40,
		BookedLesson: 25,
		StartDate: '10/06/2020 10:30 - 20:30',
		EndDate: '10/12/2020 10:30 - 20:30',
		Status: 1,
	},
];
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
const reducer = (prevState, { type, payload }) => {
	switch (type) {
		case 'STATE_CHANGE': {
			return {
				...prevState,
				[payload.key]: payload.value,
			};
		}
		default:
			return prevState;
			break;
	}
};
const Package = ({ t }) => {
	const router = useRouter();
	const [state, setState] = useState();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [searchInput, dispatch] = useReducer(reducer);
	const handlePageChange = (pageNumber) => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			getAPI({
				Page: pageNumber,
			});
		}
	};
	console.log(data);
	const [initialState, setinitialState] = useState(initialState);

	const getAPI = async (params) => {
		setLoading(true);

		const res = await GetPackageHistory(params);
		console.log(res);
		if (res.Code === 200) {
			setData(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
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
			Page: 1,
			Token: Token,
		});
	}, []);

	return (
		<>
			<h1 className="main-title-page">{t('registered-package')}</h1>
			<div className="card">
				<div className="card-body">
					<div className="table-tiket">
						<div className="table-responsive">
							<table className="table tx-center tx-nowrap table-mobile">
								<thead className="">
									<tr>
										<th className="mw-200 tx-left">{t('course')}</th>
										<th>{t('number-of-sessions')}</th>
										<th>{t('number-of-extra-sessions')} </th>
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

												<td>
													<span className="badge badge-warning badge-beauty">
														Đang học
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
						{pageSize < totalResult && (
							<Pagination
								innerClass="pagination justify-content-center mt-3"
								activePage={page}
								itemsCountPerPage={pageSize}
								totalItemsCount={totalResult}
								pageRangeDisplayed={3}
								itemClass="page-item"
								linkClass="page-link"
								onChange={handlePageChange.bind(this)}
							/>
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
Package.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});

export default withTranslation('common')(Package);
