//eslint-disable-file jsx-a11y/no-redundant-roles
import React, { useState, useEffect } from 'react';
import { randomId } from '~/utils';
import TeacherSupportModal from '~/page-components/teacher/support/TeacherSupportModal';
import { ToastContainer } from 'react-toastify';
import SupportDetail from '~/page-components/teacher/support/SupportDetail';
import './index.module.scss';
import { teacherTicketSupport, getOverviewSupport } from '~/api/teacherAPI';
import Pagination from 'react-js-pagination';
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getLayout } from '~/components/Layout';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { i18n, withTranslation } from '~/i18n';
import dataHy from '../../../data/data.json';

function getData() {
	const andt = dataHy.TicketSupport;
	return andt;
}

const TicketSupport = ({ t }) => {
	const [state, setState] = useState([]);
	const [filterState, setFilterState] = useState([]);
	const [overView, setOverView] = useState(null);
	const [filter, setFilter] = useState(0);
	const [showDetail, setShowDetail] = useState(false);
	const [detailId, setDetailId] = useState(0);
	const [pageNumber, setPageNumber] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const router = useRouter();

	// const onChangeState = () => {
	// 	setIsLoading(true);
	// 	if(filter === 0){
	// 		setFilterState([...state]);
	// 		setIsLoading(false);
	// 		return;
	// 	}
	// 	const newFilterState = [...state].filter(item => item.STATUS === filter);
	// 	setFilterState(newFilterState);
	// 	setIsLoading(false);

	// }

	const layData = getData();
	console.log('tu hy', layData);

	const pushHistoryState = (id) => {
		if (typeof window === undefined) return;
		const history = window.history;
		history.pushState(
			{ id: id },
			'Ticket detail',
			`${window.location.pathname}?id=${id}`,
		);
	};

	const showDetailBox = (id) => {
		setDetailId(id);
		pushHistoryState(id);
		setShowDetail(true);
	};

	const _handlefilter = (index) => {
		showDetail && hideDetailBox();
		setFilter(index);
		setPageNumber(1);
	};

	const hideDetailBox = () => {
		setShowDetail(false);
		window.history.pushState(
			null,
			'Teacher Support',
			`${window.location.pathname}`,
		);
	};

	const checkDetailUrl = () => {
		console.log(router);
		if (typeof window === 'undefined') return;
		const params = new URLSearchParams(window.location.search);
		params.has('id') && showDetailBox(params.get('id'));
	};

	const getSupportList = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await teacherTicketSupport({
				Status: parseInt(filter),
				Page: parseInt(page),
				FromDate: !fromDate
					? ''
					: dayjs(new Date(fromDate)).format('DD/MM/YYYY'), // string dd/mm/yyyy
				ToDate: !toDate ? '' : dayjs(new Date(toDate)).format('DD/MM/YYYY'), // string dd/mm/yyyy
			});
			if (res.Code === 200) {
				setState(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			}
		} catch (error) {
			console.log(error?.message ?? 'Call api getListSupport không thành công');
		}
		setIsLoading(false);
	};

	const refreshList = async () => {
		await getSupportList(1);
		await getOverView();
	};

	const getOverView = async () => {
		try {
			const res = await getOverviewSupport();
			res.Code === 1 && setOverView(res.Data);
		} catch (error) {
			console.log(
				error?.message ?? 'Call api SupportOverview không thành công',
			);
		}
	};

	const afterCancelSuccess = (ID) => {
		let newState = [...state];
		/* setFilterState([...state.map(item => item.ID === ID ? {
			...item,
			STATUS: 4
		} : item )]); */

		var index = state.findIndex((i) => i.ID === ID);
		if (index !== -1) {
			newState[index].STATUS = 4;
		}
		setFilterState({
			...newState,
		});
		hideDetailBox();
	};

	const handleSubmitFilter = () => {
		pageNumber === 1 ? getSupportList(1) : setPageNumber(1);
	};

	// React.useEffect(() => {
	// 	onChangeState();
	// },[state, filter])

	useEffect(() => {
		getSupportList({
			fromdate: '',
			todate: '',
			UID: 61230,
			Token: '',
		});
	}, [filter]);

	useEffect(() => {
		getSupportList(pageNumber);
	}, [pageNumber]);

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
	}, []);

	useEffect(() => {
		getOverView();
		checkDetailUrl();
	});

	return (
		<>
			<h1 className="main-title-page">{t('ticket-support')}</h1>
			<div className="sup">
				<div className="d-flex flex-wrap flex-xl-nowrap row--lg">
					<div className="wd-100p mg-xl-b-0 mg-b-30 wd-xl-300 pd-xl-x-15 d-sm-flex d-xl-block flex-shrink-0 w-res-100">
						<div className="card card-custom w-100">
							<div className="sub-menu card-body">
								<p
									className={`${
										filter === 0 && 'active'
									} d-flex align-items-center justify-content-between`}
								>
									<a
										href={true}
										className="link"
										onClick={() => _handlefilter(0)}
									>
										{t('total-tickets')}
									</a>
									<span className="badge-number">{overView?.All ?? 0}</span>
								</p>

								<p
									className={`${
										filter === 1 && 'active'
									} d-flex align-items-center justify-content-between`}
								>
									<a
										href={true}
										className="link"
										onClick={() => _handlefilter(1)}
									>
										{t('newly-created')}
									</a>
									<span className="badge-number">{overView?.News ?? 0}</span>
								</p>
								<p
									className={`${
										filter === 2 && 'active'
									} d-flex align-items-center justify-content-between`}
								>
									<a
										href={true}
										className="link"
										onClick={() => _handlefilter(2)}
									>
										{t('processing')}
									</a>
									<span className="badge-number">
										{overView?.Processing ?? 0}
									</span>
								</p>
								<p
									className={`${
										filter === 3 && 'active'
									} d-flex align-items-center justify-content-between`}
								>
									<a
										href={true}
										className="link"
										onClick={() => _handlefilter(3)}
									>
										{t('ticket-closed')}
									</a>
									<span className="badge-number">
										{overView?.Answered ?? 0}
									</span>
								</p>
								<p
									className={`${
										filter === 4 && 'active'
									} d-flex align-items-center justify-content-between`}
								>
									<a
										href={true}
										className="link"
										onClick={() => _handlefilter(4)}
									>
										{t('ticket-canceled')}
									</a>
									<span className="badge-number">
										{overView?.Cancelled ?? 0}
									</span>
								</p>
								<button
									type="button"
									className="btn btn-primary btn-block mg-t-15"
									data-toggle="modal"
									data-target="#md-teacher-support"
									id="contactsub"
								>
									<FontAwesomeIcon className="fa fa-plus mg-r-10" icon="plus" />
									{t('new-ticket')}
								</button>
							</div>
						</div>
					</div>
					<div className="flex-grow-1 pd-xl-x-15 wd-100p">
						<div className="card card-custom">
							<div className="card-body pd-15-f">
								{showDetail ? (
									<SupportDetail
										onClickBack={hideDetailBox}
										detailId={detailId}
										afterCancelSuccess={afterCancelSuccess}
									/>
								) : (
									<>
										<div
											className="d-flex from-to-group mg-b-15"
											id="filter-time"
										>
											<div className="d-flex flex-wrap-0">
												<div className="wd-sm-200 mg-sm-r-10 wd-100p mg-b-10 mg-sm-b-0">
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
												</div>
												<div className="wd-sm-200 mg-sm-r-10 wd-100p">
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
											<div className="flex-grow-0 tx-right flex-shrink-0 m-g-l-20 wd-100p wd-sm-auto tx-left mg-t-10 mg-sm-t-0">
												<button
													type="button"
													className="btn btn-primary wd-100p wd-sm-auto"
													onClick={handleSubmitFilter}
												>
													<FontAwesomeIcon
														icon="search"
														className="fa fa-search"
													/>{' '}
													{t('search')}
												</button>
											</div>
										</div>
										<div className="table-responsive mg-b-15">
											<table className="table table-borderless table-hover">
												<thead className="">
													<tr>
														<th>{t('ticket-title')}</th>
														<th>{t('sending-date')}</th>
														<th className="tx-center">{t('status')}</th>
													</tr>
												</thead>
												<tbody>
													{isLoading ? (
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
														</tr>
													) : !!state && state.length > 0 ? (
														state.map((item) => (
															<tr key={`${item.ID}`}>
																<td>
																	{' '}
																	<span>
																		<a
																			href={true}
																			onClick={() => showDetailBox(item.ID)}
																			className="sup-item-table-tieude tx-info"
																		>
																			{item.Title}
																		</a>
																	</span>
																	<br />
																</td>
																<td>
																	<span className="sup-item-table-gio">
																		{item.SendingDate}
																		{/* {dayjs(item.SendingDate).format(
																			'DD/MM/YYYY',
																		)} */}
																	</span>{' '}
																	<br />
																</td>
																<td className="text-center">
																	<span
																		className={`badge badge-${
																			item.STATUS === 1
																				? 'info wd-100'
																				: item.STATUS === 2
																				? 'warning wd-75'
																				: item.STATUS === 3
																				? 'success wd-75'
																				: 'danger wd-75'
																		} pd-5 tx-12 `}
																	>
																		{item.STATUS === 1
																			? 'Newly created'
																			: item.STATUS === 2
																			? 'Processing'
																			: item.STATUS === 3
																			? 'Closed'
																			: 'Cancelled'}
																	</span>
																</td>
															</tr>
														))
													) : (
														<tr key={`${randomId}`}>
															<td colSpan={3} className="tx-center">
																<span className="tx-bold tx-danger">
																	No support ticket
																</span>
															</td>
														</tr>
													)}
												</tbody>
											</table>
										</div>

										{totalResult > pageSize && (
											<Pagination
												innerClass="pagination"
												activePage={pageNumber}
												itemsCountPerPage={pageSize}
												totalItemsCount={totalResult}
												pageRangeDisplayed={5}
												onChange={(page) => setPageNumber(page)}
												itemClass="page-item"
												linkClass="page-link"
												activeClass="active"
											/>
										)}
									</>
								)}
							</div>
						</div>
					</div>
				</div>

				<TeacherSupportModal refreshList={refreshList} />
				<ToastContainer />
			</div>
		</>
	);
};

// TicketSupport.getLayout = getLayout;
// export default TicketSupport;

TicketSupport.getLayout = getLayout;
TicketSupport.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(TicketSupport);
