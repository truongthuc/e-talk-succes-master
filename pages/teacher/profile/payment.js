import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import { useForm, Controller } from 'react-hook-form';
import { getBankInfo, updateBankInfo } from '~/api/teacherAPI';
import { toast } from 'react-toastify';
import { appSettings } from '~/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getLayout } from '~/components/Layout';
import './index.module.scss';
import { ToastContainer } from 'react-toastify';
import { i18n, withTranslation } from '~/i18n';
const cardOptions = [
	{
		id: 1,
		name: 'Visa',
	},
	{
		id: 2,
		name: 'Master Card',
	},
	{
		id: 3,
		name: 'Napas | National Payment Corporation of Vietnam ',
	},
];

const Schema = Yup.object().shape({
	cardName: Yup.string().required('Card name is required'),
	cardNumber: Yup.string().required('Card number is required'),
	bankName: Yup.string().required('Bank name is required'),
	bankAddress: Yup.string(),
	bankBranch: Yup.string(),
});

const PaymentInfo = ({ t }) => {
	const [bank, setBank] = useState('');
	const [cardName, setCardName] = useState('');
	const [cardNumber, setCardNumber] = useState('');
	const [submitLoading, setSubmitLoading] = useState(false);
	const {
		errors,
		register,
		handleSubmit,
		setError,
		setValue,
		clearErrors,
		control,
		watch,
		getValues,
	} = useForm({
		mode: 'onSubmit',
		resolver: yupResolver(Schema),
	});

	const onSubmit = async (data) => {
		setSubmitLoading(true);
		try {
			const res = await updateBankInfo({
				BankName: data?.bankName ?? '',
				CardHolderName: data?.cardName ?? '',
				CardNumber: parseInt(
					data?.cardNumber && isNaN(data.cardNumber.split('-').join(''))
						? 0
						: data.cardNumber.split('-').join(''),
				),
				BankAddress: data?.bankAddress ?? '',
				BankBranch: data?.bankBranch ?? '',
			});
			res.Code === 1 &&
				toast.success('Update payment success !!', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
			res.Code !== 1 &&
				toast.error('Update payment failed, please try again !!', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
		} catch (error) {}
		setSubmitLoading(false);
	};

	const getBank = async () => {
		try {
			const res = await getBankInfo();
			if (res.Code === 1) {
				setValue('bankName', res.Data?.BankName ?? '');
				setValue('cardName', res.Data?.CardHolderName ?? '');
				setValue('bankAddress', res.Data?.BankAddress ?? '');
				setValue('bankSWIFTCode', res.Data?.BankSWIFTCode ?? '');
				setValue('paypalAccount', res.Data?.PaypalAccount ?? '');
				setValue(
					'cardNumber',
					res.Data?.CardNumber && res.Data?.CardNumber.toString().length > 1
						? res.Data?.CardNumber
						: '____-____-____-____' ?? '____-____-____-____',
				);
				setBank(res.Data?.BankName ?? '');
				setCardName(res.Data?.CardHolderName ?? '');
				setCardNumber(
					res.Data?.CardNumber && res.Data?.CardNumber.toString().length > 1
						? res.Data?.CardNumber
						: '____-____-____-____' ?? '____-____-____-____',
				);
			}
		} catch (error) {
			console.log(error?.message ?? 'Lỗi getBankInfo ');
		}
	};

	useEffect(() => {
		getBank();
		$('body').removeClass('show-aside');
	}, []);

	return (
		<>
			<h1 className="main-title-page">{t('payment-information')}</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="card">
					{/* <div className="card-header align-items-center d-flex justify-content-between pd-x-20-f">
						<div className="d-flex align-items-center">
							<div className="">
								<h5 className="mg-b-5">Payment</h5>
								<p className="tx-gray-300 mg-b-0">Your payment information</p>
							</div>
						</div>
					</div> */}
					<div className="card-body">
						<div className="card-visual wd-sm-450 wd-300 pos-relative mg-b-60">
							<span className="visual-name">{cardName || ''}</span>
							<span className="visual-number">{cardNumber || ''}</span>
							{/* <span className="visual-bank">{bank || ''}</span> */}
							<img src="/static/assets/img/visa-2.png" className="wd-100p" />
						</div>

						<div className="row ">
							<div className="form-group col-sm-4 mg-sm-t-10 mg-b-0 mg-sm-b-30">
								<p className="mg-b-0">
									{t('bank-name')}: <span class="tx-danger">(*)</span>
								</p>
							</div>
							<div className="form-group col-sm-8 col-lg-6">
								<div className="input-wrapped">
									<input
										type="text"
										className={`form-control ${
											!!errors && !!errors.bankName ? 'error-form' : ''
										} tx-uppercase`}
										placeholder="Bank name"
										name="bankName"
										ref={register}
										onChange={(e) => setBank(e.target.value.toUpperCase())}
									/>
								</div>
								{!!errors && !!errors.bankName && (
									<span className="tx-danger mg-t-5 d-block">
										{errors.bankName?.message}
									</span>
								)}
							</div>
						</div>

						<div className="row ">
							<div className="form-group col-sm-4 mg-sm-t-10 mg-b-0 mg-sm-b-30">
								<p className="mg-b-0">
									{t('bank-account-name')}: <span class="tx-danger">(*)</span>
								</p>
							</div>
							<div className="form-group col-sm-8 col-lg-6">
								<div className="input-wrapped">
									<input
										type="text"
										className={`form-control ${
											!!errors && !!errors.cardName ? 'error-form' : ''
										} tx-uppercase`}
										placeholder="Bank account name"
										name="cardName"
										ref={register}
										onChange={(e) => setCardName(e.target.value.toUpperCase())}
									/>
								</div>
								{!!errors && !!errors.cardName && (
									<span className="tx-danger mg-t-5 d-block">
										{errors.cardName?.message}
									</span>
								)}
							</div>
						</div>
						<div className="row ">
							<div className="form-group col-sm-4 mg-sm-t-10 mg-b-0 mg-sm-b-30">
								<p className="mg-b-0">
									{t('card-number')}: <span class="tx-danger">(*)</span>
								</p>
							</div>
							<div className="form-group col-sm-8 col-lg-6">
								<div className="input-wrapped">
									<input
										type="text"
										name="cardNumber"
										ref={register}
										className={`form-control ${
											!!errors && !!errors.cardNumber ? 'error-form' : ''
										}`}
										onChange={(e) => setCardNumber(e.target.value)}
										placeholder="CARD NUMBER"
									/>
								</div>
								{!!errors && !!errors.cardNumber && (
									<span className="tx-danger mg-t-5 d-block">
										{errors.cardNumber?.message}
									</span>
								)}
							</div>
						</div>
						<div className="row ">
							<div className="form-group col-sm-4 mg-sm-t-10 mg-b-0 mg-sm-b-30">
								<p className="mg-b-0">{t('bank-address')}:</p>
							</div>
							<div className="form-group col-sm-8 col-lg-6">
								<div className="input-wrapped">
									<input
										type="text"
										className={`form-control ${
											!!errors && !!errors.bankAddress ? 'error-form' : ''
										} tx-uppercase`}
										placeholder="Bank address"
										name="bankAddress"
										ref={register}
									/>
								</div>
								{!!errors && !!errors.bankAddress && (
									<span className="tx-danger mg-t-5 d-block">
										{errors.bankAddress?.message}
									</span>
								)}
							</div>
						</div>
						<div className="row ">
							<div className="form-group col-sm-4 mg-sm-t-10 mg-b-0 mg-sm-b-30">
								<p className="mg-b-0">{t('bank-branch')}:</p>
							</div>
							<div className="form-group col-sm-8 col-lg-6">
								<div className="input-wrapped">
									<input
										type="text"
										className={`form-control ${
											!!errors && !!errors.bankBranch ? 'error-form' : ''
										} tx-uppercase`}
										placeholder="BANK BRANCH"
										name="bankBranch"
										ref={register}
									/>
								</div>
								{!!errors && !!errors.bankBranch && (
									<span className="tx-danger mg-t-5 d-block">
										{errors.bankBranch?.message}
									</span>
								)}
							</div>
						</div>

						<div className="row">
							<div className="col-sm-8 offset-sm-4">
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
											<FontAwesomeIcon
												icon="save"
												className="fa fa-save mg-r-5"
											/>
										</>
									)}
									<span>{submitLoading ? 'Updating' : 'Update'} payment</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</form>
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
		</>
	);
};

// PaymentInfo.getLayout = getLayout;
// export default PaymentInfo;

PaymentInfo.getLayout = getLayout;
PaymentInfo.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(PaymentInfo);
