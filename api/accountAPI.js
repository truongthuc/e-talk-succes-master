import instance, { getAccessToken } from './instanceAPI';
import { appSettings } from '~/config';
const path = '/ElearnStudentApi';

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
