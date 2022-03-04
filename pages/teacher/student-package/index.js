import React, { useState, useEffect, useRef } from 'react';
import Pagination from 'react-js-pagination';
import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import { teacherEndOfPackage } from '~/api/teacherAPI';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dataHy from '../../../data/data.json';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';

function getData() {
	const andt = dataHy.EndOfStudentPackage;
	return andt;
}
const MissingFeedbackRow = ({ data }) => {
	const {
		BookingID,
		ScheduleTimeVN,
		ScheduleTimeUTC,
		DocumentName,
		LessionName,
		TotalClass,
		EvaluationStatus,
		StudentCode,
		FurthestClass,
		ElearnCoursesStudentID,
		EndDate,
		ClassBooked,
	} = data;
	return (
		<tr>
			<td>{data.StudentCode}</td>
			<td>{data.StudentName}</td>
			<td>{data.TotalClass}</td>
			<td>{data.ClassBooked}</td>
			<td>{data.FurthestClass}</td>
			<td className="text-right">{data.EndDate}</td>
		</tr>
	);
};

const StudentPackage = ({ t }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);

	const loadMissingFeedback = async (params) => {
		try {
			const res = await teacherEndOfPackage(params);
			if (res?.Code && res.Code === 200) {
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
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		loadMissingFeedback({
			UID: UID,
			Token: Token,
		});

		$('body').removeClass('show-aside');
		StudentPackage.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);

	return (
		<>
			<h1 className="main-title-page">{t('End Date Package')}</h1>
			<div className="card">
				<div className="card-body">
					<>
						<div className="table-responsive ">
							<table className="table table-classrooms table-borderless  table-hover">
								<thead className="">
									<tr className="">
										<th>{t('student-code')}</th>
										<th>{t('student-name')}</th>
										<th>{t('Total number')}</th>
										<th>{t('Classes Booked')}</th>
										<th>{t('furthest-class')}</th>
										<th>{t('End Date')}</th>
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
									) : !!data && !!data.length > 0 ? (
										data.map((item) => (
											<MissingFeedbackRow
												key={`${item.BookingID}`}
												data={item}
											/>
										))
									) : (
										<tr className="bg-white-f">
											<td colSpan={6}>
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

						{totalResult > pageSize && (
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
						)}
					</>
				</div>
			</div>
		</>
	);
};

// StudentPackage.getLayout = getLayout;
// export default StudentPackage;

StudentPackage.getLayout = getLayout;

export default withTranslation('common')(StudentPackage);
