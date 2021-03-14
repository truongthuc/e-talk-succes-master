import React, {
	useReducer,
	useState,
	useRef,
	useEffect,
	forwardRef,
	createRef,
	memo,
} from 'react';
import {
	addEvaluation,
	teacherLoadEvaluation,
	teacherUpdateEvaluation,
} from '~/api/teacherAPI';
import { getFinishedOptions } from '~/api/optionAPI';
import { randomId, decodeHTML } from '~/utils';
import { appSettings } from '~/config';
import './[eid].module.scss';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import TextareaAutosize from 'react-autosize-textarea';
import { getLayout } from '~/components/Layout';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dataHy from '../../../../data/data.json';
import { i18n, withTranslation } from '~/i18n';
console.log('o tren', dataHy.EvaluationDetail);

function getData() {
	const andt = dataHy.EvaluationDetail;
	return andt;
}

const initialState = {
	isLoading: true,
	lessonInfo: null,
	note: '',
	grammar: '',
	pronounce: '',
	memorize: '',
	summary: '',
	vocabulary: '',
	finishedType: 0,
	finishedOptions: null,
	submitLoading: false,
	teacherRating: 0,
	editMode: false,
};

const reducer = (prevState, { type, payload }) => {
	switch (type) {
		case 'UPDATE_STATE':
			return {
				...prevState,
				[payload.key]: payload.value,
			};
			break;
		case 'SET_STATE': {
			return {
				...prevState,
				...payload,
			};
			break;
		}
		case 'EDIT_MODE': {
			return {
				...prevState,
				editMode: payload,
			};
			break;
		}
		default:
			break;
	}
};
const StatelessTextarea = (props) => {
	const [state, setState] = useState(props?.defaultValue ?? '');
	return (
		<TextareaAutosize
			{...props}
			onChange={(e) => setState(e.target.value)}
			value={state}
			onBlur={props.handleChangeValue}
		/>
	);
};
// const StatelessTextarea = memo((props) => {
// 	const [state, setState] = useState(props?.defaultValue ?? '');
// 	return (
// 		<TextareaAutosize
// 			{...props}
// 			onChange={(e) => setState(e.target.value)}
// 			value={state}
// 			onBlur={props.handleChangeValue}
// 		/>
// 	);
// });
const EvaluationDetail = ({ t }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const router = useRouter();
	const { eid: BookingID } = router?.query ?? 0;
	const updateState = (key, value) => {
		dispatch({ type: 'UPDATE_STATE', payload: { key, value } });
	};

	const setEditMode = (value) => {
		dispatch({ type: 'EDIT_MODE', payload: value });
	};

	const getFeedbackDetail = async () => {
		updateState('isLoading', true);
		try {
			// const params = getParamsUrl();
			// if (!BookingID) return;
			const res = await teacherLoadEvaluation({
				BookingID: parseInt(BookingID, 10),
			});
			res.Code === 200 &&
				dispatch({
					type: 'SET_STATE',
					payload: {
						...res.Data,
						textBook: decodeURI(res.Data?.textBook ?? ''),
						EnglishLevel: decodeURI(res.Data?.EnglishLevel ?? ''),
						GeneralEvaluation: decodeURI(res.Data?.generalEvaluation ?? ''),
						Comment: decodeURI(res.Data?.comment ?? ''),
					},
				});
		} catch (error) {
			console.log(
				error?.message ?? 'Lỗi gọi api getEvaluation, vui lòng xem lại tham số',
			);
		}
		updateState('isLoading', false);
	};
	const [values, setValues] = useState({
		EvaluationID: '23',
		textBook: '',
		EnglishLevel: '',
		generalEvaluation: '',
		comment: '',
	});

	function handleChange(evt) {
		const valueInput = evt.target.value;

		setValues({
			...values,
			[evt.target.name]: valueInput,
		});
	}

	const updateFeedback = async (e) => {
		e.preventDefault();

		console.log('Values khi submit: ', values);

		try {
			const res = await teacherUpdateEvaluation(values);
			console.log('Res: ', res);
			res.Code === 200
				? (getFeedbackDetail(), setEditMode(false))
				: alert('Update khong thanh cong');
		} catch (error) {
			console.log(error);
		}

		updateState('submitLoading', false);
	};
	// const getParamsUrl = () => {
	// 	if (typeof window == undefined) return;
	// 	const params = new URLSearchParams(window.location.search);
	// 	return params;
	// };

	useEffect(() => {
		getFeedbackDetail({
			evaluationID: 23,
			UID: 61230,
			Token: '',
		});
	}, []);

	return (
		<>
			<h1 className="main-title-page">{t('evaluation-detail')}</h1>
			<div className="row">
				<div className="col-xl-4 col-lg-5 mg-b-30">
					<div className="card lesson-sidebar">
						<div className="card-body">
							<div className="row">
								<div className="col-sm-12 mg-b-15">
									{/* <!--thông tin buổi học--> */}
									<div className="">
										<h5 className="mg-b-15">{t('lesson-information')}</h5>
										<div className="infomation__wrap">
											<div className="st-time">
												<p className="st-teacher-text d-flex justify-content-between">
													<span className="">
														<FontAwesomeIcon
															icon="book-open"
															className="fa fa-book-open tx-primary st-icon wd-20 mg-r-5"
														/>
														{t('course')}:{' '}
													</span>
													<span className="">
														{state.isLoading ? (
															<Skeleton />
														) : !!dataHy.EvaluateClass[0] &&
														  !!dataHy.EvaluateClass[0].DocumentName ? (
															dataHy.EvaluateClass[0].DocumentName
														) : (
															''
														)}
													</span>
												</p>
											</div>
											<div className="st-time">
												<p className="st-teacher-text d-flex justify-content-between">
													<span className="">
														<FontAwesomeIcon
															icon="book-reader"
															className="fa fa-book-reader tx-primary graduate st-icon wd-20 mg-r-5"
														/>
														{t('lesson')}:
													</span>
													<span className="st-tengv">
														{state.isLoading ? (
															<Skeleton />
														) : !!dataHy.EvaluateClass[0] &&
														  !!dataHy.EvaluateClass[0].Lesson ? (
															dataHy.EvaluateClass[0].Lesson
														) : (
															''
														)}
													</span>
												</p>
											</div>
											<div className="st-time">
												<p className="st-teacher-text d-flex justify-content-between">
													<span className="tx-black tx-normal">
														<FontAwesomeIcon
															icon="clock"
															className="fa fa-clock tx-primary clock st-icon wd-20 mg-r-5"
														/>
														{t('time')}:
													</span>
													<span className="">
														{state.isLoading ? (
															<Skeleton />
														) : !!dataHy.EvaluateClass[0] &&
														  !!dataHy.EvaluateClass[0].ScheduleDate ? (
															dataHy.EvaluateClass[0].ScheduleDate
														) : (
															''
														)}
													</span>
												</p>
											</div>
											<div className="st-time">
												<p className="st-teacher-text d-flex justify-content-between">
													<span className="">
														<FontAwesomeIcon
															icon="book"
															className="fa fa-book tx-primary open st-icon wd-20 mg-r-5"
														/>
														{t('material')}:
													</span>
													<a
														href={
															!!dataHy.EvaluateClass[0] &&
															!!dataHy.EvaluateClass[0].MaterialLink
																? dataHy.EvaluateClass[0].MaterialLink
																: ''
														}
														target="_blank"
														rel="noreferrer"
														className="tx-right"
													>
														{state.isLoading ? (
															<Skeleton />
														) : !!dataHy.EvaluateClass[0] &&
														  !!dataHy.EvaluateClass[0].Material ? (
															dataHy.EvaluateClass[0].Material
														) : (
															''
														)}
													</a>
												</p>
											</div>
											{/* <div className="st-time">
												<div className="st-teacher-text d-flex justify-content-between align-items-center">
													<span className="">
														<FontAwesomeIcon
															icon="lightbulb"
															className="fas fa-lightbulb tx-primary open st-icon wd-20 mg-r-5"
														/>
														{t('finished-type')}:
													</span>
													<span className="">
														{!!dataHy.EvaluationDetail[0] &&
														!!dataHy.EvaluationDetail[0].finishedType
															? dataHy.EvaluationDetail[0].finishedType
															: ''}
													</span>
												</div>
											</div> */}
										</div>
									</div>
									{/* <!--/thông tin buổi học--> */}
								</div>
								<div className="col-sm-12 mg-b-15">
									{/* <!--thang danh gia--> */}
									<div className="infomation__wrap">
										<h5 className="mg-b-15 mg-md-t-15 mg-t-15 mg-md-t-0-f">
											{t('student-information')}
										</h5>
										<div className="st-time">
											<p className="st-teacher-text d-flex justify-content-between">
												<span className="">
													<FontAwesomeIcon
														icon="user-graduate"
														className="fa fa-user-graduate  tx-primary st-icon wd-20 mg-r-5"
													/>
													{t('name')}:{' '}
												</span>
												<span className="">
													{state.isLoading ? (
														<Skeleton />
													) : !!dataHy.EvaluateClass[0] &&
													  !!dataHy.EvaluateClass[0].StudentName ? (
														dataHy.EvaluateClass[0].StudentName
													) : (
														''
													)}
												</span>
											</p>
										</div>
									</div>
								</div>
								<div className="col-sm-12">
									<div>
										<h5 className="mg-b-15 mg-md-t-15 mg-t-15 mg-md-t-0-f">
											{t('student-feedback')}
										</h5>

										<span className="word-break">
											{state.isLoading ? (
												<Skeleton count={2} />
											) : !!dataHy.EvaluateClass[0] &&
											  !!dataHy.EvaluateClass[0].StudentNote ? (
												dataHy.EvaluateClass[0].StudentNote
											) : (
												<span className="tx-danger">
													Student haven't feedback yet.
												</span>
											)}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-8 col-lg-7">
					<div className="row">
						<div className="col-12">
							<div className="card mg-b-30">
								<div className="card-header">
									<h5 className="mg-b-0">{t('general-feedback-to-student')}</h5>
								</div>
							</div>
						</div>{' '}
						<div className="col-12">
							<div className="card  mg-b-30">
								<div className="card-header">
									<h5 className="mg-b-0">TextBook</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										{state.editMode ? (
											<>
												<StatelessTextarea
													name="textBook"
													rows={5}
													className="form-control"
													placeholder="textBook feedback......"
													defaultValue={values.textBook ?? ''}
													value={values.textBook}
													handleChangeValue={handleChange}
												></StatelessTextarea>
											</>
										) : (
											<div
												dangerouslySetInnerHTML={{
													__html: decodeHTML(
														!!state && !!state.textBook ? state.textBook : '',
													),
												}}
											></div>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="col-12">
							<div className="card  mg-b-30">
								<div className="card-header">
									<h5 className="mg-b-0">EnglishLevel</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										{state.editMode ? (
											<>
												<StatelessTextarea
													name="EnglishLevel"
													rows={5}
													className="form-control"
													placeholder="EnglishLevel feedback......"
													defaultValue={values.EnglishLevel ?? ''}
													value={values.EnglishLevel}
													handleChangeValue={handleChange}
												></StatelessTextarea>
											</>
										) : (
											<div
												className=""
												dangerouslySetInnerHTML={{
													__html: decodeHTML(
														!!state && !!state.EnglishLevel
															? state.EnglishLevel
															: '',
													),
												}}
											></div>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="col-12">
							<div className="card  mg-b-30">
								<div className="card-header">
									<h5 className="mg-b-0">GeneralEvaluation</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										{state.editMode ? (
											<>
												<StatelessTextarea
													name="generalEvaluation"
													rows={5}
													className="form-control"
													placeholder="generalEvaluation feedback......"
													defaultValue={values.generalEvaluation ?? ''}
													value={values.generalEvaluation}
													handleChangeValue={handleChange}
												></StatelessTextarea>
											</>
										) : (
											<div
												className=""
												dangerouslySetInnerHTML={{
													__html: decodeHTML(
														!!state && !!state.generalEvaluation
															? state.generalEvaluation
															: '',
													),
												}}
											></div>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="col-12">
							<div className="card  mg-b-30">
								<div className="card-header">
									<h5 className="mg-b-0">Comment</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										{state.editMode ? (
											<>
												<StatelessTextarea
													name="comment"
													rows={5}
													className="form-control"
													placeholder="Comment feedback......"
													defaultValue={values?.comment ?? ''}
													value={values.comment}
													handleChangeValue={handleChange}
												></StatelessTextarea>
											</>
										) : (
											<div
												className=""
												dangerouslySetInnerHTML={{
													__html: decodeHTML(
														!!state && !!state.comment ? state.comment : '',
													),
												}}
											></div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="d-flex">
						{state.editMode ? (
							<>
								<button
									type="button"
									className="btn btn-primary d-inline-flex align-items-center mg-r-15"
									disabled={state.submitLoading}
									onClick={updateFeedback}
								>
									{state.submitLoading ? (
										<div
											className="spinner-border wd-20 ht-20 mg-r-5"
											role="status"
										>
											<span className="sr-only">Updating...</span>
										</div>
									) : (
										<FontAwesomeIcon
											icon="save"
											className="fa fa-save mg-r-5"
										/>
									)}
									<span>
										{state.submitLoading ? 'Updating...' : 'Update feedback'}
									</span>
								</button>
								{/* <button className="btn btn-primary mg-r-15" onClick={_submitFeedback}><i className="fa fa-save mg-r-5"></i> Submit feedback</button> */}
								<button
									className="btn btn-icon btn-light mg-r-15"
									onClick={() => setEditMode(false)}
								>
									<FontAwesomeIcon
										icon="times"
										className="fas fa-times mg-r-5"
									/>{' '}
									Cancel
								</button>
							</>
						) : (
							<button
								className="btn btn-icon btn-warning mg-r-15"
								onClick={() => setEditMode(true)}
							>
								<FontAwesomeIcon icon="edit" className="fas fa-edit mg-r-5" />{' '}
								Edit feedback
							</button>
						)}
					</div>
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
		</>
	);
};

// EvaluationDetail.getLayout = getLayout;
// export default EvaluationDetail;

EvaluationDetail.getLayout = getLayout;
EvaluationDetail.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(EvaluationDetail);
