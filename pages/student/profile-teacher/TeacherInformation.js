import React, {
	useState,
	useEffect,
	useReducer,
	useRef,
	useContext,
} from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import { useForm, Controller } from 'react-hook-form';
import { CardMedia } from '@material-ui/core';
import { appSettings } from '~/config';
import Select from 'react-select';
import {
	getTeacherInfoProfile,
	updateTeacherInfoProfile,
} from '~/api/teacherAPI';
import { toast } from 'react-toastify';
import { Context as ProfileContext } from '~/context/ProfileContext';
import { UploadFilePost } from '~/api/optionAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { i18n, withTranslation } from '~/i18n';
import { makeStyles } from '@material-ui/core/styles';

const Schema = Yup.object().shape({
	fullName: Yup.string().required('Full name is required'),
	skypeId: Yup.string().required('Skype id is required'),
	phoneNumber: Yup.number()
		.typeError('Invalid phone number')
		.integer('Invalid phone number')
		.required('Phone is required'),
	// levelOfEducation: Yup.mixed()
	// 	.nullable(false)
	// 	.required('Level of education is required'),
	// englishProficien: Yup.mixed()
	// 	.nullable(false)
	// 	.required('Level of education is required'),
	location: Yup.mixed().nullable(false).required('location is required'),
	// levelOfPurpose: Yup.mixed()
	// 	.nullable(false)
	// 	.required('Level of purpose must be at least one option'),
});

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		borderRadius: '10px',
		width: '68%',
		height: '98%',
		overflowY: 'auto',
	},
	col: {
		width: '50%',
		padding: '0 10px',
		[theme.breakpoints.down('sm')]: {
			width: '100%',
		},
	},
	rowForm: {
		display: 'flex',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
	},
}));

const optionState = {
	locationOptions: [],
	// englishProficienOptions: [],
	// levelOfPurposeOptions: [],
	levelOfEducationOptions: [],
	timeZoneOptions: [],
};

const initialState = {
	avatar:
		'https://theamericanschool.edu.vn/wp-content/uploads/2020/01/Ms-Hong-Nguyen-Vietnamese.jpg',
	fullName: 'Truong Van Lam',
	skypeId: 'mona.media',
	phoneNumber: '0886706289',
	location: null,
	// levelOfPurpose: null,
	levelOfEducation: null,
	email: 'vietdat106@gmail.com',
	timeZone: null,
	schoolName: 'Bach Khoa University',
	major: '',
	// englishProficien: null,
	loadOption: false,
};

const reducer = (prevState, { type, payload }) => {
	// console.log('Log payload', payload);
	switch (type) {
		case 'UPDATE_STATE':
			return { ...prevState, [payload.key]: payload.value };
			break;
		default:
			return prevState;
			break;
	}
};
const ProfileVideo = React.forwardRef((props, ref) => {
	const [isLoading, setIsLoading] = useState(false);
	// const [myAvatar, setAvatar] = useState();

	const inputFileRef = useRef(true);
	const handleUploadImage = async () => {
		setIsLoading(true);
		try {
			const input = inputFileRef.current;
			if (input.files && input.files[0]) {
				const res = await UploadFilePost(input.files);
				if (!!res && res?.rs) {
					props.updateVideo('linkVideoIntroduce', res?.g ?? '');
				}
			}
		} catch (error) {
			console.log(error?.message ?? 'Lỗi gọi api');
		}
		setIsLoading(false);
	};
	const checkValidURL = () => {
		try {
			const urltmp = props?.getValues('linkVideoIntroduce');
			if (!!urltmp) {
				return urltmp.toString().trim().replace(/\//g, '').length > 0;
			} else {
				return false;
			}
		} catch (error) {
			console.log('checkValidURL error:', error);
		}
		return false;
	};
	return (
		<div className="uploadvideo-wrap">
			<div
				className={`teacher-video ${
					isLoading ? 'loading-style' : ''
				} mg-x-auto`}
			>
				<div className="upload-container ">
					{/* <div className="lds-ellipsis">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div> */}
					{/* <label
						className={`upload-avatar ${checkValidURL() ? 'renewVideo' : ''} `}
					>
						<input
							ref={inputFileRef}
							type="file"
							accept="video/*"
							className="upload-box hidden d-none upload-file"
							onChange={handleUploadImage}
						/>
						{checkValidURL() && <span className="btn">Upload video khác</span>}
						{!checkValidURL() && (
							<span className="calltoupload">
								Chưa có video giới thiệu bấm vào đây để upload video
							</span>
						)}
					</label> */}
					{checkValidURL() && (
						<CardMedia
							component="iframe"
							height="320"
							image={
								checkValidURL() ? props?.getValues('linkVideoIntroduce') : ''
							}
							src={
								checkValidURL() ? props?.getValues('linkVideoIntroduce') : ''
							}
							title="linkVideoIntroduce"
							autoPlay={false}
						/>
					)}
				</div>
			</div>
		</div>
	);
});
const ProfileAvatar = React.forwardRef((props, ref) => {
	const [isLoading, setIsLoading] = useState(false);
	// const [myAvatar, setAvatar] = useState();

	const inputFileRef = useRef(true);
	const handleUploadImage = async () => {
		setIsLoading(true);
		try {
			const input = inputFileRef.current;
			if (input.files && input.files[0]) {
				const res = await UploadFilePost(input.files);
				if (!!res && res?.rs) {
					props.updateAvatar('avatar', res?.g ?? '');
				}
			}
		} catch (error) {
			console.log(error?.message ?? 'Lỗi gọi api');
		}
		setIsLoading(false);
	};
	const checkValidURL = () => {
		const urltmp = props?.getValues('avatar');
		if (!!urltmp) {
			return urltmp.toString().trim().replace(/\//g, '').length > 0;
		} else {
			return false;
		}
	};
	return (
		<>
			<div
				className={`teacher-avatar ${
					isLoading ? 'loading-style' : ''
				} mg-x-auto`}
			>
				{/* <div className="lds-ellipsis">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div> */}
				<div className="upload-container wd-100 ht-100">
					<label className="upload-avatar">
						{/* <input
							ref={inputFileRef}
							type="file"
							accept="image/*"
							className="upload-box hidden d-none upload-file"
							onChange={handleUploadImage}
						/> */}
						<img
							src={
								checkValidURL()
									? props?.getValues('avatar')
									: '/static/assets/img/default-avatar.png'
							}
							alt="avatar"
							className="image-holder  object-fit"
						/>
					</label>
				</div>
			</div>
		</>
	);
});

function TeacherInformation({ t, dataTeacher }) {
	console.log('Scroll: ', scroll);

	console.log('Data Teacher trong đây: ', dataTeacher);

	const classes = useStyles();
	const [state, dispatch] = useReducer(reducer, optionState);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [optionLoaded, setOptionLoaded] = useState(false);
	const { state: profileState, updateUserInfo } = useContext(ProfileContext);
	const {
		errors,
		register,
		handleSubmit: handleSubmitInformation,
		setValue,
		getValues,
		control,
		watch,
	} = useForm({
		mode: 'onBlur',
		defaultValue: initialState,
		resolver: yupResolver(Schema),
	});

	const watchLocation = watch('location');

	const updateState = (key, value) =>
		dispatch({ type: 'UPDATE_STATE', payload: { key, value } });

	const setMultipleValue = (dataObj) => {
		if (typeof dataObj !== 'object') return;
		for (let property in dataObj) {
			setValue(property, dataObj[property]);
		}
	};
	const loadTeacherInfo = async (params) => {
		setIsLoading(true);
		try {
			const res = await getTeacherInfoProfile(params);
			setOptionLoaded(true);
			if (res.Code === 200) {
				console.log('loadTeacherInfo res.Data', res.Data);
				const obj = {
					avatar: res.Data?.TeacherIMG ?? '',
					linkVideoIntroduce: res.Data?.LinkVideoIntroduce ?? '',
					fullName: res.Data?.TeacherName ?? '',
					skypeId: res.Data?.SkypeID ?? '',
					phoneNumber: res.Data.PhoneNumber.toString() || '',
					email: res.Data?.Email ?? '',
					timeZone:
						res.Data?.TimezoneList.find(
							(option, index) =>
								option.ID === parseInt(res.Data?.TeacherTimeZone),
						) ?? null,
					schoolName: res.Data?.TeacherSchool ?? '',
					major: res.Data?.Course ?? '',

					location:
						res.Data?.NationList.find(
							(option, index) =>
								option.ID === parseInt(res.Data?.TeacherNational),
						) ?? null,
					birthday:
						(() => {
							try {
								let arrr = res.Data.BirthDay.split('/');
								return `${arrr[2]}-${arrr[1]}-${arrr[0]}`;
							} catch (error) {}
							return false;
						})() ?? '',
					experience: res.Data?.Experience ?? '',
					description: res.Data?.Description ?? '',
					biography: res.Data?.Biography ?? '',
				};

				console.log('loadTeacherInfo', obj);
				updateUserInfo({ ...res.Data, Avatar: res.Data?.TeacherIMG ?? '' });
				updateState('timeZoneOptions', res.Data?.TimezoneList ?? []);
				updateState('locationOptions', res.Data?.NationList ?? []);

				setMultipleValue(obj);
			}
		} catch (e) {
			console.log(e.message);
		}
		setIsLoading(false);
	};

	const _onSubmitInformation = async (data, e) => {
		e.preventDefault();
		setSubmitLoading(true);
		// console.log('Submiting');
		// console.log(data);
		console.log(data);
		try {
			const res = await updateTeacherInfoProfile({
				TeacherName: data?.fullName ?? '', // str
				SkypeID: data?.skypeId ?? '', // str
				Email: data?.email ?? '',
				PhoneNumber: data?.phoneNumber.toString() ?? '', // str
				BirthDay:
					(() => {
						try {
							let arrr = data?.birthday.split('-');
							return `${arrr[2]}/${arrr[1]}/${arrr[0]}`;
						} catch (error) {}
						return false;
					})() ?? '',
				TimeZoneID: parseInt(data.timeZone?.ID ?? 0), // int
				Experience: data?.experience ?? '',
				TeacherNational: data?.location?.ID.toString() ?? '',
				TeacherTimeZone: data?.location?.TimeZone.toString() ?? '',
				Course: data?.major ?? '',
				Description: data?.description ?? '',
				Biography: data?.biography ?? '',
				TeacherIMG: data?.avatar ?? '',
				LinkVideoIntroduce: data?.linkVideoIntroduce ?? '',
				TeacherSchool: data?.schoolName ?? '', // str
			});
			res.Code === 200 &&
				toast.success('Information updated successfully !!', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
			// res.Code === 200 &&
			// 	updateUserInfo({
			// 		...profileState,
			// 		FullName: data?.fullName ?? '',
			// 		Phone: data?.phoneNumber.toString() ?? '',
			// 		Avatar: data?.avatar ?? '', // str
			// 	});
			res.Code !== 200 &&
				toast.error('Update information failed !!', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
		} catch (err) {
			console.log(
				err?.message ??
					'Call API updateTeacherInfoProfile failed, check params again...',
			);
		}
		setSubmitLoading(false);
	};

	// useEffect(() => {
	// 	!!watchLocation && !!watchLocation.ID
	// 		? loadStateOptions(watchLocation.ID)
	// 		: loadStateOptions(0);
	// 	// console.log(watchLocation);
	// }, [watchLocation]);

	useEffect(() => {
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		loadTeacherInfo({
			UID: dataTeacher,
			Token: Token,
		});
		TeacherInformation.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);

	useEffect(() => {
		console.log('useEffect errors', errors);
	}, [errors]);

	return (
		<>
			<div className="teacher__detail">
				<form onSubmit={handleSubmitInformation(_onSubmitInformation)}>
					<Controller
						as={<ProfileAvatar getValues={getValues} updateAvatar={setValue} />}
						control={control}
						name="avatar"
					/>
					{/* <ProfileAvatar ref={register} name="avatar" avatar={getValues('avatar')} updateAvatar={setValue} /> */}
					<div className={`teacher-info mg-l-0-f mg-t-30 ${classes.rowForm}`}>
						<div className={classes.col}>
							<h5 className="mg-b-20">
								<FontAwesomeIcon icon="user" className="fas fa-user mg-r-5" />
								{t('basic-information')}
							</h5>
							<div className="row group-float-label">
								<div className="form-group col-12 col-sm-12">
									<div className="input-float">
										<input
											type="text"
											className={`form-control ${
												!!errors && errors.fullName ? 'error-form' : ''
											}`}
											placeholder="Full name *"
											name="fullName"
											ref={register}
											// defaultValue={}
											required
											id="full-name"
											value={dataTeacher?.TeacherName}
											disabled
										/>
										<label htmlFor="full-name">Full Name *</label>
									</div>
									{!!errors && !!errors.fullName && (
										<span className="tx-danger mg-t-5 d-block">
											{errors.fullName?.message}
										</span>
									)}
								</div>

								<div className="form-group col-12 col-sm-12">
									<div className="input-float">
										<input
											type="text"
											className={`form-control ${
												!!errors && errors.phoneNumber ? 'error-form' : ''
											}`}
											placeholder="Phone number *"
											name="phoneNumber"
											ref={register}
											required
											id="phone-number"
											value={dataTeacher?.PhoneNumber}
											disabled
										/>
										<label htmlFor="phone-number">Phone Number *</label>
									</div>
									{!!errors && !!errors.phoneNumber && (
										<span className="tx-danger mg-t-5 d-block">
											{errors.phoneNumber?.message}
										</span>
									)}
								</div>
								<div className="form-group col-12 col-sm-12">
									<div className="input-float">
										<input
											type="text"
											className={`form-control ${
												!!errors && errors.email ? 'error-form' : ''
											}`}
											placeholder="Email*"
											name="email"
											ref={register}
											required
											readOnly
											id="email"
											value={dataTeacher?.Email}
											disabled
										/>
										<label htmlFor="email">Email</label>
									</div>
								</div>
								<div className="form-group col-12 col-sm-6">
									<div className="input-float">
										<input
											type="text"
											className={`form-control ${
												!!errors && errors.skypeId ? 'error-form' : ''
											}`}
											placeholder="Skype ID *"
											name="skypeId"
											ref={register}
											required
											id="skype-id"
											value={dataTeacher?.SkypeID}
											disabled
										/>
										<label htmlFor="skype-id">Skype ID *</label>
									</div>
									{!!errors && !!errors.skypeId && (
										<span className="tx-danger mg-t-5 d-block">
											{errors.skypeId?.message}
										</span>
									)}
								</div>
								<div className="form-group col-12 col-sm-6">
									<div className="input-float">
										<input
											type="date"
											className={`form-control ${
												!!errors && errors.birthday ? 'error-form' : ''
											}`}
											placeholder="BirthDay *"
											name="birthday"
											ref={register}
											required
											id="birthday"
											value={dataTeacher?.BirthDay}
											disabled
										/>
										<label htmlFor="birthday">BirthDay *</label>
									</div>
									{!!errors && !!errors.skypeId && (
										<span className="tx-danger mg-t-5 d-block">
											{errors.skypeId?.message}
										</span>
									)}
								</div>
								<div className="form-group col-12 col-sm-12 col-lg-12">
									<div className="input-float">
										<Controller
											as={
												<Select
													key={(option) => `${option.ID}-${option.Nation}`}
													isSearchable={true}
													isLoading={isLoading}
													loadingMessage={`Loading...`}
													options={state.locationOptions}
													getOptionLabel={(option) => `${option.Nation}`}
													getOptionValue={(option) => `${option.ID}`}
													styles={appSettings.selectStyle}
													placeholder="Select location..."
													className={`${
														!!errors && !!errors.location ? 'error-form' : ''
													}`}
												/>
											}
											control={control}
											name="location"
											id="location"
										/>

										<label htmlFor="location">location</label>
									</div>
									{!!errors && !!errors.location && (
										<span className="tx-danger mg-t-5 d-block">
											{errors.location?.message}
										</span>
									)}
								</div>

								<div className="form-group col-12 col-sm-12 col-lg-12">
									<div className="input-float">
										<Controller
											as={
												<Select
													key={(option) =>
														`${option.ID}-${option.TimeZoneValue}`
													}
													isSearchable={true}
													isLoading={optionLoaded}
													loadingMessage={() => 'Loading options...'}
													options={state.timeZoneOptions}
													getOptionLabel={(option) => `${option.TimeZoneName}`}
													getOptionValue={(option) => `${option.ID}`}
													styles={appSettings.selectStyle}
													placeholder="Select timezone..."
													menuPosition="fixed"
													className={`${
														!!errors && !!errors.timeZone ? 'error-form' : ''
													}`}
												/>
											}
											control={control}
											name="timeZone"
											id="time-zone"
										/>

										<label htmlFor="time-zone">Time zone *</label>
									</div>
									{!!errors && !!errors.timeZone && (
										<span className="tx-danger mg-t-5 d-block">
											{errors.timeZone?.message}
										</span>
									)}
								</div>
							</div>
							<hr
								className="mg-b-30 mg-t-0"
								style={{ borderStyle: 'dashed' }}
							/>
						</div>

						<div className={classes.col}>
							<h5 className="mg-b-20">
								<FontAwesomeIcon
									icon="user-graduate"
									className="fas fa-user-graduate mg-r-5"
								/>
								{t('education-attainment')}
							</h5>
							<div className="row group-float-label">
								<div className="form-group col-12 col-sm-6">
									<div className="input-float">
										<input
											type="text"
											className={`form-control ${
												!!errors && errors.schoolName ? 'error-form' : ''
											}`}
											placeholder="School name"
											name="schoolName"
											ref={register}
											id="school-name"
											value={dataTeacher?.TeacherSchool}
											disabled
										/>
										<label htmlFor="school-name">School name</label>
									</div>
								</div>
								<div className="form-group col-12 col-sm-6">
									<div className="input-float">
										<input
											type="text"
											className={`form-control ${
												!!errors && errors.major ? 'error-form' : ''
											}`}
											placeholder="Marjor"
											name="major"
											ref={register}
											id="marjor"
											value={dataTeacher?.Course}
											disabled
										/>
										<label htmlFor="major">Course *</label>
									</div>
								</div>
								<div className="form-group col-12 col-sm-12">
									<div className="input-float">
										<textarea
											type="text"
											className={`form-control ${
												!!errors && errors.experience ? 'error-form' : ''
											}`}
											placeholder="Experience"
											name="experience"
											ref={register}
											value={dataTeacher?.Experience}
											id="experience"
										/>
										<label htmlFor="experience">Experience</label>
									</div>
								</div>
							</div>
							<hr
								className="mg-b-30 mg-t-0"
								style={{ borderStyle: 'dashed' }}
							/>
							<h5 className="mg-b-20">
								<FontAwesomeIcon
									icon="info-circle"
									className="fas fa-circle mg-r-5"
								/>
								{t('introduce-attainment')}
							</h5>
							<div className="row group-float-label">
								<div className="form-group col-12 col-sm-12">
									<div className="input-float">
										<textarea
											type="text"
											className={`form-control ${
												!!errors && errors.biography ? 'error-form' : ''
											}`}
											placeholder="Biography"
											name="biography"
											ref={register}
											id="biography"
										/>
										<label htmlFor="biography">Biography</label>
									</div>
								</div>
								<div className="form-group col-12 col-sm-12">
									<div className="input-float">
										<textarea
											type="text"
											className={`form-control ${
												!!errors && errors.description ? 'error-form' : ''
											}`}
											placeholder="Description"
											name="description"
											ref={register}
											disabled
											value={dataTeacher?.Description}
											id="description"
										/>
										<label htmlFor="description">Description</label>
									</div>
								</div>
								<div className="form-group col-12 col-sm-12">
									<Controller
										as={
											<ProfileVideo
												getValues={getValues}
												updateVideo={setValue}
											/>
										}
										control={control}
										name="linkVideoIntroduce"
									/>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}

// export default TeacherInformation;

export default withTranslation('common')(TeacherInformation);
