import instance, { getAccessToken } from './instanceAPI';
import { appSettings } from '~/config';
const path = '/ElearnAdmin';
const path_Account = '/Api/AccountApi';
const UID = appSettings.UID;
export const cancelLesson = async (params) => {
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
export const getListLevelPurpose = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetListLevelPurpose', {
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

export const getLevelPurposeOptions = async () => {
	let result;
	try {
		let res = await instance.get(path + '/GetListLevelPurpose', {
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

export const updatePassAPI = async (obj) => {
	let result;

	console.log('OBJ: ', obj);

	try {
		const formdata = new FormData();
		formdata.append('UID', localStorage.getItem('UID'));
		formdata.append('token', localStorage.getItem('token'));
		formdata.append('oldPass', obj.OldPass);
		formdata.append('newPass', obj.NewPass);

		console.log('Form Data: ', formdata);
		let res = await instance.post(
			path_Account + '/ChangePassword',
			formdata,
			{},
		);
		console.log('RESSSS: ', res);
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getTimeZoneAPI = async () => {
	let result;
	try {
		let res = await instance.get(path + '/GetTimeZone', {
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

export const UploadFilePost = async (params) => {
	let result;
	console.log('log params', params);
	try {
		let formData = new FormData();
		if (!!params && params.length > 0) {
			[...params].map((image) => {
				formData.append('file', image);
			});
		}
		let res = await instance.post(path + '/UploadFilePost', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			params: {
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		result = error.message ? error.message : '';
	}
	return result;
};

export const getListTargetAPI = async () => {
	let result;
	try {
		let res = await instance.get(path + '/ListTarget', {
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

export const getListLanguageAPI = async () => {
	let result;
	try {
		let res = await instance.get(path + '/ListLangluage', {
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

export const getTimeZone = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetTimeZone', {
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

export const getEnglishProficiencyOptions = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/ListEnglishProficiency', {
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

export const getLevelOfEducationOptions = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/ListLevelOfEducation', {
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

export const getTesolCertificateOptions = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/ListTesolCertificate', {
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

export const getTeylCertificateOptions = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/ListTeylCertificate', {
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

export const getOtherCertificateOptions = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/ListOtherCertificate', {
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

export const getTeachingExperienceOptions = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/ListTeachingExperience', {
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

export const getLearningTargetOptions = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/ListTarget', {
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

export const getFinishedOptions = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/ListFinishType', {
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

export const getStateOptions = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/ListState', {
			params: {
				UID: appSettings.UID,
				...params,
				//Param: int LocationID, int UID ? 0, string Token ? null
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getLocationOptions = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/ListLocation', {
			params: {
				UID: appSettings.UID,
				...params,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
