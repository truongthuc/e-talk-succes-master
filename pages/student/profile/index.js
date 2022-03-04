import React, { useState, useEffect, useReducer } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { getProfile, UpdateProfile } from '~/api/studentAPI';
import {
	getListTargetAPI,
	getListLanguageAPI,
	getTimeZoneAPI,
	updatePassAPI,
	UploadFilePost,
} from '~/api/optionAPI';
import { appSettings } from '~/config';

import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { i18n, withTranslation } from '~/i18n';
import { toast } from 'react-toastify';
import 'react-toastify/scss/main.scss';
import { ToastContainer } from 'react-toastify';
import { toastInit, convertDDMMYYYYtoMMDDYYYY } from '~/utils';
import { useAuth } from '~/api/auth.js';

import {
	FETCH_ERROR,
	CHANGE_PASSWORD_SUCCESS,
	FILL_PASSWORD,
	INCORRECT_PASSWORD,
	DIFFERENT_PASSWORD,
	CONFIRM_PASSWORD,
	UPDATE_PROFILE_SUCCESS,
} from '~/components/common/Constant/toast';

import { getStudentLayout } from '~/components/Layout';
import './index.module.scss';
import dayjs from 'dayjs';
import { responsiveFontSizes } from '@material-ui/core';

const schema = Yup.object().shape({
	Address: Yup.string(),
	BirthDay: Yup.date().required('Ngày sinh không được để trống'),
	Language: Yup.string().matches(/[^0]+/g, 'Ngôn ngữ không được để trống'),
	TimeZoneID: Yup.string().matches(/[^0]+/g, 'Múi giờ không được để trống'),
});
// const RenderTimeZoneList = ({ list }) => {
// 	return (
// 		!!list &&
// 		list.length > 0 &&
// 		list.map((item, index) => (
// 			<option key={index} value={item.ID}>
// 				{item.TimeZoneName}
// 			</option>
// 		))
// 	);
// };

const RenderListLanguage = ({ list }) => {
	return (
		!!list &&
		list.length > 0 &&
		list.map((item, index) => (
			<option key={index} value={item.ID}>
				{item.LanguageName}
			</option>
		))
	);
};
const convertTargetNumToString = (listNum, map) => {
	let z = [];
	if (listNum.length > 0) {
		for (let i = 0; i < listNum.length; i++) {
			for (let j = 0; j < map.length; j++) {
				if (map[j].ID == listNum[i]) {
					z.push(map[j].TargetName);
					break;
				}
			}
		}
	}
	return z;
};
const convertTargetStringToNum = (listString, map) => {
	let z = [];
	for (let i = 0; i < listString.length; i++) {
		for (let j = 0; j < map.length; j++) {
			if (listString[i] === map[j].TargetName) {
				z.push(map[j].ID);
				break;
			}
		}
	}
	return z;
};

const StudentProfile = ({ t }) => {
	const { changeDataUser } = useAuth();
	const [profile, setProfile] = useState({});
	const [loadingProfile, setLoadingProfile] = useState(true);
	const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);
	const [listLanguage, setListLanguage] = useState([]);
	const [TimeZoneList, setTimeZoneList] = useState([]);
	const [listTarget, setListTarget] = useState([]);
	const [selectedTarget, setSelectedTarget] = useState(null);
	const [avatar, setAvatar] = useState('');
	const [loadingAvatar, setLoadingAvatar] = useState(false);
	const [countryList, setCountryList] = useState('');
	const [statusUpdate, setStatusUpdate] = useState(false);

	const [action, setAction] = useState(true);
	const [getTimeZone, setTimeZone] = useState();

	const updateProfileToastSuccess = () =>
		toast.success(UPDATE_PROFILE_SUCCESS, toastInit);
	const updateProfileToastFail = () => toast.error(FETCH_ERROR, toastInit);

	const {
		register,
		handleSubmit,
		errors,
		getValues,
		setValue,
		control,
		reset,
	} = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = (resProfile) => {
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		const newProfile = {
			UID: UID,
			Introduce: resProfile.Introduce,
			Country: resProfile.country,
			Timezone: getTimeZone?.timezoneID,
			BankName: resProfile.BankName,
			CardHolder: resProfile.CardHolder,
			AccountNumber: resProfile.AccountNumber,
			Branch: resProfile.Branch,
			BankAddress: resProfile.BankAddress,
			Avatar: avatar,
			BirthDay: dayjs(resProfile.BirthDay).format('DD/MM/YYYY'),
			// BirthDay: resProfile.BirthDay,
		};

		onUpdateProfileAPI(newProfile);
	};

	const onErrors = (err) => {
		console.log(err);
	};

	console.log('PROFILE: ', profile);

	const getAPI = async (params) => {
		try {
			setLoadingProfile(true);
			const resProfile = await getProfile(params);
			if (resProfile.Code === 200) {
				setProfile({
					...resProfile.Data,
					// countryName: returnCountry(
					// 	resProfile.Data.CountryList,
					// 	resProfile.Data.Country,
					// ),
					timezoneName: returnTimezone(
						resProfile.Data.CountryList,
						resProfile.Data.Country,
					),
					BirthDay: dayjs(resProfile.Data.BirthDay, 'DD/MM/YYYY').toDate(),
				});

				setCountryList(resProfile.Data.CountryList);
				setAvatar(resProfile.Data.AvatarThumnail);

				reset({
					...resProfile.Data,
					BirthDay: dayjs(resProfile.Data.BirthDay, 'DD/MM/YYYY').toDate(),
				});
			}
			setLoadingProfile(false);
		} catch {}
	};

	// const getTimeZone = async () => {
	// 	const res = await getProfile();
	// 	if (res.Code === 200 && res.Data.length > 0) {
	// 		setListTimeZone(res.Data);
	// 	}
	// };

	const getLanguage = async () => {
		const res = await getListLanguageAPI();
		if (res.Code === 1 && res.Data.length > 0) {
			setListLanguage(res.Data);
		}
	};

	const startFix = (e) => {
		e.preventDefault();
		setAction(false);
	};

	const onUpdateProfileAPI = async (params) => {
		setLoadingUpdateProfile(true);
		const res = await UpdateProfile(params);
		if (res.Code === 200) {
			updateProfileToastSuccess();
			setStatusUpdate(true);
			setAction(true);
			changeDataUser(
				avatar,
				getTimeZone.timezoneName,
				getTimeZone.timezoneValue,
				'',
			);
		} else {
			updateProfileToastFail();
		}
		setLoadingUpdateProfile(false);
	};

	const renderTarget = (options) => {
		return options.map((item) => item.TargetName);
	};

	const returnCountry = (countryList, id) => {
		let getCountry = '';

		countryList.forEach((item) => {
			if (item.ID === id) {
				getCountry = item.Nation;
			}
		});
		console.log('Name of country: ', getCountry);
		return getCountry;
	};

	const returnTimezone = (countryList, id) => {
		let timezoneID = '';
		let timezoneName = '';

		countryList.forEach((item) => {
			if (item.ID === id) {
				timezoneID = item.TimeZone;
				timezoneName = item.TimeZoneName;
			}
		});

		setTimeZone({
			timezoneID: timezoneID,
			timezoneName: timezoneName,
		});
		return timezoneName;
	};

	// const returnTimezone = (timezoneList, id) => {
	// 	let getTimezone = '';

	// 	timezoneList.forEach((item) => {
	// 		if (item.ID === id) {
	// 			getTimezone = item.TimeZoneName;
	// 		}
	// 	});
	// 	return getTimezone;
	// };

	const handleChange_country = (e) => {
		let countryID = parseInt(e.target.value);
		let timezoneID = null;
		let timezoneName = null;
		let timezoneValue = null;

		countryList.forEach((item) => {
			if (item.ID === countryID) {
				timezoneID = parseInt(item.TimeZone);
				timezoneName = item.TimeZoneName;
				timezoneValue = item.TimeZoneValue;
			}
		});

		setProfile({
			...profile,
			timezoneName: timezoneName,
			Country: countryID,
		});

		setTimeZone({
			timezoneID: timezoneID,
			timezoneName: timezoneName,
			timezoneValue: timezoneValue,
		});
	};

	useEffect(() => {
		setValue('Timezone', getTimeZone?.timezoneID);

		return () => {};
	}, [profile]);

	const handleUploadImage = async (e) => {
		setLoadingAvatar(true);

		let files = e.target.files;

		if (!files) {
			setLoadingAvatar(false);
			return;
		} else {
			const res = await UploadFilePost(files);

			if (res.rs === true) {
				setAvatar(res.g);

				let output = document.getElementById('avatar');
				output.src = URL.createObjectURL(files[0]);
				output.onload = function () {
					URL.revokeObjectURL(output.src);
				};
			}
			setLoadingAvatar(false);
		}
	};
	useEffect(() => {
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		getAPI({
			UID: UID,
			Token: Token,
		});

		$('body').removeClass('show-aside');
		StudentProfile.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);

	useEffect(() => {
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		if (statusUpdate) {
			getAPI({
				UID: UID,
				Token: Token,
			});
			setStatusUpdate(false);
		}
	}, [statusUpdate]);

	return (
		<>
			<h1 className="main-title-page">{t('profile')}</h1>
			<div className="card">
				<div className="card-body">
					<form
						id="form-account-profile"
						className="metronic-form"
						onSubmit={handleSubmit(onSubmit, onErrors)}
					>
						<div className="form-account">
							<div className="row">
								<div className="col-12">
									<div className="form-row align-items-center ">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium ">{t('Avatar')}: </p>
										</div>
										<div className="form-group col-sm-9">
											<div className="student-avatar">
												<div className="upload-container">
													<div
														className={`${
															loadingAvatar ? '' : 'd-none'
														} overlay`}
													>
														<div className="lds-ellipsis">
															<div></div>
															<div></div>
															<div></div>
															<div></div>
														</div>
													</div>
													<label className="upload-avatar">
														<input
															type="file"
															accept="image/*"
															className="upload-box hidden d-none upload-file"
															onChange={handleUploadImage}
														/>
														<img
															id="avatar"
															alt="Avatar"
															src={
																profile?.AvatarThumnail
																	? profile.AvatarThumnail
																	: '/static/img/user.png'
															}
															// onError={(e) => {
															// 	e.target.onerror = null;
															// 	e.target.src =
															// 		'/static/assets/img/default-avatar.png';
															// }}
														/>
													</label>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('student-code')}:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												className="form-control"
												placeholder=""
												name="StudentCode"
												required
												defaultValue={profile.StudentCode}
												ref={register}
												disabled
											/>
										</div>
									</div>
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('phone')}:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												className="form-control"
												placeholder="0123456789"
												name="Phone"
												ref={register}
												defaultValue={profile.Phone}
												disabled
											/>
											{errors.Phone && (
												<span className="text-danger d-block mt-2">
													{errors.Phone.message}
												</span>
											)}
										</div>
									</div>
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('date-of-birth')}:</p>
										</div>
										<div className="form-group col-sm-9">
											<Controller
												control={control}
												defaultValue={profile?.BirthDay}
												name="BirthDay"
												render={({ onChange, value, name }) => (
													<DatePicker
														dateFormat="dd/MM/yyyy"
														className="form-control"
														placeholderText={`Birthday`}
														isClearable={false}
														onChangeRaw={(e) => e.preventDefault()}
														selected={profile.BirthDay}
														name={name}
														showMonthDropdown
														showYearDropdown
														dropdownMode="select"
														onChange={(value) => {
															onChange(value);
															setProfile({
																...profile,
																BirthDay: value,
															});
														}}
													/>
												)}
											/>
											{errors.BirthDay && (
												<span className="text-danger d-block mt-2">
													{errors.BirthDay.message}
												</span>
											)}
										</div>
									</div>
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">Country:</p>
										</div>
										<div className="form-group col-sm-9">
											{!!countryList && countryList.length > 0 && (
												<select
													name="country"
													ref={register}
													value={profile.Country}
													onChange={handleChange_country}
													className="form-control"
												>
													{countryList.map((item) => (
														<option value={item.ID}>{item.Nation}</option>
													))}
												</select>
											)}
											{errors.TimeZoneID && (
												<span className="text-danger d-block mt-2">
													{errors.TimeZoneID.message}
												</span>
											)}

											{errors.Country && (
												<span className="text-danger d-block mt-2">
													{errors.Country.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">
												{t('first-and-last-name')}:
											</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												className="form-control"
												placeholder="Họ và tên"
												ref={register}
												defaultValue={profile.StudentName}
												name="FullName"
												disabled
											/>
											{errors.FullName && (
												<span className="text-danger d-block mt-2">
													{errors.FullName.message}
												</span>
											)}
										</div>
									</div>
									<div className="form-row align-items-center d-none">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">
												{t('first-and-last-name')}:
											</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												className="form-control"
												placeholder="Họ và tên"
												ref={register}
												defaultValue={profile.UID}
												name="FullName"
											/>
											{errors.UID && (
												<span className="text-danger d-block mt-2">
													{errors.UID.message}
												</span>
											)}
										</div>
									</div>
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">Email:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="email"
												className="form-control"
												name="Email"
												ref={register}
												defaultValue={profile.Email}
												placeholder="Ex:example@domain.com"
												disabled
											/>
											{errors.Email && (
												<span className="text-danger d-block mt-2">
													{errors.Email.message}
												</span>
											)}
										</div>
									</div>
									<div className="form-row align-items-center d-none">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">Email:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="email"
												className="form-control"
												name="Avatar"
												ref={register}
												defaultValue={profile.Avatar}
												placeholder="Ex:example@domain.com"
											/>
											{errors.Email && (
												<span className="text-danger d-block mt-2">
													{errors.Avatar.message}
												</span>
											)}
										</div>
									</div>
									{/* <div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('sex')}:</p>
										</div>
										<div className="form-group col-sm-9">
											<select
												className="form-control"
												name="Gender"
												ref={register}
												defaultValue={profile.Gender}
												disabled
											>
												<option value="1">Nam</option>
												<option value="2">Nữ</option>
												<option value="3">Khác</option>
											</select>
										</div>
									</div> */}

									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('Timezone')}:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												className="form-control"
												placeholder="TimeZoneID"
												ref={register}
												defaultValue={profile.timezoneName}
												name="timezoneName"
												disabled
											/>
											{errors.TimeZoneID && (
												<span className="text-danger d-block mt-2">
													{errors.TimeZoneID.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('card-holder')}:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												className="form-control"
												placeholder="CardHolder"
												name="CardHolder"
												ref={register}
												defaultValue={profile.CardHolder}
											/>
											{errors.CardHolder && (
												<span className="text-danger d-block mt-2">
													{errors.CardHolder.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('bankname')}:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												className="form-control"
												placeholder="BankName"
												name="BankName"
												ref={register}
												defaultValue={profile.BankName}
											/>
											{errors.BankName && (
												<span className="text-danger d-block mt-2">
													{errors.BankName.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('bankaddress')}:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												className="form-control"
												placeholder="BankAddress"
												name="BankAddress"
												ref={register}
												defaultValue={profile.BankAddress}
											/>
											{errors.BankAddress && (
												<span className="text-danger d-block mt-2">
													{errors.BankAddress.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('branch')}:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												className="form-control"
												placeholder="Branch"
												name="Branch"
												ref={register}
												defaultValue={profile.Branch}
											/>
											{errors.Branch && (
												<span className="text-danger d-block mt-2">
													{errors.Branch.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('account-number')}:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												className="form-control"
												placeholder="AccountNumber"
												name="AccountNumber"
												ref={register}
												defaultValue={profile.AccountNumber}
											/>
											{errors.AccountNumber && (
												<span className="text-danger d-block mt-2">
													{errors.AccountNumber.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row  align-items-center ">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium ">SkypeID:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												placeholder="SkypeID"
												className="form-control"
												name="SkypeID"
												ref={register}
												defaultValue={profile.SkypeID}
												disabled
											/>
											{errors.SkypeID && (
												<span className="text-danger d-block mt-2">
													{errors.SkypeID.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row  align-items-center ">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium ">{t('register-link')}:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												placeholder="RegisterLink"
												className="form-control"
												name="SRegisterLink"
												ref={register}
												defaultValue={profile.RegisterLink}
											/>
											{errors.RegisterLink && (
												<span className="text-danger d-block mt-2">
													{errors.RegisterLink.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row  align-items-center ">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium ">{t('introduce')}:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												placeholder="Introduce"
												className="form-control"
												name="Introduce"
												ref={register}
												defaultValue={profile.Introduce}
											/>
											{errors.Introduce && (
												<span className="text-danger d-block mt-2">
													{errors.Introduce.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row  align-items-center ">
										<div className="form-group col-sm-3 col-label-fixed"></div>
										<div className="form-group col-sm-9 mg-b-0-f text-center">
											<button
												type="submit"
												disabled={loadingUpdateProfile ? true : ''}
												className="btn btn-primary rounded"
												style={{
													width: loadingUpdateProfile ? '120px' : 'auto',
													color: '#fff',
												}}
											>
												{loadingUpdateProfile ? (
													<i className="fa fa-spinner fa-spin"></i>
												) : (
													'Update'
												)}
											</button>
										</div>
									</div>
									<ToastContainer
										position="top-right"
										autoClose={2000}
										hideProgressBar={false}
										newestOnTop={false}
										closeOnClick
										rtl={false}
										pauseOnFocusLoss
										draggable
										pauseOnHover
									/>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

// StudentProfile.getLayout = getStudentLayout;

// export default StudentProfile;

StudentProfile.getLayout = getStudentLayout;

export default withTranslation('common')(StudentProfile);
