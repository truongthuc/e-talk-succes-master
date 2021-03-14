import React, { useReducer, useState, useRef, useEffect } from 'react';
import {
	addEvaluation,
	teacherFakeDataEvaluation,
	updateEvaluation,
	teacherSaveEvaluation,
} from '~/api/teacherAPI';
import { getFinishedOptions } from '~/api/optionAPI';
import { randomId } from '~/utils';
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
console.log('o tren', dataHy.EvaluateClass);

function getData() {
	const andt = dataHy.EvaluateClass;
	return andt;
}

const initialState = {
	isLoading: true,
	lessonInfo: null,
	rate: null,
	note: '',
	grammar: '',
	pronounce: '',
	memorize: '',
	summary: '',
	vocabulary: '',
	finishedType: '',
	finishedOptions: [],
	studentComments: [
		{
			id: randomId(),
			dateTime: new Date(),
			teacherName: 'Kelly Clarkson',
			teacherAvatar:
				'https://i.pinimg.com/236x/aa/84/88/aa8488c0bdc927ac836586c004c7cb12.jpg',
			content: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error earum
            molestias consequatur, iusto accusantium minima est saepe porro id odit nam, numquam
            voluptates quis repudiandae veniam. Provident illum et voluptate. Lorem ipsum dolor sit,
            amet consectetur adipisicing elit. Quaerat aliquam magni impedit vitae sit expedita totam
            labore neque, dolores eos veritatis? Qui nisi, ipsa nostrum nulla labore esse dicta.
            Aspernatur`,
			editted: false,
		},
		{
			id: randomId(),
			dateTime: new Date(),
			teacherName: 'Holy Breaker',
			teacherAvatar:
				'https://i.pinimg.com/236x/aa/84/88/aa8488c0bdc927ac836586c004c7cb12.jpg',
			content: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error earum
            molestias consequatur, iusto accusantium minima est saepe porro id odit nam, numquam
            voluptates.`,
			editted: false,
		},
	],
};

const reducer = (prevState, { type, payload }) => {
	switch (type) {
		case 'UPDATE_STATE':
			return {
				...prevState,
				[payload.key]: payload.value,
			};
			break;

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

const EvaluateClass = ({ t }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const selectRef = useRef(true);
	const [submitLoading, setSubmitLoading] = useState(false);
	const router = useRouter();
	const { eid: BookingID } = router?.query ?? 0;
	const updateState = (key, value) => {
		dispatch({ type: 'UPDATE_STATE', payload: { key, value } });
	};
	const getAPI = async () => {
		updateState('isLoading', true);
		try {
			const evaluation = await teacherFakeDataEvaluation({
				BookingID: parseInt(BookingID),
			});
			console.log(evaluation);
			evaluation.Code === 200 && updateState('lessonInfo', evaluation.Data);
		} catch (error) {
			console.log(
				error?.message ?? 'Lỗi gọi api getEvaluation, vui lòng xem lại tham số',
			);
		}
		updateState('isLoading', false);
	};

	const handleClick_getRating = (e) => {
		let valueRating = e.target.getAttribute('value');
		setValues({
			...values,
			[e.target.getAttribute('name')]: valueRating,
		});
	};

	const [values, setValues] = useState({
		// rating: null,
		// ratingCmt: '',
		CourseStudentID: '33',
		grammar: '',
		vocabulary: '',
		speaking: '',
		pronunciation: '',
	});

	// useEffect(() => {
	// 	setValues({
	// 		...values,
	// 		CourseStudentID: state.lessonInfo.CourseStudentID,
	// 	});
	// }, []);

	// console.log('test: ', state.lessonInfo.CourseStudentID);

	function handleChange(evt) {
		const valueInput = evt.target.value;

		setValues({
			...values,
			[evt.target.name]: valueInput,
		});
	}

	console.log('Values: ', values);

	const layData = getData();
	console.log('tu hy', layData);

	const getFinishedOpts = async () => {
		updateState('isLoading', true);
		try {
			const res = await getFinishedOptions();
			res.Code === 1 && updateState('finishedOptions', res.Data);
		} catch (error) {
			console.log(
				error?.message ??
					'Lỗi gọi api getFinishedOptions, vui lòng xem lại tham số',
			);
		}
		updateState('isLoading', false);
	};

	const _submitFeedback = async (e) => {
		e.preventDefault();
		// try {
		// 	if (!state?.rate) {
		// 		toast.warning('Please leave your rate !!', {
		// 			position: toast.POSITION.TOP_CENTER,
		// 			autoClose: 2000,
		// 		});
		// 		return;
		// 	}

		// 	setSubmitLoading(true);
		// 	const res = await addEvaluation({
		// 		ElearnBookingID: parseInt(state?.lessonInfo.BookingID || 0),
		// 		FinishedType: parseInt(
		// 			!!state.finishedType && !!state.finishedType
		// 				? state.finishedType.ID
		// 				: 0,
		// 		),
		// 		Rate: state?.rate ?? 0,
		// 		Note: state?.note ?? '',
		// 		Pronunciation: state?.pronounce ?? '',
		// 		Vocabulary: state?.vocabulary ?? '',
		// 		Grammar: state?.grammar ?? '',
		// 		SentenceDevelopmentAndSpeak: state?.memorize ?? '',
		// 	});
		// 	if (res.Code === 1) {
		// 		toast.success('Update feedback success, redirect after 2 seconds !!', {
		// 			position: toast.POSITION.TOP_CENTER,
		// 			autoClose: 2000,
		// 		});
		// 		setTimeout(
		// 			() =>
		// 				router.replace(`/evaluation/detail/${state.lessonInfo.BookingID}`),
		// 			2000,
		// 		);
		// 	}
		// 	res.Code !== 1 &&
		// 		toast.error('Update feedback failed !!', {
		// 			position: toast.POSITION.TOP_CENTER,
		// 			autoClose: 2000,
		// 		});
		// } catch (error) {
		// 	console.log(
		// 		error?.message ?? 'Lỗi gọi api addEvaluation, vui lòng xem lại tham số',
		// 	);
		// }

		// submit

		console.log('Values khi submit: ', values);

		try {
			const res = await teacherSaveEvaluation(values);
			res.Code === 200
				? alert('submit thanh cong')
				: alert('Submit khong thanh cong');
		} catch (error) {
			console.log(error);
		}

		setSubmitLoading(false);
	};

	// const getParamsUrl = () => {
	// 	if (typeof window == undefined) return;
	// 	const params = new URLSearchParams(window.location.search);
	// 	return params;
	// };

	const cleanUpComponent = () => {
		if (selectRef && selectRef.current) {
			selectRef.current = false;
		}
	};

	useEffect(() => {
		getFinishedOpts();
		getAPI({
			UID: 61215,
			courseID: 33,
			Token: '',
		});
		// return cleanUpComponent;
	}, []);

	useEffect(() => {
		console.log('rendered');
	}, [state]);

	return (
		<>
			<h1 className="main-title-page">{t('evaluate-class')}</h1>
			<div className="row ">
				<div className="col-xl-4 col-lg-12 mg-b-30">
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
				<div className="col-xl-8 col-lg-12">
					<div className="card mg-b-30">
						<div className="card-header">
							<h5 className="mg-b-0">{t('general-feedback-to-student')}</h5>
						</div>
						<div className="card-body pd-t-10">
							<div>
								<div className="">
									{/* <TinyEditor options={{
										...editorOptions,
										placeholder: 'General feedback...'
									}}
									onChangeEvent={(content, editor) => updateState('note', content)}
									/> */}
									<div className="rating justify-content-end mg-b-5">
										<input type="radio" name="rating" id="rating-5" />
										<label
											name="rating"
											htmlFor="rating-5"
											value={5}
											// onClick={(e) =>
											// 	updateState(
											// 		'rate',
											// 		parseInt(e.target.getAttribute('value')),
											// 	)
											// }
											onClick={handleClick_getRating}
										></label>
										<input type="radio" name="rating" id="rating-4" />
										<label
											name="rating"
											htmlFor="rating-4"
											value={4}
											// onClick={(e) =>
											// 	updateState(
											// 		'rate',
											// 		parseInt(e.target.getAttribute('value')),
											// 	)
											// }
											onClick={handleClick_getRating}
										></label>
										<input type="radio" name="rating" id="rating-3" />
										<label
											name="rating"
											htmlFor="rating-3"
											value={3}
											// onClick={(e) =>
											// 	updateState(
											// 		'rate',
											// 		parseInt(e.target.getAttribute('value')),
											// 	)
											// }
											onClick={handleClick_getRating}
										></label>
										<input type="radio" name="rating" id="rating-2" />
										<label
											name="rating"
											htmlFor="rating-2"
											value={2}
											// onClick={(e) =>
											// 	updateState(
											// 		'rate',
											// 		parseInt(e.target.getAttribute('value')),
											// 	)
											// }
											onClick={handleClick_getRating}
										></label>
										<input type="radio" name="rating" id="rating-1" />
										<label
											name="rating"
											htmlFor="rating-1"
											value={1}
											// onClick={(e) =>
											// 	updateState(
											// 		'rate',
											// 		parseInt(e.target.getAttribute('value')),
											// 	)
											// }
											onClick={handleClick_getRating}
										></label>
										<span>Rating:</span>
									</div>
									<StatelessTextarea
										placeholder="General feedback..."
										// defaultValue={state.note}
										// handleChangeValue={(e) =>
										// 	updateState('note', e.target.value)
										// }
										name="ratingCmt"
										defaultValue={values.ratingCmt}
										value={values.ratingCmt}
										handleChangeValue={handleChange}
									></StatelessTextarea>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-12 col-sm-6 mg-b-30">
							<div className="card">
								<div className="card-header">
									<h5 className="mg-b-0">TextBook</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										<div>
											{/* <TinyEditor options={{
                        ...editorOptions,
                        placeholder: 'Grammar feedback...'
                      }}
                      onChangeEvent={(content, editor) => updateState('grammar', content)}
                    /> */}
											<StatelessTextarea
												placeholder="Grammar feedback..."
												// defaultValue={state.grammar}
												// handleChangeValue={(e) =>
												// 	updateState('grammar', e.target.value)
												// }
												name="grammar"
												defaultValue={values.grammar}
												value={values.grammar}
												handleChangeValue={handleChange}
											></StatelessTextarea>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12 col-sm-6 mg-b-30">
							<div className="card">
								<div className="card-header">
									<h5 className="mg-b-0">Comment</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										<div>
											{/* <TinyEditor options={{
                      ...editorOptions,
                      placeholder: 'Vocabulary feedback...'
                    }}
                      onChangeEvent={(content, editor) => updateState('vocabulary', content)}
                    /> */}
											<StatelessTextarea
												placeholder="Vocabulary feedback..."
												// defaultValue={state.vocabulary}
												// handleChangeValue={(e) =>
												// 	updateState('vocabulary', e.target.value)
												// }
												name="vocabulary"
												defaultValue={values.vocabulary}
												value={values.vocabulary}
												handleChangeValue={handleChange}
											></StatelessTextarea>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-12 col-sm-6 mg-b-30">
							<div className="card">
								<div className="card-header">
									<h5 className="mg-b-0">GeneralEvaluation</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										<div>
											{/* <TinyEditor options={{
                      ...editorOptions,
                      placeholder: 'Sentence feedback...'
                    }}
                      onChangeEvent={(content, editor) => updateState('memorize', content)}
                    /> */}
											<StatelessTextarea
												placeholder="Sentence feedback..."
												// defaultValue={state.memorize}
												// handleChangeValue={(e) =>
												// 	updateState('memorize', e.target.value)
												// }
												name="speaking"
												defaultValue={values.speaking}
												value={values.speaking}
												handleChangeValue={handleChange}
											></StatelessTextarea>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12 col-sm-6 mg-b-30">
							<div className="card h-100">
								<div className="card-header">
									<h5 className="mg-b-0">EnglishLevel</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										<div>
											{/*  <TinyEditor options={{
                      ...editorOptions,
                      placeholder: 'Pronounce feedback...'
                    }}
                      onChangeEvent={(content, editor) => updateState('pronounce', content)}
                      /> */}
											<StatelessTextarea
												placeholder="Pronounce feedback..."
												// defaultValue={state.pronounce}
												// handleChangeValue={(e) =>
												// 	updateState('pronounce', e.target.value)
												// }
												name="pronunciation"
												defaultValue={values.pronunciation}
												value={values.pronunciation}
												handleChangeValue={handleChange}
											></StatelessTextarea>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="d-flex">
						<button
							type="button"
							className="btn btn-primary d-inline-flex align-items-center mg-r-15"
							// disabled={submitLoading}
							onClick={_submitFeedback}
						>
							{submitLoading ? (
								<span
									className="spinner-border wd-20 ht-20 mg-r-5"
									role="status"
								>
									<span className="sr-only">Submitting...</span>
								</span>
							) : (
								<>
									<FontAwesomeIcon icon="save" className="mg-r-5" />
								</>
							)}
							<span>{submitLoading ? 'Submitting...' : 'Submit feedback'}</span>
						</button>
						{/* <button className="btn btn-primary mg-r-15" onClick={_submitFeedback}><i className="fa fa-save mg-r-5"></i> Submit feedback</button> */}
						<button
							className="btn btn-icon btn-light mg-r-15"
							onClick={() => window.history.back()}
						>
							<FontAwesomeIcon
								icon="arrow-left"
								className="fas fa-arrow-left mg-r-5"
							/>{' '}
							Back
						</button>
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

// EvaluateClass.getLayout = getLayout;
// export default EvaluateClass;

EvaluateClass.getLayout = getLayout;
EvaluateClass.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(EvaluateClass);
