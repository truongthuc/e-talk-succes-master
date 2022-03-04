import React, { useState, useEffect } from 'react';
import SkeletonLessonDetail from '~/page-components/student/classes/evaluation/[eid]/SkeletonLessonDetail';
import RatingLessonModal from '~/components/common/Modal/RatingLessonModal';
import { GetEvaluationDetail } from '~/api/studentAPI';
import { ToastContainer } from 'react-toastify';
import { decodeHTML } from '~/utils';
import { useRouter } from 'next/router';
import { getStudentLayout } from '~/components/Layout';
import { i18n, withTranslation } from '~/i18n';
import './index.module.scss';

const renderRatingStars = (rate) => {
	return rate === 5 ? (
		<span className="badge badge-light text-white bg-success mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Excellent
		</span>
	) : rate === 4 ? (
		<span className="badge badge-light text-white bg-success mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Good
		</span>
	) : rate === 3 ? (
		<span className="badge badge-light text-white bg-info mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Average
		</span>
	) : rate === 2 ? (
		<span className="badge badge-light text-white bg-warning mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Bad
		</span>
	) : rate === 1 ? (
		<span className="badge badge-light text-white bg-danger mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Very Bad
		</span>
	) : (
		<span className="badge badge-light text-white bg-black-4 mg-l-5">
			Not Rated
		</span>
	);
};

const LessonDetail = ({ t }) => {
	const [state, setState] = useState({});
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const getAPI = async (params) => {
		// console.log(UID);
		// let UID = null;
		// let Token = null;
		// if (localStorage.getItem('UID')) {
		// 	UID = localStorage.getItem('UID');
		// 	Token = localStorage.getItem('token');
		// }
		setLoading(true);
		const res = await GetEvaluationDetail(params);
		if (res.Code === 200) {
			setState(res.Data);
		}
		setLoading(false);
	};

	const onCallbackRating = (result, message, rating, BookingID, TeacherUID) => {
		if (result === 1) {
			setState({
				...state,
				StudentEvaluation: message,
				StudentRate: rating,
			});
		}
	};

	useEffect(() => {
		// --- Get ID ---
		let linkClone = null;
		let link = window.location.href;
		link = link.split('/');
		let EvaluationID = parseInt(link[link.length - 2]);

		// let postID = parseInt(linkClone);

		// --------------
		console.log(UID);
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		getAPI({
			Token: Token,
			UID: UID,
			EvaluationID: EvaluationID,
		});
	}, []);

	return (
		<>
			<h1 className="main-title-page">{t('Detail Feedback')}</h1>
			{loading ? (
				<SkeletonLessonDetail />
			) : (
				<>
					<div className="media-body-wrap pd-15 shadow">
						<div className="row">
							<div className="col-md-6 col-sm-12">
								{/* <!--thông tin buổi học--> */}
								<div className="st-thontinbuoihoc">
									<h5 className="main-title">{t('lesson-information')}</h5>
									<div className="infomation__wrap">
										<div className="st-time">
											<p className="st-time-text">
												<i className="fa fa-user-clock st-icon wd-20 mg-r-5"></i>
												<span className="tx-black tx-normal">
													{t('package')}:{' '}
												</span>
												<span>{state?.PackageName}</span>
											</p>
										</div>

										<div className="st-time">
											<p className="st-teacher-text">
												<i className="fas fa-chalkboard-teacher st-icon wd-20 mg-r-5"></i>
												<span>{t('teacher')}:</span>{' '}
												<span className="st-tengv">{state?.TeacherName}</span>
											</p>
										</div>
										<div className="st-time">
											<p className="st-teacher-text">
												<i className="fa fa-book-open st-icon wd-20 mg-r-5"></i>
												<span>
													{t('material')}: <span>{state.Material}</span>
												</span>
											</p>
										</div>
									</div>
								</div>
								{/* <!--/thông tin buổi học--> */}
							</div>
							<div className="col-md-6 col-sm-12">
								{/* <!--thang danh gia--> */}
								<div className="st-thangdanhgia">
									<h5 className="main-title">{t('notes')}</h5>
									<div className="wrapNote">
										<p>{state?.Note}</p>
									</div>
									{/* {(state.Rate === 0 || state.Rate) && (
										<div className="d-block mg-b-15 st-rating">
											<div className="cell text-left">
												<i className="fas fa-chalkboard-teacher st-icon wd-20 mg-r-5"></i>
												<span className="mg-r-5">{t('teacher')}:</span>
												<div className="d-inline-block st-noidung-rating">
													<div className="rating-stars">
														<span className="empty-stars">
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
														</span>
														<span
															className="filled-stars"
															style={{ width: `${state.Rate * 20}%` }}
														>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
														</span>
													</div>
													{renderRatingStars(state.Rate)}
												</div>
											</div>
										</div>
									)}
									{(state.StudentRate == 0 || state.StudentRate) && (
										<div className="d-block st-rating">
											<div className="cell text-left">
												<i className="fas fa-user-graduate st-icon wd-20 mg-r-5"></i>
												<span className="mg-r-5">{t('student')}:</span>
												<div className="d-inline-block st-noidung-rating">
													<div className="rating-stars">
														<span className="empty-stars">
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
														</span>
														<span
															className="filled-stars"
															style={{ width: `${state.StudentRate * 20}%` }}
														>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
														</span>
													</div>
													{renderRatingStars(state.StudentRate)}
												</div>
											</div>
										</div>
									)} */}
									<div className="st-title-danhgia mg-b-15">
										<h5 className="pd-b-10"></h5>
									</div>
								</div>
							</div>
						</div>
						<div className="review__wrap mg-t-15 sec">
							{/* <h5 className="main-title">{t('remark')}</h5>
					
							<div className="st-title-danhgia mg-b-15">
								<h5 className="pd-b-10 bd-b">{state.ContentRate}</h5>
							</div> */}
							{/* <div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">{t('grammar')}</h5>
								</div>
								<div className="row">
									<div className="col-12">
										<div className="st-item-danhgia tx-gray-500">
											{state.Grammar ? (
												<p
													className="word-break"
													dangerouslySetInnerHTML={{
														__html: decodeHTML(state.Grammar),
													}}
												></p>
											) : (
												<p className="word-break tx-danger">
													Chưa có đánh giá cho phần này
												</p>
											)}
										</div>
									</div>
								</div>
							</div> */}
							{/* <!--/Đánh giá ngữ pháp-->
                      <!--Đánh giá phát âm--> */}
							{/* <div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">{t('pronunciation')}</h5>
								</div>
								<div className="row">
									<div className="col-12">
										<div className="st-item-danhgia tx-gray-500">
											{state.Pronunciation ? (
												<p
													className="word-break"
													dangerouslySetInnerHTML={{
														__html: decodeHTML(state.Pronunciation),
													}}
												></p>
											) : (
												<p className="word-break tx-danger">
													Chưa có đánh giá cho phần này
												</p>
											)}
										</div>
									</div>
								</div>
							</div> */}
							{/* <!--/Đánh giá phát âm-->
                      <!--Đánh giá từ vựng--> */}
							{/* <div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">{t('vocabulary')}</h5>
								</div>
								<div className="row">
									<div className="col-12">
										<div className="st-item-danhgia tx-gray-500">
											{state.Vocabulary ? (
												<p
													className="word-break"
													dangerouslySetInnerHTML={{
														__html: decodeHTML(state.Vocabulary),
													}}
												></p>
											) : (
												<p className="word-break tx-danger">
													Chưa có đánh giá cho phần này
												</p>
											)}
										</div>
									</div>
								</div>
							</div> */}
							{/* <!--/Đánh giá từ vựng-->
                      		<!--Từ cần ghi nhớ--> */}
							{/* <div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">
										{t('sentence-development-and-speak')}
									</h5>
								</div>

								<div className="st-item-danhgia tx-gray-500">
									{state.SentenceDevelopmentAndSpeak ? (
										<p
											className="word-break"
											dangerouslySetInnerHTML={{
												__html: decodeHTML(state.SentenceDevelopmentAndSpeak),
											}}
										></p>
									) : (
										<p className="word-break tx-danger">
											Chưa có đánh giá cho phần này
										</p>
									)}
								</div>
							</div> */}
							{/* <!--/Từ cần ghi nhớ-->
                      	<!--Đánh giá giáo viên--> */}
							{/* <div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">{t('general-comment')}</h5>
								</div>

								<div className="st-item-danhgia tx-gray-500">
									{state.Note ? (
										<p
											className="word-break"
											dangerouslySetInnerHTML={{
												__html: decodeHTML(state.Note),
											}}
										></p>
									) : (
										<p className="word-break tx-danger">
											Chưa có đánh giá cho phần này
										</p>
									)}
								</div>
							</div> */}
							{/* <!--/Đánh giá giáo viên-->
                      <!--Đánh giá học viên--> */}
							{/* <div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">
										{t('students-comment-on-the-lesson')}
									</h5>
								</div>
								{Object.keys(state).length === 0 ? (
									''
								) : state.StudentEvaluation ? (
									<div className="st-item-danhgia tx-gray-500">
										<p
											className="word-break"
											dangerouslySetInnerHTML={{
												__html: decodeHTML(state.StudentEvaluation),
											}}
										></p>
									</div>
								) : (
									<>
										<p className="tx-danger">
											Bạn chưa đánh giá về lớp học này
										</p>
										<button
											className="btn btn-primary mg-r-10"
											data-toggle="modal"
											data-target="#js-md-rate"
										>
											Đánh Giá
										</button>
									</>
								)}
							</div> */}
						</div>
						<RatingLessonModal
						// TeacherUID={state.TeacherUID}
						// TeacherName={state.TeacherName}
						// callback={onCallbackRating}
						/>
					</div>
				</>
			)}
			<ToastContainer />
		</>
	);
};

// LessonDetail.getLayout = getStudentLayout;
// export default LessonDetail;

LessonDetail.getLayout = getStudentLayout;
LessonDetail.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});

export default withTranslation('common')(LessonDetail);
