import React, { useState, useEffect, useReducer } from 'react';

import styled from 'styled-components';
import { BookOpen } from '@styled-icons/boxicons-regular/BookOpen';
import { OpenBook } from '@styled-icons/entypo/OpenBook';
import { CancelCircle } from '@styled-icons/icomoon/CancelCircle';
import { TextDocument } from '@styled-icons/entypo/TextDocument';

import LessonHistoryCard from '~/page-components/student/home/LessonHistoryCard';
import LessonUpcomingCard from '~/page-components/student/home/LessonUpcomingCard';

import RatingLessonModal from '~/components/common/Modal/RatingLessonModal';
import RequireLessonModal from '~/components/common/Modal/RequireLessonModal';
import CancelBookingLessonModal from '~/components/common/Modal/CancelBookingLessonModal';
import PopUpCancelLesson from '~/components/common/Modal/PopUpCancelLesson';
import SkeletonLessonCard from '~/page-components/student/home/SkeletonLessonCard';
import { NOT_DATA_FOUND } from '~/components/common/Constant/message';

import { convertDateFromTo, checkCancelTime } from '~/utils.js';
import {
	LessionHistory,
	getCoursesInfoAPI,
	getUpcomingLessons,
	StudyProcess,
} from '~/api/studentAPI';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/scss/main.scss';
import { toastInit } from '~/utils';
import {
	CANCEL_BOOKING_SUCCESS,
	FETCH_ERROR,
} from '~components/common/Constant/toast';
import { getStudentLayout } from '~/components/Layout';
import { appSettings } from '~/config';
import './index.module.scss';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import dayjs from 'dayjs';
import Link from 'next/link';
import data from '../../../data/data.json';
import { i18n, withTranslation } from '~/i18n';
const styledIcon = `
  color: ${appSettings.colors.primary};
  width: 30px;
  height: 30px;
`;
const BookOpenIcon = styled(BookOpen)`
	${styledIcon}
`;
const OpenBookIcon = styled(OpenBook)`
	${styledIcon}
`;
const CancelCircleIcon = styled(CancelCircle)`
	${styledIcon}
`;
const TextDocumentIcon = styled(TextDocument)`
	${styledIcon}
`;
const initialCancelLesson = {
	BookingID: '',
	LessionName: '',
	date: '',
	start: '',
	end: '',
	reason: '',
};

const initialRatingLesson = {
	BookingID: '',
	TeacherUID: '',
	TeacherName: '',
};

const initialRequireLesson = {
	BookingID: '',
	avatar: '',
	TeacherUID: '',
	TeacherName: '',
	LessionName: '',
	LessionMaterial: '',
	SpecialRequest: '',
	date: '',
	start: '',
	end: '',
	DocumentName: '',
	SkypeID: '',
};
const Home = ({ t }) => {
	const router = useRouter();
	const [state, setState] = useState({});
	const [lock, setLock] = useState({
		id: '',
		lock: false,
	});
	const [stateCancelLesson, setStateCancelLesson] = useState(
		initialCancelLesson,
	);
	const [stateRatingLesson, setStateRatingLesson] = useState(
		initialRatingLesson,
	);
	const [stateRequireLesson, setStateRequireLesson] = useState(
		initialRequireLesson,
	);
	const [loading, setLoading] = useState(false);

	const [courseInfo, setCourseInfo] = useState(null);
	const [loadingCourseInfo, setLoadingCourseInfo] = useState(false);

	const [dataHis, setDataHis] = useState();

	const [process, setProcess] = useState();

	console.log('Data His: ', dataHis);

	const cancelToastFail = () => toast.error(FETCH_ERROR, toastInit);

	const handleRatingLesson = (BookingID, TeacherUID, TeacherName) => {
		setStateRatingLesson({
			...stateRatingLesson,
			BookingID,
			TeacherUID,
			TeacherName,
		});
	};

	const handleRequireLesson = (
		BookingID,
		avatar,
		TeacherUID,
		TeacherName,
		LessionMaterial,
		LessionName,
		SpecialRequest,
		date,
		start,
		end,
		DocumentName,
		SkypeID,
	) => {
		setStateRequireLesson({
			...stateRequireLesson,
			BookingID,
			avatar,
			TeacherUID,
			TeacherName,
			LessionMaterial,
			LessionName,
			SpecialRequest,
			date,
			start,
			end,
			DocumentName,
			SkypeID,
		});
	};

	const handleCancelBooking = (BookingID, LessionName, date, start, end) => {
		setStateCancelLesson({
			...stateCancelLesson,
			BookingID,
			LessionName,
			date,
			start,
			end,
		});
	};

	const cbCancelBooking = (
		id,
		result,
		LessionName,
		date,
		start,
		end,
		reason,
	) => {
		if (result === -1) {
			//Start Call API, lock the card
			setLock({
				id,
				lock: true,
			});
		} else {
			//After call API, unlock the card
			setLock({
				id,
				lock: false,
			});
			if (result === 1) {
				//If cancel lesson success
				let newUpcomingLessions = [...state.UpcomingLessions].filter(
					(item) => item.BookingID !== id,
				);
				setState({
					...state,
					UpcomingLessions: newUpcomingLessions,
				});
				setStateCancelLesson({
					...stateCancelLesson,
					reason,
				});
				$('#md-cancel-schedule-popup').modal('show');
			} else cancelToastFail(); //Cancel Lesson Fail
		}
	};

	const cbRatingLesson = (result, message, rating, BookingID, TeacherUID) => {
		if (result === 1) {
			//Rating Success
			let newState = { ...state };
			const index = newState.LessionHistory.findIndex(
				(item) =>
					item.BookingID === BookingID && item.TeacherUID === TeacherUID,
			);
			newState.LessionHistory[index].Rate = rating;
			setState(newState);
		}
	};

	const cbRequireLesson = (SpecialRequest, BookingID, TeacherUID) => {
		let newState = { ...state };
		const index = newState.UpcomingLessions.findIndex(
			(item) => item.BookingID === BookingID && item.TeacherUID === TeacherUID,
		);
		newState.UpcomingLessions[index].SpecialRequest = SpecialRequest;
		setState(newState);
	};

	const getAPI = async (params) => {
		console.log('data', res);
		const res = await LessionHistory(params);

		setLoading(true);

		try {
			await new Promise((e) => setTimeout(e, 1000));
			setLoading(false);
			if (res.Code === 200) {
				setState(res.Data);
				setDataHis(res.Data);
			}
			setState(data);
		} catch (error) {
			setLoading(false);
		}
	};

	const [dataComing, setDataComing] = useState();

	console.log('Data Coming: ', dataComing);

	const _getCoursesInfoAPI = async (params) => {
		setLoadingCourseInfo(true);
		setLoading(false);
		const res = await getUpcomingLessons(params);
		if (res.Code === 200) {
			console.log('DATA coming up: ', res.Data);
			// setCourseInfo({
			// 	...res.Data,
			// 	Message: '',
			// });
			setDataComing(res.Data);
		} else {
			setCourseInfo({
				Message: res.Message,
			});
		}
		setLoadingCourseInfo(false);
	};

	console.log('Loading: ', loading);

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

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		$(function () {
			$('[data-toggle="tooltip"]').tooltip();
		});
		getAPI({
			UID: UID,
			Token: Token,
		});
		_getCoursesInfoAPI({
			UID: UID,
			Token: Token,
		});

		// Get process
		(async () => {
			try {
				const res = await StudyProcess({ UID, Token });
				res.Code === 200 && setProcess(res.Data);
			} catch (error) {
				console.log(error);
			}
		})();

		$('body').removeClass('show-aside');
		Home.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);

	return (
		<>
			{!state ? (
				<NOT_DATA_FOUND />
			) : (
				<>
					<div className="lesson mg-t-45 animated fadeInUp am-animation-delay-1">
						<div className="d-xl-flex align-items-center justify-content-between box-title">
							<h4 className="title-section">{t('Upcoming Lesson')}</h4>
							{/* <Link href={'/student/upcoming-classes'}>
								<a
									href={true}
									className="link d-flex align-items-center tx-info"
								>
									{t('see-all')}
									<i className="fas fa-chevron-right mg-l-5"></i>
								</a>
							</Link> */}
						</div>

						{dataComing?.length === 0 && (
							<div className="empty-error tx-center mg-y-15 cr-item bg-white bg-f2 rounded-5 pd-15 pd-30 shadow">
								<img
									src="/static/img/no-data.svg"
									alt="no-data"
									className="wd-200 mg-b-15"
								/>
								<p className=" tx-danger tx-medium">
									{t("There's no have any upcoming lesson")}
								</p>
								<a href="/student/profile-teacher" className="btn btn-primary">
									{t('Book a class schedule')}
								</a>
							</div>
						)}

						<div className="course-horizental mg-t-15">
							<ul className="list-wrap">
								{loading ? (
									<SkeletonLessonCard />
								) : dataComing?.length > 0 ? (
									dataComing.map((item, index) => (
										<LessonUpcomingCard
											Avatar={item.Avatar}
											BookingID={item.BookingID}
											CourseName={item.CourseName}
											EndTime={item.EndTime}
											StartTime={item.StartTime}
											Status={item.Status}
											StudentName={item.StudentName}
											TeacherID={item.TeacherID}
											TeacherName={item.TeacherName}
											TeacherSkype={item.TeacherSkype}
											TimeStudy={item.TimeStudy}
										/>
									))
								) : (
									''
								)}
							</ul>
						</div>
					</div>{' '}
					<div className="lesson mg-t-45 animated fadeInUp am-animation-delay-2">
						<div className="d-xl-flex align-items-center justify-content-between box-title">
							<h4 className="title-section">{t('Completed Lessons')}</h4>
							{/* <Link href={'/student/class-history'}>
								<a
									href={true}
									className="link d-flex align-items-center tx-info"
								>
									{t('see-all')}
									<i className="fas fa-chevron-right mg-l-5"></i>
								</a>
							</Link> */}
						</div>{' '}
						<div className="course-horizental mg-t-15">
							{dataHis?.length === 0 && (
								<div className="empty-error tx-center mg-y-15 cr-item bg-white bg-f2 rounded-5 pd-15 pd-30 shadow">
									<img
										src="/static/img/no-data.svg"
										alt="no-data"
										className="wd-200 mg-b-15"
									/>
									<p className=" tx-danger tx-medium">
										{t(`You don't have any lessons`)}.
									</p>
								</div>
							)}
							<ul className="list-wrap">
								{loading ? (
									<SkeletonLessonCard />
								) : (
									dataHis?.length > 0 &&
									dataHis?.map((item) => (
										<LessonHistoryCard
											key={item.BookingID}
											BookingID={item.BookingID}
											TeacherID={item.TeacherID}
											avatar={item.Avatar}
											TeacherName={item.TeacherName}
											CourseName={item.CourseName}
											LessionMaterial={item.Material}
											SpecialRequest={item.SpecialRequest}
											start={item.StartTime}
											end={item.EndTime}
											TimeStudy={item.TimeStudy}
											onHandleCancelBooking={handleCancelBooking}
											onHandleRequireLesson={handleRequireLesson}
											lock={lock}
											// cancelable={checkCancelTime(
											// 	convertDateFromTo(item.ScheduleTimeVN).dateObject,
											// )}
										/>
									))
								)}
							</ul>{' '}
						</div>{' '}
					</div>{' '}
				</>
			)}
			<RatingLessonModal
				BookingID={stateRatingLesson.BookingID}
				TeacherUID={stateRatingLesson.TeacherUID}
				TeacherName={stateRatingLesson.TeacherName}
				callback={cbRatingLesson}
			/>
			<RequireLessonModal
				BookingID={stateRequireLesson.BookingID}
				avatar={stateRequireLesson.avatar}
				TeacherUID={stateRequireLesson.TeacherUID}
				TeacherName={stateRequireLesson.TeacherName}
				LessionName={stateRequireLesson.LessionName}
				LessionMaterial={stateRequireLesson.LessionMaterial}
				SpecialRequest={stateRequireLesson.SpecialRequest}
				date={stateRequireLesson.date}
				start={stateRequireLesson.start}
				end={stateRequireLesson.end}
				DocumentName={stateRequireLesson.DocumentName}
				SkypeID={stateRequireLesson.SkypeID}
				callback={cbRequireLesson}
			/>
			<CancelBookingLessonModal
				BookingID={stateCancelLesson.BookingID}
				LessionName={stateCancelLesson.LessionName}
				date={stateCancelLesson.date}
				start={stateCancelLesson.start}
				end={stateCancelLesson.end}
				callback={cbCancelBooking}
			/>
			<PopUpCancelLesson
				LessionName={stateCancelLesson.LessionName}
				date={stateCancelLesson.date}
				start={stateCancelLesson.start}
				end={stateCancelLesson.end}
				reason={stateCancelLesson.reason}
			/>{' '}
			<ToastContainer />
		</>
	);
};

Home.getLayout = getStudentLayout;

export default withTranslation('common')(Home);
