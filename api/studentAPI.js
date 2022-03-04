import instance, { getAccessToken } from './instanceAPI';
import { appSettings } from '~/config';
import dayjs from 'dayjs';
const path = '/Api/ElearnStudentApi';

export const getLessons = async () => {
	let result;
	try {
		let res = await instance.get(path + '/Dashboard', {
			params: {
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getUpcomingLessons = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/UpcomingLessions', {
			params: {
				UID: params.UID,
				Token: params.Token,
				Page: 1,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

// export const getLessonHistory = async (params) => {
// 	let result;
// 	try {
// 		let res = await instance.get(path + '/GetLessionHistory', {
// 			params: {
// 				UID: params.UID,
// 				FromDate: params.FromDate,
// 				ToDate: params.ToDate,
// 				Page: params.Page,
// 			},
// 		});
// 		result = res.data;
// 	} catch (error) {
// 		return error.message ? error.message : (result = '');
// 	}
// 	return result;
// };

export const GetEvaluationDetail = async (params) => {
	console.log('Params Eva ID: ', params);

	let result;
	try {
		let res = await instance.get(path + '/GetEvaluationDetail', {
			params: {
				UID: params.UID,
				EvaluationID: params.EvaluationID,
				token: params.Token,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getProfile = async () => {
	let result;
	try {
		let res = await instance.get(path + '/GetProfile', {
			params: {
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

// export const GetListTeacher = async (params) => {
// 	let result;
// 	try {
// 		let res = await instance.get(path + '/GetListTeacher', {
// 			params: {
// 				UID: params.UID,
// 				Search: params.Search,
// 				Token: params.Token,
// 				Page: params.Page,
// 			},
// 		});
// 		result = res.data;
// 	} catch (error) {
// 		return error.message ? error.message : (result = '');
// 	}
// 	return result;
// };

export const GetTeacherProfile = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetTeacherProfile', {
			params: {
				UID: params.UID,
				Token: params.Token,
				TeacherID: params.TeacherID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getTeacherInfoProfile = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/teacherGetInfo', {
			params: {
				...params,
				UID: params.UID,
				Token: params.Token,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const GetNotifications = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetNotifications', {
			params: {
				UID: params.UID,
				Token: params.Token,
				page: params.Page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getNotificationDetailAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetNotificationDetail', {
			params: {
				UID: appSettings.UID,
				NotificationID: params.NotificationID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const GetHolidays = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetHolidays', {
			params: {
				UID: params.UID,
				Token: params.Token,
				Page: params.Page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
/* Lịch dạy của giáo viên theo tuần (teacherDetail) */
export const getScheduleByTeacherUID = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/BookingScheduleByTeacherUID', {
			params: {
				UID: appSettings.UID,
				TeacherUID: params.TeacherUID,
				Date: params.Date,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const GetBookingScheduleForStudent = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetBookingScheduleForStudent', {
			params: {
				UID: params.UID,
				fromdate: params.fromdate,
				todate: params.todate,
				Token: params.Token,
				Page: params.Page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const GetBookingCalendarForStudent = async (params) => {
	let result;

	console.log('Params API: ', params);

	try {
		let res = await instance.get(path + '/GetBookingCalendarForStudent', {
			params: {
				TeacherUID: params.TeacherID,
				Start: params.start,
				End: params.end,
				UID: params.UID,
				Token: params.Token,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
/* Lịch dạy của giáo viên theo ngày (bookingLesson) */
export const GetScheduleTeacherAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetScheduleTeacher', {
			params: {
				UID: appSettings.UID,
				TeacherUID: params.TeacherUID,
				Date: params.Date,
				Start: params.Start,
				End: params.End,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const setEventAvailable = async (params, ...ars) => {
	let result;
	try {
		const formdata = new FormData();
		formdata.append('UID', params.UID);
		formdata.append('token', params.token);
		formdata.append('Start', params.start);
		formdata.append('End', params.end);
		formdata.append('pagekageID', params.packageID);
		formdata.append('title', params.title);
		formdata.append('courseID', params.courseID);
		formdata.append('teacherID', params.teacher);
		formdata.append('timeCourse', params.timeCourse);
		console.log('form data', formdata);
		let res = await instance.post(path + '/StudentBooking', formdata, {});
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const StudentCancelBooked = async (params) => {
	console.log('StudentCancelBooked', params);
	let result;
	try {
		const formdata = new FormData();
		formdata.append('bookingID', params.BookingID);
		formdata.append('UID', params.UID);
		formdata.append('Token', params.Token);
		console.log('form data', formdata);
		let res = await instance.post(path + '/StudentCancelBooked', formdata, {});
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}
	return result;
};

// export const getGetListTeacher = async (params) => {
// 	let result;
// 	try {
// 		let res = await instance.get(path + '/GetListTeacher', {
// 			params: {
// 				UID: appSettings.UID,
// 				Nation: params.Nation,
// 				LevelPurpose: params.LevelPurpose,
// 				Gender: params.Gender,
// 				Date: params.Date,
// 				Start: params.Start,
// 				End: params.End,
// 				Search: params.Search,
// 				Page: params.Page,
// 			},
// 		});
// 		result = res.data;
// 	} catch (error) {
// 		return error.message ? error.message : (result = '');
// 	}
// 	return result;
// };

export const ratingLessonAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/RatingLession', {
			params: {
				UID: appSettings.UID,
				BookingID: params.BookingID,
				TeacherUID: params.TeacherUID,
				Rate: params.Rate,
				Evaluation: params.Evaluation,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const requestLessonAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/UpdateSpecialRequest', {
			params: {
				UID: appSettings.UID,
				BookingID: params.BookingID,
				SpecialRequest: params.SpecialRequest,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const bookingLessonAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/Booking', {
			params: {
				UID: appSettings.UID,
				TeacherUID: params.TeacherUID,
				Date: params.Date,
				StudyTimeID: params.StudyTimeID,
				SpecialRequest: params.SpecialRequest,
				DocumentID: params.DocumentID,
				DocumentDetailID: params.DocumentDetailID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getLessonBookAPI = async () => {
	let result;
	try {
		let res = await instance.get(path + '/GetLessonBook', {
			params: {
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const cancelLessonAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/StudentCancelBooking', {
			params: {
				UID: appSettings.UID,
				BookingID: params.BookingID,
				ReasonCancel: params.ReasonCancel,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getFaqAPI = async () => {
	let result;
	try {
		let res = await instance.get(path + '/GetAllFaq', {
			params: {
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const UpdateProfile = async (params, ...ars) => {
	console.log('UpdateProfile', params);
	let result;
	try {
		// const formdata = new FormData();
		// formdata.append('UID', params.UID);
		// formdata.append('BirthDay', params.BirthDay);
		// formdata.append('Introduce', params.Introduce);
		// formdata.append('Country', params.Country);
		// formdata.append('Timezone', params.Timezone);
		// formdata.append('Token', params.Token);
		// formdata.append('BankName', params.BankName);
		// formdata.append('CardHolder', params.CardHolder);
		// formdata.append('AccountNumber', params.AccountNumber);
		// formdata.append('Branch', params.Branch);
		// formdata.append('BankAddress', params.BankAddress);
		// formdata.append('Avatar', params.Avatar);

		// console.log('form data', formdata);
		let fData = new FormData();
		Object.keys(params).map((key) => {
			fData.append(key, params[key]);
		});
		fData.append('Token', localStorage.getItem('token'));

		let res = await instance.post(path + '/UpdateProfile', fData, {});
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getAllStudentReviewAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetAllStudentReview', {
			params: {
				UID: appSettings.UID,
				TeacherUID: params.TeacherUID,
				Page: params.Page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getFeedbackOverviewAPI = async () => {
	let result;
	try {
		let res = await instance.get(path + '/FeedbackOverview', {
			params: {
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const GetListFeedback = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetListFeedback', {
			params: {
				UID: params.UID,
				Token: params.Token,
				Page: 1,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const GetPaymentHistory = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetPaymentHistory', {
			params: {
				UID: params.UID,
				Page: params.Page,
				fromdate: params.fromdate,
				todate: params.todate,
				Token: params.Token,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const GetTimeLimiteCourses = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetTimeLimiteCourses', {
			params: {
				UID: params.UID,
				Page: params.Page,
				Token: params.Token,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const GetPackageHistory = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetPackageHistory', {
			params: {
				Search: params.Search,
				UID: appSettings.UID,
				Token: params.Token,
				Page: params.Page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const GetAttendanceRecord = async (params) => {
	console.log('params nè', params);
	// console.log('params todate', params);
	let result;
	try {
		let res = await instance.get(path + '/GetAttendanceRecord', {
			params: {
				fromdate: params.fromdate,
				todate: params.todate,
				UID: params.UID,
				Token: params.Token,
				Page: params.Page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const studentGetDetailAttendanceRecord = async (params) => {
	let result;

	try {
		let res = await instance.get(path + '/studentGetDetailAttendanceRecord', {
			params: {
				BookingID: params.BookingID,
				UID: params.UID,
				Token: params.Token,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const GetReferral = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetReferral', {
			params: {
				UID: params.UID,
				Token: params.Token,
				Page: params.Page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const getCoursesInfoAPI = async () => {
	let result;
	try {
		let res = await instance.get(path + '/DashboardStudent', {
			params: {
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const LessionHistory = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/LessionHistory', {
			params: {
				UID: params.UID,
				Token: params.Token,
				Page: 1,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
// export const LoadFeeConfirm = async (params) => {
// 	let result;
// 	try {
// 		let res = await instance.get(path + '/LoadFeeConfirm', {
// 			params: {
// 				UID: params.UID,
// 				FeeConfirmID: params.FeeConfirmID,
// 				token: params.token,
// 			},
// 		});
// 		result = res.data;
// 	} catch (error) {
// 		return error.message ? error.message : (result = '');
// 	}
// 	return result;
// };
export const GetEvaluationContent = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetEvaluationContent', {
			params: {
				UID: params.UID,
				token: params.token,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
// export const UpdateProfile = async (params) => {
// 	let result;
// 	try {
// 		let res = await instance.get(path + '/UpdateProfile', {
// 			params: {
// 				UID: params.UID,
// 				Token: params.Token,
// 			},
// 			//Param: int BookingID, int UID ? 0, string Token ? null
// 		});
// 		result = res.data;
// 	} catch (error) {
// 		return error.message ? error.message : (result = '');
// 	}
// 	return result;
// };

export const GetListTeacher = async (params) => {
	let result;

	// console.log('Params trong E-Talk: ', params);

	try {
		let res = await instance.get(path + '/API_LoadTeacher', {
			params: {
				UID: params.UID,
				Token: params.Token,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const GetListTeacherPage = async (params) => {
	let result;

	console.log('Params trong E-Talk: ', params);

	try {
		let res = await instance.get(path + '/GetListTeacher', {
			params: {
				Search: params.Search,
				UID: params.UID,
				Token: params.Token,
				Page: params.Page,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const LoadCourseStudent = async (params) => {
	let result;

	console.log('Params in here: ', params);

	try {
		let res = await instance.get(path + '/LoadCourseStudent', {
			params: {
				UID: params.UID,
				token: params.Token,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const LoadCourseInfo = async (params) => {
	let result;

	// console.log('Params trong E-Talk: ', params);

	try {
		let res = await instance.get(path + '/LoadCourseInfo', {
			params: {
				studentid: params.studentid,
				bookingid: params.bookingid,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const studentLoadDetailNotification = async (params) => {
	let result;

	// console.log('Params trong E-Talk: ', params);

	try {
		let res = await instance.get(path + '/studentLoadDetailNotification', {
			params: {
				ID: params.ID,
				Token: params.Token,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const StudyProcess = async (params) => {
	let result;

	// console.log('Params trong E-Talk: ', params);

	try {
		let res = await instance.get(path + '/StudyProcess', {
			params: {
				UID: params.UID,
				Token: params.Token,
				Page: 1,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const LoadFeeConfirm = async (params) => {
	let result;

	console.log('Params trong E-Talk: ', params);

	try {
		let res = await instance.get(path + '/LoadFeeConfirm', {
			params: {
				UID: params.UID,
				Token: params.Token,
				FeeConfirmID: params.FeeConfirmID,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const addEvaluation = async (params) => {
	console.log('Feed Back', params);

	let result;
	try {
		const formdata = new FormData();
		formdata.append('UID', params.UID);
		formdata.append('token', params.token);
		formdata.append('feedbackID', params.feedbackID);
		formdata.append('internetRate', params.internetRate);
		formdata.append('documentRate', params.documentRate);
		formdata.append('performanceRate', params.performanceRate);
		formdata.append('satisfiedRate', params.satisfiedRate);
		formdata.append('contentRate', params.ContentRate);
		console.log('form data', formdata);
		let res = await instance.post(path + '/EditFeedback', formdata, {});
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const CreateFeeConfirm = async (params) => {
	console.log('Feed Back', params);

	let result;
	try {
		const formdata = new FormData();
		formdata.append('UID', params.UID);
		formdata.append('token', params.Token);
		formdata.append('CourseStudentID', params.CourseStudentID);
		formdata.append('PayerName', params.PayerName);
		formdata.append('RegistedPhone', params.RegistedPhone);
		formdata.append('Amount', params.Amount);
		formdata.append(
			'DayTrading',
			dayjs(params.DayTrading).format('DD/MM/YYYY HH:mm'),
		);
		formdata.append('PaymentType', params.PaymentType);
		formdata.append('ToBank', params.ToBank);
		formdata.append('FromBank', params.FromBank);
		formdata.append('PaymentMethod', params.PaymentMethod);
		console.log('form data', formdata);
		let res = await instance.post(path + '/CreateFeeConfirm', formdata, {});
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const UpdateFeeConfirm = async (params) => {
	console.log('Update', params);

	let result;
	try {
		const formdata = new FormData();
		formdata.append('UID', params.UID);
		formdata.append('token', params.Token);
		formdata.append('FeeConfirmID', params.FeeConfirmID);

		formdata.append('PayerName', params.PayerName);
		formdata.append('RegistedPhone', params.RegistedPhone);
		formdata.append('Amount', params.Amount);
		formdata.append(
			'DayTrading',
			dayjs(params.DayTrading).format('DD/MM/YYYY HH:mm'),
		);
		formdata.append('PaymentType', params.PaymentType);
		formdata.append('ToBank', params.ToBank);
		formdata.append('FromBank', params.FromBank);
		formdata.append('PaymentMethod', params.PaymentMethod);
		console.log('form data', formdata);
		let res = await instance.post(path + '/UpdateFeeConfirm', formdata, {});
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const DeleteFeeConfirm = async (params) => {
	console.log('Delete params', params);

	let result;
	try {
		const formdata = new FormData();
		formdata.append('UID', params.UID);
		formdata.append('token', params.Token);
		formdata.append('FeeConfirmID', params.FeeConfirmID);

		let res = await instance.post(path + '/DeleteFeeConfirm', formdata, {});
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}
	return result;
};
