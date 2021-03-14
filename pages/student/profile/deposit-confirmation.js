import React, { useState, useEffect, useReducer } from 'react';
import Pagination from 'react-js-pagination';
import Skeleton from 'react-loading-skeleton';
import { useForm, Controller } from 'react-hook-form';
import { LoadFeeConfirm, updateProfileAPI } from '~/api/studentAPI';
import { appSettings } from '~/config';
import { getStudentLayout } from '~/components/Layout';
import dayjs from 'dayjs';
import { i18n, withTranslation } from '~/i18n';
import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';
import './index.module.scss';
const reducer = (prevState, { type, payload }) => {
	switch (type) {
		case 'STATE_CHANGE': {
			return {
				...prevState,
				[payload.key]: payload.value,
			};
		}
		default:
			return prevState;
			break;
	}
};
const PaymentMethod = [
	{ value: '1', label: 'ATM' },
	{ value: '2', label: 'Internet Banking' },
	{ value: '0', label: 'Tiền mặt' },
];
const FeeConfirmStatus = [
	{ value: '1', label: 'Đã duyệt' },
	{ value: '2', label: 'Bị bác bỏ' },
	{ value: '0', label: 'Đang chờ' },
];
const schema = Yup.object().shape({
	FullName: Yup.string().required('Họ tên không được để trống'),
	Phone: Yup.number()
		.required('Số điện thoại không được để trống')
		.typeError('Số điện thoại không hợp lệ')
		.integer('Số điện thoại không hợp lệ'),
	Email: Yup.string()
		.required('Email không được để trống')
		.email('Email không hợp lệ'),
	Address: Yup.string(),
	BirthDay: Yup.date().required('Ngày sinh không được để trống'),
	SelectTarget: Yup.string()
		.nullable()
		.required('Mục tiêu không được để trống'),
	// Address: Yup.string().required('Địa chỉ không được để trống'),
	PersonalPreference: Yup.string().required('Sở thích không được để trống'),
	RequestWithTeacher: Yup.string().required(
		'Yêu cầu với giáo viên không được để trống',
	),
	Language: Yup.string().matches(/[^0]+/g, 'Ngôn ngữ không được để trống'),
	TimeZoneID: Yup.string().matches(/[^0]+/g, 'Múi giờ không được để trống'),
	SkypeID: Yup.string().required('SkypeID không được để trống'),
});
const DepositConfirmation = ({ t }) => {
	const [profile, setProfile] = useState({});
	const [loadingProfile, setLoadingProfile] = useState(true);
	const [state, setState] = useState();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [searchInput, dispatch] = useReducer(reducer);
	const handlePageChange = (pageNumber) => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			getAPI({
				Page: pageNumber,
			});
		}
	};
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
	const onErrors = (err) => {
		console.log(err);
	};
	const onSubmit = (data) => {
		console.log(data);
		const array = data.SelectTarget.split(',');
		let z = convertTargetStringToNum(array, listTarget);

		const newProfile = {
			...data,
			Avatar: avatar,
			BirthDay: dayjs(data.BirthDay).format('DD/MM/YYYY'),
			Target: z.join(','),
		};
		onUpdateProfileAPI(newProfile);
	};
	const [initialState, setinitialState] = useState(initialState);
	const getAPI = async () => {
		try {
			setLoadingProfile(true);
			const resProfile = await LoadFeeConfirm();
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
	useEffect(() => {
		getAPI({
			UID: 61241,
			FeeConfirmID: 8,
			token: '',
		});
		// getTimeZone();
		// getLanguage();
	}, []);

	return (
		<>
			<h1 className="main-title-page">{t('deposit-confirmation')}</h1>
			<div className="card">
				<div className="card-body">
					<form
						id="form-account-profile"
						className="metronic-form"
						onSubmit={handleSubmit(onSubmit, onErrors)}
					>
						<div className="form-account custome-form">
							<div className="row">
								<div className="col-md-6">
									<div className="form-row align-items-center">
										<div className="form-group col-sm-4 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('depositors')}:</p>
										</div>
										<div className="form-group col-sm-8">
											<input
												type="text"
												className="form-control"
												placeholder=""
												disabled={true}
												name="PayerName"
												required
												defaultValue={profile.PayerName}
												ref={register}
											/>
										</div>
									</div>
									<div className="form-row align-items-center">
										<div className="form-group col-sm-4 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('phone')}:</p>
										</div>
										<div className="form-group col-sm-8">
											<input
												type="text"
												className="form-control"
												placeholder="RegistedPhone"
												name="RegistedPhone"
												ref={register}
												defaultValue={profile.RegistedPhone}
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
										<div className="form-group col-sm-4 col-label-fixed">
											<p className="mg-b-0 tx-medium">
												{t('amount-thousand-dong')}:
											</p>
										</div>
										<div className="form-group col-sm-8">
											<input
												type="text"
												className="form-control"
												placeholder="Amount"
												name="Amount"
												ref={register}
												defaultValue={profile.Amount}
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
										<div className="form-group col-sm-4 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('day-trading')}:</p>
										</div>
										<div className="form-group col-sm-8">
											<input
												type="text"
												className="form-control"
												placeholder="DayTrading"
												name="DayTrading"
												ref={register}
												defaultValue={profile.DayTrading}
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
										<div className="form-group col-sm-4 col-label-fixed">
											<p className="mg-b-0 tx-medium">
												{t('transaction-type')}:
											</p>
										</div>
										<div className="form-group col-sm-8">
											<select
												name="PaymentMethod"
												ref={register}
												defaultValue={PaymentMethod}
												className="form-control"
												selected={profile.PaymentMethod}
												disabled
											>
												<option value={profile.PaymentMethod} selected>
													{PaymentMethod[1].label}
												</option>
											</select>
										</div>
									</div>
									<div className="form-row align-items-center">
										<div className="form-group col-sm-4 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('status')}:</p>
										</div>
										<div className="form-group col-sm-8">
											<select
												name="FeeConfirmStatus"
												ref={register}
												defaultValue={FeeConfirmStatus}
												className="form-control"
												selected={profile.FeeConfirmStatus}
												disabled
											>
												<option value={profile.FeeConfirmStatus} selected>
													{FeeConfirmStatus[0].label}
												</option>
											</select>
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-row align-items-center">
										<div className="form-group col-sm-4 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('school-package')}:</p>
										</div>
										<div className="form-group col-sm-8">
											<input
												type="text"
												className="form-control"
												placeholder="PackageName"
												ref={register}
												defaultValue={profile.PackageName}
												name="PackageName"
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
										<div className="form-group col-sm-4 col-label-fixed">
											<p className="mg-b-0 tx-medium">{t('course')}:</p>
										</div>
										<div className="form-group col-sm-8">
											<input
												type="email"
												className="form-control"
												name="CourseName"
												ref={register}
												defaultValue={profile.CourseName}
												placeholder="CourseName"
												disabled
											/>
											<input
												type="email"
												className="form-control"
												name="CourseName"
												ref={register}
												defaultValue={profile.CourseName}
												placeholder="CourseName"
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
										<div className="form-group col-sm-4 col-label-fixed">
											<p className="mg-b-0 tx-medium">
												{t('total-number-of-lessons')}:
											</p>
										</div>
										<div className="form-group col-sm-8">
											<input
												type="text"
												className="form-control"
												placeholder="StudyDay"
												ref={register}
												defaultValue={profile.StudyDay}
												name="StudyDay"
												disabled
											/>
											{errors.FullName && (
												<span className="text-danger d-block mt-2">
													{errors.FullName.message}
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
											>
												<option value="1">Nam</option>
												<option value="2">Nữ</option>
												<option value="3">Khác</option>
											</select>
										</div>
									</div> */}
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

// Package.getLayout = getStudentLayout;
// export default Package;
DepositConfirmation.getLayout = getStudentLayout;
DepositConfirmation.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});

export default withTranslation('common')(DepositConfirmation);
