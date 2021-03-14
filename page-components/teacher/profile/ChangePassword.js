import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Tab, Nav } from 'react-bootstrap';
import './ProfileInfor.module.scss';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import { useForm } from 'react-hook-form';
import { updatePassAPI } from '~/api/optionAPI';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Schema = Yup.object().shape({
	oldPassword: Yup.string().required('Old password is not empty'),
	newPassword: Yup.string().required('New password is not empty'),
	reNewPassword: Yup.string().oneOf(
		[Yup.ref('newPassword'), null],
		'Passwords must match',
	),
});

const ChangePassword = () => {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [reNewPassword, setReNewPassword] = useState('');
	const [submitLoading, setSubmitLoading] = useState(false);
	const { errors, register, handleSubmit, setError, clearErrors } = useForm({
		mode: 'onSubmit',
		resolver: yupResolver(Schema),
	});

	const onSubmit = async (data) => {
		setSubmitLoading(true);
		try {
			const res = await updatePassAPI({
				OldPass: data.oldPassword,
				NewPass: data.newPassword,
			});
			res.Code === 1 &&
				toast.success('Change password success', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
			res.Code !== 1 &&
				setError('wrongPassword', {
					type: 'manual',
					message: 'Old password not correct, please try again !!',
				});
		} catch (err) {
			console.log(err?.mesage ?? 'Call api updatePassAPI không thành công !!');
		}
		setSubmitLoading(true);
	};

	useEffect(() => {}, []);

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="card card-custom">
					<div className="card-header align-items-center d-flex justify-content-between pd-x-20-f">
						<div className="d-flex align-items-center">
							<div className="">
								<h5 className="mg-b-5">Change password</h5>
								<p className="tx-gray-300 mg-b-0">
									Change your account password
								</p>
							</div>
						</div>
					</div>
					<div className="card-body">
						{!!errors && !!errors.wrongPassword && (
							<div
								className="alert alert-danger mg-b-30 d-flex justify-content-between"
								role="alert"
							>
								<div className="pd-r-15">
									<FontAwesomeIcon
										icon="exclamation-circle"
										class="fas fa-exclamation-circle mg-r-10"
									/>{' '}
									<span className="">{errors.wrongPassword?.message}</span>
								</div>
								<span onClick={() => clearErrors('wrongPassword')}>
									<i data-feather="x"></i>
								</span>
							</div>
						)}
						<div className="row ">
							<div className="form-group col-sm-4 mg-sm-t-10">
								<p className="mg-b-0">Old password:</p>
							</div>
							<div className="form-group col-sm-8 col-lg-6">
								<div className="input-wrapped">
									<input
										type="password"
										className="form-control"
										placeholder="Old password"
										name="oldPassword"
										ref={register}
										onChange={(e) => setOldPassword(e.target.value)}
										defaultValue={oldPassword}
									/>
								</div>
								{!!errors && !!errors.oldPassword && (
									<span className="tx-danger mg-t-5 d-block">
										{errors.oldPassword?.message}
									</span>
								)}
							</div>
						</div>
						<div className="row ">
							<div className="form-group col-sm-4 mg-sm-t-10">
								<p className="mg-b-0">New password:</p>
							</div>
							<div className="form-group col-sm-8 col-lg-6">
								<div className="input-wrapped">
									<input
										type="password"
										className="form-control"
										placeholder="New password"
										name="newPassword"
										ref={register}
										onChange={(e) => setNewPassword(e.target.value)}
										defaultValue={newPassword}
									/>
								</div>
								{!!errors && !!errors.newPassword && (
									<span className="tx-danger mg-t-5 d-block">
										{errors.newPassword?.message}
									</span>
								)}
							</div>
						</div>
						<div className="row ">
							<div className="form-group col-sm-4 mg-sm-t-10">
								<p className="mg-b-0">Renew password:</p>
							</div>
							<div className="form-group col-sm-8 col-lg-6">
								<div className="input-wrapped">
									<input
										type="password"
										className="form-control"
										placeholder="Renew password"
										name="reNewPassword"
										ref={register}
										onChange={(e) => setReNewPassword(e.target.value)}
										defaultValue={reNewPassword}
									/>
								</div>
								{!!errors && !!errors.reNewPassword && (
									<span className="tx-danger mg-t-5 d-block">
										{errors.reNewPassword?.message}
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
									<span>{submitLoading ? 'Updating' : 'Update'} password</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</>
	);
};

export default ChangePassword;
