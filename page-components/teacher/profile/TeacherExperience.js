import React, { useEffect, useState, useRef, memo, useReducer } from 'react';
import { randomId } from '~/utils';
import Select from 'react-select';
import { appSettings } from '~/config';
import { Modal, Button, Tabs, Tab } from 'react-bootstrap';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import { useForm } from 'react-hook-form';
import {
	getTeacherExperience,
	updateTeacherExperience,
} from '~/api/teacherAPI';
import { toast } from 'react-toastify';
import { i18n, withTranslation } from '~/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	getTesolCertificateOptions,
	getTeylCertificateOptions,
	getOtherCertificateOptions,
	getTeachingExperienceOptions,
} from '~/api/optionAPI';

const initialState = {
	isLoading: true,
	otherCertificateOptions: [],
	teylCertificateOptions: [],
	tesolCertificateOptions: [],
	teylCertificate: null,
	tesolCertificate: null,
	otherCertificate: null,
	experienceLists: [],
	teacherExperiences: [],
	optionLoaded: false,
	teacherExp: null,
};

const reducer = (prevState, { type, payload }) => {
	switch (type) {
		case 'SET_LOADING':
			return { ...prevState, isLoading: payload.value };
			break;
		case 'UPDATE_STATE':
			return { ...prevState, [payload.key]: payload.value };
			break;
		case 'DEFAULT_STATE':
			return {
				...prevState,
				...payload,
			};
			break;
		default:
			return prevState;
			break;
	}
};

const RenderExpRow = ({ exp, handleStateChange, deleteRow }) => {
	const [name, setName] = React.useState(exp.name);
	const [jobValue, setJobValue] = React.useState(exp.jobTitle);
	const [timePeriod, setTimePeriod] = React.useState(exp.timePeriod);
	const handleDeleteRow = (e) => {
		e.preventDefault();
		deleteRow(exp.id);
	};
	React.useEffect(() => {
		handleStateChange({ id: exp.id, name, jobValue, timePeriod });
	}, [name, jobValue, timePeriod]);

	return (
		<>
			{
				<div className="exp-row form-row  align-items-center">
					<div className="form-group col-md-3">
						<div className="input-float">
							<input
								type="text"
								className="form-control"
								placeholder="Organization Name"
								onChange={(e) => setName(e.target.value)}
								defaultValue={name}
								id="organization"
							/>
							<label htmlFor="organization">Organization Name</label>
						</div>
					</div>
					<div className="form-group col-md-3">
						<div className="input-float">
							<input
								type="text"
								className="form-control"
								placeholder="Job title"
								onChange={(e) => setJobValue(e.target.value)}
								defaultValue={jobValue}
								id="job-title"
							/>
							<label htmlFor="job-title">Job Title</label>
						</div>
					</div>
					<div className="form-group col-md-3">
						<div className="input-float">
							<input
								type="text"
								className="form-control"
								placeholder="Time period"
								onChange={(e) => setTimePeriod(e.target.value)}
								defaultValue={timePeriod}
								id="time-period"
							/>

							<label htmlFor="time-period">Time period</label>
						</div>
					</div>
					<div className="form-group col-md-3">
						<a
							href={true}
							onClick={handleDeleteRow}
							className="delete-row tx-24 pd-x-10"
						>
							<FontAwesomeIcon
								icon="minus-circle"
								className="fa fa-minus-circle tx-danger"
							/>
						</a>
					</div>
				</div>
			}
		</>
	);
};

const TeacherExperience = ({ props, t }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [submitLoading, setSubmitLoading] = useState(false);

	const setIsLoading = (value) =>
		dispatch({ type: 'SET_LOADING', payload: { value } });
	const updateState = (key, value) =>
		dispatch({ type: 'UPDATE_STATE', payload: { key, value } });

	const handleExpRowChange = (rowState) => {
		const { id, name, jobValue, timePeriod } = rowState;
		const newValue = [...state.experienceLists].map((exp) =>
			exp.id === id
				? {
						...exp,
						name: name,
						jobTitle: jobValue,
						timePeriod: timePeriod,
				  }
				: exp,
		);
		updateState('experienceLists', newValue);
	};

	const _handleSubmitForm = async (e) => {
		//Ok submit
		e.preventDefault();
		setSubmitLoading(true);
		try {
			const params = {
				Experience: JSON.stringify(
					(!!state.teacherExp &&
						state.teacherExp.length > 0 &&
						state.teacherExp.map((exp) => exp.ID)) ||
						[],
				),
				ExperienceObject: JSON.stringify(
					!!state.experienceLists && !!state.experienceLists.length > 0
						? [...state.experienceLists].map((exp) => {
								return {
									ID: exp.idItem,
									OrganizationName: exp.name,
									JobTitle: exp.jobTitle,
									TimePeriod: exp.timePeriod,
								};
						  })
						: [],
				),
				TesolCertificate: JSON.stringify(
					!!state.tesolCertificate && !!state.tesolCertificate.length > 0
						? state.tesolCertificate.map((ce) => ce.ID)
						: [],
				),
				TeylCertificate: JSON.stringify(
					!!state.teylCertificate && !!state.teylCertificate.length > 0
						? state.teylCertificate.map((ce) => ce.ID)
						: [],
				),
				OtherCertificate: JSON.stringify(
					!!state.otherCertificate && !!state.otherCertificate.length > 0
						? state.otherCertificate.map((ce) => ce.ID)
						: [],
				),
			};
			const res = await updateTeacherExperience(params);
			res.Code === 1 &&
				toast.success('Experience updated successfully !!', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
			res.Code !== 1 &&
				toast.error('Update experience failed, please try again !!', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
		} catch (error) {
			console.log(
				error?.message ?? 'Lỗi tham số API, vui lòng kiểm tra lại !!',
			);
		}
		setSubmitLoading(false);
	};

	const _addExpRow = (e) => {
		e.preventDefault();
		const rowData = {
			id: randomId(),
			name: '',
			jobTitle: '',
			timePeriod: '',
			idItem: 0,
		};
		updateState('experienceLists', [...state.experienceLists, rowData]);
	};

	const _deleteExpRow = (id) => {
		updateState(
			'experienceLists',
			[...state.experienceLists].filter((exp) => exp.id !== id),
		);
	};

	const loadTeacherExperience = async () => {
		setIsLoading(true);
		try {
			const res = await getTeacherExperience();
			res.Code === 1
				? dispatch({
						type: 'DEFAULT_STATE',
						payload: {
							...state,
							teacherExp: JSON.parse(res.Data?.TeacherExperience ?? '[]').map(
								(id) => {
									return [...state.teacherExperiences].find(
										(exp) => exp.ID === id,
									);
								},
							),
							experienceLists: [...(res.Data?.TeachingExperience ?? [])].map(
								(exp) => {
									return {
										id: randomId(),
										idItem: exp.ID,
										name: exp.OrganizationName,
										jobTitle: exp.JobTitle,
										timePeriod: exp.TimePeried,
									};
								},
							),
							teylCertificate: JSON.parse(
								res.Data?.TeylCertificate ?? '[]',
							).map((id) => {
								return [...state.teylCertificateOptions].find(
									(exp) => exp.ID === id,
								);
							}),
							tesolCertificate: JSON.parse(
								res.Data?.TesolCertificate ?? '[]',
							).map((id) => {
								return [...state.tesolCertificateOptions].find(
									(exp) => exp.ID === id,
								);
							}),
							otherCertificate: JSON.parse(
								res.Data?.OtherCertificate ?? '[]',
							).map((id) => {
								return [...state.otherCertificateOptions].find(
									(exp) => exp.ID === id,
								);
							}),
						},
				  })
				: dispatch({ type: 'DEFAULT_STATE', payload: initialState });
		} catch (error) {
			console.log(
				error?.message ??
					'Call api getTeacherExperience không thành công, xem lại params !!',
			);
		}

		setIsLoading(false);
	};

	const loadSelectOptionAPI = async () => {
		const [teyl, exp, other, tesol] = await Promise.all([
			getTeylCertificateOptions(),
			getTeachingExperienceOptions(),
			getOtherCertificateOptions(),
			getTesolCertificateOptions(),
		]);
		updateState('teylCertificateOptions', teyl.Data ?? []);
		updateState('teacherExperiences', exp.Data ?? []);
		updateState('otherCertificateOptions', other.Data ?? []);
		updateState('tesolCertificateOptions', tesol.Data ?? []);
		updateState('optionLoaded', true);
	};

	useEffect(() => {
		loadSelectOptionAPI();
	}, []);

	useEffect(() => {
		console.log('Lasted State', state);
	}, [state]);

	useEffect(() => {
		state.optionLoaded === true && loadTeacherExperience();
	}, [state.optionLoaded]);

	return (
		<>
			<form onSubmit={_handleSubmitForm}>
				<div className="content-block">
					<div className="introduce-content">
						<div className="teacher__content-block">
							<h5 className="mg-b-20">
								<FontAwesomeIcon
									icon="user-clock"
									className="fa fa-user-clock mg-r-5"
								/>{' '}
								{t('experience')}
							</h5>
							<div className="form-groupselect-checkbox mg-b-30 mg-t-15">
								<p className="mg-b-5">- {t('teacher-experience')}:</p>
								<div className="input-float">
									<Select
										key={(option) => `${option.id}`}
										isMulti={true}
										isSearchable={false}
										isLoading={
											state.teacherExperiences.length > 0 ? false : true
										}
										loadingMessage={() => 'Select option is loading...'}
										options={state.teacherExperiences}
										getOptionLabel={(option) =>
											`${option.TeachingExperienceName}`
										}
										getOptionValue={(option) => `${option.ID}`}
										onChange={(values) => updateState('teacherExp', values)}
										styles={appSettings.selectStyle}
										placeholder="Select experiences..."
										value={state.teacherExp}
									/>
								</div>
							</div>
						</div>
						<div className="teacher__content-block mg-b-30">
							<p className="mg-b-5">
								- {t('fill-in-your-teaching-experience')}:
							</p>
							<div className="experience__list" id="js-exp-list">
								{!!state.experienceLists &&
									state.experienceLists.length > 0 &&
									[...state.experienceLists].map((exp) => (
										<RenderExpRow
											key={`${exp.id}`}
											handleStateChange={handleExpRowChange}
											exp={exp}
											deleteRow={_deleteExpRow}
										/>
									))}
							</div>
							<button
								type="button"
								className="btn btn-success"
								id="js-add-row"
								onClick={_addExpRow}
							>
								<FontAwesomeIcon icon="plus" className="fa fa-plus" />{' '}
								{t('add-experience')}
							</button>
						</div>
						<hr className="mg-b-30 mg-t-0" style={{ borderStyle: 'dashed' }} />
						<div className="teacher__content-block">
							<h5 className="mg-b-20">
								<FontAwesomeIcon
									className="fas fa-certificate mg-r-5"
									icon="certificate"
								/>{' '}
								{t('certificate')}
							</h5>
							<div className="row teacher__certificate pd-y-15">
								<div className="form-group col-12 col-md-6">
									<div className="input-float">
										<Select
											key={(option) => `${option.id}`}
											isMulti={true}
											isSearchable={false}
											isLoading={
												state.tesolCertificateOptions.length > 0 ? false : true
											}
											loadingMessage={() => 'Select option is loading...'}
											options={state.tesolCertificateOptions}
											getOptionLabel={(option) =>
												`${option.TesolCertificateName}`
											}
											getOptionValue={(option) => `${option.ID}`}
											onChange={(values) =>
												updateState('tesolCertificate', values)
											}
											styles={appSettings.selectStyle}
											menuPortalTarget={document.body}
											value={state.tesolCertificate}
											id="tesol-cer"
										/>
										<label htmlFor="tesol-cer">TESOL Certificate</label>
									</div>
								</div>
								<div className="form-group col-12 col-md-6">
									<div className="input-float">
										<Select
											key={(option) => `${option.id}`}
											isMulti={true}
											isSearchable={false}
											isLoading={
												state.teylCertificateOptions.length > 0 ? false : true
											}
											loadingMessage={() => 'Select option is loading...'}
											options={state.teylCertificateOptions}
											value={state.teylCertificate}
											getOptionLabel={(option) =>
												`${option.TeylCertificateName}`
											}
											getOptionValue={(option) => `${option.ID}`}
											onChange={(values) =>
												updateState('teylCertificate', values)
											}
											styles={appSettings.selectStyle}
											menuPortalTarget={document.body}
											value={state.teylCertificate}
											id="teyl-cer"
										/>

										<label htmlFor="teyl-cer">TEYL Certificate</label>
									</div>
								</div>
								<div className="form-group col-12 col-md-6">
									<div className="input-float">
										<Select
											key={(option) => `${option.id}`}
											isMulti={true}
											isSearchable={false}
											isLoading={
												state.otherCertificateOptions.length > 0 ? false : true
											}
											loadingMessage={() => 'Select option is loading...'}
											options={state.otherCertificateOptions}
											value={state.otherCertificate}
											getOptionLabel={(option) =>
												`${option.OtherCertificateName}`
											}
											getOptionValue={(option) => `${option.ID}`}
											onChange={(values) =>
												updateState('otherCertificate', values)
											}
											styles={appSettings.selectStyle}
											menuPortalTarget={document.body}
											value={state.otherCertificate}
											id="other-cer"
										/>
										<label htmlFor="other-cer">Other Certificate</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="tx-center">
					<button
						type="submit"
						className="btn btn-primary d-inline-flex align-items-center"
						disabled={submitLoading}
					>
						{submitLoading ? (
							<div className="spinner-border wd-20 ht-20 mg-r-5" role="status">
								<span className="sr-only">Submitting...</span>
							</div>
						) : (
							<>
								<FontAwesomeIcon className="fa fa-save mg-r-5" icon="save" />
							</>
						)}
						<span>{submitLoading ? 'Updating' : 'Save'} experience</span>
					</button>
				</div>
			</form>
		</>
	);
};

// export default memo(TeacherExperience);

TeacherExperience.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(TeacherExperience);
