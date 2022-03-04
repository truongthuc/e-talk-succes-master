import React, { useState, useEffect, useReducer } from 'react';
import Select from 'react-select';
import ListSchedule from '~/page-components/student/booking-schedule/ListSchedule';
import { GetListTeacher } from '~/api/studentAPI';
import { getLevelPurposeOptions } from '~/api/optionAPI';
import Pagination from 'react-js-pagination';
import Router, { useRouter } from 'next/router';
import BookingLessonModal from '~/components/common/Modal/BookingLessonModal';
// import ListNationModal from '~components/common/Modal/ListNationModal';

import { toast } from 'react-toastify';
import 'react-toastify/scss/main.scss';
import { toastInit } from '~/utils';
import { appSettings } from '~/config';

import { nationMapToFlag } from '~/utils';
import { ToastContainer } from 'react-toastify';
import DatePicker from 'react-datepicker';
import './index.module.scss';
import { getStudentLayout } from '~/components/Layout';
import dayjs from 'dayjs';
import Swiper from 'swiper';
import Link from 'next/link';
import { i18n, withTranslation } from '~/i18n';
const genderArr = [
	{
		label: 'Tất cả giới tính',
		value: '0',
	},
	{
		label: 'Nam',
		value: '1',
	},
	{
		label: 'Nữ',
		value: '2',
	},
];
const nationArr = [
	{
		label: 'Tất cả quốc tịch',
		value: '0',
	},
	{
		label: 'Giáo viên Philippines',
		value: '1',
	},
	{
		label: 'Giáo viên Việt Nam',
		value: '2',
	},
	{
		label: 'Giáo viên bản ngữ',
		value: '3',
	},
];

const initialState = {
	nation: [],
	gender: genderArr[0],
	levelPurpose: [],
	selectedLevelPurpose: [],
	date: dayjs(new Date()).format('DD/MM/YYYY'),
	startTime: new Date('01/01/2020 00:00'),
	endTime: new Date('01/01/2020 23:00'),
	searchText: '',
	nation: nationArr[0],
};

const initialBookLesson = {
	StudyTimeID: '',
	LessionName: '',
	TeacherUID: '',
	TeacherIMG: '',
	TeacherName: '',
	Rate: '',
	date: '',
	start: '',
	end: '',
	BookingID: '',
};

const initialOnBookState = {
	TeacherUID: '',
	StudyTimeID: '',
	date: '',
};

const reducer = (prevState, { type, payload }) => {
	switch (type) {
		case 'STATE_CHANGE': {
			return {
				...prevState,
				[payload.key]: payload.value,
			};
		}
		default:
			return prevState;
			break;
	}
};

const pad = (n) => ('' + n >= 10 ? n : '0' + n);

const BookingLesson = ({ t }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [teachersList, setTeacherList] = useState(null);
	const [loading, setLoading] = useState(false);
	const [onBookState, setOnBookState] = useState(initialOnBookState);
	const [stateBookLesson, setStateBookLesson] = useState(initialBookLesson);
	const [learnTime, setLearnTime] = useState([]);
	const [date, setDate] = useState(null);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const router = useRouter();

	const errorToast = () =>
		toast.error('Đã có lỗi xảy ra, xin vui lòng thử lại', toastInit);

	const getAPI = async (params) => {
		setLoading(true);
		const res = await GetListTeacher(params);
		if (res.Code === 200) {
			setTeacherList(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		} else errorToast();
		setLoading(false);
	};

	const renderLevelPurpose = (options) => {
		return options.map((item) => item.PurposeLevelName);
	};

	const fetchListLevelPurpose = async () => {
		const res = await getLevelPurposeOptions();
		if (res.Code === 1 && res.Data.length > 0) {
			let key = 'levelPurpose';
			const value = res.Data;
			dispatch({ type: 'STATE_CHANGE', payload: { key, value } });
		}
	};

	const onHandleBooking = (
		StudyTimeID,
		LessionName,
		TeacherUID,
		TeacherIMG,
		TeacherName,
		Rate,
		date,
		start,
		end,
		BookingID,
	) => {
		setStateBookLesson({
			...stateBookLesson,
			StudyTimeID,
			LessionName,
			TeacherUID,
			TeacherIMG,
			TeacherName,
			Rate,
			date,
			start,
			end,
			BookingID,
		});
	};

	const handleChange = (e) => {
		const target = e.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const key = target.getAttribute('name');
		dispatch({ type: 'STATE_CHANGE', payload: { key, value } });
	};

	const handlePageChange = (pageNumber) => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			onSearch(null, pageNumber);
		}
	};

	const handleChangeDate = (e) => {
		try {
			let key = 'date';
			//let value = $('#date-selected').val().split(', ')[1];

			// if (dayjs(new Date()).format('DD/MM/YYYY') === value) {
			// 	dispatch({
			// 		type: 'STATE_CHANGE',
			// 		payload: {
			// 			key: 'startTime',
			// 			value: `${new Date().getHours() + 1}:00`,
			// 		},
			// 	});
			// 	dispatch({
			// 		type: 'STATE_CHANGE',
			// 		payload: { key: 'endTime', value: '23:00' },
			// 	});
			// }

			//dispatch({ type: 'STATE_CHANGE', payload: { key, value } });
		} catch (err) {
			console.log(err);
		}
	};

	const onBook = (TeacherUID, StudyTimeID, date) => {
		setOnBookState({
			...onBookState,
			TeacherUID,
			StudyTimeID,
			date,
		});
	};

	const onSearch = (e, page) => {
		// setTeacherList(null);
		e && e.preventDefault();
		let x = [];
		let min = parseInt(state.startTime.getHours());
		let max = parseInt(state.endTime.getHours());

		for (let i = min; i <= max; i++) {
			x.push(`${i < 10 ? '0' + i : i}:00`);
			if (i !== max) x.push(`${i < 10 ? '0' + i : i}:30`);
		}
		setLearnTime(x);

		let z = [];
		if (!!state.selectedLevelPurpose)
			for (let i = 0; i < state.selectedLevelPurpose.length; i++) {
				for (let j = 0; j < state.levelPurpose.length; j++) {
					if (
						state.selectedLevelPurpose[i] ===
						state.levelPurpose[j].PurposeLevelName
					) {
						z.push(state.levelPurpose[j].ID);
						break;
					}
				}
			}

		// $('#display-schedule').prop('checked', false);
		getAPI({
			Nation: state?.nation?.value ?? '0',
			LevelPurpose: z.join(','),
			Gender: state?.gender?.value ?? '0',
			Date: state.date + '',
			Start: `${pad(state.startTime.getHours())}:00`,
			End: `${pad(state.endTime.getHours())}:00`,
			Search: state.searchText,
			Page: page,
		});
	};

	const initCalendar = () => {
		const dateString = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thusday',
			'Friday',
			'Saturday',
		];
		const monthString = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		const getMonthString = (inMonth) => monthString[inMonth];
		const getDateString = (inDate) => dateString[inDate];
		const getNextNumberDay = (startDate, daysToAdd) => {
			let arrDates = [];
			for (let i = 1; i <= daysToAdd; i++) {
				let currentDate = new Date(startDate);
				currentDate.setDate(startDate.getDate() + i);
				let html = `	<div class="day-block swiper-slide" data-date='${currentDate}'>
          <div class="day-month">${getMonthString(currentDate.getMonth())}</div>
          <div class="day-number">${currentDate.getDate()}</div>
          <div class="day-text">${getDateString(currentDate.getDay())}</div>
          </div>`;
				arrDates.push(html);
			}
			return arrDates;
		};
		const dateDisplay = document.getElementById('date-selected');

		const slideClickCallback = (swiper, event) => {
			try {
				if (event.target !== swiper.clickedSlide) return;
				let slides = swiper.slides;

				let i = 0;
				while (i < slides.length) {
					swiper.slides[i].classList.remove('selected');
					i++;
				}
				swiper.clickedSlide.classList.add('selected');

				if (window.matchMedia('(min-width: 992px)').matches) {
					swiper.slideTo(swiper.clickedIndex - 3, 500, false);
				} else if (window.matchMedia('(min-width: 600px)').matches) {
					swiper.slideTo(swiper.clickedIndex - 2, 500, false);
				} else {
					swiper.slideTo(swiper.clickedIndex - 1, 500, false);
				}
			} catch (error) {
				console.log({ error });
			}
			dispatch({
				type: 'STATE_CHANGE',
				payload: {
					key: 'date',
					value: dayjs(swiper.clickedSlide.dataset.date).format('DD/MM/YYYY'),
				},
			});
		};
		const calendarSwiper = new Swiper('.calendar__picker', {
			init: false,
			speed: 500,
			spaceBetween: 5,
			slidesPerView: 7,
			grabCursor: true,
			loop: false,
			//   centerMode:true,
			watchOverflow: true,
			// centeredSlidesBounds:true,
			// centerInsufficientSlides:true,
			navigation: {
				nextEl: '.navigation_slider .next-btn',
				prevEl: '.navigation_slider .prev-btn',
			},
			breakpoints: {
				992: {
					slidesPerView: 7,
					spaceBetween: 10,
				},
				600: {
					slidesPerView: 5,
					spaceBetween: 10,
				},
				0: {
					slidesPerView: 3,
					spaceBetween: 5,
				},
			},
			observer: true,
			observeParents: true,
			on: {
				init: function () {
					let today = new Date();
					today.setDate(today.getDate() - 1);
					this.appendSlide(getNextNumberDay(today, 14));
				},
				click: slideClickCallback,
				reachEnd: function (event) {
					if (this.slides.length === 0 || this.slides.length > 14) return;
					let lastDate = new Date(
						this.slides[this.slides.length - 1].dataset.date,
					);
					this.appendSlide(getNextNumberDay(lastDate, 7));
					this.update();
				},
			},
		});
		calendarSwiper.init();

		const todayBtn = document.getElementById('js-select-today');

		const chooseToday = (e) => {
			e && e.preventDefault();
			const slideEls = document.querySelectorAll(
				'.calendar__picker .day-block',
			);
			[...slideEls].map((slide) => slide.classList.remove('selected'));
			slideEls[0].classList.add('selected');
			calendarSwiper.slideTo(0, 500, false);
			const date = slideEls[0].dataset.date;
			dateDisplay.value = dayjs(new Date(date)).format('dddd, DD/MM/YYYY');
		};
		todayBtn.addEventListener('click', chooseToday);

		function setDateDisplay() {
			const selected = this.el.querySelector('.swiper-slide.selected');
			if (selected) {
				const date = selected.dataset.date;
				dateDisplay.value = dayjs(new Date(date)).format('dddd, DD/MM/YYYY');
			}
		}

		calendarSwiper.on('click', setDateDisplay);
		calendarSwiper.on('slideChange', setDateDisplay);
		chooseToday();
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
		//initCalendar();
		fetchListLevelPurpose();

		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		getAPI({
			UID: UID,
			Token: Token,
		});
		$('body').removeClass('show-aside');
		BookingLesson.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);

	return (
		<>
			<h1 className="main-title-page">{t('booking-schedule')}</h1>
			<div className="media-body-wrap pd-15 shadow">
				<div
					className="form-row"
					style={{ maxWidth: 600, zIndex: 2, position: 'relative' }}
				>
					<div className="col-sm-3 margin-bottom-10">
						<DatePicker
							dateFormat="dd/MM/yyyy"
							className="form-control"
							placeholderText={`Ngày muốn học`}
							selected={date}
							onChange={(date) => setDate(date)}
							isClearable={!!date ? true : false}
						/>
					</div>
					<div className="col-sm-6 item margin-bottom-10">
						<input
							className="form-control"
							name="searchText"
							type="text"
							placeholder="Nhập tên giáo viên..."
							onChange={handleChange}
						/>
					</div>
					<div className="col-sm-3 item search-btn-group">
						<a
							href={true}
							className="submit-search btn btn-primary btn-block"
							onClick={(e) => onSearch(e, 1)}
						>
							<i className="fa fa-search mg-r-5"></i>
							{t('search')}
						</a>
					</div>
				</div>

				<div className="filter-group pd-t-5 mg-t-15 bd-t" id="list-tutor">
					<div className="filter-row row">
						<div className="left col-12">
							<h5>{t('list-of-teachers')}</h5>
						</div>
						{/*  <div className="right col-md-10" style={{ alignItems: 'center', display: 'inline-flex' }}>
            <div className="custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id="display-schedule" />
              <label className="custom-control-label" htmlFor="display-schedule">Hiển thị lịch</label>
            </div>
          </div> */}
					</div>
					<div className="filter-row row pos-relative">
						<div className="col-sm-12">
							{loading && (
								<div className={`overlay`}>
									<div className="lds-ellipsis">
										<div></div>
										<div></div>
										<div></div>
										<div></div>
									</div>
								</div>
							)}
							{teachersList?.length > 0 ? (
								<div className="table-tutor">
									<ul className="list-tutors">
										{teachersList.map((item) => (
											<li className="tutor" key={item.TeacherUID}>
												<div className="totor-detail">
													<Link
														href={`/student/teacher-profile/[tid]`}
														as={`/student/teacher-profile/${item.TeacherUID}`}
													>
														<a href={true} className="tutor-wrap no-hl">
															<span className="tutor-avatar">
																<img
																	src={
																		item.TeacherIMG
																			? item.TeacherIMG
																			: '/static/assets/img/default-avatar.png'
																	}
																	alt="Avatar"
																	onError={(e) => {
																		e.target.onerror = null;
																		e.target.src =
																			'/static/assets/img/default-avatar.png';
																	}}
																/>
															</span>
															<div className="tutor-infomation pd-5">
																<div className="tutor-info">
																	<div className="tutor-rating-star">
																		<div className="rating-stars">
																			<span className="empty-stars">
																				<i className="star fa fa-star"></i>
																				<i className="star fa fa-star"></i>
																				<i className="star fa fa-star"></i>
																				<i className="star fa fa-star"></i>
																				<i className="star fa fa-star"></i>
																			</span>
																			<span
																				className="filled-stars"
																				style={{ width: `${item.Rate * 20}%` }}
																			>
																				<i className="star fa fa-star"></i>
																				<i className="star fa fa-star"></i>
																				<i className="star fa fa-star"></i>
																				<i className="star fa fa-star"></i>
																				<i className="star fa fa-star"></i>
																			</span>
																		</div>
																		<div className="tutor-rate-point">
																			{item.Rate.toFixed(1)}
																		</div>
																	</div>
																</div>
																<h6 className="mg-t-5">
																	<span
																		className={`flag-icon flag-icon-${
																			item.National
																				? nationMapToFlag(item.National)
																				: 'vn'
																		} flag-icon-squared`}
																	></span>{' '}
																	{item.TeacherName}
																</h6>
																<p>Lịch dạy ngày: {'20/10/2020'}</p>
															</div>
														</a>
													</Link>
													<div className="tutor-schedule d-block custom-student">
														<ul className="ul-schedule">
															<ListSchedule
																onBookStudyTimeID={onBookState.StudyTimeID}
																onBookTeacherUID={onBookState.TeacherUID}
																onBookDate={onBookState.date}
																learnTime={learnTime}
																TeacherUID={item.TeacherUID}
																TeacherIMG={item.TeacherIMG}
																TeacherName={item.TeacherName}
																Rate={item.Rate}
																date={state.date}
																Start={state.startTime}
																End={state.endTime}
																handleBooking={onHandleBooking}
															/>
														</ul>
													</div>
												</div>
											</li>
										))}
									</ul>
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
							) : (
								<div className="pd-y-30 tx-center">
									<img
										src="/static/img/no-teacher-found.svg"
										className="wd-300 mg-x-auto"
										alt="teacher"
									/>
									<h6 className="tx-danger  mg-t-30">
										{t('no-teacher-found')}
									</h6>
								</div>
							)}
						</div>
					</div>

					<BookingLessonModal
						style={{ color: '#000', textAlign: 'left' }}
						StudyTimeID={stateBookLesson.StudyTimeID}
						LessionName={stateBookLesson.LessionName}
						TeacherUID={stateBookLesson.TeacherUID}
						TeacherIMG={stateBookLesson.TeacherIMG}
						TeacherName={stateBookLesson.TeacherName}
						Rate={stateBookLesson.Rate}
						date={stateBookLesson.date}
						start={stateBookLesson.start}
						end={stateBookLesson.end}
						BookingID={stateBookLesson.BookingID}
						onBook={onBook}
					/>

					{/* <ListNationModal selectNation={onSelectNation} /> */}
					<ToastContainer />
				</div>
			</div>
		</>
	);
};
// BookingLesson.getLayout = getStudentLayout;
// export default BookingLesson;

BookingLesson.getLayout = getStudentLayout;

export default withTranslation('common')(BookingLesson);
