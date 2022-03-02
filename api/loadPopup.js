import instance from './instanceAPI';

const path = '/api/AccountApi/LoadPopup';

export const loadPopup = async () => {
	let result = '';
	try {
		let res = await instance.get(path);
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
