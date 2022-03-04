import React, { useEffect } from 'react';
import { randomId } from '~/utils';
import { teacherStudentFeedback, getOverviewFeedback } from '~/api/teacherAPI';
import './index.module.scss';
import Skeleton from 'react-loading-skeleton';
import Pagination from 'react-js-pagination';
import { getLayout } from '~/components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const FeedbackRow = ({
	data: {
		id,
		stName,
		Avatar,
		StudentName,
		ContentFeedBack,
		stFeedback,
		Rating,
		ClassTime,
		LessonName,
		rating,
		DocumentRate,
		InternetRate,
		SatisfiedRate,
		FeedbackLink,
		PerformanceRate,
	},
	t,
	isLoading = false,
}) => {
	return (
		<div className="fb-item">
			<div className="fb-avatar">
				{isLoading ? (
					<Skeleton circle={true} className="avatar" />
				) : (
					<img
						src={Avatar ? Avatar : '/static/assets/img/user.png'}
						alt="avatar"
						className="avatar"
					/>
				)}
			</div>
			<div className="fb-info">
				<div className="name-rating mg-b-0-f">
					<p className="name">
						{isLoading ? <Skeleton width={200} /> : StudentName}
					</p>
				</div>

				<div className="metas mg-b-10-f">
					{isLoading ? (
						<Skeleton
							width={100}
							height={15}
							style={{ marginLeft: '10px', marginRight: '10px' }}
						/>
					) : (
						<div className="meta">
							<span className="tx-medium">{t('Class time')}:</span>
							{''}
							<span className="tx-normal">{ClassTime}</span>
						</div>
					)}
					{isLoading ? (
						<Skeleton width={100} height={15} />
					) : (
						<div className="meta">
							<span className="tx-medium">{t('Lesson')}:</span>{' '}
							<span className="tx-normal">{LessonName}</span>
						</div>
					)}
				</div>
				<div className="feedback-comment mg-b-15-f">
					<ul className="listFeedback">
						<li>
							<span className="text">Document rate:</span>{' '}
							<span>{DocumentRate}</span>{' '}
							<FontAwesomeIcon icon="star" className="fa fa-star tx-warning" />
						</li>
						<li>
							<span className="text">Internet rate:</span>{' '}
							<span>{InternetRate}</span>{' '}
							<FontAwesomeIcon icon="star" className="fa fa-star tx-warning" />
						</li>
						<li>
							<span className="text">Satisfied rate:</span>{' '}
							<span>{SatisfiedRate}</span>{' '}
							<FontAwesomeIcon icon="star" className="fa fa-star tx-warning" />
						</li>
						<li>
							<span className="text">Performance rate:</span>{' '}
							<span>{PerformanceRate}</span>{' '}
							<FontAwesomeIcon icon="star" className="fa fa-star tx-warning" />
						</li>
					</ul>
					<p className="title-fb">Content feedback:</p>
					{isLoading ? (
						<Skeleton count={3} />
					) : ContentFeedBack !== '' ? (
						<p className="word-break">{ContentFeedBack}</p>
					) : (
						'...'
					)}
				</div>
				{/* <div className="actions">
					{isLoading ? (
						<Skeleton height={32} width={100} />
					) : (
						<Link
							href="/teacher/evaluation/detail/[eid]"
							as={`/evaluation/detail/361`}
						>
							<a href={true} className="btn btn-sm btn-success mg-r-10">
								<FontAwesomeIcon
									icon="vote-yea"
									className="fas fa-vote-yea mg-r-5"
								/>{' '}
								View evaluation
							</a>
						</Link>
					)}
				</div> */}
			</div>
		</div>
	);
};

const RenderSummary = ({ handFilterValue, t }) => {
	const router = useRouter();
	const [overview, setOverview] = React.useState({});
	const [isLoading, setIsLoading] = React.useState(true);

	const fetchSummary = async () => {
		setIsLoading(true);
		try {
			const res = await getOverviewFeedback();
			res.Code === 1 && setOverview(res.Data);
		} catch (error) {
			console.log(error.message);
		}
		setIsLoading(false);
	};

	const _onChangeFilter = (e) => {
		handFilterValue(e.target.value);
	};

	React.useEffect(() => {
		console.log(overview);
	}, [overview]);

	React.useEffect(() => {
		if (!localStorage.getItem('isLogin')) {
			router.push({
				pathname: '/',
			});
		} else {
			let RoleID = parseInt(localStorage.getItem('RoleID'));
			if (RoleID !== 4) {
				localStorage.clear();
				router.push({
					pathname: '/',
				});
			}
		}
		fetchSummary();
		RenderSummary.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);

	return (
		<div className="filter-sidebar flex-shrink-0">
			<div className="fb-summary-container">
				<p className="tx-16">
					Last 100 Student Rating Average:{' '}
					<span className="tx-primary tx-20 tx-bold">
						{isLoading ? <Skeleton width={15} /> : overview?.Avarage ?? ''}
					</span>
				</p>
				<div className="fb-summary">
					<div className="fb-type">
						<div className="fb-radio">
							<label>
								<input
									type="radio"
									name="fbType"
									group="feedback"
									value=""
									defaultChecked
									onChange={_onChangeFilter}
								/>
								<span>
									All feedbacks{' '}
									<span className="number">{overview.AllEvaluation}</span>
								</span>
							</label>
						</div>
					</div>
					<div className="fb-type">
						<div className="fb-radio">
							<label>
								<input
									type="radio"
									name="fbType"
									group="feedback"
									value="5"
									onChange={_onChangeFilter}
								/>
								<span>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>{' '}
									Excellent{' '}
									<span className="number">
										{isLoading ? (
											<Skeleton width={15} />
										) : (
											overview?.EvaluationRate5 ?? ''
										)}
									</span>
								</span>
							</label>
						</div>
					</div>
					<div className="fb-type">
						<div className="fb-radio">
							<label>
								<input
									type="radio"
									name="fbType"
									group="feedback"
									value="4"
									onChange={_onChangeFilter}
								/>
								<span>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>{' '}
									Good
									<span className="number">
										{isLoading ? (
											<Skeleton width={15} />
										) : (
											overview?.EvaluationRate4 ?? ''
										)}
									</span>
								</span>
							</label>
						</div>
					</div>
					<div className="fb-type">
						<div className="fb-radio">
							<label>
								<input
									type="radio"
									name="fbType"
									group="feedback"
									value="3"
									onChange={_onChangeFilter}
								/>
								<span>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>{' '}
									Average
									<span className="number">
										{isLoading ? (
											<Skeleton width={15} />
										) : (
											overview?.EvaluationRate3 ?? ''
										)}
									</span>
								</span>
							</label>
						</div>
					</div>
					<div className="fb-type">
						<div className="fb-radio">
							<label>
								<input
									type="radio"
									name="fbType"
									group="feedback"
									value="2"
									onChange={_onChangeFilter}
								/>
								<span>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>{' '}
									Bad
									<span className="number">
										{isLoading ? (
											<Skeleton width={15} />
										) : (
											overview?.EvaluationRate2 ?? ''
										)}
									</span>
								</span>
							</label>
						</div>
					</div>
					<div className="fb-type">
						<div className="fb-radio">
							<label>
								<input
									type="radio"
									name="fbType"
									group="feedback"
									value="1"
									onChange={_onChangeFilter}
								/>
								<span>
									<FontAwesomeIcon
										icon="star"
										className="fa fa-star tx-warning"
									/>{' '}
									Very bad
									<span className="number">
										{isLoading ? (
											<Skeleton width={15} />
										) : (
											overview?.EvaluationRate1 ?? ''
										)}
									</span>
								</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const StudentFeedback = ({ t }) => {
	const [filterValue, setFilterValue] = React.useState('');
	const [feedbacks, setFeedbacks] = React.useState(null);
	const [isLoading, setIsLoading] = React.useState(true);
	const [pageNumber, setPageNumber] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(null);
	const [data, setData] = React.useState();
	const [totalResult, setTotalResult] = React.useState(null);

	const getAPI = async (params) => {
		setIsLoading(true);
		const res = await teacherStudentFeedback(params);
		if (res.Code === 200) {
			setData(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		} else {
			setData({});
		}
		setIsLoading(false);
	};

	React.useEffect(() => {
		StudentFeedback.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, [feedbacks]);

	React.useEffect(() => {
		let UID = null;
		let Token = null;

		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		getAPI({
			sort: 0,
			page: 1,
			UID: parseInt(UID),
			Token: Token,
		});

		$('body').removeClass('show-aside');
	}, [filterValue]);

	return (
		<>
			<h1 className="main-title-page">{t('student-feedback')}</h1>
			<div className="mg-t-30 feedback-container">
				{/* <RenderSummary handFilterValue={setFilterValue} /> */}
				<div className="fb-list">
					{isLoading ? (
						<>
							<FeedbackRow data={{}} isLoading={isLoading} />
							<FeedbackRow data={{}} isLoading={isLoading} />
							<FeedbackRow data={{}} isLoading={isLoading} />
						</>
					) : (
						<>
							{!!data && data.length > 0 ? (
								[...data].map((fb, index) => (
									<FeedbackRow
										key={`${index + randomId()}`}
										data={{
											id: fb.id,
											StudentName: fb?.StudentName ?? '',
											Avatar: fb?.Avatar,
											ContentFeedBack: fb?.ContentFeedBack ?? '',
											ClassTime: fb?.ClassTime ?? '',
											LessonName: fb?.LessonName ?? '',
											Rating: fb.Rating,
											FeedbackLink: fb.FeedbackLink,
											DocumentRate: fb?.DocumentRate,
											InternetRate: fb?.InternetRate,
											SatisfiedRate: fb?.SatisfiedRate,
											PerformanceRate: fb?.PerformanceRate,
										}}
										t={t}
										isLoading={isLoading}
									/>
								))
							) : (
								<div className="card card-custom">
									<div className="card-body tx-center">
										<img
											src="/static/img/no-data.svg"
											alt="empty"
											className="wd-250 mg-x-auto mg-b-30-f mg-t-30"
										/>
										<div className="tx-center tx-danger tx-16">
											No rating {filterValue}{' '}
											<FontAwesomeIcon
												icon="star"
												className="fa fa-star tx-warning"
											/>{' '}
											from students
										</div>
									</div>
								</div>
							)}
							{totalResult > pageSize && (
								<Pagination
									innerClass="pagination justify-content-end"
									activePage={pageNumber}
									itemsCountPerPage={pageSize}
									totalItemsCount={totalResult}
									pageRangeDisplayed={5}
									onChange={(page) => setPageNumber(page)}
									itemClass="page-item"
									linkClass="page-link"
									activeClass="active"
								/>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
};

// StudentFeedback.getLayout = getLayout;
// export default StudentFeedback;

StudentFeedback.getLayout = getLayout;

export default withTranslation('common')(StudentFeedback, RenderSummary);
