import instance, { getAccessToken } from './instanceAPI';
import { appSettings } from '~/config';
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
		let res = await instance.get(path + '/GetUpcomingLessions', {
			params: {
				UID: appSettings.UID,
				Page: params.Page,
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
	let result;
	try {
		let res = await instance.get(path + '/GetEvaluationDetail', {
			params: {
				UID: 61215,
				EvaluationID: 7,
				token: '',
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
// 				UID: appSettings.UID,
// 				Nation: params.Nation,
// 				Search: params.Search,
// 				Token: params.Token,
// 				Page: params.Page,
// 				LevelPurpose: params.LevelPurpose,
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
				UID: appSettings.UID,
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
export const GetNotifications = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetNotifications', {
			params: {
				UID: appSettings.UID,
				page: params.page,
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
				UID: appSettings.UID,
				fromdate: params.fromdate,
				todate: params.todate,
				Token: params.Token,
				Page: params.page,
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
	console.log('StudentBooking', params);
	console.log('setEventAvailable', params.start);
	let result;
	try {
		const formdata = new FormData();
		formdata.append('UID', params.UID);
		formdata.append('token', params.token);
		formdata.append('Start', params.start);
		formdata.append('End', params.end);
		formdata.append('pagekageID', params.packageID);
		formdata.append('title', '');
		formdata.append('courseID', params.courseID);
		formdata.append('teacherID', params.teacher);
		console.log('form data', formdata);
		let res = await instance.post(path + '/StudentBooking', formdata, {});
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const StudentCancelBooked = async (params, ...ars) => {
	console.log('StudentCancelBooked', params);
	let result;
	try {
		const formdata = new FormData();
		formdata.append('bookingID', params.BookingID);
		formdata.append('UID', appSettings.UID);
		formdata.append('Token', '');
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

export const updateProfileAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/UpdateProfile', {
			params: {
				UID: appSettings.UID,
				FullName: params.FullName,
				Phone: params.Phone,
				Email: params.Email,
				BirthDay: params.BirthDay,
				Gender: params.Gender,
				Language: params.Language,
				Address: params.Address,
				Target: params.Target,
				SkypeID: params.SkypeID,
				TimezoneID: params.TimeZoneID,
				PersonalPreference: params.PersonalPreference,
				RequestWithTeacher: params.RequestWithTeacher,
				Avatar: params.Avatar,
			},
		});
		result = res.data;
	} catch (error) {
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
				UID: 61215,
				Token: '',
				Page: params.Page,
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
				UID: appSettings.UID,
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
				UID: appSettings.UID,
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
	let result;
	try {
		let res = await instance.get(path + '/GetAttendanceRecord', {
			params: {
				fromdate: params.fromdate,
				todate: params.todate,
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
export const GetReferral = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetReferral', {
			params: {
				fromdate: params.fromdate,
				todate: params.todate,
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
export const LoadFeeConfirm = async () => {
	let result;
	try {
		let res = await instance.get(path + '/LoadFeeConfirm', {
			params: {
				UID: appSettings.UID,
				FeeConfirmID: 8,
				token: '',
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const GetEvaluationContent = async () => {
	let result;
	try {
		let res = await instance.get(path + '/GetEvaluationContent', {
			params: {
				UID: appSettings.UID,
				FeeConfirmID: 8,
				token: '',
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const UpdateProfile = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/UpdateProfile', {
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

export const GetListTeacher = async (params) => {
	let result;

	// console.log('Params trong E-Talk: ', params);

	try {
		let res = await instance.get(path + '/API_LoadTeacher', {
			params: {
				Search: '',
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
