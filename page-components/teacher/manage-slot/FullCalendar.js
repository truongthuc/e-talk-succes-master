import lottie from '~/node_modules/lottie-web/build/player/lottie.min.js';
import React, { useState, useEffect, useReducer, useRef } from 'react';
import {
	getListEventsOfWeek,
	setEventAvailable,
	setEventClose,
	addScheduleLog,
	cancelSlotByDate,
	teacherUpdateTeachingSchedule,
} from '~/api/teacherAPI';
import ActiveSlotModal from './ActiveSlotModal';
import CloseSlotModal from './CloseSlotModal';
import CancelSlotModal from './CancelSlotModal';
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
import ModalUpdate from './ModalUpdate';
import { useRouter } from 'next/router';
import { i18n, withTranslation } from '~/i18n';

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

// const hotTime = [5, 6, 7, 8, 9, 13, 14, 15, 16];

// const date = new Date();
// const d = date.getDate();
// const m = date.getMonth() + 1;
// const y = date.getFullYear();

const formatDateString = (dateStr) => {
	return dayjs(dateStr).format('DD/MM/YYYY');
};

const initEvents = [];

let calendar = null;

const FullCalendar = ({ statusShow, t }) => {
	const router = useRouter();

	const [eventSource, setEventSource] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showErrorBook, setShowErrorBook] = useState(false);
	const [showActiveModal, setShowActiveModal] = useState(false);
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [modalData, setModalData] = useState(null);
	const [sureBook, setSureBook] = useState(false);
	const [dateCalendar, setDateCalendar] = useState();
	const [infoNeedCancel, setInfoNeedCancel] = useState();
	const [startChange, setStartChange] = useState(false);

	const [dataCal, setDataCal] = useState();

	const [dataUser, setDataUser] = useState();

	statusShow = parseInt(statusShow);

	const loadingRef = useRef(true);

	const [cancelLoading, setCancelLoading] = useState(false);

	const [openUpdate, setOpenUpdate] = useState(false);

	const [getDataAPI, setDataAPI] = useState();

	// console.log('GET data API: ', getDataAPI);

	const checkSlotEmpty = (data) => {
		let timeEmpty = null;
		let getTime = null;

		for (const [index, item] of data.entries()) {
			if (item.BookingID === 0) {
				timeEmpty = item.StartDate;
				break;
			}
		}

		if (timeEmpty !== null) {
			timeEmpty = timeEmpty.split(' ');
			getTime = timeEmpty[1];
		}

		return getTime;
	};

	const fetchEventByDate = async (obj) => {
		setIsLoading(true);

		try {
			const res = await getListEventsOfWeek({
				UID: obj.UID,
				start: obj.start,
				end: obj.end,
				Token: obj.Token,
			});
			if (res.Code === 200) {
				setDataAPI(res.Data);
				let arrOff = findDayOff(res.Data);
				// calendar.addEventSource(showData());
				// Hồi nãy nó có filter nữa nên nó chỉ lấy mấy cái empty, nên cái có data k showw
				const newEvents = res.Data.map((event, i) => {
					if (statusShow === 1) {
						return {
							...event,
							id: i,
							title: event.Title || '',
							OpenID: event.OpenID,
							start: dayjs(event.StartDate, 'DD/MM/YYYY HH:mm').toDate(),
							end: dayjs(event.EndDate, 'DD/MM/YYYY HH:mm').toDate(),
							eventType: event.eventType,
							bookStatus: event.BookingStatus,
							bookInfo: event.bookInfo,
							available: event.available,
							isEmptySlot: event.isEmptySlot,
							loading: false,
						};
					} else if (statusShow === 2) {
						if (event.OpenID > 0) {
							return {
								...event,
								id: i,
								title: event.Title || '',
								OpenID: event.OpenID,
								start: dayjs(event.StartDate, 'DD/MM/YYYY HH:mm').toDate(),
								end: dayjs(event.EndDate, 'DD/MM/YYYY HH:mm').toDate(),
								eventType: event.eventType,
								bookStatus: event.BookingStatus,
								bookInfo: event.bookInfo,
								available: event.available,
								isEmptySlot: event.isEmptySlot,
								loading: false,
							};
						}
					} else if (statusShow === 3) {
						if (event.OpenID === 0) {
							return {
								...event,
								id: i,
								title: event.Title || '',
								OpenID: event.OpenID,
								start: dayjs(event.StartDate, 'DD/MM/YYYY HH:mm').toDate(),
								end: dayjs(event.EndDate, 'DD/MM/YYYY HH:mm').toDate(),
								eventType: event.eventType,
								bookStatus: event.BookingStatus,
								bookInfo: event.bookInfo,
								available: event.available,
								isEmptySlot: event.isEmptySlot,
								loading: false,
							};
						}
					}
				});

				let cloneNewArr = cloneArr(newEvents, arrOff);

				const sources = calendar.getEventSources();

				if (sources.length > 0) {
					sources.forEach((item) => {
						item.remove();
					});

					calendar.addEventSource(cloneNewArr);
					calendar.render();
				}
			}
		} catch (error) {
			console.log('Error: ', error);
		}
		setIsLoading(false);
	};

	const callFetchEvent = (date) => {
		// GET UID and Token
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		let start = dayjs(dateCalendar?.start).format('DD/MM/YYYY');
		let end = dayjs(dateCalendar?.end).format('DD/MM/YYYY');

		fetchEventByDate({
			UID: UID,
			start: start,
			end: end,
			Token: Token,
		});
	};

	const triggerNextCalendar = () => {
		initCalendar(statusShow);
	};

	const triggerPrevCalendar = () => {
		initCalendar(statusShow);
	};

	const triggerWeek = () => {
		initCalendar(statusShow);
	};

	const triggerMonth = () => {
		initCalendar(statusShow);
	};

	const triggerTodayCalendar = () => {
		initCalendar(statusShow);
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
		console.log({ view, el });
	};

	const funcGetOpenID = async (obj) => {
		let rs = null;

		try {
			const res = await setEventAvailable({
				start: obj.start,
				end: obj.end,
				token: dataUser?.token,
				UID: dataUser?.UID,
			});
			if (res.Code === 200) {
				rs = res.Data;
			} else {
				alert('Lỗi không lấy được Open ID');
			}
		} catch (error) {
			console.log(error);
		}
		return rs;
	};

	const [loadingSlot, setLoadingSlot] = useState(false);

	const _openSlot = async () => {
		setLoadingSlot(true);

		let start = dayjs(modalData.start).toDate();
		let end = dayjs(modalData.end).toDate();

		start = dayjs(start).format('DD/MM/YYYY HH:mm');
		end = dayjs(end).format('DD/MM/YYYY HH:mm');

		let getOpenID = null;
		let openID = funcGetOpenID({ start, end });
		openID.then(function (value) {
			try {
				value.forEach((item) => {
					let startTime = dayjs(item.start, 'DD/MM/YYYY HH:mm').toDate();
					let endTime = dayjs(item.end, 'DD/MM/YYYY HH:mm').toDate();

					startTime.setHours(startTime.getHours() + dataUser?.timeValue);
					endTime.setHours(endTime.getHours() + dataUser?.timeValue);

					setLoadingSlot(false);

					calendar.addEvent(
						{
							id: randomId(),
							BookingID: 0,
							start: startTime,
							end: endTime,
							OpenID: item.ID,
							StudyTimeID: 1,
							TeacherEnd: modalData.start,
							TeacherStart: modalData.end,
							TeacherUID: 20,
							available: true,
							bookInfo: null,
							bookStatus: false,
							DateOff: 'false',
							eventType: 0,
							isEmptySlot: false,
							title: null,
							loading: false,
						},

						true,
					);
				});
				setShowActiveModal(false);
			} catch (error) {
				console.log('Error openSlot !', error);
				alert('Open slot failed !!');
			}
		});

		// ----
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
	};

	const afterEventAdded = async (eventInfo) => {
		let event = eventInfo.event;

		let start = dayjs(event.start).toDate();
		let end = dayjs(event.end).toDate();

		start = dayjs(start).format('DD/MM/YYYY HH:mm');
		end = dayjs(end).format('DD/MM/YYYY HH:mm');

		const res = await setEventAvailable({
			start: start,
			end: end,
		});
		if (res.Code === 200) {
			event.setExtendedProp('loading', false);
		} else {
			// eventApi.remove();
			eventInfo.revert();
			toast.error('Open slot failed', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 2000,
			});
			console.log('Loi khi goi api');
		}
	};

	// const _closeSlot = async (event) => {
	// 	let eventInstance = calendar.getEventById(event.id);
	// 	if (eventInstance) eventInstance.remove();
	// 	eventInstance.remove();
	// };
	const showCancelReasonModal = (event) => {
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

	const onSubmit = (e) => {
		e.preventDefault();
	};

	const viewRender = (view, element) => {
		console.log('Elenment: ', element);
		console.log('VIEW: ', view);
	};

	const updateStatus = async (infoSubmit) => {
		let check = false;
		setOpenUpdate(false);
		const currentDate = calendar.getDate();

		try {
			const res = await teacherUpdateTeachingSchedule({
				UID: dataUser.UID,
				Token: dataUser.token,
				BookingID: infoSubmit.BookingID,
				ClassStatus: infoSubmit.ClassStatus,
				Remark: infoSubmit.Rating,
				Homework: infoSubmit.Homework,
			});
			check = true;
			if (res.Code === 200) {
				toast.success('Update Success', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 1000,
				});
				// callFetchEvent(currentDate);
				// initCalendar(0);
				calendar.refetchEvents();
			} else {
				toast.warning('Update Not Success', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 1000,
				});
			}
		} catch (error) {
			console.log(error);
		}

		return check;
	};

	const emptyCellSelect = (selection) => {
		console.log('Selection: ', selection);

		// getID_afterClick(selection);

		setModalData({
			start: selection.startStr,
			end: selection.endStr,
		});
		setShowActiveModal(true);
	};

	let $toggleCheckbox;

	const getSpaceDate = () => {
		var curr = new Date(); // get current date
		var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
		var last = first + 6; // last day is the first day + 6

		let firstday = new Date(curr.setDate(first + 1)).toUTCString();
		let lastday = new Date(curr.setDate(last + 1)).toUTCString();

		firstday = dayjs(firstday).format('DD/MM/YYYY HH:mm');
		lastday = dayjs(lastday).format('DD/MM/YYYY HH:mm');

		firstday = firstday.split(' ')[0];
		lastday = lastday.split(' ')[0];

		fetchEventByDate({
			UID: 61230,
			start: firstday,
			end: lastday,
			Token: '',
		});

		// setDateCalendar({
		// 	start: firstday,
		// 	end: lastday,
		// });
	};

	const [dataUpdate, setDataUpdate] = useState(null);

	const initCalendar = (statusShow) => {
		//const createEventSlots
		const calendarEl = document.getElementById('js-book-calendar');

		const $closeModal = $('#md-close-slot');
		const $cancelModal = $('#md-cancel-slot');

		const eventDidMount = (args) => {
			const { event, el } = args;

			console.log('eventDidMount', event);

			const data = {
				...event.extendedProps,
				id: event.id,
				start: event.StartDate,
				end: event.EndDate,
				teacherName: event.TeacherName,
				StudentName: event.StudentName,
				className: event.ClassName,
				studentCode: event.StudentCode,
				program: event.Program,
				homeWork: event.HomeWork,
				studentSkype: event.StudentSkype,
			};
			const studentSkype = event.extendedProps.StudentSkype;

			console.log('Student Skype: ', studentSkype);

			// console.log('Start day: ', data.start);

			// setDateCalendar({
			// 	start: data.start,
			// 	end: data.end,
			// });

			// fetchEventByDate({
			// 	UID: 61230,
			// 	start: data.start,
			// 	end: data.end,
			// 	Token: '',
			// });

			el.setAttribute('tabindex', -1);
			if (!args.isPast && ![...el.classList].includes('booked-slot')) {
				// $(el).tooltip({
				// 	html: true,
				// 	title: `
				//             <p class="mg-b-0 tx-nowrap">Your time: ${dayjs(
				// 							event.extendedProps?.TeacherStart ?? new Date(),
				// 						).format('DD/MM/YYYY hh:mm A')}</p>
				//               <p class="mg-b-0 tx-nowrap">VN time: ${dayjs(
				// 								event.start,
				// 							).format('DD/MM/YYYY hh:mm A')}</p>
				//         `,
				// 	animation: false,
				// 	template: `<div class="tooltip" role="tooltip">
				//             <div class="tooltip-arrow">
				//             </div>
				//             <div class="tooltip-inner">
				//             </div>
				//           </div>`,
				// 	trigger: 'hover',
				// });
			}

			const diff = getDifferentMinBetweenTime(
				new Date(),
				new Date(event.StartDate),
			);

			const popWhitelist = $.fn.tooltip.Constructor.Default.whiteList; //White list data attribute;
			popWhitelist.a.push('data-skype');
			popWhitelist.a.push('data-schedule');
			popWhitelist.a.push('disabled');
			const cancelable = diff > 60 ? true : false;
			!!el &&
				[...el.classList].includes('haveFinish') &&
				$(el).click(function () {
					setDataUpdate(event.extendedProps);
					setOpenUpdate(true);
				});
			$(el)
				.popover({
					html: true,
					container: 'body',
					trigger: 'focus',
					title: 'Class Information',
					content: `
					<p class="mg-b-5 tx-light"><span class="tx-medium text-uppercase color-primary">${
						event.extendedProps.Title ?? ''
					}</span></p>
							<p class="mg-b-5 tx-light"><span class="mg-r-5">Teacher Name:</span><span class="tx-medium">${
								event.extendedProps.TeacherName ?? ''
							}</span></p>
							<p class="mg-b-5 tx-light"><span class="mg-r-5">Student:</span><span class="tx-medium">${
								event.extendedProps.StudentName ?? ''
							}</span></p>
							<p class="mg-b-5 tx-light"><span class="mg-r-5">ClassName:</span><span class="tx-medium">${
								event.extendedProps.ClassName ?? ''
							}</span></p>
			        <p class="mg-b-5 tx-light"><span class="mg-r-5">Student Code:</span><span class="tx-medium">${
								event.extendedProps.StudentCode ?? ''
							}</span></p>
			        <p class="mg-b-5 tx-light"><span class="mg-r-5">Program:</span><span class="tx-medium">${
								event.extendedProps.Program ?? ''
							}</span></p>
							<p class="mg-b-5 tx-light"><span class="mg-r-5">HomeWork:</span><span class="tx-medium">${
								event.extendedProps.HomeWork ?? ''
							}</span></p>
			        <p class="mg-b-5 tx-light"><span class="mg-r-5">Start Date:</span><span class="tx-medium">${
								event.extendedProps.StartDate
							}</span></p>
			        <p class="mg-b-5 tx-light"><span class="mg-r-5">End Date:</span><span class="tx-medium">${
								event.extendedProps.EndDate
							}</span></p>
							${
								!args.isPast &&
								`
							<p class="mg-b-0 tx-light"><span class="mg-r-5">Skype ID:</span><span class="tx-medium">${
								event.extendedProps.StudentSkype ?? ''
							}</span></p>
							<p class="mg-b-0 tx-light"><span class="mg-r-5">Zoom ID:</span><span class="tx-medium">${
								event.extendedProps.StudentZoom ?? ''
							}</span></p>
			        				<div class="action mg-t-15">
								<a href="#" rel='${studentSkype}' class="btn btn-sm btn-info btn-block tx-white-f mg-b-10 join-class-skype" target="_blank" rel="noreferrer"><i class="fab fa-skype"></i> Join class</a>
								${cancelable ? `` : ``}
								${cancelable ? '' : ''}
							</div>
							`
							}

			        `,
				})
				.on('click', function () {
					if ($(this).is('.custom-color-G, .custom-color-F ')) {
						$(this).popover('toggle');
					}
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
					// console.log({ events });
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
				}
		};

		const eventClick = (args) => {
			const { start, end, id, extendedProps } = args.event;
			const diff = getDifferentMinBetweenTime(new Date(), start);

			const element = args.el;

			if (extendedProps.available) return;
			if (
				!!$toggleCheckbox &&
				$toggleCheckbox.prop('checked') === true &&
				![...element.classList].includes('booked-slot')
			) {
				toast.warning(
					'Please uncheck "Only show student booking hours" before open or booking slot !!',
					{
						position: toast.POSITION.TOP_CENTER,
						autoClose: 5000,
					},
				);
				return;
			}
			if (
				[...element.classList].includes('fc-event-past') ||
				![...element.classList].includes('empty-slot')
			)
				return;

			// if (diff < 60) {
			// 	setShowErrorBook(true);
			// 	return;
			// }
		};

		calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
			timeZone: 'local',
			height: 550,

			expandRows: true,
			slotMinTime: '00:00',
			slotMaxTime: '24:00',

			events: function (info, successCallback) {
				setDateCalendar(info);

				(async () => {
					let UID = null;
					let Token = null;
					if (localStorage.getItem('UID')) {
						UID = localStorage.getItem('UID');
						Token = localStorage.getItem('token');
					}

					let start = dayjs(info.start).format('DD/MM/YYYY');
					let end = dayjs(info.end).format('DD/MM/YYYY');

					try {
						const res = await getListEventsOfWeek({
							sort: statusShow,
							UID: UID,
							start: start,
							end: end,
							Token: Token,
						});

						if (res.Code === 200) {
							successCallback(
								res.Data.map((event, i) => {
									return {
										...event,
										id: i,
										title: event.Title || '',
										OpenID: event.OpenID,
										start: dayjs(event.StartDate, 'DD/MM/YYYY HH:mm').toDate(),
										end: dayjs(event.EndDate, 'DD/MM/YYYY HH:mm').toDate(),
										eventType: event.eventType,
										bookStatus: event.BookingStatus,
										bookInfo: event.bookInfo,
										available: event.available,
										isEmptySlot: event.isEmptySlot,
										loading: false,
									};
								}),
							);
							// let timeEmpty = checkSlotEmpty(res.Data);

							// calendar.scrollToTime(timeEmpty);
						}
					} catch (error) {
						console.log('Error: ', error);
					}
				})();
			},

			headerToolbar: {
				start: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek', // will normally be on the left. if RTL, will be on the right

				center: '',
				end: 'today,prev,title,next', // will normally be on the right. if RTL, will be on the left
			},

			titleFormat: { year: 'numeric', month: 'short' },

			navLinks: true, // can click day/week names to navigate views
			editable: true,
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
			selectOverlap: function (event) {
				return event.rendering === 'background';
			},
			select: emptyCellSelect,
			slotLabelContent: function (arg) {
				// console.log('slotLabelContent', arg);

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
					available,
					Color,
					DateOff,
					isEmptySlot,
					loading,
					BookingStatus,
				} = event.extendedProps;
				// let classLists =
				// 	DateOff === 'false'
				// 		? bookStatus
				// 			? 'booked-slot'
				// 			: 'available-slot'
				// 		: 'off-slot';
				let classLists = null;
				classLists = Color;
				classLists += eventType === 1 ? ' hot-slot ' : '';
				classLists += isEmptySlot ? ' empty-slot' : '';
				classLists += loading ? ' is-loading' : '';
				classLists += BookingStatus === 2 ? ' haveFinish' : '';
				return classLists;
			},
			eventContent: function (args) {
				console.log('ARG: ', args);
				let templateEl = document.createElement('div');
				const { event, isPast, isStart } = args;
				const {
					bookInfo,
					eventType,
					bookStatus,
					BookingID,
					available,
					DateOff,
					isEmptySlot,
					loading,
					Title,
				} = event.extendedProps;
				const data = {
					...event.extendedProps,
					id: event.id,
					start: event.start,
					end: event.end,
					title: event.Title,
				};

				const html = `
										${
											!isEmptySlot
												? `
										<div class="inner-book-wrap ">
												<div class="inner-content">
												${
													DateOff === 'false'
														? BookingID > 0
															? `
																<span class="label-book booked"><i class="fas ${
																	isPast ? 'fa-check' : 'fa-user-graduate'
																}"></i> ${isPast ? 'FINISHED' : 'BOOKED'} 
															  </span>
																`
															: `<span class="label-book"><i class="fas fa-copyright"></i>AVAILABLE</span>`
														: `<span class="label-book"><i class="far fa-calendar-times"></i>${Title}</span>`
												}
												${
													DateOff === 'true'
														? ''
														: BookingID === 0
														? `<a href="javascript:;" class="fix-btn close-schedule" data-schedule='${JSON.stringify(
																data,
														  )}' data-events='${
																calendar.getEventSources().length > 0
																	? calendar.getEventSources()[0]
																			.internalEventSource.meta
																	: {}
														  }'>Close</a>`
														: ''
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
			// eventTimeFormat: {
			// 	// like '14:30:00'
			// 	hour: '2-digit',
			// 	minute: '2-digit',
			// 	second: '2-digit',
			// 	meridiem: false,
			// },
		});

		calendar.render();

		$('body').on('click', '.cancel-schedule', showCancelReasonModal);

		$('body').on('click', '.close-schedule', _closeSlot);

		$('body').on('click', '.join-class-skype', async function (e) {
			e.preventDefault();
			const studentSkype = $(this).attr('rel');

			// try {
			// 	addScheduleLog({ BookingID: eventData.BookingID });
			// } catch (error) {
			// 	console.log(error?.message ?? `Can't add schedule log !!`);
			// }
			window.location.href = `skype:${studentSkype ?? ''}?call`;
		});

		// function calendar() {
		// 	// Caching calendar for later use
		// 	const FullCalendar = $('#calendar');

		// 	// Build calendar with default view of mobile query
		// 	FullCalendar({ defaultView: 'timeGridWeek' });

		// 	// Register media query watch handlers
		// 	enquire.register('screen and (max-width: 1023px)', {
		// 		match: () => {
		// 			calendar('changeView', 'timeGridDay');
		// 		},
		// 	});
		// }

		// $('body').on(
		// 	'click',
		// 	'#js-book-calendar .fc-next-button',
		// 	triggerNextCalendar,
		// );
		// $('body').on(
		// 	'click',
		// 	'#js-book-calendar .fc-prev-button',
		// 	triggerPrevCalendar,
		// );

		// $('body').on(
		// 	'click',
		// 	'#js-book-calendar .fc-timeGridWeek-button',
		// 	triggerWeek,
		// );

		// $('body').on(
		// 	'click',
		// 	'#js-book-calendar .fc-dayGridMonth-button',
		// 	triggerTodayCalendar,
		// );

		// $('body').on(
		// 	'click',
		// 	'#js-book-calendar .fc-today-button',
		// 	triggerTodayCalendar,
		// );

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

	// ------------ END INIT CALENDAR ---------------

	const acceptCloseSlot = async (event) => {
		try {
			event.preventDefault();
			// const closeBtn = event.target;
			// console.log('CLOSE BTN: ', closeBtn);
			// const eventId = JSON.parse(closeBtn.getAttribute('data-schedule'));
			// console.log('eventID: ', eventId);

			const eventInstance = calendar.getEventById(infoNeedCancel.id);
			let UID = null;
			let Token = null;
			if (localStorage.getItem('UID')) {
				UID = localStorage.getItem('UID');
				Token = localStorage.getItem('token');
			}
			const res = await setEventClose({
				OpenID: infoNeedCancel.OpenID,
				token: Token,
				UID: UID,
			});
			let openDate = dayjs(infoNeedCancel.start, 'DD/MM/YYYY HH:mm').toDate();

			if (res.Code === 200) {
				eventInstance.remove();
				calendar.render();
			} else if (res.Code === 403) {
				localStorage.clear();
				router.push('/login/signin');
			} else {
				toast.error('Close slot failed', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 2000,
				});
			}
		} catch (error) {
			console.log(error);
		}
		setSureBook(false);
	};

	const _closeSlot = (event) => {
		setSureBook(true);
		const closeBtn = event.target;

		const eventId = JSON.parse(closeBtn.getAttribute('data-schedule'));

		setInfoNeedCancel(eventId);
	};

	const checkHaveDayOf = (arr) => {
		let check = null;
		arr.forEach((item) => {
			if (item.DateOff === 'true') {
				check = true;
			}
		});

		return check;
	};

	const cloneArr = (oldArr, arrOff) => {
		let arr = [];
		for (const [index, value] of oldArr.entries()) {
			if (value) {
				arr.push(value);
			}
		}

		let check = checkHaveDayOf(arr);
		if (!check) {
			if (arrOff.length > 0) {
				for (const [index, value] of arrOff.entries()) {
					arr.push(value);
				}
			}
		}

		return arr;
	};

	const findDayOff = (arr) => {
		let arrOff = [];
		for (const [index, value] of arr.entries()) {
			if (value.DateOff === 'true') {
				arrOff.push(value);
			}
		}

		return arrOff;
	};

	// useEffect(() => {
	// 	if (openUpdate) {
	// 		const currentDate = calendar.getDate();

	// 		callFetchEvent(currentDate);
	// 	}

	// 	lottie &&
	// 		lottie.loadAnimation({
	// 			container: loadingRef.current,
	// 			renderer: 'svg',
	// 			loop: true,
	// 			autoplay: true,
	// 			path: '/static/img/loading.json',
	// 		});

	// 	return () => {
	// 		loadingRef.current = false;
	// 	};
	// }, [openUpdate]);

	useEffect(() => {
		if (startChange) {
			// const currentDate = calendar.getDate();
			// callFetchEvent(currentDate);
			initCalendar(statusShow);
		}
	}, [statusShow]);

	// useEffect(() => {
	// 	calendar?.addEventSource(dataCal);
	// }, [dataCal]);

	useEffect(() => {
		if (localStorage.getItem('isLogin')) {
			let UID = localStorage.getItem('UID');
			let token = localStorage.getItem('token');
			let dataProfile = localStorage.getItem('dataUser');
			dataProfile = JSON.parse(dataProfile);

			let timeValue = dataProfile.TimeZoneValue;
			timeValue = parseInt(timeValue);

			setDataUser({
				UID: parseInt(UID),
				token: token,
				timeValue: timeValue / 60,
			});
		}

		initCalendar(statusShow);
		setStartChange(true);

		if (!openUpdate) {
			// const currentDate = calendar.getDate();
			// callFetchEvent(currentDate);
			// if (data?.length > 0) {
			// 	let arrOff = findDayOff(data);
			// 	console.log('Arr OFF: ', arrOff);
			// 	const newArr = [...data].map((event, i) => {
			// 		if (statusShow === 1) {
			// 			return {
			// 				...event,
			// 				id: i,
			// 				title: event.Title || '',
			// 				start: dayjs(event.StartDate, 'DD/MM/YYYY HH:mm').toDate(),
			// 				end: dayjs(event.EndDate, 'DD/MM/YYYY HH:mm').toDate(),
			// 				eventType: event.eventType,
			// 				bookStatus: event.BookingStatus,
			// 				bookInfo: event.bookInfo,
			// 				available: event.available,
			// 				isEmptySlot: event.isEmptySlot,
			// 				loading: false,
			// 			};
			// 		} else if (statusShow === 2) {
			// 			if (event.BookingID === 0) {
			// 				return {
			// 					...event,
			// 					id: i,
			// 					title: event.Title || '',
			// 					start: dayjs(event.StartDate, 'DD/MM/YYYY HH:mm').toDate(),
			// 					end: dayjs(event.EndDate, 'DD/MM/YYYY HH:mm').toDate(),
			// 					eventType: event.eventType,
			// 					bookStatus: event.BookingStatus,
			// 					bookInfo: event.bookInfo,
			// 					available: event.available,
			// 					isEmptySlot: event.isEmptySlot,
			// 					loading: false,
			// 				};
			// 			}
			// 		} else if (statusShow === 3) {
			// 			if (event.OpenID === 0) {
			// 				return {
			// 					...event,
			// 					id: i,
			// 					title: event.Title || '',
			// 					start: dayjs(event.StartDate, 'DD/MM/YYYY HH:mm').toDate(),
			// 					end: dayjs(event.EndDate, 'DD/MM/YYYY HH:mm').toDate(),
			// 					eventType: event.eventType,
			// 					bookStatus: event.BookingStatus,
			// 					bookInfo: event.bookInfo,
			// 					available: event.available,
			// 					isEmptySlot: event.isEmptySlot,
			// 					loading: false,
			// 				};
			// 			}
			// 		}
			// 	});
			// 	let cloneNewArr = cloneArr(newArr, arrOff);
			// 	calendar.addEventSource(cloneNewArr);
			// 	setStartChange(true);
			// }
		}

		lottie &&
			lottie.loadAnimation({
				container: loadingRef.current, // the dom element that will contain the animation
				renderer: 'svg',
				loop: true,
				autoplay: true,
				path: '/static/img/loading.json', // the path to the animation json
			});

		FullCalendar.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
		return () => {
			loadingRef.current = false;
		};
	}, []);

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
				<Modal
					show={sureBook}
					onHide={() => setSureBook(false)}
					size="sm"
					centered
					bsPrefix="modal"
					animation={false}
				>
					<Modal.Header bsPrefix="modal-header bg-danger tx-white pd-10">
						<Modal.Title bsPrefix="modal-title tx-white">
							{t('Noted')} !
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p className="mg-b-0">
							{t('Do you really want to cancel this slot?')}
						</p>
						<div className="tx-center mg-t-15">
							<a
								className="btnClose"
								size="sm"
								variant="primary"
								onClick={() => setSureBook(false)}
							>
								{t('Close')}
							</a>
							<a
								className="btnAccept"
								size="sm"
								variant="primary"
								onClick={acceptCloseSlot}
							>
								OK
							</a>
						</div>
					</Modal.Body>
				</Modal>

				<Modal
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
				</Modal>
				{/* <CancelSlotModal
					showModal={showCancelModal}
					closeModal={() => setShowCancelModal(false)}
					handleCancelSlot={_cancelSlot}
					loading={cancelLoading}
				/> */}
				<ActiveSlotModal
					data={{
						start: dayjs(modalData?.start).format('DD/MM/YYYY HH:mm') ?? '',
						end: dayjs(modalData?.end).format('DD/MM/YYYY HH:mm') ?? '',
					}}
					showModal={showActiveModal}
					closeModal={() => setShowActiveModal(false)}
					handleOpenSlot={_openSlot}
					t={t}
					loadingSlot={loadingSlot}
				/>

				<ModalUpdate
					dataUpdate={!!dataUpdate && dataUpdate}
					onShow={openUpdate}
					onClose={() => setOpenUpdate(false)}
					updateStatus={(infoSubmit) => updateStatus(infoSubmit)}
					t={t}
				/>
			</div>
		</>
	);
};

export default withTranslation('common')(FullCalendar);
