import React, { useState, useEffect, useReducer } from 'react';
import Pagination from 'react-js-pagination';
import { GetPaymentHistory } from '~/api/studentAPI';
// import { convertDateFromTo, randomId } from '~/utils';
import Skeleton from 'react-loading-skeleton';
import './index.module.scss';
import { getStudentLayout } from '~/components/Layout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';
// const fakeData = [
// 	{
// 		BookingID: randomId(),
// 		CoursesID: randomId(),
// 		DocumentID: 1,
// 		DocumentName: 'Giáo trình javascript nâng cao',
// 		DocumentDetailID: 1,
// 		LessionName: 'React From Beginner',
// 		TeacherName: 'Nguyễn Hoàng Anh',
// 		Status: 1,
// 		StatusString: 'As chedule',
// 		LessionDetail: '/student/evaluation/3',
// 		Schedule: '20/10/2020 10:30 - 11:30',
// 		TeacherUID: 3,
// 	},
// 	{
// 		BookingID: randomId(),
// 		CoursesID: randomId(),
// 		DocumentID: 1,
// 		DocumentName: 'Giáo trình javascript nâng cao',
// 		DocumentDetailID: 1,
// 		LessionName: 'React From Beginner',
// 		TeacherName: 'Nguyễn Hoàng Anh',
// 		Status: 1,
// 		StatusString: 'As chedule',
// 		LessionDetail: '/student/evaluation/3',
// 		Schedule: '20/10/2020 10:30 - 11:30',
// 		TeacherUID: 3,
// 	},
// 	{
// 		BookingID: randomId(),
// 		CoursesID: randomId(),
// 		DocumentID: 1,
// 		DocumentName: 'Giáo trình javascript nâng cao',
// 		DocumentDetailID: 1,
// 		LessionName: 'React From Beginner',
// 		TeacherName: 'Nguyễn Hoàng Anh',
// 		Status: 1,
// 		StatusString: 'As chedule',
// 		LessionDetail: '/student/evaluation/3',
// 		Schedule: '20/10/2020 10:30 - 11:30',
// 		TeacherUID: 3,
// 	},
// 	{
// 		BookingID: randomId(),
// 		CoursesID: randomId(),
// 		DocumentID: 1,
// 		DocumentName: 'Giáo trình javascript nâng cao',
// 		DocumentDetailID: 1,
// 		LessionName: 'React From Beginner',
// 		TeacherName: 'Nguyễn Hoàng Anh',
// 		Status: 1,
// 		StatusString: 'As chedule',
// 		LessionDetail: '/student/evaluation/3',
// 		Schedule: '20/10/2020 10:30 - 11:30',
// 		TeacherUID: 3,
// 	},
// 	{
// 		BookingID: randomId(),
// 		CoursesID: randomId(),
// 		DocumentID: 1,
// 		DocumentName: 'Giáo trình javascript nâng cao',
// 		DocumentDetailID: 1,
// 		LessionName: 'React From Beginner',
// 		TeacherName: 'Nguyễn Hoàng Anh',
// 		Status: 1,
// 		StatusString: 'As chedule',
// 		LessionDetail: '/student/evaluation/3',
// 		Schedule: '20/10/2020 10:30 - 11:30',
// 		TeacherUID: 3,
// 	},
// ];

let start = '',
	end = '';

const LessonItem = ({
	BookingID,
	DocumentID,
	DocumentDetailID,
	DocumentName,
	LessionName,
	LessonDetail,
	start,
	end,
	StatusName,
	date,
	TeacherUID,
	TeacherName,
	Status,
	StatusString,
}) => {
	return (
		<tr>
			<td style={{ letterSpacing: '0.5px' }}>{date}</td>
			<td>{DocumentName}</td>
			<td style={{ whiteSpace: 'pre-line' }}>{LessionName}</td>
			<td className="tx-nowrap">
				<Link
					href={`/student/teacher-profile/[id]`}
					as={`/student/teacher-profile/${TeacherUID}`}
				>
					<a href={true}>{TeacherName}</a>
				</Link>
			</td>
			<td className="tx-nowrap">
				<span className="tx-success">{StatusName}</span>
			</td>
			{/* <td>
				<Link href={`/student/evaluation/[eid]`} as={`/student/evaluation/1`}>
					<a href={true} className="btn btn-info btn-icon">
						<i className="fas fa-file-alt mg-r-10"></i>
						Chi tiết
					</a>
				</Link>
			</td> */}
		</tr>
	);
};

const EvaluationLists = ({ t }) => {
	const router = useRouter();
	const [data, setData] = useState({});
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [loading, setLoading] = useState(true);
	const getAPI = async (params) => {
		setLoading(false);
		const res = await GetPaymentHistory(params);
		if (res.Code === 200) {
			setData(res.Data);
			setLoading(true);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		} else {
			setData({});
		}
		setLoading(false);
	};

	const handlePageChange = (pageNumber) => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			getAPI({
				FromDate: fromDate,
				ToDate: toDate,
				Page: pageNumber,
			});
		}
	};

	const onSubmit = (e) => {
		e.preventDefault();
		getAPI({
			FromDate: fromDate,
			ToDate: toDate,
			Page: 1,
		});
		setPage(1);
		start = fromDate;
		end = toDate;
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
		getAPI({
			UID: '',
			Page: 1,
			Token: '',
			fromdate: '',
			todate: '',
		});
	}, []);
	return (
		console.log('render'),
		(
			<>
				<h1 className="main-title-page">{t('study-history')}</h1>
				<div className="card">
					<div className="card-body">
						{/* <form
							action=""
							method="get"
							noValidate
							className="st-date metronic-form"
							onSubmit={onSubmit}
						>
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
										/> */}
						{/* <input type="text" name="start-day " onChange={(value) =>  setFromDate(value)} className="form-control datetimepicker from-date" placeholder="From date" /> */}
						{/* </div>
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
										/>
									</div>
								</div>
								<div className="flex-grow-0 tx-right flex-shrink-0 mg-t-30 mg-sm-t-0">
									<button type="submit" className="btn btn-primary ">
										<FontAwesomeIcon icon="filter" className="fa fa-filter" />{' '}
										Filter
									</button>
								</div>
							</div>
						</form> */}

						<div className="table-responsive mg-t-20">
							<table className="table">
								<thead className="">
									<tr>
										<th>{t('thoi-gian')}</th>
										<th>{t('course')}</th>
										<th>{t('lesson')}</th>
										<th>{t('teacher')}</th>
										<th>{t('status')}</th>
										{/* <th></th> */}
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
										data.map((item) => (
											<LessonItem
												key={item.BookingID}
												BookingID={item.BookingID}
												DocumentID={item.DocumentID}
												DocumentName={item.CoursesName}
												DocumentDetailID={item.DocumentDetailID}
												LessionName={item.DocumentName}
												LessonDetail={item.LessonDetail}
												// start={convertDateFromTo(item.Schedule).fromTime}
												// end={convertDateFromTo(item.Schedule).endTime}
												date={item.PaymentDate}
												TeacherUID={item.TeacherUID}
												TeacherName={item.PayerName}
												StatusName={item.StatusName}
												StatusString={item.StatusString}
											/>
										))
									) : data.length === 0 ? (
										<tr className="bg-transparent">
											<td colSpan="6" className="tx-center">
												<img
													src="/static/img/no-data.svg"
													alt="no-booking"
													className="wd-200 d-block mx-auto"
												/>
												<p className="tx-danger tx-medium mg-t-15">
													{start.length > 0 && end.length > 0
														? `Bạn chưa đăng ký lớp học nào từ ${
																start.length > 0 ? `${start}` : ''
														  }  ${end.length > 0 ? `đến ${end}` : ''}`
														: start.length === 0 && end.length === 0
														? `Bạn chưa đăng ký lớp học nào`
														: start.length === 0
														? `Bạn chưa đăng ký lớp học nào trước ${end}`
														: `Bạn chưa đăng ký lớp học nào sau ${start}`}
												</p>
												<Link href="/student/booking-schedule">
													<a href={true} className="btn btn-primary">
														Đặt lịch học
													</a>
												</Link>
											</td>
										</tr>
									) : (
										!loading && (
											<tr className="bg-transparent">
												<td colSpan="6" className="tx-center">
													<span className="d-block text-center tx-danger tx-medium">
														Đã có lỗi xảy ra, xin vui lòng thử lại
													</span>
													<img
														src="/static/assets/img/error.svg"
														alt="error"
														className="wd-200 mg-b-15"
													/>
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
						{pageSize < totalResult && (
							<Pagination
								innerClass="pagination justify-content-end mt-3"
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
			</>
		)
	);
};

// EvaluationLists.getLayout = getStudentLayout;

// export default EvaluationLists;

EvaluationLists.getLayout = getStudentLayout;
EvaluationLists.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});

export default withTranslation('common')(EvaluationLists);
