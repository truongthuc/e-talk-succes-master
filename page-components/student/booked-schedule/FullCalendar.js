import lottie from '~/node_modules/lottie-web/build/player/lottie.min.js';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import {
	getListEventsOfWeek,
	setEventClose,
	addScheduleLog,
} from '~/api/teacherAPI';
import {
	GetBookingCalendarForStudent,
	setEventAvailable,
	StudentCancelBooked,
	LoadCourseInfo,
} from '~/api/studentAPI';
import ActiveSlotModal from './ActiveSlotModal';
import CloseSlotModal from './CloseSlotModal';
import CancelSlotModal from './CancelSlotModal';
import { cancelLesson } from '~/api/optionAPI';
import { appSettings } from '~/config';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { getDifferentMinBetweenTime, convertDDMMYYYYtoMMDDYYYY } from '~/utils';
import { randomId } from '~/utils';
import dayjs from 'dayjs';
// import '@fortawesome/fontawesome-free';
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const pad = (n) => (n >= 10 ? n : '0' + n);

const reducer = (prevState, { type, payload }) => {
	switch (type) {
		case 'STATE_CHANGE': {
			return {
				...prevState,
				[payload.key]: payload.value,
			};
			break;
		}
		default:
			return prevState;
			break;
	}
};
//Add hourse Prototype
const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const hotTime = [5, 6, 7, 8, 9, 13, 14, 15, 16];

const date = new Date();
const d = date.getDate();
const m = date.getMonth() + 1;
const y = date.getFullYear();

const formatDateString = (dateStr) => {
	return dayjs(dateStr).format('DD/MM/YYYY');
};

const initEvents = [];

let calendar = null;

const FullCalendar = ({ data = [], teacher, completeBooking }) => {
	teacher = Number(teacher);
	const router = useRouter();
	const [activeDate, setActiveDate] = useState(new Date());
	const [eventSource, setEventSource] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showActiveModal, setShowActiveModal] = useState(false);
	const [showErrorBook, setShowErrorBook] = useState(false);
	const [modalData, setModalData] = useState(null);
	const [bookStatuss, setbookStatuss] = useState();
	const [check, setcheck] = useState(false);
	const [activeModal, setActiveModal] = useState({
		id: '',
		studentName: '',
		start: '',
		end: '',
		date: '',
	});
	const [dataUser, setDataUser] = useState();

	console.log('Data user: ', dataUser);

	const [changeData, setChangeData] = useState(false);
	const [openData, setOpenData] = useState();

	const loadingRef = useRef(true);

	const fetchEventByDate = async (obj) => {
		setIsLoading(true);
		try {
			const res = await GetBookingCalendarForStudent({
				TeacherID: teacher,
				UID: obj.UID,
				start: obj.start,
				end: obj.end,
				Token: obj.Token,
			}); // @string date dd/mm/yyyy
			if (res.Code === 200 && res.Data.length > 0) {
				// Hồi nãy nó có filter nữa nên nó chỉ lấy mấy cái empty, nên cái có data k showw
				const newEvents = res.Data.map((event) => {
					return {
						...event,
						id: event.id,
						title: event.Title || '',
						start: dayjs(event.StartDate, 'DD/MM/YYYY HH:mm').toDate(),
						end: dayjs(event.EndDate, 'DD/MM/YYYY HH:mm').toDate(),
						eventType: event.eventType,
						bookStatus: event.BookingStatus,
						bookInfo: event.bookInfo,
						available: event.available,
						isEmptySlot: event.isEmptySlot,
						loading: false,
					};
				});
				const sources = calendar.getEventSources();

				if (sources.length > 0) {
					sources.forEach((item) => {
						item.remove();
					});

					calendar.addEventSource(newEvents);
				}
			}
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};

	const callFetchEvent = (date) => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		// GET DATE
		// let cur = new Date();

		// let getDate = date.getDate();

		// let testDate = new Date(cur.setDate(getDate + 6)).toUTCString();

		// let start = dayjs(date).format('DD/MM/YYYY');
		// let end = dayjs(testDate).format('DD/MM/YYYY');

		let getMonth = date.getMonth();
		let getYear = date.getFullYear();

		let start = new Date(getYear, getMonth, 1);
		let end = new Date(getYear, getMonth + 1, 0);

		start = dayjs(start).format('DD/MM/YYYY');
		end = dayjs(end).format('DD/MM/YYYY');

		console.log('START: ', start);
		console.log('END: ', end);

		// ----

		fetchEventByDate({
			UID: UID,
			start: start,
			end: end,
			Token: Token,
		});
	};

	const callData = () => {};

	const triggerNextCalendar = () => {
		setChangeData(true);

		if (!calendar) return;
		try {
			const currentDate = calendar.getDate();

			callFetchEvent(currentDate);
		} catch (error) {}
	};

	const triggerPrevCalendar = () => {
		setChangeData(true);

		if (!calendar) return;
		try {
			const currentDate = calendar.getDate();

			callFetchEvent(currentDate);
		} catch (error) {}
	};

	const triggerWeek = () => {
		calendar.refetchEvents();
		if (!calendar) return;
		try {
			const currentDate = calendar.getDate();

			callFetchEvent(currentDate);
		} catch (error) {}
	};

	const triggerMonth = () => {
		calendar.refetchEvents();
		if (!calendar) return;
		try {
			const currentDate = calendar.getDate();

			callFetchEvent(currentDate);
		} catch (error) {}
	};

	const triggerTodayCalendar = () => {
		if (!calendar) return;
		try {
			const currentDate = calendar.getDate();

			callFetchEvent(currentDate);
		} catch (error) {}
	};

	const closeAvailableEvent = (newProps, eventsArray) => {
		const newSources = [...eventsArray].map((event) =>
			event.StudyTimeID === newProps.StudyTimeID &&
			event.Start === newProps.Start
				? {
						...event,
						available: false,
						bookStatus: false,
						isEmptySlot: true,
				  }
				: event,
		);
		setEventSource(newSources);
	};

	const cancelBookedEvent = (newProps) => {
		const { StudyTimeID, Start } = newProps;
		const newSources = [...eventSource].map((event) =>
			event.StudyTimeID === StudyTimeID && event.Start === Start
				? {
						...event,
						available: false,
						bookStatus: false,
						isEmptySlot: true,
						bookInfo: null,
				  }
				: event,
		);
		setEventSource(newSources);
	};

	const onViewChange = (view, el) => {
		// console.log({ view, el });
	};

	const _openSlot = async (infoSubmit) => {
		let timeTeacher = modalData?.diff;
		let timeCourse = modalData.timeCourse;

		const res = await setEventAvailable({
			UID: dataUser?.UID,
			token: dataUser?.token,
			program: infoSubmit.program,
			packageID: infoSubmit.packageID.toString(),
			courseID: infoSubmit.courseID.toString(),
			start: infoSubmit.start,
			end: infoSubmit.end,
			teacher: teacher,
			timeCourse: timeCourse,
		});
		if (res.Code === 200) {
			// event.setExtendedProp('loading', false);
			toast.success('You have booked a lesson successfully', {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 2000,
			});
			completeBooking && completeBooking();
		} else if (res.Code === 403) {
			localStorage.clear();
			router.push({
				pathname: '/',
			});
		} else {
			toast.error('Open slot failed', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 2000,
			});
		}
		setShowActiveModal(false);
	};

	// const afterEventAdded = async (eventInfo) => {
	// 	console.log(12345);
	// 	let event = eventInfo.event;
	// 	console.log('event range', event.start, event.end);

	// 	const res = await setEventAvailable({
	// 		start: dayjs(event.start).format('DD/MM/YYYY HH:mm'),
	// 		end: dayjs(event.end).format('DD/MM/YYYY HH:mm'),
	// 	});
	// 	console.log(res);
	// 	if (res.Code === 200) {
	// 		event.setExtendedProp('loading', false);
	// 	} else {
	// 		// eventApi.remove();
	// 		eventInfo.revert();
	// 		toast.error('Open slot failed', {
	// 			position: toast.POSITION.TOP_RIGHT,
	// 			autoClose: 2000,
	// 		});
	// 		console.log('Loi  khi goi api');
	// 	}
	// };
	const showCancelReasonModal = (event) => {
		// console.log(showCancelReasonModal);
		try {
			event.preventDefault();
			const cancelBtn = event.target;
			const eventId = cancelBtn.dataset.schedule;
			setModalData({
				...modalData,
				eventId,
			});
			setShowCancelModal(true);
		} catch (error) {
			console.log(error);
		}
		// setIsLoading(true);
		// try {
		// 	const res = await cancelLesson({
		// 		BookingID: data.BookingID,
		// 		ReasonCancleOfTeacher: data.reason,
		// 	});
		// 	if (res.Code === 1) {
		// 		cancelBookedEvent(data);
		// 		toast.success('You have canceled a lesson successfully', {
		// 			position: toast.POSITION.TOP_CENTER,
		// 			autoClose: 2000,
		// 		});
		// 	} else {
		// 		toast.error(res?.Message ?? 'Cancel slot failed', {
		// 			position: toast.POSITION.TOP_CENTER,
		// 			autoClose: 2000,
		// 		});
		// }
		// } catch (error) {
		// 	console.log('Error openSlot !', error);
		// }
		// setIsLoading(false);
	};
	const _closeSlot = async (event) => {
		let eventInstance = calendar.getEventById(event.id);
		if (eventInstance) eventInstance.remove();
		//eventInstance.remove();
	};

	const afterEventRemoved = async (eventInfo) => {
		try {
			const res = await setEventClose({
				OpenDayID: data.OpenDayID,
			});
			if (/*res.Code !== 1*/ false) {
				eventInfo.revert();
				toast.error('Close slot failed', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 2000,
				});
			} else {
			}
		} catch (error) {
			console.log('Error openSlot !', error);
		}
	};

	const _cancelSlot = async (event) => {
		// setIsLoading(true);
		// setcheck(true);
		setShowActiveModal(false);
		try {
			const res = await StudentCancelBooked({
				BookingID: event.BookingID,
				UID: dataUser?.UID,
				Token: dataUser?.token,
			});
			if (res.Code === 200) {
				// cancelBookedEvent(event);
				completeBooking && completeBooking();
				toast.success('You have canceled a lesson successfully', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
				$('body').find('.popover.show').remove();
			} else if (res.Code === 403) {
				localStorage.clear();
				router.push('/login/signin');
			} else {
				toast.error(res?.Message ?? 'Cancel slot failed', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
			}
		} catch (error) {
			console.log('Error openSlot !', error);
		}
		// fetchEventByDate({
		// 	UID: 61230,
		// 	start: '01/03/2021',
		// 	end: '08/03/2021',
		// 	Token: '',
		// });
		// initCalendar();
		// setTimeout(() => {
		// 	calendar.render();
		// }, 500);
		// setIsLoading(false);
	};

	const onSubmit = (e) => {
		e.preventDefault();
	};

	let $toggleCheckbox;

	console.log('Modal Data: ', modalData);

	const initCalendar = () => {
		//const createEventSlots
		const calendarEl = document.getElementById('js-book-calendar');

		const $closeModal = $('#md-close-slot');
		const $cancelModal = $('#md-cancel-slot');

		const eventDidMount = (args) => {
			// console.log('eventDidMount', args);
			const { event, el } = args;
			const data = {
				...event.extendedProps,
			};
			el.setAttribute('tabindex', -1);
			if (!args.isPast && ![...el.classList].includes('booked-slot')) {
				setShowActiveModal(false);
			}

			let diff = getDifferentMinBetweenTime(new Date(), new Date(event.start));
			let cancelable = diff > 60 ? true : false;
			!!el &&
				[...el.classList].includes('custom-color-G') &&
				$(el)
					.popover({
						html: true,
						container: 'body',
						trigger: 'focus',
						title: 'Booked information',
						content: `  
                <p class="mg-b-5"><span class="mg-r-5">Teacher:</span><span class="tx-medium">${
									event.extendedProps.TeacherName ?? ''
								}</span></p>
                <p class="mg-b-5"><span class="mg-r-5">PackageName:</span><span class="tx-medium">${
									event.extendedProps.PackageName ?? ''
								}</span></p>
                <p class="mg-b-5"><span class="mg-r-5">Course:</span><span class="tx-medium">${
									event.extendedProps.CourseName ?? ''
								}</span></p>
                <p class="mg-b-5"><span class="mg-r-5">StudyTime:</span><span class="tx-medium">${
									event.extendedProps.StudyTime ?? ''
								}</span></p>
								<p class="mg-b-5"><span class="mg-r-5">StudyTime:</span><span class="tx-medium">${
									event.extendedProps.StudyDate ?? ''
								}</span></p>

				<div class="action mg-t-15">
								
                    <a href="#" data-schedule='${JSON.stringify(
											data,
										)}' class="btn btn-sm btn-info btn-block tx-white-f mg-b-10 join-class-skype" target="_blank" rel="noopener">Go to Classroom</a>
                    ${
											cancelable
												? `<a href="#" class="btn btn-sm btn-danger btn-block cancel-schedule" rel='${JSON.stringify(
														data,
												  )}'>Cancel lesson</a>`
												: `<a href="#" class="btn btn-sm btn-block btn-disabled">Cancel lesson</a>`
										}
                    ${
											cancelable
												? ''
												: '<p class="mg-b-0 tx-danger mg-t-10">Sorry, you cannot cancel the class</p>'
										}
                </div>

                `,
					})
					.on('click', function () {
						$(this).popover('show');
					});

			$(document).on('click', function (event) {
				let $el = $(el);
				if (
					!$(event.target).closest($el).length &&
					!$(event.target).closest('.popover').length
				) {
					$el.popover('hide');
				}
			});

			!!$toggleCheckbox && showStudentToggle();
			const events = calendar.getEvents();
			const dayHeaders = document.querySelectorAll('.fc-col-header-cell');
			// console.log({dayHeaders});
			if (dayHeaders.length > 0)
				for (let i = 0; i < dayHeaders.length; i++) {
					//  console.log(dayHeaders[i]);
					if ('data-date' in dayHeaders[i].dataset) continue;
					const date = dayHeaders[i].getAttribute('data-date');
					const dateHD = new Date(date);
					let bookedSlot = 0;
					let totalSlot = 0;
					events.map((event) => {
						const eventDate = event.start;
						if (eventDate.getTime() === dateHD.getTime()) {
							(event.extendedProps.available === true ||
								event.extendedProps.bookStatus === true) &&
								totalSlot++;
							event.extendedProps.bookStatus === true && bookedSlot++;
						}
					});
					// console.log(dayHeaders[i]);
					// console.log({bookedSlot, totalSlot});
					dayHeaders[i].querySelector('.booked').textContent = bookedSlot;
					dayHeaders[i].querySelector('.total').textContent = totalSlot;
					setActiveModal(false);
				}
		};

		// const emptyCellSelect = (selection) => {
		// 	_openSlot({
		// 		start: selection.startStr,
		// 		end: selection.endStr,
		// 	});
		// };

		const eventClick = (args) => {
			console.log('ARG: ', args);

			if (args.el.className.includes('custom-color-H')) {
				toast.dismiss();
				// Get time Course
				let timeCourse = null;
				if (localStorage.getItem('isLogin')) {
					let dataUser = localStorage.getItem('dataUser');
					dataUser = JSON.parse(dataUser);

					timeCourse = dataUser.TimeCourse;
				}

				// ---------------

				const element = args.el;

				const { start, end, id, extendedProps } = args.event;
				const diff = getDifferentMinBetweenTime(start, end);

				setModalData({
					...modalData,
					start: extendedProps.StartDate,
					end: extendedProps.EndDate,
					diff: diff,
					timeCourse: timeCourse,
				});

				// Get info to submit open slot

				let studentid = null;
				let bookingid = null;

				if (localStorage.getItem('isLogin')) {
					studentid = localStorage.getItem('UID');
				}
				bookingid = args.event.extendedProps.BookingID;

				(async () => {
					try {
						const res = await LoadCourseInfo({
							studentid: studentid,
							bookingid: bookingid,
						});
						res.Code == 200 ? setOpenData(res.Data) : console.log('Error');
					} catch (error) {
						console.log(error);
					}
				})();

				// ---------------------------- //

				if (
					extendedProps.available ||
					[...element.classList].includes('booked-slot') ||
					[...element.classList].includes('booked-slot')
				)
					return;

				setActiveModal({
					...activeModal,
					...args.event.extendedProps,
					date: dayjs(extendedProps.StartDate).format('DD/MM/YYYY'),
					start: dayjs(extendedProps.StartDate).format('HH:mm A'),
					end: dayjs(extendedProps.EndDate).format('HH:mm A'),
				});
			}
		};

		calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
			timeZone: 'local',
			height: 550,
			expandRows: true,
			slotMinTime: '00:00',
			slotMaxTime: '24:00',
			events: data?.map((y) => ({
				...y,
				id: randomId(),
				loading: true,
			})), //Filter for demo
			// event: [],
			headerToolbar: {
				start: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek', // will normally be on the left. if RTL, will be on the right
				center: '',
				end: 'today,prev,title,next', // will normally be on the right. if RTL, will be on the left
			},
			titleFormat: { year: 'numeric', month: 'short' },
			navLinks: true, // can click day/week names to navigate views
			editable: false,
			stickyHeaderDates: 'auto',
			selectable: true,
			nowIndicator: true,
			allDaySlot: false,
			dayMaxEvents: true, // allow "more" link when too many events
			eventOverlap: false,
			initialDate: new Date(),
			initialView: 'timeGridWeek',
			firstDay: 1,
			slotDuration: '00:30',
			slotLabelInterval: '00:30',
			slotEventOverlap: false,
			viewDidMount: onViewChange,
			// eventAdd: afterEventAdded,
			eventRemove: afterEventRemoved,
			selectOverlap: function (event) {
				return event.rendering === 'background';
			},
			// select: emptyCellSelect,
			slotLabelContent: function (arg) {
				// console.log('slotLabelContent', arg);
				const hour = arg.date.getHours();

				let templateEl = document.createElement('div');
				templateEl.setAttribute('class', 'slot-label');
				const html = `
                ${dayjs(arg.date).format('hh:mm A')}
                `;
				templateEl.innerHTML = html;
				return { html };
			},
			dayHeaderContent: function (args) {
				const days = args.date.getDay();
				const d = args.date.getDate();

				const html = `
                    <div class="header-container">
                        <div class="date-wrap">
                            <span class="hd-date">${d} </span><span class="hd-day">${dayNamesShort[days]}</span>
                        </div>
                       <div class="box-slot">
                            <span class="booked"></span> <span class="mg-x-2">/</span> <span class="total"></span>
                       </div>
                    </div>
                `;
				return { html };
			},
			dayCellDidMount: function (args) {
				// console.log('dayCellDidMount', args);
			},
			slotLabelDidMount: function (args) {
				// console.log('SlotLabelDidMount', args);
			},
			selectAllow: function (selectInfo) {
				if (dayjs(selectInfo.startStr).isBefore(dayjs(new Date())))
					return false;
				return true;
			},
			eventClassNames: function (args) {
				const { event, isPast, isStart } = args;
				const {
					bookInfo,
					eventType,
					bookStatus,
					Color,
					DateOff,
					available,
					isEmptySlot,
					loading,
				} = event.extendedProps;
				// let classLists =
				// 	DateOff === 'false'
				// 		? bookStatus
				// 			? 'booked-slot'
				// 			: 'available-slot'
				// 		: 'off-slot';
				let classLists = null;
				(classLists = Color),
					(classLists += eventType === 1 ? ' hot-slot ' : '');
				classLists += isEmptySlot ? ' empty-slot' : '';
				classLists += loading ? ' is-loading' : '';
				return classLists;
			},
			eventContent: function (args) {
				let templateEl = document.createElement('div');
				const { event, isPast, isStart } = args;

				const {
					bookInfo,
					eventType,
					bookStatus,
					available,
					DateOff,
					isEmptySlot,
					loading,
				} = event.extendedProps;
				const data = {
					...event.extendedProps,
					id: event.id,
					start: event.start,
					end: event.end,
					title: event.Title,
					openID: event.OpenID,
				};

				// console.log(data);
				const html = `
                    ${
											!isEmptySlot
												? `
                    <div class="inner-book-wrap ">
												<div class="inner-content">
												${
													loading
														? `Creating event...`
														: `${
																DateOff === 'false'
																	? bookStatus
																		? `
																<span class="label-book booked"><i class="fas ${
																	isPast ? 'fa-check' : 'fa-user-graduate'
																}"></i> ${isPast ? 'FINISHED' : 'BOOKED'}  ${
																				event.extendedProps.Title
																		  }</span>
																`
																		: `<span class="label-book"><i class="fas fa-copyright"></i>AVAILABLE</span>`
																	: `<span class="label-book"><i class="far fa-calendar-times"></i>OFF DAY</span>`
														  }
														${
															available
																? `<a href="javascript:;" class="fix-btn close-schedule" data-schedule='${JSON.stringify(
																		data,
																  )}' data-events='${
																		calendar.getEventSources().length > 0
																			? calendar.getEventSources()[0]
																					.internalEventSource.meta
																			: {}
																  }'>Close</a>`
																: ''
														}`
												}
                        
                        </div>
                    </div>`
												: ''
										}
                `;
				templateEl.innerHTML = html;
				return { domNodes: [templateEl] };
			},
			eventClick: eventClick,
			eventDidMount: eventDidMount,
			nowIndicatorDidMount: function (args) {
				//   console.log("nowIndicatorDidMount", args);
			},
		});

		calendar.render();

		console.log('source event', calendar.getEventSources());
		$('body').off('click', '**');
		$('body').on('click', '.cancel-schedule', (e) => {
			e.preventDefault();
			const eventData = JSON.parse(e.target.getAttribute('rel'));
			console.log('cancel event data', eventData);
			_cancelSlot(eventData);
		});

		$('body').on('click', '.close-schedule', function (e) {
			e.preventDefault();
			const eventData = JSON.parse(this.getAttribute('data-schedule'));
			_closeSlot(eventData);
		});

		$('body').on('click', '.join-class-skype', async function (e) {
			e.preventDefault();
			const eventData = JSON.parse(this.getAttribute('data-schedule'));
			try {
				addScheduleLog({ BookingID: eventData.BookingID });
			} catch (error) {
				console.log(error?.message ?? `Can't add schedule log !!`);
			}
			window.location.href = `skype:${eventData?.bookInfo?.SkypeID ?? ''}?chat`;
		});

		$('body').on(
			'click',
			'#js-book-calendar .fc-next-button',
			triggerNextCalendar,
		);
		$('body').on(
			'click',
			'#js-book-calendar .fc-prev-button',
			triggerPrevCalendar,
		);
		$('body').on(
			'click',
			'#js-book-calendar .fc-timeGridWeek-button',
			triggerWeek,
		);

		$('body').on(
			'click',
			'#js-book-calendar .fc-timeGridWeek-button',
			triggerWeek,
		);

		$('body').on(
			'click',
			'#js-book-calendar .fc-dayGridMonth-button',
			triggerTodayCalendar,
		);
		$toggleCheckbox = $('#student-toggle-checkbox');

		$('body').on('change', $toggleCheckbox, showStudentToggle);

		function showStudentToggle() {
			const value = $toggleCheckbox.prop('checked');
			const nonBookedEvents = $('.fc-event:not(.booked-slot)');
			value
				? nonBookedEvents.addClass('hide-event')
				: nonBookedEvents.removeClass('hide-event');
		}
	};

	useEffect(() => {
		if (openData) {
			setModalData({
				...modalData,
				dataPopup: openData,
			});
			setShowActiveModal(true);
		}
	}, [openData]);

	useEffect(() => {
		initCalendar();

		console.log('DATA first load: ', data);

		if (localStorage.getItem('isLogin')) {
			let UID = localStorage.getItem('UID');
			let token = localStorage.getItem('token');
			setDataUser({
				UID: UID,
				token: token,
			});
		}

		if (data?.length > 0) {
			if (!changeData) {
				const newArr = data.map((event) => {
					return {
						...event,
						id: event.id,
						title: event.Title || '',
						start: dayjs(event.StartDate, 'DD/MM/YYYY HH:mm').toDate(),
						end: dayjs(event.EndDate, 'DD/MM/YYYY HH:mm').toDate(),
						eventType: event.eventType,
						bookStatus: event.BookingStatus,
						bookInfo: event.bookInfo,
						available: event.available,
						isEmptySlot: event.isEmptySlot,
						loading: false,
					};
				});

				calendar.addEventSource(newArr);
			}
		}

		lottie &&
			lottie.loadAnimation({
				container: loadingRef.current, // the dom element that will contain the animation
				renderer: 'svg',
				loop: true,
				autoplay: true,
				path: '/static/img/loading.json', // the path to the animation json
			});

		return () => {
			loadingRef.current = false;
		};
	}, [teacher]);

	return (
		<>
			<div className="pos-relative">
				<>
					{isLoading && (
						<div className="loading-style">
							<div ref={loadingRef} className="lottie-loading"></div>
						</div>
					)}
				</>
				<div id="js-book-calendar" className="fc fc-unthemed fc-ltr"></div>
				{showActiveModal ? (
					<ActiveSlotModal
						data={{
							dataPopup: modalData?.dataPopup,
							start: dayjs(modalData?.start).format('MM/DD/YYYY HH:mm') ?? '',
							end: dayjs(modalData?.end).format('MM/DD/YYYY HH:mm') ?? '',
						}}
						modalData={modalData}
						showModal={showActiveModal}
						closeModal={() => setShowActiveModal(false)}
						handleOpenSlot={(infoSubmit) => _openSlot(infoSubmit)}
					/>
				) : (
					''
				)}

				<CloseSlotModal data={activeModal} handleCloseSlot={_closeSlot} />

				<CancelSlotModal data={activeModal} handleCancelSlot={_cancelSlot} />
				{/* <Modal
					show={showErrorBook}
					onHide={() => setShowErrorBook(false)}
					size="sm"
					centered
					bsPrefix="modal"
				>
					<Modal.Header bsPrefix="modal-header bg-danger tx-white pd-10">
						<Modal.Title bsPrefix="modal-title tx-white">
							Open slot failed !
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p className="mg-b-0">
							Sorry, you cannot open this class. It is less than 60 mins to
							starting time.
						</p>
						<div className="tx-right mg-t-15">
							<Button
								size="sm"
								variant="light"
								onClick={() => setShowErrorBook(false)}
							>
								Close
							</Button>
						</div>
					</Modal.Body>
				</Modal> */}
			</div>
		</>
	);
};

export default FullCalendar;
