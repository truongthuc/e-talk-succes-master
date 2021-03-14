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
import { toastInit, convertDDMMYYYYtoMMDDYYYY } from '~/utils';

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
import Router, { useRouter } from 'next/router';

const schema = Yup.object().shape({
	Address: Yup.string(),
	BirthDay: Yup.date().required('Ngày sinh không được để trống'),
	Language: Yup.string().matches(/[^0]+/g, 'Ngôn ngữ không được để trống'),
	TimeZoneID: Yup.string().matches(/[^0]+/g, 'Múi giờ không được để trống'),
});
const RenderTimeZoneList = ({ list }) => {
	return (
		!!list &&
		list.length > 0 &&
		list.map((item, index) => (
			<option key={index} value={item.ID}>
				{item.TimeZoneName}
			</option>
		))
	);
};
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
	const router = useRouter();
	const [profile, setProfile] = useState({});
	const [loadingProfile, setLoadingProfile] = useState(true);
	const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);
	const [listLanguage, setListLanguage] = useState([]);
	const [TimeZoneList, setTimeZoneList] = useState([]);
	const [listTarget, setListTarget] = useState([]);
	const [selectedTarget, setSelectedTarget] = useState(null);
	const [avatar, setAvatar] = useState('');
	const [loadingAvatar, setLoadingAvatar] = useState(false);

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
		// console.log(resProfile);
		// const array = resProfile.SelectTarget.split(',');
		// let z = convertTargetStringToNum(array, listTarget);

		const newProfile = {
			...resProfile,
			Avatar: avatar,
			BirthDay: dayjs(resProfile.BirthDay).format('DD/MM/YYYY'),
			// Target: z.join(','),
		};
		console.log(newProfile);
		onUpdateProfileAPI(newProfile);
	};

	const onErrors = (err) => {
		console.log(err);
	};

	const getAPI = async () => {
		try {
			setLoadingProfile(true);
			const resProfile = await getProfile();
			if (resProfile.Code === 200) {
				setProfile({
					...resProfile.Data,
					BirthDay: new Date(resProfile.Data.BirthDay),
				});
				reset({
					...resProfile.Data,
					BirthDay: new Date(resProfile.Data.BirthDay),
				});
			}
			setLoadingProfile(false);

			const resTarget = await getListTargetAPI();
			if (resTarget.Code === 1 && resTarget.Data.length > 0) {
				setListTarget(resTarget.Data);
			}

			let arrayProfile = [];

			if (resProfile.Data && resProfile.Data.Target) {
				arrayProfile = resProfile.Data.Target.split(',');
			}

			let z = convertTargetNumToString(arrayProfile, resTarget.Data);
			setSelectedTarget(z);
		} catch {}
	};
	// const getTimeZone = async () => {
	// 	const res = await GetProfile();
	// 	if (res.Code === 1 && res.Data.length > 0) {
	// 		setListTimeZone(res.Data);
	// 	}
	// };
	const getLanguage = async () => {
		const res = await getListLanguageAPI();
		if (res.Code === 1 && res.Data.length > 0) {
			setListLanguage(res.Data);
		}
	};
	const onUpdateProfileAPI = async (params) => {
		setLoadingUpdateProfile(true);
		const res = await UpdateProfile(params);
		if (res.Code === 200) {
			updateProfileToastSuccess();
		} else {
			updateProfileToastFail();
		}
		setLoadingUpdateProfile(false);
	};
	const renderTarget = (options) => {
		return options.map((item) => item.TargetName);
	};
	const handleUploadImage = async (e) => {
		setLoadingAvatar(true);
		console.log('hinh ne', files);
		let files = e.target.files;
		if (!files) {
			setLoadingAvatar(false);
			return;
		} else {
			const res = await UploadFilePost(files);
			if (res.Code === 200) {
				//Upload Avatar success
				const avatar = res.Data[0].UrlIMG;
				setAvatar(avatar);
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
		if (!localStorage.getItem('isLogin')) {
			router.push({
				pathname: '/',
			});
		} else {
			let RoleID = parseInt(localStorage.getItem('RoleID'));
			if (RoleID !== 5) {
				localStorage.clear();
				router.push({
					pathname: '/',
				});
			}
		}
		getAPI();
		// getTimeZone();
		getLanguage();
	}, []);

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
											<p className="mg-b-0 tx-medium ">{t('avarta')}: </p>
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
																profile.AvatarThumnail
																	? profile.AvatarThumnail
																	: '/static/assets/img/default-avatar.png'
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
												disabled={true}
												name="StudentCode"
												required
												defaultValue={profile.StudentCode}
												ref={register}
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
												defaultValue={profile.BirthDay}
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
														selected={value}
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
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('sex')}:</p>
										</div>
										<div className="form-group col-sm-9">
											<select
												className="form-control"
												name="Gender"
												ref={register}
												defaultValue={profile.Gender}
											>
												<option value="1">Nam</option>
												<option value="2">Nữ</option>
												<option value="3">Khác</option>
											</select>
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
												disabled
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
												disabled
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
												name="BankAddresse"
												ref={register}
												defaultValue={profile.BankAddress}
												disabled
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
												disabled
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
												disabled
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
												disabled
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
										<div className="form-group col-sm-9 mg-b-0-f">
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
													'Lưu Thông Tin'
												)}
											</button>
										</div>
									</div>
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
StudentProfile.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});

export default withTranslation('common')(StudentProfile);
