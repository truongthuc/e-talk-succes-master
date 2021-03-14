import React, { useState, useEffect, useRef } from 'react';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
import { getScheduleLog } from '~/api/teacherAPI';
import Pagination from 'react-js-pagination';
import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import { teacherEvaluatedClasses, addScheduleLog } from '~/api/teacherAPI';
import { Popover, OverlayTrigger, Overlay } from 'react-bootstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dataHy from '../../../../data/data.json';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';

function getData() {
	const andt = dataHy.evaluationClass;
	return andt;
}

const FinishedRow = ({ data, showStudentModal }) => {
	const {
		BookingID,
		ScheduleTimeVN,
		ScheduleTimeUTC,
		StudentName,
		StudentUID,
		LessonName,
		CourseName,
		DocumentName,
		TimeZoneName,
		VNTime,
		LessionName,
		SkypeID,
		EvaluationID,
		StudentCode,
		StatusString,
		Status,
		FinishedType,
		LessionMaterial,
		GenderID,
		SpecialRequest,
	} = data;
	const handleEnterClass = async (e) => {
		e.preventDefault();
		try {
			addScheduleLog({ BookingID });
		} catch (error) {
			console.log(error?.message ?? `Can't add schedule log !!`);
		}
		window.location.href = `skype:${SkypeID}?chat`;
	};

	return (
		<tr>
			<td className="clr-time">
				<div className="mg-b-5">
					<span className="">{data.StudentCode}</span>
				</div>
			</td>
			<td className="clr-lesson">
				<div className="mg-b-5">
					<span className=" mg-r-5 tx-medium">Course:</span>
					<span className="">{data.CoursesName}</span>
				</div>
				<div className="">
					<span className=" mg-r-5 tx-medium">Lesson:</span>
					<span className="">{data.LessonName}</span>
				</div>
			</td>
			<td className="clr-student">
				<a
					href={true}
					onClick={(e) => {
						e.preventDefault();
						showStudentModal(StudentUID);
					}}
					className="clrm-studentname tx-info"
				>
					{StudentName}
					<FontAwesomeIcon
						icon={
							GenderID === 1 ? 'mars' : GenderID === 2 ? 'venus' : 'genderless'
						}
						className={`fa fa-${
							GenderID === 1 ? 'mars' : GenderID === 2 ? 'venus' : 'genderless'
						} mg-l-10 clrm-icon-male`}
					/>
				</a>
			</td>

			<td className="clr-status tx-center">
				<span className={`badge badge-secondary pd-5 tx-12`}>
					{StatusString && StatusString.toString().toUpperCase()}
				</span>
				{<span className="badge badge-success pd-5">{data.FinishedType}</span>}
			</td>
			<td className="clr-actions tx-center">
				<Link
					href={`/teacher/evaluation/detail/[eid]`}
					as={`/teacher/evaluation/detail/${data.EvaluationID}`}
				>
					<a
						href={true}
						className="btn btn-sm btn-success rounded-5 mg-sm-r-5-f"
					>
						<FontAwesomeIcon
							icon="vote-yea"
							className="fas fa-vote-yea mg-r-5"
						/>{' '}
						Detail
					</a>
				</Link>
				<Link
					href={`/teacher/evaluation/detail/[eid]`}
					as={`/teacher/evaluation/detail/${BookingID}`}
				>
					<a href={true} className="btn btn-sm btn-danger rounded-5">
						<FontAwesomeIcon
							icon="trash-alt"
							className="fas fa-trash-alt mg-r-5"
						/>{' '}
						Delete
					</a>
				</Link>
			</td>
		</tr>
	);
};

const EvaluatedClasses = ({ t }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [studentId, setStudentId] = useState(null);
	const mdStudentInfo = useRef(true);

	const showStudentModal = (studentId) => {
		setStudentId(studentId);
		$(mdStudentInfo.current).modal('show');
	};

	const layData = getData();
	console.log('tu hy', layData);

	const unMountComponents = () => {
		mdStudentInfo.current = false;
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
		return unMountComponents;
	}, []);

	const loadFinishedClass = async () => {
		try {
			const res = await teacherEvaluatedClasses({
				Page: pageNumber,
				Status: 2,
			});
			if (res?.Code && res.Code === 200) {
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			} else {
				console.log('Code response khác 1');
			}
			setIsLoading(false);
			return;
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
		setData([]);
	};

	useEffect(() => {
		loadFinishedClass();
	}, [pageNumber]);

	return (
		<>
			<h1 className="main-title-page">{t('evaluated-classes')}</h1>
			<div className="card">
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-classrooms table-borderless responsive-table table-hover">
							<thead className="">
								<tr className="">
									<th className="clr-time">Student Code</th>
									<th className="clr-lesson">{t('lesson')}</th>
									<th className="clr-student">{t('student')}</th>
									<th className="clr-status tx-center">{t('finished-type')}</th>
									<th className="clr-action tx-center">{t('actions')}</th>
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
										<FinishedRow
											key={`${item.BookingID}`}
											data={item}
											showStudentModal={showStudentModal}
										/>
									))
								) : (
									<tr className="bg-white-f">
										<td colSpan={5}>
											<div className="empty-error tx-center mg-t-30 bg-white mg-x-auto">
												<img
													src="/static/img/no-data.svg"
													alt="no-booking"
													className="wd-200 mg-b-15"
												/>
												<p className=" tx-danger tx-medium">
													You don't have any finished classes.
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
				</div>
			</div>
			<StudentInformationModal ref={mdStudentInfo} studentId={studentId} />
		</>
	);
};

// EvaluatedClasses.getLayout = getLayout;
// export default EvaluatedClasses;

EvaluatedClasses.getLayout = getLayout;
EvaluatedClasses.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(EvaluatedClasses);
