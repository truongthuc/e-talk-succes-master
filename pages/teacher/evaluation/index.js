import React, { useEffect } from 'react';
import { randomId } from '~/utils';
import { getFeedback, getOverviewFeedback } from '~/api/teacherAPI';
import './index.module.scss';
import Skeleton from 'react-loading-skeleton';
import Pagination from 'react-js-pagination';
import { getLayout } from '~/components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const feedbackDemo = [
	{
		id: randomId(),
		stName: 'Truong Van Lam',
		stAvatar: null,
		stFeedback: '',
		lessonTime: '12/06/2020 10:30AM (Vietnam Time)',
		lessonName: 'Lesson 6: ReactJS application',
		rating: '5',
	},
	{
		id: randomId(),
		stName: 'Truong Van Lam',
		stAvatar:
			'https://i.pinimg.com/236x/aa/84/88/aa8488c0bdc927ac836586c004c7cb12.jpg',
		stFeedback:
			'Buổi học rất tốt, giảng viên nhiệt tình. Giảng viên phát âm rất chuẩn chỉnh',
		lessonTime: '12/06/2020 10:30AM (Vietnam Time)',
		lessonName: 'Lesson 6: ReactJS application',
		rating: '3',
	},
];

const commentDemo = [
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
];

const FeedbackRow = ({
	data: {
		id,
		stName,
		stAvatar,
		stFeedback,
		lessonTime,
		lessonName,
		rating,
		FeedbackLink,
	},
	isLoading = false,
}) => {
	return (
		<div className="fb-item">
			<div className="fb-avatar">
				{isLoading ? (
					<Skeleton circle={true} className="avatar" />
				) : (
					<img
						src={stAvatar || '../assets/img/default-avatar.png'}
						alt="avatar"
						className="avatar"
					/>
				)}
			</div>
			<div className="fb-info">
				<div className="name-rating mg-b-0-f">
					<p className="name">
						{isLoading ? <Skeleton width={200} /> : stName}
					</p>
					<div className="rating-wrap">
						<div className="rating tx-warning">
							{isLoading ? (
								<Skeleton width={100} height={24} />
							) : (
								[...Array(5)].map((el, index) =>
									5 - index <= rating ? (
										<FontAwesomeIcon
											icon="star"
											key={`${index}`}
											className="fas fa-star"
										/>
									) : (
										<FontAwesomeIcon
											icon={['far', 'star']}
											key={`${index}`}
											className="far fa-star"
										/>
									),
								)
							)}
						</div>
					</div>
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
							<span className="tx-medium">Class time:</span>{' '}
							<span className="tx-normal">{lessonTime}</span>
						</div>
					)}
					{isLoading ? (
						<Skeleton width={100} height={15} />
					) : (
						<div className="meta">
							<span className="tx-medium">Lesson:</span>{' '}
							<span className="tx-normal">{lessonName}</span>
						</div>
					)}
				</div>
				<div className="feedback-comment mg-b-15-f">
					{isLoading ? (
						<Skeleton count={3} />
					) : !!stFeedback && stFeedback !== '' ? (
						<p className="word-break">{stFeedback}</p>
					) : (
						<p className="tx-danger tx-medium">
							The student didn't leave any feedback for this class
						</p>
					)}
				</div>
				<div className="actions">
					{isLoading ? (
						<Skeleton height={32} width={100} />
					) : (
						<a
							href={FeedbackLink}
							className="btn btn-sm btn-success mg-r-10"
							target="_blank"
							rel="noopener"
						>
							<FontAwesomeIcon
								icon="vote-yea"
								className="fas fa-vote-yea mg-r-5"
							/>{' '}
							View evaluation
						</a>
					)}
				</div>
			</div>
		</div>
	);
};

const RenderSummary = ({ handFilterValue }) => {
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
		fetchSummary();
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
										className="fa fa-star tx-warning"
										icon="star"
									/>
									<FontAwesomeIcon
										className="fa fa-star tx-warning"
										icon="star"
									/>
									<FontAwesomeIcon
										className="fa fa-star tx-warning"
										icon="star"
									/>
									<FontAwesomeIcon
										className="fa fa-star tx-warning"
										icon="star"
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
									<FontAwesomeIcon className="fa fa-star tx-warning" />
									<FontAwesomeIcon className="fa fa-star tx-warning" /> Bad
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
									<FontAwesomeIcon className="fa fa-star tx-warning" /> Very bad
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

const Evaluation = () => {
	const [filterValue, setFilterValue] = React.useState('');
	const [feedbacks, setFeedbacks] = React.useState(null);
	const [isLoading, setIsLoading] = React.useState(true);
	const [pageNumber, setPageNumber] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(null);
	const [totalResult, setTotalResult] = React.useState(null);

	const fetchFeedback = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await getFeedback({
				Rate: filterValue !== '' ? parseInt(filterValue) : 0,
				Page: page,
			});
			if (res.Code === 1) {
				res.Data.length > 0
					? setFeedbacks(
							res.Data.map((fb) => {
								return {
									...fb,
									id: fb.StudentUID,
									stName: fb.StudentName,
									stAvatar: fb.StudentIMG,
									stFeedback: fb.Evaluation,
									lessonTime: fb?.ScheduleDate ?? '',
									lessonName: fb.Lession,
									rating: fb.Rate,
									FeedbackLink: fb.FeedbackLink,
								};
							}),
					  )
					: setFeedbacks([]);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			}
		} catch (error) {
			setFeedbacks([]);
			console.log(error.message);
		}
		setIsLoading(false);
	};

	React.useEffect(() => {
		console.log(feedbacks);
	}, [feedbacks]);

	React.useEffect(() => {
		fetchFeedback();
	}, [filterValue]);

	React.useEffect(() => {
		fetchFeedback(pageNumber);
	}, [pageNumber]);

	return (
		<>
			<h1 className="main-title-page">Student feedback</h1>
			<div className="mg-t-30 feedback-container">
				<RenderSummary handFilterValue={setFilterValue} />
				<div className="fb-list">
					{isLoading ? (
						<>
							<FeedbackRow data={{}} isLoading={isLoading} />
							<FeedbackRow data={{}} isLoading={isLoading} />
							<FeedbackRow data={{}} isLoading={isLoading} />
						</>
					) : (
						<>
							{!!feedbacks && feedbacks.length > 0 ? (
								[...feedbacks].map((fb, index) => (
									<FeedbackRow
										key={`${index + randomId()}`}
										data={{
											id: fb.id,
											stName: fb?.stName ?? '',
											stAvatar:
												fb?.stAvatar ?? '../assets/img/default-avatar.png',
											stFeedback: fb?.stFeedback ?? '',
											lessonTime: fb?.lessonTime ?? '',
											lessonName: fb?.lessonName ?? '',
											rating: fb.rating,
											FeedbackLink: fb.FeedbackLink,
										}}
										isLoading={isLoading}
									/>
								))
							) : (
								<div className="card card-custom">
									<div className="card-body tx-center">
										<img
											src="../assets/img/empty.svg"
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

Evaluation.getLayout = getLayout;

export default Evaluation;
