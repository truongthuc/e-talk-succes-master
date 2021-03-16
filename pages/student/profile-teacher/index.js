import React, { useState, useEffect, useReducer } from 'react';
import Select from 'react-select';
import ListSchedule from '~/page-components/student/booking-schedule/ListSchedule';
import { GetListTeacherPage } from '~/api/studentAPI';
// import Pagination from 'react-js-pagination';
import Pagination from '@material-ui/lab/Pagination';

import Router, { useRouter } from 'next/router';
import BookingLessonModal from '~/components/common/Modal/BookingLessonModal';
// import ListNationModal from '~components/common/Modal/ListNationModal';
import Box from '@material-ui/core/Box';

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
// import data from '../../../data/data.json';
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

// const initialState = {
// 	nation: [],
// 	gender: genderArr[0],
// 	levelPurpose: [],
// 	selectedLevelPurpose: [],
// 	date: dayjs(new Date()).format('DD/MM/YYYY'),
// 	startTime: new Date('01/01/2020 00:00'),
// 	endTime: new Date('01/01/2020 23:00'),
// 	searchText: '',
// 	nation: nationArr[0],
// };

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

// const reducer = (prevState, { type, payload }) => {
// 	switch (type) {
// 		case 'STATE_CHANGE': {
// 			return {
// 				...prevState,
// 				[payload.key]: payload.value,
// 			};
// 		}
// 		default:
// 			return prevState;
// 			break;
// 	}
// };

const pad = (n) => ('' + n >= 10 ? n : '0' + n);

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

const ProfileTeacher = ({ t }) => {
	const router = useRouter();
	// const [state, dispatch] = useReducer(reducer, initialState);
	const [teachersList, setTeacherList] = useState(null);
	const [loading, setLoading] = useState(false);
	const [onBookState, setOnBookState] = useState(initialOnBookState);
	const [stateBookLesson, setStateBookLesson] = useState(initialBookLesson);
	const [learnTime, setLearnTime] = useState([]);
	const [date, setDate] = useState();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);

	const [state, dispatch] = useReducer(reducer, initialState);

	const errorToast = () =>
		toast.error('Đã có lỗi xảy ra, xin vui lòng thử lại', toastInit);

	const getAPI = async (params) => {
		setLoading(true);
		const res = await GetListTeacherPage(params);
		if (res.Code === 200) {
			dispatch({ type: 'ADD_PAGE', res });
			setTeacherList(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		} else errorToast();
		setLoading(false);
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

		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		getAPI({
			Search: '',
			UID: UID,
			Token: Token,
			Page: state.page,
		});
	}, [state.page]);

	function handlePageClick({ selected: selectedPage }) {
		setCurrentPage(selectedPage);
	}

	return (
		<>
			<h1 className="main-title-page">{t('Profile-teacher')}</h1>
			<div className="media-body-wrap pd-15 shadow">
				{/* <div
					className="form-row"
					style={{ maxWidth: 600, zIndex: 2, position: 'relative' }}
				>
					<div className="col-sm-6 item">
						<input
							className="form-control margin-bottom-10"
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
				</div> */}

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
							{!!teachersList && teachersList.length > 0 ? (
								<div className="table-tutor-ds">
									<ul className="list-tutor-ds">
										{teachersList.map((item) => (
											<li>
												<div className="infomation-content">
													<div className="infomation-top">
														<div className="tutor-infomation">
															<h3 className="infomation-job">Teacher</h3>
															<p className="infomation-name">
																{item.TeacherName}
															</p>
															<p className="infomation-country">
																{t('nation')}:{' '}
																<span>{item.AccountNationName}</span>
															</p>
															<p className="infomation-exp">
																{t('teaching-experience')}:{' '}
																<span>{item.Experience}</span>
															</p>
														</div>
														<div className="box-img-teacher">
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
														</div>
													</div>
													<div className="infomation-bottom">
														<div className="tutor-rating-star">
															{/* <span className="number-start">1</span> */}
															{/* <div className="rating-stars">
																<span className="empty-stars">
																	<i className="far fa-star"></i>
																	<i className="far fa-star"></i>
																	<i className="far fa-star"></i>
																	<i className="far fa-star"></i>
																	<i className="far fa-star"></i>
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
															</div> */}
														</div>
														<a
															href="/student/booked-schedule/calendar"
															className="submit-search btn border-radius-5 btn-block w-100 bg-green"
														>
															<i className="fa fa-clone"></i> Đặt lịch học
														</a>
														<a
															href="/teacher/profile"
															className="submit-search btn border-radius-5 btn-block w-100 bg-blue"
														>
															<i className="fa fa-user"></i> Xem thông tin
														</a>
													</div>
												</div>
											</li>
										))}
									</ul>
									{/* <Pagination
										innerClass="pagination justify-content-center"
										activePage={page}
										itemsCountPerPage={pageSize}
										totalItemsCount={Math.ceil(
												state?.TotalResult / (state?.PageSize / 2),
											)}
										pageRangeDisplayed={3}
										itemClass="page-item"
										linkClass="page-link"
											onChange={(obj, page) =>
												dispatch({ type: 'SELECT_PAGE', page })
											}
									/> */}
									<Box display={`flex`} justifyContent={`center`} mt={4}>
										<Pagination
											count={Math.ceil(state?.TotalResult / state?.PageSize)}
											color="secondary"
											onChange={(obj, page) =>
												dispatch({ type: 'SELECT_PAGE', page })
											}
											c
										/>

										{/* <ReactPaginate
													previousLabel={'←'}
													nextLabel={'→'}
													pageCount={pageCount}
													onPageChange={handlePageClick}
													containerClassName={'paginate-wrap'}
													subContainerClassName={'paginate-inner'}
													pageClassName={'paginate-li'}
													pageLinkClassName={'paginate-a'}
													activeClassName={'paginate-active'}
													nextLinkClassName={'paginate-next-a'}
													previousLinkClassName={'paginate-prev-a'}
													breakLinkClassName={'paginate-break-a'}
												/> */}
									</Box>
								</div>
							) : (
								<div className="pd-y-30 tx-center dispaly-none">
									<img
										src="/static/img/no-teacher-found.svg"
										className="wd-300 mg-x-auto"
										alt="teacher"
									/>
									<h6 className="tx-danger  mg-t-30">No teacher found.</h6>
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

ProfileTeacher.getLayout = getStudentLayout;
ProfileTeacher.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});

export default withTranslation('common')(ProfileTeacher);
