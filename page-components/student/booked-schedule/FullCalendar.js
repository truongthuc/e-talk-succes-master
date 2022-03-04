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
import { toast, ToastContainer } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { getDifferentMinBetweenTime, convertDDMMYYYYtoMMDDYYYY } from '~/utils';
import { randomId } from '~/utils';
import dayjs from 'dayjs';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClassesDetail from '~/page-components/teacher/payment/ClassesDetail';
import { makeStyles } from '@material-ui/core/styles';
import { i18n, withTranslation } from '~/i18n';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import allLocales from '@fullcalendar/core/locales-all';
// import { compensateScroll } from '~/out/static/assets/plugins/custom/fullcalendar/fullcalendar.bundle';

const useStyles = makeStyles((theme) => ({
	styleLoading: {
		width: '20px!important',
		height: '20px!important',
		color: 'white!important',
		marginRight: '10px!important',
	},
}));

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
let teacherID = null;

const FullCalendar = ({ teacher, completeBooking, t }) => {
	let LANG = i18n.language;

	const [dataLang, setDataLang] = useState([
		'Sun',
		'Mon',
		'Tue',
		'Wed',
		'Thu',
		'Fri',
		'Sat',
	]);

	console.log('DATA LANG: ', dataLang);

	const dayNamesShort = [
		t('Sun'),
		t('Mon'),
		t('Tue'),
		t('Wed'),
		t('Thu'),
		t('Fri'),
		t('Sat'),
	];
	const classes = useStyles();

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
	const [checkScroll, setCheckScroll] = useState(false);
	const [dateCalendar, setDateCalendar] = useState();
	const [statusBook, setStatusBook] = useState(false);

	console.log('Modal Data: ', modalData);

	const [changeData, setChangeData] = useState(false);
	const [openData, setOpenData] = useState();
	const [dataTime, setDataTime] = useState([]);
	const loadingRef = useRef(true);
	const [statusRender, setStatusRender] = useState(false);
	const [modalCancel, setModalCancel] = useState(false);

	const [infoNeedCancel, setInfoNeedCancel] = useState();
	const [startChange, setStartChange] = useState(false);

	const [anchorEl, setAnchorEl] = useState(null);

	const handleClickInfo = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseInfo = () => {
		setAnchorEl(null);
	};

	const openInfo = Boolean(anchorEl);
	const idInfo = openInfo ? 'simple-popover' : undefined;

	const fetchEventByDate = async (obj) => {
		let timeEmpty = null;
		setIsLoading(true);
		try {
			const res = await GetBookingCalendarForStudent({
				TeacherID: teacher,
				UID: obj.UID,
				start: obj.start,
				end: obj.end,
				Token: obj.Token,
			}); // @string date dd/mm/yyyy
			if (res.Code === 200) {
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
				}

				if (newEvents.length > 0) {
					timeEmpty = checkSlotEmpty(newEvents);
				}

				calendar.addEvent(newEvents);
				calendar.render();
			}
			if (res.Code === 403) {
				localStorage.clear();
				router.push('/login/signin');
			}
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
		calendar.scrollToTime(timeEmpty);
	};

	const reloadCalendar = async () => {
		// GET UID and Token
		let UID = null;
		let Token = null;

		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		let start = dayjs(dateCalendar?.start).format('DD/MM/YYYY');
		let end = dayjs(dateCalendar?.end).format('DD/MM/YYYY');

		setIsLoading(true);
		try {
			const res = await GetBookingCalendarForStudent({
				TeacherID: teacher,
				UID: UID,
				start: start,
				end: end,
				Token: Token,
			}); // @string date dd/mm/yyyy
			if (res.Code === 200) {
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
				}

				calendar.addEventSource(newEvents);
			}
			if (res.Code === 403) {
				localStorage.clear();
				router.push('/login/signin');
			}
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};

	const callFetchEvent = async (date) => {
		// GET UID and Token
		let UID = null;
		let Token = null;

		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		let start = dayjs(dateCalendar?.start).format('DD/MM/YYYY');
		let end = dayjs(dateCalendar?.end).format('DD/MM/YYYY');

		// GET DATE

		// let first = date.getDate();

		// console.log('Fisrt is: ', first);

		// let firstday = new Date(date.setDate(first - 6)).toUTCString();
		// let lastday = new Date(date.setDate(first + 6)).toUTCString();

		// firstday = dayjs(firstday).format('DD/MM/YYYY');
		// lastday = dayjs(lastday).format('DD/MM/YYYY');

		// console.log('First Day: ', firstday);
		// console.log('Last day: ', lastday);

		// let getMonth = date.getMonth();
		// let getYear = date.getFullYear();

		// let start = new Date(getYear, getMonth, 1);
		// let end = new Date(getYear, getMonth + 1, 0);

		// ----

		fetchEventByDate({
			UID: UID,
			start: start,
			end: end,
			Token: Token,
		});
	};

	// const triggerNextCalendar = () => {
	// 	calendar.render();
	// };

	// const triggerPrevCalendar = () => {
	// 	calendar.render();
	// };

	// const triggerWeek = () => {
	// 	calendar.render();
	// };

	// const triggerMonth = () => {
	// 	if (!calendar) return;
	// 	try {
	// 		const currentDate = calendar.getDate();

	// 		callFetchEvent(currentDate);
	// 	} catch (error) {}
	// };

	// const triggerTodayCalendar = () => {
	// 	if (!calendar) return;
	// 	try {
	// 		const currentDate = calendar.getDate();

	// 		callFetchEvent(currentDate);
	// 	} catch (error) {}
	// };

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

	const onViewChange = (view, el) => {};

	const _openSlot = async (infoSubmit) => {
		let timeTeacher = modalData?.diff;
		let timeCourse = modalData.timeCourse;

		const res = await setEventAvailable({
			UID: dataUser?.UID,
			token: dataUser?.token,
			title: infoSubmit.program,
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
				autoClose: 500,
			});

			setStatusBook(true);
			setShowActiveModal(false);

			const currentDate = calendar.getDate();

			console.log(
				'Current Date when book: ',
				dayjs(currentDate).format('DD/MM/YYYY HH:mm'),
			);

			// callFetchEvent(currentDate);
			// reloadCalendar();
			calendar.refetchEvents();

			// completeBooking && completeBooking();
		} else if (res.Code === 100) {
			setStatusBook(true);
			toast.error('Bạn đã học hết số buổi học', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 2000,
			});
		} else if (res.Code === 101) {
			setStatusBook(true);
			toast.error(
				'Ca học đã được book hoặc không tồn tại lịch trống phù hợp với gói học của bạn!',
				{
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 2000,
				},
			);
		} else if (res.Code === 102) {
			setStatusBook(true);
			toast.error('Bạn chưa đăng ký gói mới!', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 2000,
			});
		} else if (res.Code === 403) {
			localStorage.clear();
			router.push({
				pathname: '/',
			});
		} else {
			setStatusBook(true);
			toast.error('Open slot failed', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 2000,
			});
		}
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

	const acceptCloseSlot = () => {};

	const [cancelLoading, setCancelLoading] = useState(false);

	const _cancelSlot = async () => {
		let UID = null;
		let token = null;

		if (localStorage.getItem('isLogin')) {
			UID = localStorage.getItem('UID');
			token = localStorage.getItem('token');
		}

		let getUID = parseInt(UID);

		console.log('Get UID: ', getUID);

		if (getUID !== modalData.StudentUID) {
			toast.error("You can't cancel this slot, it's not your slot!", {
				position: toast.POSITION.TOP_CENTER,
				autoClose: 2000,
			});
			setModalCancel(false);
		} else {
			setCancelLoading(true);
			try {
				const res = await StudentCancelBooked({
					BookingID: infoNeedCancel,
					UID: UID,
					Token: token,
				});
				if (res.Code === 200) {
					calendar.refetchEvents();
					// const currentDate = calendar.getDate();
					// callFetchEvent(currentDate);

					toast.success('You have canceled a lesson successfully', {
						position: toast.POSITION.TOP_CENTER,
						autoClose: 2000,
					});
					handleCloseInfo();
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
			setCancelLoading(false);
		}

		setShowActiveModal(false);
		setModalCancel(false);
	};

	const onSubmit = (e) => {
		e.preventDefault();
	};

	const moveToTime = (data) => {
		let timeEmpty = checkSlotEmpty(data);

		setTimeout(() => {
			console.log('Run scroll');
			if (timeEmpty !== null) {
				calendar.scrollToTime(timeEmpty);
			}
		}, 1000);
	};

	let $toggleCheckbox;

	const initCalendar = (teacher, arrLang, Lang) => {
		//const createEventSlots
		const calendarEl = document.getElementById('js-book-calendar');

		const $closeModal = $('#md-close-slot');
		const $cancelModal = $('#md-cancel-slot');

		const eventDidMount = (args) => {
			// var tooltip = new Tooltip(args.el, {
			// 	title: args.event.extendedProps.description,
			// 	placement: 'top',
			// 	trigger: 'hover',
			// 	container: 'body',
			// });
			// console.log('eventDidMount', args);
			const { event, el } = args;
			const data = {
				...event.extendedProps,
			};
			const cancelID = data.BookingID;
			const teacherSkype = data.TeacherSkype;

			console.log('teacher skype: ', teacherSkype);

			el.setAttribute('tabindex', -1);

			el.setAttribute('aria-describedby', idInfo);

			if (!args.isPast && ![...el.classList].includes('booked-slot')) {
				setShowActiveModal(false);
			}

			let diff = getDifferentMinBetweenTime(new Date(), new Date(event.start));

			// let userID = parseInt(localStorage.getItem('UID'));
			// let studentID = event.extendedProps.StudentUID;

			// console.log('User ID: ', userID);
			// console.log('Student ID: ', studentID);

			let cancelable = diff > 60 ? true : false;
			// !!el &&
			// 	[...el.classList].includes('haveBooked') &&
			// 	$(el)
			// 		.not('.custom-color-J')
			// 		.popover({
			// 			html: true,
			// 			container: 'body',
			// 			trigger: 'focus',
			// 			title: `${t('Booked Information')}`,
			// 			content: `
			//           <p class="mg-b-5"><span class="mg-r-5">${t(
			// 						'Teacher',
			// 					)}:</span><span class="tx-medium">${
			// 				event.extendedProps.TeacherName ?? ''
			// 			}</span></p>
			//           <p class="mg-b-5"><span class="mg-r-5">${t(
			// 						'Package Name',
			// 					)}:</span><span class="tx-medium">${
			// 				event.extendedProps.PackageName ?? ''
			// 			}</span></p>
			//           <p class="mg-b-5"><span class="mg-r-5">${t(
			// 						'Course',
			// 					)}:</span><span class="tx-medium">${
			// 				event.extendedProps.CourseName ?? ''
			// 			}</span></p>
			//           <p class="mg-b-5"><span class="mg-r-5">${t(
			// 						'Study Time',
			// 					)}:</span><span class="tx-medium">${
			// 				event.extendedProps.StudyTime ?? ''
			// 			}</span></p>
			// 					<p class="mg-b-5"><span class="mg-r-5">${t(
			// 						'Study Date',
			// 					)}:</span><span class="tx-medium">${
			// 				event.extendedProps.StudyDate ?? ''
			// 			}</span></p>

			// 	<div class="action mg-t-15">

			//               <a href="#" rel='${teacherSkype}' class="btn btn-sm btn-info btn-block tx-white-f mg-b-10 join-class-skype" target="_blank" rel="noopener">${t(
			// 				'Go to Classroom',
			// 			)}</a>

			//               ${
			// 								cancelable
			// 									? `<a href="#" class="btn btn-sm btn-danger btn-block cancel-schedule" rel='${cancelID}'>${t(
			// 											'Cancel Lesson',
			// 									  )}</a>`
			// 									: `<a href="#" class="btn btn-sm btn-block btn-disabled">${t(
			// 											'Cancel Lesson',
			// 									  )}</a>`
			// 							}
			//               ${
			// 								cancelable
			// 									? ''
			// 									: '<p class="mg-b-0 tx-danger mg-t-10">Sorry, you cannot cancel the class</p>'
			// 							}
			//           </div>

			//           `,
			// 		})
			// 		.on('click', function (e) {
			// 			e.preventDefault();

			// 			$(this).popover('toggle');
			// 		});

			// ---------------- SPACE  --------------- //

			// if ($(window).width() < 800) {
			// 	$(document).on('click', function (event) {
			// 		let $el = $(el);

			// 		if (!$(event.target).closest($el)) {
			// 			$el.popover('hide');
			// 		}
			// 	});
			// } else {
			// 	$(document).on('click', function (event) {
			// 		let $el = $(el);

			// 		if (
			// 			!$(event.target).closest($el).length &&
			// 			!$(event.target).closest('.popover').length
			// 		) {
			// 			$el.popover('hide');
			// 		}
			// 	});
			// }

			// $(document).on('click', function (event) {
			// 	let $el = $(el);

			// 	if (
			// 		!$(event.target).closest($el).length &&
			// 		!$(event.target).closest('.popover').length
			// 	) {
			// 		$el.popover('hide');
			// 	}
			// });

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
			const { start, end, id, extendedProps } = args.event;
			handleCloseInfo();
			console.log('Extended Props: ', extendedProps);

			const diffCheck = getDifferentMinBetweenTime(new Date(), start);
			let Cancelable = diffCheck > 60 ? true : false;

			let timeCourse = null;
			if (localStorage.getItem('isLogin')) {
				let dataUser = localStorage.getItem('dataUser');
				dataUser = JSON.parse(dataUser);

				timeCourse = dataUser.TimeCourse;
			}

			const diff = getDifferentMinBetweenTime(start, end);

			setModalData({
				...modalData,
				start: extendedProps.StartDate,
				end: extendedProps.EndDate,
				StudyTime: extendedProps.StudyTime,
				StudentUID: extendedProps.StudentUID,
				diff: diff,
				timeCourse: timeCourse,
				Avatar: extendedProps.Avatar,
				TeacherName: extendedProps.TeacherName,
				PackageName: extendedProps.PackageName,
				CourseName: extendedProps.CourseName,
				StudyDate: extendedProps.StudyDate,
				TeacherSkype: extendedProps.TeacherSkype,
				StudentSkype: extendedProps.StudentSkype,
				BookingID: extendedProps.BookingID,
				Cancelable: Cancelable,
			});

			if (diffCheck >= 60) {
				toast.dismiss();
				// Get time Course
				// let timeCourse = null;
				// if (localStorage.getItem('isLogin')) {
				// 	let dataUser = localStorage.getItem('dataUser');
				// 	dataUser = JSON.parse(dataUser);

				// 	timeCourse = dataUser.TimeCourse;
				// }

				// const diff = getDifferentMinBetweenTime(start, end);

				const element = args.el;

				// setModalData({
				// 	...modalData,
				// 	start: extendedProps.StartDate,
				// 	end: extendedProps.EndDate,
				// 	StudyTime: extendedProps.StudyTime,
				// 	StudentUID: extendedProps.StudentUID,
				// 	diff: diff,
				// 	timeCourse: timeCourse,
				// 	Avatar: extendedProps.Avatar,
				// 	TeacherName: extendedProps.TeacherName,
				// 	PackageName: extendedProps.PackageName,
				// 	CourseName: extendedProps.CourseName,
				// 	StudyDate: extendedProps.StudyDate,
				// 	TeacherSkype: extendedProps.TeacherSkype,
				// 	StudentSkype: extendedProps.StudentSkype,
				// 	BookingID: extendedProps.BookingID,
				// 	Cancelable: Cancelable,
				// });

				if (args.el.className.includes('custom-color-H')) {
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
							res.Code == 200 && setOpenData(res.Data);
							if (res.Code === 403) {
								localStorage.clear();
								router.push('/login/signin');
							}
						} catch (error) {
							console.log(error);
						}
					})();

					// ---------------------------- //

					// if (
					// 	extendedProps.available ||
					// 	[...element.classList].includes('booked-slot') ||
					// 	[...element.classList].includes('booked-slot')
					// )
					return;

					setActiveModal({
						...activeModal,
						...args.event.extendedProps,
						date: dayjs(extendedProps.StartDate).format('DD/MM/YYYY'),
						start: dayjs(extendedProps.StartDate).format('HH:mm A'),
						end: dayjs(extendedProps.EndDate).format('HH:mm A'),
					});
				}

				// if (args.el.className.includes('haveBooked')) {
				// 	console.log('Target: ', args.el.getAttribute('aria-describedby'));
				// 	let target = args.el;
				// 	setAnchorEl(target);
				// }
			} else {
				if (extendedProps.Color === 'custom-color-H') {
					toast.error('Bạn phải book buổi học trước hơn 1 tiếng', {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: 2000,
					});
				}
			}
			if (args.el.className.includes('haveBooked')) {
				console.log('Target: ', args.el.getAttribute('aria-describedby'));
				let target = args.el;
				setAnchorEl(target);
			}
			// ---------------
		};

		let timeEmpty = '';

		calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
			timeZone: 'local',
			height: 550,
			locales: allLocales,
			locale: Lang,
			// contentHeight: 'auto',
			expandRows: false,
			// slotMinTime: '00:00',
			// slotMaxTime: '24:00',
			// events: data?.map((y) => ({
			// 	...y,
			// 	id: randomId(),
			// 	loading: false,
			// })),
			eventChange: function (info) {
				console.log('Info is: ', info);
			},
			events: function (info, successCallback) {
				setDateCalendar(info);
				setStartChange(true);
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
						const res = await GetBookingCalendarForStudent({
							TeacherID: teacher,
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

							// setStatusRender(true);
							timeEmpty = checkSlotEmpty(res.Data);
							console.log('timeEmpty: ', timeEmpty);

							// setDataTime(res.Data);
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
                            <span class="hd-date">${d} </span><span class="hd-day">${arrLang[days]}</span>
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
					BookingID,
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
				classLists += BookingID > 0 ? ' haveBooked' : '';
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
					Title,
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
																}"></i> ${
																				isPast
																					? Lang === 'en'
																						? 'FINISHED'
																						: 'ĐÃ KẾT THÚC'
																					: Lang === 'en'
																					? 'BOOKED'
																					: 'ĐÃ ĐẶT'
																		  }  </span>
																`
																		: `<span class="label-book"><i class="fas fa-copyright"></i>${
																				Lang === 'en'
																					? 'AVAILABLE'
																					: 'CÒN TRỐNG'
																		  }</span>`
																	: `<span class="label-book text-off-day"><i class="far fa-calendar-times"></i>${Title}</span>`
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
		});

		calendar.render();

		setTimeout(() => {
			console.log('Time Empty: ', timeEmpty);
			calendar.scrollToTime(timeEmpty);
		}, 500);

		$('body').off('click', '**');
		$('body').on('click', '.cancel-schedule', (e) => {
			e.preventDefault();
			const dataRel = parseInt(e.target.getAttribute('rel'));
			console.log('Data rel: ', dataRel);
			// const eventData = JSON.parse(dataRel);

			// _cancelSlot(eventData);
			setInfoNeedCancel(dataRel);
			setModalCancel(true);
		});

		$('body').on('click', '.close-schedule', function (e) {
			e.preventDefault();
			const eventData = JSON.parse(e.target.getAttribute('data-schedule'));
			_closeSlot(eventData);
		});

		$('body').on('click', '.join-class-skype', async function (e) {
			e.preventDefault();

			const teacherSkype = $(this).attr('rel');
			// try {
			// 	addScheduleLog({ BookingID: eventData.BookingID });
			// } catch (error) {
			// 	console.log(error?.message ?? `Can't add schedule log !!`);
			// }

			window.location.href = `skype:${teacherSkype ?? ''}?chat`;
		});

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
		// 	'#js-book-calendar .fc-timeGridWeek-button',
		// 	triggerWeek,
		// );

		// $('body').on(
		// 	'click',
		// 	'#js-book-calendar .fc-dayGridMonth-button',
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

	const checkSlotEmpty = (data) => {
		let timeEmpty = null;
		let getTime = null;

		let min = null;
		for (const [index, item] of data.entries()) {
			let date = item.StartDate;
			let startDay = date.split(' ');
			startDay = startDay[0];

			if (min === null) {
				if (item.BookingID === 0) {
					min = startDay;
				}
			} else {
				console.log('chạy vô đây');
				if (item.BookingID === 0) {
					if (Date.parse(startDay) < Date.parse(min)) {
						console.log('run continue');
						min = startDay;
					}
				}
			}
		}

		console.log('min: ', min);

		for (const [ind, value] of data.entries()) {
			let date = value.StartDate;
			let startDay = date.split(' ');
			startDay = startDay[0];

			console.log('Start Day: ', startDay);

			if (value.BookingID === 0) {
				if (min === startDay) {
					timeEmpty = value.StartDate;
					break;
				}
			}
		}

		if (timeEmpty !== null) {
			timeEmpty = timeEmpty.split(' ');
			getTime = timeEmpty[1];
		}

		return getTime;
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
		if (statusBook) {
			setStatusBook(false);
		}
	}, [statusBook]);

	// useEffect(() => {
	// 	if (startChange === true) {
	// 		console.log('Run ittt');
	// 		const currentDate = calendar.getDate();
	// 		callFetchEvent(currentDate);
	// 		// setTeacherID(teacher);
	// 		// calendar.refetchEvents();
	// 		// initCalendar(teacher);
	// 	}
	// }, [teacher]);

	// useEffect(() => {
	// 	if (statusRender) {
	// 		calendar.render();
	// 		let timeEmpty = checkSlotEmpty(dataTime);
	// 		console.log('Time empty: ', timeEmpty);
	// 		setTimeout(() => {
	// 			if (timeEmpty !== null) {
	// 				console.log('Scroll đê');
	// 				calendar.scrollToTime('21:00:00');
	// 			}
	// 		}, 2000);

	// 		setStatusRender(false);
	// 	}
	// }, [statusRender]);

	// useEffect(() => {

	// 	setTimeout(() => {
	// 		initCalendar(teacher);
	// 	}, 500);
	// }, [LANG]);

	useEffect(() => {
		if (calendar) {
			calendar.destroy();
		}

		if (LANG == 'en') {
			const arrLang = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			initCalendar(teacher, arrLang, 'en');
		}
		if (LANG == 'vi') {
			const arrLang = ['CN', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7'];
			// setDataLang(['CN', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7']);
			initCalendar(teacher, arrLang, 'vi');
		}
		if (localStorage.getItem('isLogin')) {
			let UID = localStorage.getItem('UID');
			let token = localStorage.getItem('token');
			setDataUser({
				UID: parseInt(UID),
				token: token,
			});
		}

		// if (data?.length > 0) {
		// 	if (!changeData) {
		// 		const newArr = data.map((event) => {
		// 			return {
		// 				...event,
		// 				id: event.id,
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
		// 		});

		// 		calendar.addEventSource(newArr);
		// 	}
		// }

		// const currentDate = calendar.getDate();

		// callFetchEvent(currentDate);

		// let timeEmpty = checkSlotEmpty(data);
		// calendar.scrollToTime(timeEmpty);
		// teacherID = teacher;

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
	}, [teacher, LANG]);

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
				{
					<ActiveSlotModal
						data={{
							TeacherName: modalData?.TeacherName,
							Avatar: modalData?.Avatar,
							dataPopup: modalData?.dataPopup,
							start: dayjs(modalData?.start).format('MM/DD/YYYY HH:mm') ?? '',
							end: dayjs(modalData?.end).format('MM/DD/YYYY HH:mm') ?? '',
						}}
						dataUser={!!dataUser && dataUser}
						modalData={!!modalData && modalData}
						showModal={showActiveModal}
						closeModal={() => setShowActiveModal(false)}
						handleOpenSlot={(infoSubmit) => _openSlot(infoSubmit)}
						statusBook={statusBook}
						t={t}
					/>
				}

				<CloseSlotModal data={activeModal} handleCloseSlot={_closeSlot} />

				<CancelSlotModal data={activeModal} handleCancelSlot={_cancelSlot} />
				<Modal
					show={modalCancel}
					onHide={() => setModalCancel(false)}
					size="sm"
					centered
					bsPrefix="modal"
					animation={false}
				>
					<Modal.Header bsPrefix="modal-header bg-danger tx-white pd-10">
						<Modal.Title bsPrefix="modal-title tx-white">Note!</Modal.Title>
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
								onClick={() => setModalCancel(false)}
							>
								{t('Close')}
							</a>
							<a
								className="btnAccept"
								size="sm"
								variant="primary"
								onClick={_cancelSlot}
							>
								{cancelLoading && (
									<CircularProgress className={classes.styleLoading} />
								)}
								OK
							</a>
						</div>
					</Modal.Body>
				</Modal>

				<Popper
					id={idInfo}
					open={openInfo}
					anchorEl={anchorEl}
					onClose={handleCloseInfo}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
				>
					<div className="info-slot">
						<div className="info-slot-header">
							<p className="title">{t('Booked Information')}</p>
							<span className="close-icon" onClick={handleCloseInfo}>
								<CloseOutlinedIcon />
							</span>
						</div>
						<div className="info-slot-body">
							<p>
								Teacher: <span>{modalData?.TeacherName}</span>
							</p>
							<p>
								Package Name: <span>{modalData?.PackageName}</span>
							</p>
							<p>
								Course Name: <span>{modalData?.CourseName}</span>
							</p>
							<p>
								Study Time: <span>{modalData?.StudyTime}</span>
							</p>
							<p>
								Study Date: <span>{modalData?.StudyDate}</span>
							</p>
							<a
								href="#"
								className="btn btn-sm btn-info btn-block tx-white-f mg-b-10 join-class-skype"
								rel={modalData?.TeacherSkype}
								target="_blank"
							>
								{t('Go to Classroom')}
							</a>
							{!modalData?.Cancelable ? (
								<p class="mg-b-0 tx-danger mg-t-10">
									Sorry, you cannot cancel the class
								</p>
							) : (
								<a
									href="#"
									className="btn btn-sm btn-danger btn-block cancel-schedule"
									rel={modalData?.BookingID}
								>
									{t('Cancel Lesson')}
								</a>
							)}
						</div>
					</div>
				</Popper>
			</div>
		</>
	);
};

FullCalendar.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(FullCalendar);
