import instance, { getAccessToken } from './instanceAPI';
import { appSettings } from '~/config';
const path = '/Api/AccountApi';

const key = appSettings.key;

export const LoginAPI = async (values) => {
	let result;

	console.log('values: ', values);

	try {
		const formData = new FormData();
		// formData.append('key', key);
		formData.append('username', values.username);
		formData.append('password', values.password);

		console.log('FORM DATA: ', formData);

		let res = await instance.post(path + '/login', formData, {});
		result = res.data;
	} catch (error) {
		console.log('Error: ', error);
		return error.message ? error.message : (result = '');
	}

	return result;
};

export const LogoutAPI = async (UID) => {
	let result;
	try {
		const formData = new FormData();
		formData.append('UID', UID);

		let res = await instance.post(path + '/LogOut', formData, {});
		result = res.data;
	} catch (error) {
		console.log('Error Logout API: ', error);
		return error.message ? error.message : (result = '');
	}

	return result;
};
