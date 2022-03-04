import React, { useState, useEffect, useReducer, useRef } from 'react';
import { getListEventsOfWeek } from '~/api/teacherAPI';

import FullCalendar from './FullCalendar';
import dayjs from 'dayjs';
import lottie from '~/node_modules/lottie-web/build/player/lottie.min.js';
import { i18n, withTranslation } from '~/i18n';
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';

// ================== STYLE MATERIAL ==================

const BootstrapInput = withStyles((theme) => ({
	root: {
		'label + &': {
			marginTop: theme.spacing(0),
		},
	},
	input: {
		borderRadius: 4,
		position: 'relative',
		backgroundColor: theme.palette.background.paper,
		border: '1px solid #ced4da',
		fontSize: 16,
		padding: '10px 26px 10px 12px',
		transition: theme.transitions.create(['border-color', 'box-shadow']),
		// Use the system font instead of the default Roboto font.
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		'&:focus': {
			borderRadius: 4,
			borderColor: '#fa005e3b',
			boxShadow: '0 0 0 0.2rem #fa005e3b',
			background: 'white',
		},
	},
}))(InputBase);

const useStyles = makeStyles((theme) => ({
	formControl: {
		display: 'inline-block',
		verticalAlign: 'middle',
		margin: theme.spacing(1),

		minWidth: 300,

		'&:focus': {
			'&: label': {
				color: 'black',
			},
		},
	},
	textNoti: {
		textAlign: 'center',
		fontSize: '17px',
		fontWeight: 'bold',
		color: '#fa005e',
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
		'&:before': {
			border: '1px solid black',
		},
	},
	rowInfo: {
		display: 'flex',
		alignItems: 'flex-end',
		marginBottom: '20px',
	},
	styleInput: {
		marginTop: '0px',
		opacity: '1',
		top: '50%',
		zIndex: '99999',
		transform: 'translateY(-50%)',
		left: '10px',
		color: '#424242',
		fontSize: '15px',
	},
	titleForm: {
		display: 'inline-block',
		verticalAlign: 'middle',
		marginBottom: '0',
		color: '#fa005e',
		fontWeight: 'bold',
		marginRight: '10px',
		[theme.breakpoints.down('md')]: {
			display: 'none',
		},
	},
	boxSelect: {
		marginLeft: '0px',
		marginBottom: '30px',
		[theme.breakpoints.down('md')]: {
			marginBottom: '0',
		},
	},
}));

//-----------------------------------------------------

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

const BookingCalendar = ({ t }) => {
	const classes = useStyles();
	const [eventSource, setEventSource] = useState(null);
	const [activeDate, setActiveDate] = useState(new Date());
	const [isLoading, setIsLoading] = useState(true);

	const [statusShow, setStatusShow] = useState(0);

	let loadingRef = useRef(true);

	const getEventByWeek = async (obj) => {
		setIsLoading(true);

		var curr = new Date();

		let getMonth = curr.getMonth();
		let getYear = curr.getFullYear();

		let start = new Date(getYear, getMonth - 1, 1);
		let end = new Date(getYear, getMonth + 2, 0);

		start = dayjs(start).format('DD/MM/YYYY');
		end = dayjs(end).format('DD/MM/YYYY');

		try {
			const res = await getListEventsOfWeek({
				start: start,
				end: end,
				UID: obj.UID,
				Token: obj.Token,
			}); // @string date dd/mm/yyyy
			console.log(res);
			if (res.Code === 200 && res.Data.length > 0) {
				const newEvents = res.Data.map((event) => {
					return {
						...event,
						id: event.BookingID,
						title: event.Title || '',
						start: dayjs(event.Start, 'DD/MM/YYYY HH:mm').toDate(),
						end: dayjs(event.End, 'DD/MM/YYYY HH:mm').toDate(),
						eventType: event.eventType,
						bookStatus: event.bookStatus,
						bookInfo: event.bookInfo,
						available: event.available,
						isEmptySlot: event.isEmptySlot,
					};
				});
				setEventSource(newEvents);
			}
		} catch (error) {
			console.log('Goi API khong thanh cong');
		}
		setIsLoading(false);
	};

	const onSubmit = (e) => {
		e.preventDefault();
	};

	// useEffect(() => {
	// 	getEventByWeek({
	// 		UID: 61230,
	// 		start: '01/03/2021',
	// 		end: '08/03/2021',
	// 		Token: '',
	// 	});
	// 	console.log(activeDate);
	// }, [activeDate]);

	const cleanUp = () => {
		loadingRef.current && (loadingRef.current = false);
	};

	useEffect(() => {
		// if (localStorage.getItem('UID')) {
		// 	let UID = localStorage.getItem('UID');
		// 	let Token = localStorage.getItem('token');

		// 	getEventByWeek({
		// 		UID: UID,
		// 		start: '01/03/2021',
		// 		end: '08/03/2021',
		// 		Token: Token,
		// 	});
		// }
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
		}, 500);

		lottie &&
			lottie.loadAnimation({
				container: loadingRef.current, // the dom element that will contain the animation
				renderer: 'svg',
				loop: true,
				autoplay: true,
				path: '/static/img/calendar-loading.json', // the path to the animation json
			});

		BookingCalendar.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
		return cleanUp;
	}, []);

	return (
		<>
			<div className="box-header">
				<div className={classes.rowInfo}>
					<div className={classes.boxSelect}>
						<p className={classes.titleForm}>{t('Show')}</p>
						<FormControl className={`${classes.margin} ${classes.formControl}`}>
							<NativeSelect
								style={{ width: '100%' }}
								id="demo-customized-select-native"
								value={statusShow}
								onChange={({ target: { value } }) => setStatusShow(value)}
								input={<BootstrapInput />}
							>
								<option key={0} value={0}>
									{t('All')}
								</option>
								<option key={1} value={1}>
									{t('Available')}
								</option>
								<option key={2} value={2}>
									{t('Booked')}
								</option>
							</NativeSelect>
						</FormControl>
					</div>
				</div>
				<div className="note-color">
					<div className="container mb-0">
						<div className="row">
							<div className="col-md-7 col-12">
								<h6 className="mb-3">{t('Passed Classes')}</h6>
								<div className="item-note">
									<span className="box-color color-a"></span>
									<span className="text">{t('Student is PRESENT')}</span>
								</div>

								<div className="item-note">
									<span className="box-color color-b"></span>
									<span className="text">{t('Teacher is absent')}</span>
								</div>

								<div className="item-note">
									<span className="box-color color-c"></span>
									<span className="text">
										{t('STUDENT IS ABSENT without notice')}
									</span>
								</div>

								<div className="item-note">
									<span className="box-color color-d"></span>
									<span className="text">
										{t('NO INTERNET/POWER INTERUPTION')}
									</span>
								</div>

								<div className="item-note">
									<span className="box-color color-e"></span>
									<span className="text">
										{t("Teacher've not set up status")}
									</span>
								</div>
							</div>
							<div className="col-md-5 col-12 col-note-2">
								<h6 className="mb-3">{t('Upcoming Classes')}</h6>
								<div className="item-note">
									<span className="box-color color-f"></span>
									<span className="text">{t('Trial class')}</span>
								</div>

								<div className="item-note">
									<span className="box-color color-g"></span>
									<span className="text">{t('Regular Class')}</span>
								</div>

								<div className="item-note">
									<span className="box-color color-h"></span>
									<span className="text">{t('Probably book class')}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="book__calendar" id="js-book-calendar">
				{isLoading ? (
					<div ref={loadingRef} className="loading-lottie"></div>
				) : (
					<FullCalendar
						// data={eventSource}
						isLoading={isLoading}
						statusShow={statusShow}
					/>
				)}
			</div>
			<div className="note-calendar mt-3">
				<h5>{t('Note')}:</h5>
				<p>
					<b>{t('Open available slot')}:</b>{' '}
					{t('Click empty item on the calendar to open the available slot')}
				</p>
				<p>
					<b>{t('Close available slot')}:</b>{' '}
					{t(
						'Hover the available item and click close button to close the available slot',
					)}
				</p>
			</div>
		</>
	);
};

// export default BookingCalendar;

export default withTranslation('common')(BookingCalendar);
