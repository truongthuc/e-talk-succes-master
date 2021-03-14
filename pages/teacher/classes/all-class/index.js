import React, { useState, useEffect, useRef } from 'react';
import { teacherAllClass, addScheduleLog } from '~/api/teacherAPI';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
import Pagination from 'react-js-pagination';
import Select from 'react-select';
import { appSettings } from '~/config';
import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import './index.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dataHy from '../../../../data/data.json';
import { i18n, withTranslation } from '~/i18n';
console.log('o ngoai', dataHy.allClass);

import Router, { useRouter } from 'next/router';

function getData() {
	const andt = dataHy.allClass;
	return andt;
}

const DateTimeFormat = new Intl.DateTimeFormat('vi-VN', {
	month: '2-digit',
	day: '2-digit',
	year: 'numeric',
});

const statusOptions = [
	{
		value: 1,
		label: 'Student is PRESENT',
	},
	{
		value: 2,
		label: 'Teacher is absent',
	},
	{
		value: 3,
		label: 'STUDENT IS ABSENT without notice',
	},
	{
		value: 4,
		label: 'NO INTERNET/POWER INTERRUPTION',
	},
	{
		value: 5,
		label: 'Teacher have not set up status',
	},
	{
		value: 6,
		label: 'Booked',
	},
];

const AllClassRow = ({ data, showStudentModal }) => {
	const {
		Status,
		StatusString,
		FinishTypeString,
		VNTime = '',
		TimeZoneName = '',
		ScheduleTimeUTC = '',
		LessionMaterial = '',
		StudentName = '',
		BookingID = '',
		LessionName = '',
		CoursesName = '',
		SkypeID,
		StudentUID,
		DocumentName = '',
		GenderID,
	} = data;

	const handleEnterClass = async (e) => {
		e.preventDefault();
		try {
			const res = addScheduleLog({ BookingID });
		} catch (error) {
			console.log(error?.message ?? `Can't add schedule log !!`);
		}
		window.location.href = `skype:${SkypeID}?chat`;
	};

	return (
		<tr>
			<td className="clr-id">
				<span className="">{data.BookingID}</span>
			</td>
			<td className="clr-lesson">
				<div className="mg-b-5">
					<span className="">{data.CoursesName}</span>
				</div>
			</td>
			<td>
				<div className="">
					<span className="">{data.DocumentName}</span>
				</div>
			</td>
			<td className="clr-lesson">
				<a
					href={true}
					onClick={(e) => {
						e.preventDefault();
						showStudentModal(StudentName);
					}}
					className="clrm-studentname"
				>
					{data.StudentName}
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
			<td className="clr-time">
				<div className="mg-b-5">
					<span className="">{data.VNTime}</span>
				</div>
			</td>
			<td>
				<div className="">
					<span className="">{data.VNTime}</span>
				</div>
			</td>
			<td className="clr-status">
				<span
					className={`badge badge-${
						Status === 1
							? 'primary tx-white'
							: Status === 2
							? 'success'
							: 'blue'
					} pd-10`}
				>
					{Status === 1
						? 'Booked'
						: Status === 2
						? 'Teacher is absent'
						: Status === 3
						? 'STUDENT IS ABSENT without notice'
						: Status === 4
						? 'NO INTERNET/POWER INTERRUPTION'
						: Status === 5
						? 'Teacher have not set up status'
						: 'Student is PRESENT'}
				</span>
				{/* {Status === 1 && <span className="badge badge-warning pd-5">BOOKED</span>}
                {Status === 2 && <span className="badge badge-success pd-5">FINISHED</span>} */}
			</td>
			{/* <td className="clr-finishType">
				{Status === 2 && <span className="">{FinishTypeString}</span>}

			</td> */}
			{/* <td className="clr-actions">
				{
					<a
						href={LessionMaterial}
						className="btn btn-sm btn-warning rounded-5 mg-5"
						target="_blank"
						rel="noreferrer"
					>
						<FontAwesomeIcon
							icon="book-open"
							className="fa fa-book-open clrm-icon mg-r-5"
						/>{' '}
						Material
					</a>
				}
				{Status === 1 && (
					<a
						href={`skype:${SkypeID}?chat`}
						className=" btn btn-sm btn-info rounded-5 mg-5"
						onClick={handleEnterClass}
					>
						<FontAwesomeIcon
							icon={['fab', 'skype']}
							className="fab fa-skype clrm-icon mg-r-5"
						/>{' '}
						Join class
					</a>
				)}
				{Status === 2 && (
					<Link href={`/teacher/evaluation/detail/${BookingID}`}>
						<a
							href={true}
							// target="_blank"
							// rel="noreferrer"
							className=" btn btn-sm btn-success btn-detail rounded-5 mg-5"
						>
							<FontAwesomeIcon
								icon="vote-yea"
								className="fas fa-vote-yea mg-r-5"
							/>{' '}
							Detail
						</a>
					</Link>
				)}
			</td> */}
		</tr>
	);
};

const AllClasses = ({ t }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [filterStatusAllClass, setFilterStatusAllClass] = useState(
		statusOptions[0],
	);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState([]);
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [studentId, setStudentId] = useState(null);
	const mdStudentInfo = useRef(true);

	const layData = getData();
	console.log('tu hy', layData);

	const showStudentModal = (studentId) => {
		setStudentId(studentId);
		$(mdStudentInfo.current).modal('show');
	};

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

	const _onFilterDate = (e) => {
		e.preventDefault();
		loadAllClassesData();
	};

	const _changeFilterStatusAllClass = (event) => {
		setFilterStatusAllClass(event.target.value);
	};

	const loadAllClassesData = async () => {
		setIsLoading(true);
		console.log(fromDate);
		try {
			const res = await teacherAllClass({
				Status: parseInt(filterStatusAllClass.value),
				fromDate: fromDate ? DateTimeFormat.format(new Date(fromDate)) : '',
				toDate: toDate ? DateTimeFormat.format(new Date(toDate)) : '',
			});
			if (res?.Code && res.Code === 200) {
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			} else {
				console.log('Code response khác 1');
			}
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};
	useEffect(() => {
		console.log(filterStatusAllClass);
	}, [filterStatusAllClass]);

	useEffect(() => {
		loadAllClassesData({
			status: 1,
			fromdate: '',
			todate: '',
			UID: 61241,
			page: 1,
			token: '',
		});
	}, [pageNumber, filterStatusAllClass]);

	return (
		<>
			<h1 className="main-title-page">{t('all-class')}</h1>
			<div className="d-flex align-items-center justify-content-between mg-b-15 flex-wrap">
				<div className="wd-300 order-1 mg-t-15 mg-md-t-0 m-g-l-auto">
					<Select
						options={statusOptions}
						defaultValue={filterStatusAllClass}
						onChange={(values) => setFilterStatusAllClass(values)}
						styles={appSettings.selectStyle}
					/>
					{/* <select name="language" id=""
                        value={filterStatusAllClass}
                        className="form-control" onChange={_changeFilterStatusAllClass}>
                        <option value="0">All status</option>
                        <option value="1">Booked</option>
                        <option value="2">Finished</option>
                    </select> */}
				</div>
			</div>

			<div className="card mg-b-30">
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-classrooms table-borderless responsive-table table-hover">
							<thead>
								<tr>
									<th className="clr-id">ID</th>
									<th className="clr-lesson">{t('course')}</th>
									<th className="clr-lesson">{t('lesson')}</th>
									<th className="clr-lesson">{t('student')}</th>
									<th className="clr-lesson">{t('vn-time')}</th>
									<th className="clr-time">{t('your-time')} </th>
									<th className="clr-status">{t('status')}</th>
									{/* <th className="clr-finishType">Finish Type</th> */}
									{/* <th className="clr-actions">{t('actions')}</th> */}
								</tr>
							</thead>
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
										<AllClassRow
											key={`${item.BookingID}`}
											data={item}
											showStudentModal={showStudentModal}
										/>
									))
								) : (
									<tr>
										<td colSpan={7}>
											<span className="tx-danger d-block tx-center tx-medium tx-16">
												No classes.
											</span>
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

// AllClasses.getLayout = getLayout;

// export default AllClasses;

AllClasses.getLayout = getLayout;
AllClasses.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(AllClasses);
