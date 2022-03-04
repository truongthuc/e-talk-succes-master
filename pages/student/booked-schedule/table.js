import React, { useState, useEffect, useReducer } from 'react';
import { getStudentLayout } from '~/components/Layout';
import { GetBookingScheduleForStudent } from '~/api/studentAPI';
// import Pagination from 'react-js-pagination';
import {
	convertDateFromTo as cvDate,
	getDifferentMinBetweenTime,
} from '~/utils';
import Pagination from '@material-ui/lab/Pagination';
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './table.module.scss';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { i18n, withTranslation } from '~/i18n';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';

const checkCancelTime = (startDate) => {
	const oneMinutes = 1000 * 60 * 60;
	const startTime = startDate.getTime();
	const now = new Date().getTime();
	const diffTime = startTime - now;
	return Math.round(diffTime / oneMinutes) > 30 ? true : false;
};

const useStyles = makeStyles((theme) => ({
	stylePagi: {
		'& > button': {
			'&:focus': {
				outline: '0',
				border: '0',
			},
		},
	},
	wrapBtn: {
		position: 'absolute',
		top: '-70px',
		right: '0',
		borderRadius: '999px',
		[theme.breakpoints.down('sm')]: {
			top: '65px!important',
		},
	},
	btnShow: {
		borderRadius: '999px',
	},
	wrapFilter: {
		// right: '110px!important',
		// [theme.breakpoints.down('sm')]: {
		// 	right: '0!important',
		// },
	},
}));
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

const TableView = ({ t }) => {
	const classes = useStyles();

	const [schedules, setSchedules] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [data, setData] = useState();
	const [showAll, setShowAll] = useState(false);
	const [statusSearch, setStatusSearch] = useState(false);

	const [state, dispatch] = useReducer(reducer, initialState);

	const _onFilterDate = (e) => {
		e.preventDefault();
		// loadAllClassesData();

		setStatusSearch(true);
	};

	const getAPI = async (params) => {
		setIsLoading(true);
		const res = await GetBookingScheduleForStudent(params);
		console.log(res);
		if (res.Code === 200) {
			dispatch({ type: 'ADD_PAGE', res });
			setData(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		} else {
			setData({});
		}
		setIsLoading(false);
	};

	const showAllData = () => {
		setFromDate('');
		setToDate('');

		setShowAll(true);
	};

	useEffect(() => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		if (statusSearch) {
			getAPI({
				fromdate: dayjs(fromDate).format('DD/MM/YYYY'),
				todate: dayjs(toDate).format('DD/MM/YYYY'),
				UID: UID,
				Page: 1,
				Token: Token,
			});
			setStatusSearch(false);
		}
	}, [statusSearch]);

	useEffect(() => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		if (showAll) {
			getAPI({
				fromdate: '',
				todate: '',
				UID: UID,
				Page: state.page,
				Token: Token,
			});
			setShowAll(false);
		}
	}, [showAll]);

	useEffect(() => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		getAPI({
			fromdate: fromDate,
			todate: toDate,
			UID: UID,
			Page: state.page,
			Token: Token,
		});
		$('body').removeClass('show-aside');
	}, [state.page]);

	useEffect(() => {
		TableView.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);

	return (
		<>
			<h1 className="main-title-page color-black">{t('Booked Schedule')}</h1>
			<div className="card">
				<div className="card-body bg-white-radius">
					<div
						className={`d-flex from-to-group mg-b-15 wrap-filter flex-wrap absoulute-date ${classes.wrapFilter}`}
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
								/>
							</div>
							<div className="wd-sm-200 wd-sm-240 mg-sm-r-10 wd-100p">
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
								/>
							</div>
						</div>
						<div className="flex-grow-0 wrap-book-search  tx-right flex-shrink-0 wd-100p wd-sm-auto tx-left mg-t-10 mg-sm-t-0 ">
							<button
								type="button"
								className="btn  wd-100p wd-sm-auto  btn-pink"
								onClick={_onFilterDate}
							>
								<FontAwesomeIcon icon="search" className="fa fa-search" />{' '}
								Search
							</button>
							<button
								type="button"
								className={`btn btn-pink   ${classes.btnShow}`}
								onClick={() => setShowAll(true)}
								style={{ borderRadius: '0' }}
							>
								{t('Show all')}
							</button>
						</div>
					</div>
					{/* <div className={classes.wrapBtn}>
						{' '}
					
					</div> */}
					<div className="table-responsive table-schedule">
						<table className="table">
							<thead>
								<tr>
									<th>{t('teacher')}</th>
									<th>{t('school-package')}</th>
									<th>{t('course')}</th>
									<th>{t('curriculum')}</th>
									{/* <th>{t('time')}</th> */}
									<th>{t('day')}</th>
									<th>{t('hour')}</th>
									<th>{t('class')}</th>
									<th>{t('status')}</th>
								</tr>
							</thead>
							<tbody>
								{isLoading ? (
									<tr>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
									</tr>
								) : !!data && data.length > 0 ? (
									data.map((ls, index) => (
										<tr key={`${index}`}>
											<td>{ls.TeacherName}</td>
											<td>{ls.PackageName}</td>
											<td>{ls.DocumentName}</td>
											<td>{ls.DocumentDetailName}</td>
											{/* <td>{ls.TimeCourse}</td> */}
											<td>{ls.StartDate}</td>
											<td>{ls.TimeStudy}</td>
											<td>{ls.ClassName}</td>
											<td className="text-right">{ls.StatusName}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={9}>
											<div className="empty-error tx-center mg-y-30 bg-white mg-x-auto">
												<img
													src="/static/img/no-data.svg"
													alt="no-booking"
													className="wd-200 mg-b-15"
												/>
												<p className=" tx-danger tx-medium">
													You don't have any booked lessons.
												</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					{/* {totalResult > pageSize && (
						<Pagination
							innerClass="pagination mg-t-15"
							activePage={pageNumber}
							itemsCountPerPage={pageSize}
							totalItemsCount={totalResult}
							pageRangeDisplayed={5}
							onChange={(page) => setPageNumber(page)}
							itemClass="page-item"
							linkClass="page-link"
							activeClass="active"
						/>
					)} */}
					<Box display={`flex`} justifyContent={`center`} mt={4}>
						<Pagination
							count={Math.ceil(state?.TotalResult / state?.PageSize)}
							color="secondary"
							onChange={(obj, page) => dispatch({ type: 'SELECT_PAGE', page })}
							className={classes.stylePagi}
						/>
					</Box>
				</div>
			</div>
		</>
	);
};

// TableView.getLayout = getStudentLayout;

// export default TableView;

TableView.getLayout = getStudentLayout;

export default withTranslation('common')(TableView);
