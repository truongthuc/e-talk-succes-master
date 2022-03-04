import React, { useState, useEffect, useReducer } from 'react';
import Pagination from 'react-js-pagination';
import Skeleton from 'react-loading-skeleton';
import { GetPaymentHistory } from '~/api/studentAPI';
import { getStudentLayout } from '~/components/Layout';
import dayjs from 'dayjs';
import './index.module.scss';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { i18n, withTranslation } from '~/i18n';
const fakeData = [
	{
		package: 'Gói học regular',
		course: 'Luyện phản xạ nghe chuyên nghiệp',
		totalClasses: 80,
		payer: 'Trương Văn Lam',
		phone: '0784378011',
		date: '30/10/2020 10:30 AM',
		amount: 6200000,
		paymentMethod: 'Bank',
		status: 'Approved',
		reason: '',
		approver: 'Hùng Mon',
	},
	{
		package: 'Gói học beginner',
		course: 'Luyện phản xạ nghe chuyên nghiệp',
		totalClasses: 80,
		payer: 'Trương Văn Lam',
		phone: '0784378011',
		date: '30/10/2020 10:30 AM',
		amount: 6200000,
		paymentMethod: 'Bank',
		status: 'Approved',
		reason: '',
		approver: 'Hùng Mon',
	},
	{
		package: 'Gói học professional',
		course: 'Luyện phản xạ nghe chuyên nghiệp',
		totalClasses: 80,
		payer: 'Trương Văn Lam',
		phone: '0784378011',
		date: '30/10/2020 10:30 AM',
		amount: 6200000,
		paymentMethod: 'Bank',
		status: 'Approved',
		reason: '',
		approver: 'Hùng Mon',
	},
	{
		package: 'Gói học master',
		course: 'Luyện phản xạ nghe chuyên nghiệp',
		totalClasses: 80,
		payer: 'Trương Văn Lam',
		phone: '0784378011',
		date: '30/10/2020 10:30 AM',
		amount: 6200000,
		paymentMethod: 'Bank',
		status: 'Approved',
		reason: '',
		approver: 'Hùng Mon',
	},
];

const PaymentHistory = ({ t }) => {
	const [state, setState] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const handlePageChange = (pageNumber) => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			getAPI({
				Page: pageNumber,
			});
		}
	};

	const [showAll, setShowAll] = useState(false);
	const [statusSearch, setStatusSearch] = useState(false);

	const _onFilterDate = (e) => {
		e.preventDefault();
		// loadAllClassesData();
		let fromDate2 = dayjs(fromDate).format('DD/MM/YYYY');
		let toDate2 = dayjs(toDate).format('DD/MM/YYYY');
		setStatusSearch(true);
	};

	const showAllData = () => {
		setFromDate('');
		setToDate('');
		setShowAll(true);
	};

	const getAPI = async (params) => {
		setLoading(true);
		const res = await GetPaymentHistory(params);
		if (res.Code === 200) {
			setState(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		} else {
			setState(null);
		}
		setLoading(false);
	};

	useEffect(() => {
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		if (showAll) {
			getAPI({
				UID: UID,
				Page: 1,
				Token: Token,
				fromdate: dayjs(fromDate).format('DD/MM/YYYY'),
				todate: dayjs(toDate).format('DD/MM/YYYY'),
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

		if (statusSearch) {
			getAPI({
				UID: UID,
				Page: 1,
				Token: Token,
				fromdate: dayjs(fromDate).format('DD/MM/YYYY'),
				todate: dayjs(toDate).format('DD/MM/YYYY'),
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

		getAPI({
			UID: UID,
			Page: 1,
			Token: Token,
			fromdate: '',
			todate: '',
		});

		$('body').removeClass('show-aside');
	}, []);

	const renderRow = () => {
		return (
			<>
				{state && state.length > 0 ? (
					state.map((item, index) => (
						<tr key={index}>
							<td>{item.DocumentName}</td>
							<td>{item.CoursesName}</td>
							<td>{item.TotalNumberofClass}</td>
							<td>{item.PayerName}</td>
							<td>{item.RegistedPhone}</td>
							<td>{item.PaymentDate}</td>
							<td>{item.Amount}</td>
							<td>{item.PaymentTypeName}</td>
							<td>{item.StatusName}</td>
							<td>{item.ModifiedBy}</td>
							<td>{item.Reason}</td>
							<td>
								<Link
									href={`/student/profile/deposit-confirmation?id-${item.ID}`}
									as={`/student/profile/deposit-confirmation?id-${item.ID}`}
								>
									<a href={true} className="">
										<FontAwesomeIcon icon="search" className="fas fa-search" />{' '}
									</a>
								</Link>
							</td>
						</tr>
					))
				) : !state ? (
					<tr className="bg-transparent">
						<td colSpan="11">
							<span className="d-block tx-danger tx-medium">
								Không tìm thấy
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
						<td colSpan="11">
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
			</>
		);
	};

	return (
		<>
			<h1 className="main-title-page">Payment history</h1>
			<div className="card">
				<div className="card-body">
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
									showMonthDropdown
									showYearDropdown
									dropdownMode="select"
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
									showMonthDropdown
									showYearDropdown
									dropdownMode="select"
								/>
							</div>
						</div>
						<div className="flex-grow-0 tx-right flex-shrink-0 mg-t-30 mg-xs-t-0">
							<button
								type="button"
								className="btn btn-primary "
								onClick={_onFilterDate}
							>
								<FontAwesomeIcon icon="search" className="fa fa-search" />{' '}
								{t('search')}
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={showAllData}
								style={{ marginLeft: '10px' }}
							>
								Show all
							</button>
						</div>
					</div>
					<div className="table-tiket mg-t-30">
						<div className="table-responsive table-border">
							<table className="table tx-center">
								<thead className="">
									<tr>
										<th className="">{t('package')}</th>
										<th className="mw-200">{t('course')}</th>
										<th>{t('total-number-of-class')}</th>
										<th>{t('payer')}</th>
										<th>{t('registered-phone-number')}</th>
										<th>{t('payment-date')}</th>
										<th>{t('amount-thousand-dongs')}</th>
										<th>{t('transaction-type')}</th>
										<th>{t('status')}</th>
										<th>{t('approver')}</th>
										<th>{t('reason-cancellation')}</th>
										<th></th>
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
									) : (
										renderRow()
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

// PaymentHistory.getLayout = getStudentLayout;
// export default PaymentHistory;

PaymentHistory.getLayout = getStudentLayout;
PaymentHistory.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(PaymentHistory);
