import React, { useState, useEffect, useReducer } from 'react';
import { GetScheduleTeacherAPI } from '~/api/studentAPI';
import { toast } from 'react-toastify';
import 'react-toastify/scss/main.scss';
import { toastInit } from '~/utils';
import { BOOKING_SUCCESS } from '~components/common/Constant/toast';
import dayjs from 'dayjs';
const ListSchedule = ({
	learnTime,
	TeacherUID,
	TeacherIMG,
	TeacherName,
	Rate,
	date,
	Start,
	End,
	handleBooking,
	onBookTeacherUID,
	onBookStudyTimeID,
	onBookDate,
}) => {
	const [scheduleList, setSchedule] = useState([]);
	const [loading, setLoading] = useState(false);
	const bookingToast = () => toast.success(BOOKING_SUCCESS, toastInit);

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
		handleBooking(
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
		);
	};

	const getAPI = async (params) => {
		setLoading(true);
		const res = await GetScheduleTeacherAPI(params);
		if (res.Code === 1) {
			setSchedule(res.Data);
		}
		setLoading(false);
	};
	useEffect(() => {
		getAPI({
			TeacherUID,
			Date: date,
		});
	}, [date]);

	useEffect(() => {
		let newSchedule = [...scheduleList];

		let index = newSchedule.findIndex(
			(i) =>
				i.StudyTimeID === onBookStudyTimeID &&
				i.TeacherUID === onBookTeacherUID &&
				dayjs(i.Start).format('DD/MM/YYYY') === onBookDate,
		);

		if (index !== -1) {
			newSchedule[index].bookStatus = true;
			setSchedule(newSchedule);
			bookingToast();
		}
	}, [onBookTeacherUID, onBookStudyTimeID, onBookDate]);

	return loading ? (
		<div className="overlay">
			<div className="lds-ellipsis">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	) : (
		<>
			{!!scheduleList &&
				!!learnTime &&
				learnTime.length > 0 &&
				learnTime.map((item, index) => {
					let bookedFilter = scheduleList.filter((item) => item.bookStatus);
					let availableFilter = scheduleList.filter(
						(item) => !item.bookStatus && item.available,
					);

					let status = '';
					let StudyTimeID = '';
					let BookingID = '';
					let LessionName = '';
					let start = '';
					let end = '';
					bookedFilter.map((x) => {
						if (
							new Date(x.Start).getHours() === parseInt(item.split(':')[0]) &&
							new Date(x.Start).getMinutes() === parseInt(item.split(':')[1])
						)
							status = 'registed';
					});
					availableFilter.map((x) => {
						if (
							new Date(x.Start).getHours() === parseInt(item.split(':')[0]) &&
							new Date(x.Start).getMinutes() === parseInt(item.split(':')[1])
						) {
							start = new Date(x.Start);
							end = new Date(x.End);
							StudyTimeID = x.StudyTimeID;
							BookingID = x.BookingID;
							LessionName = x.title;
							status = 'available';
						}
					});
					return (
						<li className={status} key={index}>
							<span className="time">{item}</span>
							<span className="status">
								{status === 'available' ? (
									<button
										className="open-lessionwish"
										data-toggle="modal"
										data-target="#md-book-schedule"
										onClick={() =>
											onHandleBooking(
												StudyTimeID,
												LessionName,
												TeacherUID,
												TeacherIMG,
												TeacherName,
												Rate,
												dayjs(start).format('DD/MM/YYYY'),
												dayjs(start).format('HH:mm A'),
												dayjs(end).format('HH:mm A'),
												BookingID,
											)
										}
									>
										Đang mở
									</button>
								) : status === 'registed' ? (
									'Đã đăng ký'
								) : (
									''
								)}
							</span>
						</li>
					);
				})}
		</>
	);
};

export default ListSchedule;
