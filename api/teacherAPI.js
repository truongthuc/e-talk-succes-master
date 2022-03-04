import instance, { getAccessToken } from './instanceAPI';
import { appSettings } from '~/config';
import dayjs from 'dayjs';
const path = '/Api/ElearnTeacherApi';

export const teacherDashboard = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/teacherDashboard', {
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

export const teacherMonthlyStatistics = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/teacherMonthlyStatistics', {
			params: {
				UID: params.UID,
				token: params.token,
				typeSearch: params.typeSearch,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const teacherAllClass = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/teacherAllClass', {
			params: {
				UID: params.UID,
				// token: params.token,
				status: params.status,
				fromdate: '',
				todate: '',
				page: params.page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const teacherGetStudentInfo = async (params = {}) => {
	console.log('Params detail: ', params);

	let result;
	try {
		let res = await instance.get(path + '/teacherGetStudentInfo', {
			params: {
				UID: params.UID,
				studentUID: params.studentUID,
				Token: params.Token,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const teacherAttendanceRecord = async (params = {}) => {
	console.log('Params trong API: ', params);
	let result;
	try {
		let res = await instance.get(path + '/teacherAttendanceRecord', {
			params: {
				studentid: params.studentid,
				fromdate: params.fromdate,
				todate: params.todate,
				UID: params.UID,
				Token: params.Token,
				page: params.page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const teacherStudentFeedback = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/teacherStudentFeedback', {
			params: {
				sort: 0,
				page: 1,
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
export const teacherEvaluatedClasses = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/teacherEvaluatedClasses', {
			params: {
				page: params.page,
				UID: params.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const teacherUpcomingLessons = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/teacherUpcomingLessons', {
			params: {
				page: params.page || 1,
				UID: localStorage.getItem('UID'),
				Token: localStorage.getItem('token'),
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const teacherEndOfPackage = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/teacherEndOfPackage', {
			params: {
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
export const teacherTicketSupport = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/teacherTicketSupport', {
			params: {
				fromdate: '',
				todate: '',
				UID: 61230,
				Token: '',
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const teacherMissingFeedback = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/teacherMissingFeedback', {
			params: {
				UID: params.UID,
				page: params.Page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const teacherGetHolidays = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/teacherGetHolidays', {
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
export const getListEventsOfWeek = async (params) => {
	let result;

	console.log('Date trong Teacher API: ', params);

	try {
		let res = await instance.get(path + '/teacherLoadTeachingSchedule', {
			params: {
				sort: params.sort,
				UID: params.UID,
				start: params.start,
				end: params.end,
				Token: params.Token,
			},
			// params: {
			// 	UID: 61230,
			// 	start: params.start,
			// 	end: params.end,
			// 	Token: '',
			// },
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const teacherFakeDataEvaluation = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/teacherFakeDataEvaluation', {
			params: {
				UID: 61215,
				courseID: 33,
				Token: '',
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const getListCategoryLibrary = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetLibrary', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getListLibraryNew = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetLibraryNew', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getLibraryByCategoryID = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetLibraryDetail', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getAllClass = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetAllClass', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getUpcomingClass = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetUpcomingClass', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getMissingFeedback = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetListEvaluation', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getFeedback = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetListFeedback', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const cancelSchedule = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/CancelSchedule', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getScheduleLog = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetScheduleLog', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getBookingRequest = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetBookingRequest', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

// Param: int StudentUID, int UID ? 0, string Token ? null
export const getStudentByUID = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetByStudentUID', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

// Params: string Date ? null, int UID ? 0, string Token ? null
export const getPaymentInfo = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetPayment', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

// Params: string Date ? null, int UID ? 0, string Token ? null
export const getPaymentHistory = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetHistoryPayment', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

// Params:  int ElearnBookingID, string Pronunciation, string Vacabulary, string Grammar, string SentenceDevelopmentAndSpeak, string Note, int UID ? 0, string Token ? null
export const addEvaluation = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/AddEvaluation', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getTeacherInfo = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetTeacherProfile', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

// export const getListEventsOfWeek = async (params) => {
// 	let result;
// 	try {
// 		let res = await instance.get(path + '/BookingSchedule', {
// 			params: {
// 				...params,
// 				UID: appSettings.UID,
// 			},
// 		});
// 		result = res.data;
// 	} catch (error) {
// 		return error.message ? error.message : (result = '');
// 	}
// 	return result;
// };

export const getMonthReport = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetStatistics', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getOverviewFeedback = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/EvaluationOverview', {
			params: {
				...params,
				UID: appSettings.UID,
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
				UID: localStorage.getItem('UID'),
				Token: localStorage.getItem('token'),
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const updateTeacherInfoProfile = async (params = {}) => {
	console.log('updateTeacherInfoProfile', params);
	let result;
	try {
		let fData = new FormData();
		Object.keys(params).map((key) => {
			fData.append(key, params[key]);
		});
		fData.append('Token', localStorage.getItem('token'));
		let res = await instance.post(path + '/teacherUpdateInfo', fData, {
			params: {
				// ...params,
				// UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getTeacherIntroduce = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/LoadSummary', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const updateTeacherIntroduce = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/UpdateSummary', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getTeacherExperience = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/LoadCurriculum', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const updateTeacherExperience = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/UpdateTeachingExperience', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getListSupport = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetListSupport', {
			params: {
				...params,
				UID: appSettings.UID,
				//Param: int UID ? 0, string Token ? null, int Status ? 0,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getOverviewSupport = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/SupportOverview', {
			params: {
				...params,
				UID: appSettings.UID,
				//Param: int UID ? 0, string Token ? null
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getTicketDetail = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetSupportDetail', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param:int ID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const addSupportTicket = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/AddSupport', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param:string SupportTitle, string SupportContent, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getEvaluation = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetEvaluation', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param:string SupportTitle, string SupportContent, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const cancelTicketSupport = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/CancelTicketSupport', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param:string SupportTitle, string SupportContent, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getBookingInfo = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetBookingInfo', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const addScheduleLog = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/AddScheduleLog', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getBankInfo = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetBankInfo', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const updateBankInfo = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/UpdateBank', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const updateEvaluation = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/UpdateEvaluation', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const teacherSaveEvaluation = async (values) => {
	let result;

	console.log('Values ben api: ', values);
	try {
		const formdata = new FormData();
		formdata.append('UID', values.UID);
		formdata.append('Token', values.Token);
		formdata.append('CourseStudentID', values.CourseStudentID);
		formdata.append('GeneralEvaluation', values.GeneralEvaluation);

		let res = await instance.post(
			path + '/teacherSaveEvaluation',
			formdata,
			{},
		);
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}

	return result;
};
export const teacherUpdateEvaluation = async (values) => {
	let result;

	console.log('Values ben api:================================= ', values);
	try {
		const formdata = new FormData();
		formdata.append('UID', values.UID);
		formdata.append('Token', values.Token);
		formdata.append('EvaluationID', values.EvaluationID);
		formdata.append('GeneralEvaluation', values.GeneralEvaluation);

		console.log('form data', formdata);
		let res = await instance.post(
			path + '/teacherUpdateEvaluation',
			formdata,
			{},
		);
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}

	return result;
};
export const setEventAvailable = async (params, ...ars) => {
	console.log('setEventAvailable', params);
	let result;
	try {
		const formdata = new FormData();
		formdata.append('UID', params.UID);
		formdata.append('Token', params.token);
		formdata.append('Start', params.start);
		formdata.append('End', params.end);
		console.log('form data', formdata);
		let res = await instance.post(
			path + '/teacherSaveFreeSchedule',
			formdata,
			{},
		);
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}
	return result;
};
export const setEventClose = async (params, ...ars) => {
	console.log('setEventClose', params);
	let result;
	try {
		const formdata = new FormData();
		formdata.append('UID', params.UID);
		formdata.append('Token', params.token);
		formdata.append('OpenID', params.OpenID);
		let res = await instance.post(
			path + '/teacherCancelFreeSchedule',
			formdata,
			{},
		);
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const cancelSlotByDate = async (obj) => {
	console.log('obj', obj);
	let result;
	try {
		const formdata = new FormData();
		formdata.append('openDate', obj.openDate);
		formdata.append('openStart', obj.openStart);
		formdata.append('openEnd', obj.openEnd);
		formdata.append('UID', 61230);
		formdata.append('Token', '');
		let res = await instance.post(
			path + '/teacherCancelSlotByDate',
			formdata,
			{},
		);
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const teacherLoadEvaluation = async (params = {}) => {
	console.log('Params load eva: ', params);

	let result;
	try {
		let res = await instance.get(path + '/teacherLoadEvaluation', {
			params: {
				evaluationID: params.EvaluationID,
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

export const teacherUpdateTeachingSchedule = async (obj) => {
	console.log('obj update', obj);
	let result;
	try {
		const formdata = new FormData();
		formdata.append('UID', obj.UID);
		formdata.append('Token', obj.Token);
		formdata.append('BookingID', obj.BookingID);
		formdata.append('ClassStatus', obj.ClassStatus);
		formdata.append('Remark', obj.Remark);
		formdata.append('Homework', obj.Homework);

		let res = await instance.post(
			path + '/teacherUpdateTeachingSchedule',
			formdata,
			{},
		);
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const teacherDeleteEvaluation = async (values) => {
	let result;

	console.log('Values ben api: ', values);
	try {
		const formdata = new FormData();
		formdata.append('UID', values.UID);
		formdata.append('Token', values.Token);
		formdata.append('EvaluationID', values.EvaluationID);
		let res = await instance.post(
			path + '/teacherDeleteEvaluation',
			formdata,
			{},
		);
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}

	return result;
};

export const UploadFileEvaluation = async (values) => {
	let result;

	console.log('Values File ben api: ', values);
	try {
		const formdata = new FormData();
		formdata.append('file', values);

		let res = await instance.post(path + '/UploadFileEvaluation', formdata, {});
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}

	return result;
};

export const GetDetailAttendanceRecord = async (params) => {
	let result;

	try {
		let res = await instance.get(path + '/GetDetailAttendanceRecord', {
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

export const ForgotPassword = async (values) => {
	let result;

	console.log('Values File ben api: ', values);
	try {
		const formdata = new FormData();
		formdata.append('email', values);

		let res = await instance.post(
			'/Api/AccountApi' + '/ForgotPassword',
			formdata,
			{},
		);
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}

	return result;
};
