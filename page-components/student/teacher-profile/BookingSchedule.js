import React, { useState, useEffect } from 'react';
import { getScheduleByTeacherUID } from '~/api/studentAPI';
import { toast } from 'react-toastify';
import 'react-toastify/scss/main.scss';
import { toastInit } from '~/utils';
import {
	FETCH_ERROR,
	CANCEL_BOOKING_SUCCESS,
	BOOKING_SUCCESS,
} from '~/components/common/Constant/toast';
import dayjs from 'dayjs';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { randomId } from '~/utils';
import './BookingSchedule.module.scss';
let calendar;

const getDifferentMinBetweenTime = (startDate, endDate) => {
	const oneMinutes = 1000 * 60;
	const startTime = startDate.getTime();
	const endTime = endDate.getTime();
	const diffTime =
		endTime - startTime + startDate.getTimezoneOffset() * 60 * 1000;
	return Math.round(diffTime / oneMinutes);
};
let mondayOfWeek = new Date(
	new Date().setDate(new Date().getDate() - new Date().getDay() + 1),
);
const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let uid;

const BookingSchedule = ({
	TeacherUID,
	handleBookLesson,
	handleCancelLesson,
	onBookingId,
	onCancelId,
}) => {
	const [eventSource, setEventSource] = useState([]);
	const [loading, setLoading] = useState(false);
	const [activeDate, setActiveDate] = useState(mondayOfWeek);

	const cancelToastSuccess = () =>
		toast.success(CANCEL_BOOKING_SUCCESS, toastInit);
	const cancelToastFail = () => toast.error(FETCH_ERROR, toastInit);
	const bookingToastSuccess = () => toast.success(BOOKING_SUCCESS, toastInit);

	const bookLesson = (StudyTimeID, LessionName, date, start, end) => {
		handleBookLesson(StudyTimeID, LessionName, date, start, end);
	};

	const cancelLesson = (BookingID, LessionName, date, start, end) => {
		handleCancelLesson(BookingID, LessionName, date, start, end);
	};

	const calendarInit = () => {
		const calendarEl = document.getElementById('js-book-calendar');
		let $toggleCheckbox;
		const eventDidMount = (args) => {
			const { event } = args;
			let toggleStudent = document.getElementById('student-toggle-checkbox');
			if (
				!args.isPast &&
				(event._def.extendedProps.available ||
					event._def.extendedProps.bookInfo)
			) {
				$(args.el).tooltip({
					html: true,
					title: `<p class="mg-b-0">Ngày học: ${dayjs(event.start).format(
						'DD/MM/YYYY',
					)}</p>
            <p class="mg-b-0">Giờ học: ${dayjs(event.start).format(
							'hh:mm A',
						)} - ${dayjs(event.end).format('hh:mm A')}</p>`,
					animation: false,
					template: `<div class="tooltip" role="tooltip">
                <div class="tooltip-arrow"></div><div class="tooltip-inner"></div>
              </div>`,
					trigger: 'hover',
				});
			}
			!!$toggleCheckbox && showStudentToggle();
			const events = calendar.getEvents();
			const dayHeaders = document.querySelectorAll('.fc-col-header-cell');
			if (dayHeaders.length > 0)
				for (let i = 0; i < dayHeaders.length; i++) {
					if ('data-date' in dayHeaders[i].dataset) continue;
					const date = dayHeaders[i].getAttribute('data-date');
					const dateHD = new Date(date);
					let bookedSlot = 0;
					let totalSlot = 0;

					events.map((event) => {
						const eventDate = new Date(event.extendedProps.Start.split('T')[0]);
						if (eventDate.getTime() === dateHD.getTime()) {
							(event.extendedProps.bookStatus ||
								event.extendedProps.available) &&
								totalSlot++;
							event.extendedProps.bookStatus && bookedSlot++;
						}
					});
					dayHeaders[i].querySelector('.booked').textContent = bookedSlot;
					dayHeaders[i].querySelector('.total').textContent = totalSlot;
				}
		};

		const eventClick = (args) => {
			/*  Handle when click on cell const element = args.el;
       if ([...element.classList].includes("available-slot") &&
         !([...element.classList].includes("empty-slot") || [...element.classList].includes("fc-event-past"))
       ) {
         const { start, end } = args.event;
       }
       return; */
		};

		calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
			height: 600,
			expandRows: true,
			slotMinTime: '06:00',
			slotMaxTime: '23:00',
			events: [...eventSource]
				.filter((x) => x.isEmptySlot === false)
				.map((y) => ({
					...y,
					id: randomId(),
					loading: false,
				})),
			headerToolbar: {
				start: '', // will normally be on the left. if RTL, will be on the right
				center: '',
				end: 'today,prev,title,next', // will normally be on the right. if RTL, will be on the left
			},
			titleFormat: { year: 'numeric', month: 'short' },
			navLinks: true, // can click day/week names to navigate views
			editable: false,
			stickyHeaderDates: true,
			selectable: true,
			nowIndicator: true,
			allDaySlot: false,
			allDayDefault: false,
			dayMaxEvents: true, // allow "more" link when too many events
			eventOverlap: false,
			initialDate: new Date(activeDate),
			initialView: 'timeGridWeek',
			firstDay: 1,
			slotDuration: '00:30',
			slotLabelInterval: '00:30',
			slotEventOverlap: false,
			customButtons: {
				prev: {
					click: function () {
						calendar.prev();
						setActiveDate(calendar.getDate());
					},
				},
				next: {
					click: function () {
						calendar.next();
						setActiveDate(calendar.getDate());
					},
				},
				today: {
					text: 'Today',
					click: function () {
						calendar.today();
						let today = calendar.getDate();
						/* Fetch data from Monday of this week */
						setActiveDate(
							new Date(today.setDate(today.getDate() - today.getDay() + 1)),
						);
					},
				},
			},
			selectOverlap: function (event) {
				return event.rendering === 'background';
			},
			slotLabelContent: function (arg) {
				//  console.log('slotLabelContent', arg);

				let templateEl = document.createElement('div');
				templateEl.setAttribute('class', 'slot-label');
				const html = `${dayjs(arg.date).format('hh:mm A')}`;
				templateEl.innerHTML = html;
				return { html };
			},

			dayHeaderContent: function (args) {
				const days = args.date.getDay();
				const d = args.date.getDate();
				const html = `<span class="hd-date">${d} </span><span class="hd-day">${dayNamesShort[days]}
          </span><div class="slot pd-3"> <span class="booked hl">0</span> / <span class="total hl">0</span>
          </div>`;
				return { html };
			},

			eventClassNames: function (args) {
				const { event } = args;
				const {
					eventType,
					bookStatus,
					bookInfo,
					isEmptySlot,
				} = event.extendedProps;
				let classLists = bookStatus
					? bookInfo.StudentUID.toString() === uid.toString()
						? 'booked-slot'
						: 'booked-others-slot'
					: 'available-slot';
				classLists += eventType === 1 ? ' hot-slot ' : '';
				classLists += isEmptySlot ? ' empty-slot' : '';
				return classLists;
			},
			eventContent: function (args) {
				let templateEl = document.createElement('div');
				const { event, isPast, isStart } = args;
				const {
					bookInfo,
					bookStatus,
					isEmptySlot,
					title,
					BookingID,
				} = event.extendedProps;
				let minutesTilStart = getDifferentMinBetweenTime(
					new Date(),
					args.event._instance.range.start,
				);
				const html = `${
					!isEmptySlot
						? `
    <div class="inner-book-wrap ">
    <div class="inner-content"> ${
			bookStatus
				? `
      <span class="label-book booked">
      <i class="fas ${isPast ? 'fa-check' : 'fa-user-graduate'}"></i> ${
						isPast ? 'FINISHED' : 'BOOKED'
				  }</span>
      ${
				minutesTilStart > 30 && bookInfo.StudentUID.toString() == uid.toString()
					? `
        <a href="javascript:;" class="fix-btn cancel-schedule"
        data-toggle="modal"
        data-target="#md-cancel-schedule"
        data-bookingID="${BookingID}"
        data-id="${event.id}"
        data-title="${bookInfo.LessonName}"
        data-start="${event.start}"
        data-end="${event.end}">Cancel</a>
        `
					: ''
			}`
				: ` <i class="fas fa-copyright"></i><span class="label-book">AVAILABLE</span>`
		}
      ${
				!bookStatus && minutesTilStart > 30
					? `<a href="javascript:;" class="fix-btn book-schedule"
          data-toggle="modal"
          data-target="#md-book-schedule"
          data-id="${event.id}"
          data-title="${event._def.extendedProps.courseName}"
          data-start="${event.start}"
          data-end="${event.end}"}>Book</a>`
					: ''
			}
        </div>
        </div>`
						: ''
				}`;
				templateEl.innerHTML = html;
				return { domNodes: [templateEl] };
			},

			eventClick: eventClick,
			eventDidMount: eventDidMount,
			nowIndicatorDidMount: function (args) {
				//console.log("nowIndicatorDidMount", args);
			},
			//events: eventList,
		});

		calendar.render();

		if ($('.fc-toolbar-chunk:first-child').html() == '') {
			$('.fc-toolbar-chunk:first-child').append(
				`<div class="custom-control custom-checkbox" id="student-toggle">
    <input type="checkbox" class="custom-control-input" id="student-toggle-checkbox">
    <label class="custom-control-label" for="student-toggle-checkbox">Chỉ hiển thị lịch đã book</label>
    </div>`,
			);
		}

		$('body').on('click', '.book-schedule', function (e) {
			e.preventDefault();
			const StudyTimeID = this.getAttribute('data-id');
			const LessionName = this.getAttribute('data-title');
			const date = dayjs(this.getAttribute('data-start')).format('DD/MM/YYYY');
			const start = dayjs(this.getAttribute('data-start')).format('HH:mm A');
			const end = dayjs(this.getAttribute('data-end')).format('HH:mm A');
			bookLesson(StudyTimeID, LessionName, date, start, end);
		});

		$('body').on('click', '.cancel-schedule', function (e) {
			e.preventDefault();
			const BookingID = this.getAttribute('data-bookingID');
			const LessionName = this.getAttribute('data-title');
			const date = dayjs(this.getAttribute('data-start')).format('DD/MM/YYYY');
			const start = dayjs(this.getAttribute('data-start')).format('HH:mm A');
			const end = dayjs(this.getAttribute('data-end')).format('HH:mm A');
			cancelLesson(BookingID, LessionName, date, start, end);
		});

		$toggleCheckbox = $('#student-toggle-checkbox');

		$('body').on('change', $toggleCheckbox, showStudentToggle);

		function showStudentToggle() {
			const value = $toggleCheckbox.prop('checked');
			//const availableEvents = $('.fc-event.available-slot');
			const availableEvents = $('.fc-event:not(.booked-slot)');
			value
				? availableEvents.addClass('hide-event')
				: availableEvents.removeClass('hide-event');
		}
	};

	const getAPI = async (params, callback) => {
		setLoading(true);
		const res = await getScheduleByTeacherUID(params);
		if (res.Code === 1) {
			const newEvents = res.Data.map((event) => {
				return {
					...event,
					id: event.StudyTimeID,
					title: event.title || '',
					start: new Date(event.Start),
					end: new Date(event.End),
					eventType: event.eventType,
					bookStatus: event.bookStatus,
					bookInfo: event.bookInfo,
					available: event.available,
					isEmptySlot: event.isEmptySlot,
				};
			});
			setEventSource(newEvents);
		}
		!!callback && callback();
		setLoading(false);
	};

	useEffect(() => {
		if (!!calendar) {
			let eventsInstance = calendar.getEventSources();
			eventsInstance[0] && eventsInstance[0].remove();
			calendar.addEventSource(eventSource);
		}
	}, [eventSource]);

	useEffect(() => {
		getAPI({
			TeacherUID,
			Date: dayjs(activeDate).format('DD/MM/YYYY'),
		});
	}, [activeDate]);

	useEffect(() => {
		if (onCancelId !== null) {
			onCancelId === 'fail'
				? cancelToastFail()
				: getAPI(
						{
							TeacherUID,
							Date: dayjs(activeDate).format('DD/MM/YYYY'),
						},
						function () {
							$('#md-cancel-schedule-popup').modal('show');
						},
				  );
		}
	}, [onCancelId]);

	useEffect(() => {
		if (onBookingId !== null)
			getAPI(
				{
					TeacherUID,
					Date: dayjs(activeDate).format('DD/MM/YYYY'),
				},
				!!onBookingId ? bookingToastSuccess : null,
			);
	}, [onBookingId]);

	useEffect(() => {
		if (window) {
			uid = localStorage.getItem('uid') ? localStorage.getItem('uid') : '';
		}
		TeacherUID && calendarInit();
	}, []);

	return (
		<>
			<div className="book__calendar">
				<div className={`${loading ? '' : 'd-none'} overlay`}>
					<div className="lds-ellipsis">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
				<div
					id="js-book-calendar"
					className="calendar-student"
					height="500"
				></div>
			</div>
		</>
	);
};
export default BookingSchedule;
