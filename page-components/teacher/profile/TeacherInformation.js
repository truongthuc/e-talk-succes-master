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
import { appSettings } from '~/config';
import Select from 'react-select';
import { randomId } from '~/utils';
import {
	getTeacherInfoProfile,
	updateTeacherInfoProfile,
} from '~/api/teacherAPI';
import { toast } from 'react-toastify';
import { Context as ProfileContext } from '~/context/ProfileContext';
import {
	UploadFilePost,
	getEnglishProficiencyOptions,
	getLevelOfEducationOptions,
	getLocationOptions,
	getStateOptions,
	getTimeZone,
	getListLevelPurpose,
} from '~/api/optionAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { i18n, withTranslation } from '~/i18n';
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
				if (res.Code === 200 && res.Data.length > 0) {
					props.updateAvatar('avatar', res.Data[0].UrlIMG);
				}
			}
		} catch (error) {
			console.log(error?.message ?? 'Lỗi gọi api');
		}
		setIsLoading(false);
	};

	return (
		<>
			<div
				className={`teacher-avatar ${
					isLoading ? 'loading-style' : ''
				} mg-x-auto`}
			>
				<div className="lds-ellipsis">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
				<div className="upload-container wd-100 ht-100">
					<label className="upload-avatar">
						<input
							ref={inputFileRef}
							type="file"
							accept="image/*"
							className="upload-box hidden d-none upload-file"
							onChange={handleUploadImage}
						/>
						<img
							src={
								!!props?.getValues('avatar')
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

function TeacherInformation({ t }) {
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

	const loadTeacherInfo = async () => {
		setIsLoading(true);
		try {
			const res = await getTeacherInfoProfile();
			setOptionLoaded(true);
			if (res.Code === 200) {
				console.log('loadTeacherInfo res.Data', res.Data);
				const obj = {
					avatar: res.Data?.TeacherIMG ?? '',
					fullName: res.Data?.TeacherName ?? '',
					skypeId: res.Data?.SkypeID ?? '',
					phoneNumber: res.Data.PhoneNumber.toString() || '',
					email: res.Data?.Email ?? '',
					timeZone: res.Data?.TeacherTimeZone ?? null,
					schoolName: res.Data?.TeacherSchool ?? '',
					major: res.Data?.Course ?? '',
					// englishProficien:
					// 	[...state.englishProficienOptions].find(
					// 		(option, index) => option.ID === res.Data?.EnglishProficiency,
					// 	) ?? null,
					location: res.Data?.TeacherNational ?? null,
				};
				console.log('loadTeacherInfo', obj);
				updateUserInfo({ ...res.Data, Avatar: res.Data?.TeacherIMG ?? '' });
				updateState('timeZoneOptions', res.Data.TimezoneList ?? []);
				// 	updateState('englishProficienOptions', proficienRes.Data ?? []);
				// 	updateState('levelOfEducationOptions', educationRes.Data ?? []);
				// 	updateState('levelOfPurposeOptions', purposeRes.Data ?? []);
				// 	updateState('timeZoneOptions', timezoneRes.Data ?? []);
				// 	updateState('locationOptions', locationRes.Data ?? []);

				setMultipleValue(obj);
			}
		} catch (e) {
			console.log(e.message);
		}
		setIsLoading(false);
	};

	const loadSelectOptionAPI = async () => {
		// try {
		// 	const [
		// 		proficienRes,
		// 		educationRes,
		// 		purposeRes,
		// 		timezoneRes,
		// 		locationRes,
		// 	] = await Promise.all([
		// 		getEnglishProficiencyOptions(),
		// 		getLevelOfEducationOptions(),
		// 		getListLevelPurpose(),
		// 		getTimeZone(),
		// 		getLocationOptions(),
		// 	]);
		// 	updateState('englishProficienOptions', proficienRes.Data ?? []);
		// 	updateState('levelOfEducationOptions', educationRes.Data ?? []);
		// 	updateState('levelOfPurposeOptions', purposeRes.Data ?? []);
		// 	updateState('timeZoneOptions', timezoneRes.Data ?? []);
		// 	updateState('locationOptions', locationRes.Data ?? []);
		// } catch (err) {
		// 	console.log(
		// 		err?.message ?? 'Call Promise all failed, check params again...',
		// 	);
		// }
	};

	// const loadStateOptions = async (LocationID) => {
	// 	try {
	// 		const res = await getStateOptions({
	// 			LocationID,
	// 		});
	// 		if (res.Code === 1) {
	// 			updateState('stateOptions', res.Data);
	// 		}
	// 	} catch (err) {
	// 		console.log(
	// 			err?.message ??
	// 				'Call api getLocationOptions failed, check params again...',
	// 		);
	// 	}
	// };

	const _onSubmitInformation = async (data, e) => {
		e.preventDefault();
		setSubmitLoading(true);
		// console.log('Submiting');
		// console.log(data);
		console.log(data);
		try {
			const res = await updateTeacherInfoProfile({
				FullName: data?.fullName ?? '', // str
				SkypeID: data?.skypeId ?? '', // str
				Phone: data?.phoneNumber.toString() ?? '', // str
				TimeZoneID: parseInt(data.timeZone?.ID ?? 0), // int
				// LevelPurpose: JSON.stringify(
				// 	!!data.levelOfPurpose && !!data.levelOfPurpose.length > 0
				// 		? data.levelOfPurpose.map((ce) => ce.ID)
				// 		: [],
				// ), // str arr
				// LevelOfEdacation: parseInt(data?.levelOfEducation.ID) ?? 0, // int
				SchoolName: data?.schoolName ?? '', // str
				Major: data?.major ?? '', // str
				// Proficiency: data?.englishProficien?.ID ?? 0, // int
				// EnglishProficiency: data?.englishProficien?.ID ?? 0, // int
				Avatar: data?.avatar ?? '', // str
				Location: data?.location?.ID ?? 0,
				// State: data?.state?.ID ?? 0,
			});
			res.Code === 1 &&
				toast.success('Information updated successfully !!', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
			res.Code === 1 &&
				updateUserInfo({
					...profileState,
					FullName: data?.fullName ?? '',
					Phone: data?.phoneNumber.toString() ?? '',
					Avatar: data?.avatar ?? '', // str
				});
			res.Code !== 1 &&
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
		loadTeacherInfo();
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
					<div className="teacher-info mg-l-0-f mg-t-30">
						<h5 className="mg-b-20">
							<FontAwesomeIcon icon="user" className="fas fa-user mg-r-5" />
							{t('basic-information')}
						</h5>
						<div className="row group-float-label">
							<div className="form-group col-12 col-sm-6">
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
									/>
									<label htmlFor="full-name">Full Name *</label>
								</div>
								{!!errors && !!errors.fullName && (
									<span className="tx-danger mg-t-5 d-block">
										{errors.fullName?.message}
									</span>
								)}
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
										type="text"
										className={`form-control ${
											!!errors && errors.phoneNumber ? 'error-form' : ''
										}`}
										placeholder="Phone number *"
										name="phoneNumber"
										ref={register}
										required
										id="phone-number"
									/>
									<label htmlFor="phone-number">Phone Number *</label>
								</div>
								{!!errors && !!errors.phoneNumber && (
									<span className="tx-danger mg-t-5 d-block">
										{errors.phoneNumber?.message}
									</span>
								)}
							</div>
							<div className="form-group col-12 col-sm-6">
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
									/>
									<label htmlFor="email">Email</label>
								</div>
							</div>
							<div className="form-group col-12 col-sm-12 col-lg-6">
								<div className="input-float">
									<Controller
										as={
											<Select
												key={(option) => `${option.id}`}
												isSearchable={true}
												isLoading={isLoading}
												loadingMessage={`Loading...`}
												options={state.locationOptions}
												getOptionLabel={(option) => `${option.LocationName}`}
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

									<label htmlFor="location">Location</label>
								</div>
								{!!errors && !!errors.location && (
									<span className="tx-danger mg-t-5 d-block">
										{errors.location?.message}
									</span>
								)}
							</div>

							<div className="form-group col-12 col-sm-12 col-lg-6">
								<div className="input-float">
									<Controller
										as={
											<Select
												key={(option) => `${option.ID}-${option.TimeZoneValue}`}
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
							{/* <div className="form-group col-12 col-sm-12">
								<div className="input-float">
									<Controller
										as={
											<Select
												isMulti={true}
												key={(option) => `${option.id}`}
												isSearchable={false}
												isLoading={isLoading}
												loadingMessage={() => 'Loading options...'}
												options={state.levelOfPurposeOptions}
												getOptionLabel={(option) =>
													`${option.PurposeLevelName}`
												}
												getOptionValue={(option) => `${option.ID}`}
												styles={appSettings.selectStyle}
												menuPosition="fixed"
												className={`${
													!!errors && !!errors.levelOfPurpose
														? 'error-form'
														: ''
												}`}
											/>
										}
										control={control}
										name="levelOfPurpose"
										id="level-purpose"
									/>

									<label htmlFor="level-purpose">Level purpose</label>
								</div>
								{!!errors && !!errors.levelOfPurpose && (
									<span className="tx-danger mg-t-5 d-block">
										{errors.levelOfPurpose?.message}
									</span>
								)}
							</div> */}
						</div>
						<hr className="mg-b-30 mg-t-0" style={{ borderStyle: 'dashed' }} />
						<h5 className="mg-b-20">
							<FontAwesomeIcon
								icon="user-graduate"
								className="fas fa-user-graduate mg-r-5"
							/>
							{t('education-attainment')}
						</h5>
						<div className="row group-float-label">
							{/* <div className="form-group col-12 col-sm-6">
								<div className="input-float">
									<Controller
										as={
											<Select
												key={(option) => `${option.id}`}
												isSearchable={false}
												isLoading={isLoading}
												loadingMessage={() => 'Loading options...'}
												options={state.levelOfEducationOptions}
												getOptionLabel={(option) =>
													`${option.LevelOfEducationName}`
												}
												getOptionValue={(option) => `${option.ID}`}
												styles={appSettings.selectStyle}
												placeholder="Select level..."
												menuPosition="fixed"
												className={`${
													!!errors && !!errors.levelOfEducation
														? 'error-form'
														: ''
												}`}
											/>
										}
										control={control}
										name="levelOfEducation"
										id="level-education"
									/>

									<label htmlFor="level-education">Level of Education</label>
								</div>
								{!!errors && !!errors.levelOfEducation && (
									<span className="tx-danger mg-t-5 d-block">
										{errors.levelOfEducation?.message}
									</span>
								)}
							</div> */}
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
									/>

									<label htmlFor="major">Major/Specialization *</label>
								</div>
							</div>
							{/* <div className="form-group col-12 col-sm-6">
								<div className="input-float">
									<Controller
										as={
											<Select
												key={(option) => `${option.id}`}
												isSearchable={false}
												isLoading={isLoading}
												loadingMessage={() => 'Loading options...'}
												options={state.englishProficienOptions}
												getOptionLabel={(option) =>
													`${option.EnglishProficiencyName}`
												}
												getOptionValue={(option) => `${option.ID}`}
												styles={appSettings.selectStyle}
												placeholder="Select proficiency..."
												menuPosition="fixed"
												className={`${
													!!errors && !!errors.englishProficien
														? 'error-form'
														: ''
												}`}
											/>
										}
										control={control}
										name="englishProficien"
										id="english-proficien"
									/>

									<label htmlFor="english-proficien">English proficiency</label>
								</div>
								{!!errors && !!errors.englishProficien && (
									<span className="tx-danger mg-t-5 d-block">
										{errors.englishProficien?.message}
									</span>
								)}
							</div> */}
						</div>
					</div>

					<div className="tx-center">
						<button
							type="submit"
							className="btn btn-primary d-inline-flex align-items-center"
							disabled={submitLoading}
						>
							{submitLoading ? (
								<div
									className="spinner-border wd-20 ht-20 mg-r-5"
									role="status"
								>
									<span className="sr-only">Submitting...</span>
								</div>
							) : (
								<>
									<FontAwesomeIcon className="fa fa-save mg-r-5" icon="save" />
								</>
							)}
							<span>{submitLoading ? 'Updating' : 'Save'} information</span>
						</button>
					</div>
				</form>
			</div>
		</>
	);
}

// export default TeacherInformation;

TeacherInformation.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(TeacherInformation);
