import React, { useState, useEffect, useReducer } from 'react';
// import Pagination from 'react-js-pagination';
import Skeleton from 'react-loading-skeleton';
import { teacherGetHolidays } from '~/api/teacherAPI';
import { appSettings } from '~/config';
import { getLayout } from '~/components/Layout';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';

// ----------- PHÂN TRANG ---------------
const initialState = {
	page: 1,
	TotalResult: null,
	PageSize: null,
};

const reducer = (statePage, action) => {
	switch (action.type) {
		case 'ADD_PAGE':
			return {
				...statePage,
				TotalResult: action.res.TotalResult,
				PageSize: action.res.PageSize,
			};
		case 'SELECT_PAGE':
			return {
				...statePage,
				page: action.page,
			};
		default:
			throw new Error();
	}
};

// ------------------------------------

const DayOff = ({ t }) => {
	const router = useRouter();
	const [pageNumber, setPageNumber] = useState(1);
	const [state, setState] = useState();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState();
	const [pageSize, setPageSize] = useState(0);
	const [statePage, dispatch] = useReducer(reducer, initialState);

	const [totalResult, setTotalResult] = useState(0);

	const getAPI = async (params) => {
		setLoading(true);
		const res = await teacherGetHolidays(params, {
			Page: parseInt(pageNumber),
		});
		console.log(res);
		if (res.Code === 200) {
			dispatch({ type: 'ADD_PAGE', res });
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

		getAPI({
			UID: UID,
			Token: Token,
			Page: statePage.page,
		});

		$('body').removeClass('show-aside');
	}, [statePage.page]);

	useEffect(() => {
		DayOff.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);

	return (
		<>
			<h1 className="main-title-page">{t('holiday')}</h1>
			<div className="card">
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-fb table-holiday">
							<thead>
								<tr>
									<th>{t('title-eva')}</th>
									<th>{t('start-day')}</th>
									<th>{t('end-day')}</th>
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
											<td>{item.HolidayName}</td>
											<td>{item.StartDate}</td>
											<td>{item.EndDate}</td>
										</tr>
									))
								) : !data ? (
									<tr
										className="bg-transparent"
										style={{ textAlign: 'center' }}
									>
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
												Bạn chưa có ngày nghĩ nào !!!
											</span>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					{statePage?.TotalResult > 0 && (
						<Box display={`flex`} justifyContent={`center`} mt={4}>
							<Pagination
								count={Math.ceil(statePage?.TotalResult / statePage?.PageSize)}
								color="secondary"
								onChange={(obj, page) =>
									dispatch({ type: 'SELECT_PAGE', page })
								}
							/>
						</Box>
					)}
				</div>
			</div>
		</>
	);
};

// DayOff.getLayout = getStudentLayout;
// export default DayOff;

DayOff.getLayout = getLayout;

export default withTranslation('common')(DayOff);
