import React, { useState, useEffect, useReducer } from 'react';
import Pagination from 'react-js-pagination';
import Skeleton from 'react-loading-skeleton';
import { GetHolidays } from '~/api/studentAPI';
import { appSettings } from '~/config';
import { getStudentLayout } from '~/components/Layout';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';

const DayOff = ({ t }) => {
	const router = useRouter();
	const [state, setState] = useState();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState();
	const [page, setPage] = useState();

	const getAPI = async (params) => {
		setLoading(true);
		const res = await GetHolidays(params);
		console.log(res);
		if (res.Code === 200) {
			setData(res.Data);
			// setPageSize(res.PageSize);
			// setTotalResult(res.TotalResult);
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

		// ----- GET UID and Token
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		getAPI({
			UID: UID,
			Page: 1,
			Token: Token,
		});

		$('body').removeClass('show-aside');
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
						<table className="table table-fb table-dayof">
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
											<td className="text-right">{item.EndDate}</td>
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
				</div>
			</div>
		</>
	);
};

// DayOff.getLayout = getStudentLayout;
// export default DayOff;

DayOff.getLayout = getStudentLayout;

export default withTranslation('common')(DayOff);
