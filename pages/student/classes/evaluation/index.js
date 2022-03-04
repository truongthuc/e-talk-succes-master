import React, { useState, useEffect } from 'react';
import StudentCommentItem from '~/page-components/student/classes/evaluation/StudentComment/StudentCommentItem';
import SkeletonFeedback from '~/page-components/student/classes/evaluation/SkeletonFeedback';
import Pagination from 'react-js-pagination';
import { getFeedbackOverviewAPI } from '~/api/studentAPI';
import { GetEvaluationContent } from '~/api/studentAPI';
import './index.module.scss';
import Select, { components } from 'react-select';
import { appSettings } from '~/config';
import { getStudentLayout } from '~/components/Layout';
import { randomId } from '~/utils';
import { i18n, withTranslation } from '~/i18n';
import data from '../../../../data/data.json';
import Router, { useRouter } from 'next/router';

console.log(data);
const fakeData = [
	{
		ElearnBookingID: randomId(),
		ScheduleTimeVN: '20/09/2020 10:30 - 11:00',
		TeacherName: 'Phạm Thị Hồng Hoa',
		TeacherIMG: '/static/img/avatar.jpg',
		TeacherUID: randomId(),
		Note: 'Học viên rất tốt, tuy nhiên cần cải thiện thêm về khả năng phát âm.',
		Rate: 2,
		LinkDetail: `/student/classes/evaluation/${randomId()}`,
		DocumentName: 'React JS World Classes',
	},
	{
		ElearnBookingID: randomId(),
		ScheduleTimeVN: '20/09/2020 10:30 - 11:00',
		TeacherName: 'Phạm Thị Hồng Hoa',
		TeacherIMG: '/static/img/avatar.jpg',
		TeacherUID: randomId(),
		Note: 'Học viên rất tốt, tuy nhiên cần cải thiện thêm về khả năng phát âm.',
		Rate: 4,
		LinkDetail: `/student/classes/evaluation/${randomId()}`,
		DocumentName: 'React JS World Classes',
	},
	{
		ElearnBookingID: randomId(),
		ScheduleTimeVN: '20/09/2020 10:30 - 11:00',
		TeacherName: 'Phạm Thị Hồng Hoa',
		TeacherIMG: '/static/img/avatar.jpg',
		TeacherUID: randomId(),
		Note: 'Học viên rất tốt, tuy nhiên cần cải thiện thêm về khả năng phát âm.',
		Rate: 5,
		LinkDetail: `/student/classes/evaluation/${randomId()}`,
		DocumentName: 'React JS World Classes',
	},
	{
		ElearnBookingID: randomId(),
		ScheduleTimeVN: '20/09/2020 10:30 - 11:00',
		TeacherName: 'Phạm Thị Hồng Hoa',
		TeacherIMG: '/static/img/avatar.jpg',
		TeacherUID: randomId(),
		Note: 'Học viên rất tốt, tuy nhiên cần cải thiện thêm về khả năng phát âm.',
		Rate: 4,
		LinkDetail: `/student/classes/evaluation/${randomId()}`,
		DocumentName: 'React JS World Classes',
	},
	{
		ElearnBookingID: randomId(),
		ScheduleTimeVN: '20/09/2020 10:30 - 11:00',
		TeacherName: 'Phạm Thị Hồng Hoa',
		TeacherIMG: '/static/img/avatar.jpg',
		TeacherUID: 1,
		Note: 'Học viên rất tốt, tuy nhiên cần cải thiện thêm về khả năng phát âm.',
		Rate: 5,
		LinkDetail: `/student/classes/evaluation/${randomId()}`,
		DocumentName: 'React JS World Classes',
	},
];

const FeedbackOption = (props) => {
	const { data, children } = props;
	const numberStar = parseInt(data.value);
	return (
		<components.Option {...props}>
			<div className="d-flex justify-content-between align-items-center">
				{numberStar > 0 ? (
					<>
						<span>
							{[...Array(numberStar)].map((item, index) => {
								return (
									<i key={`${index}`} className="fas fa-star tx-warning"></i>
								);
							})}
						</span>
						<span>({data.count})</span>
					</>
				) : (
					<>
						<span>Tất cả đánh giá</span>
						<span>({data.count})</span>
					</>
				)}
			</div>
		</components.Option>
	);
};

const Feedback = ({ t }) => {
	const router = useRouter();
	const [overview, setOverview] = useState({});
	const [loading, setLoading] = useState(false);
	const [loadingListEvaluation, setLoadingListEvaluation] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [filterOption, setFilterOption] = useState({
		label: 'Tất cả đánh giá',
		value: '0',
		count: overview.AllEvaluation,
	});
	const [feedback, setFeedback] = useState([]);
	const [rate, setRate] = useState(0);

	const handlePageChange = (pageNumber) => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			_GetListEvaluationAPI({
				Rate: rate,
				Page: pageNumber,
			});
		}
	};

	const getOverViewAPI = async () => {
		setLoading(true);
		const res = await getFeedbackOverviewAPI();
		if (res.Code === 1) {
			setOverview(res.Data);
		}
		setLoading(false);
	};

	const _GetListEvaluationAPI = async (params) => {
		setLoadingListEvaluation(true);
		const res = await GetEvaluationContent(params);
		if (res.Code === 200) {
			setFeedback(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		}
		setPage(params.Page);
		setLoadingListEvaluation(false);
	};

	const fetchListEvaluation = (e) => {
		let rateFilter = parseInt(e.target.value);
		if (rateFilter === rate) return;
		setRate(rateFilter);
		_GetListEvaluationAPI({
			Rate: rateFilter,
			Page: 1,
		});
	};

	// useEffect(() => {
	// 	_GetListEvaluationAPI({
	// 		Rate: parseInt(filterOption?.value) ?? 0,
	// 		Page: 1,
	// 	});
	// }, [filterOption]);

	useEffect(() => {
		if (!localStorage.getItem('isLogin')) {
			router.push({
				pathname: '/',
			});
		} else {
			let RoleID = parseInt(localStorage.getItem('RoleID'));
			if (RoleID !== 5) {
				localStorage.clear();
				router.push({
					pathname: '/',
				});
			}
		}

		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		_GetListEvaluationAPI({
			UID: UID,
			token: Token,
		});

		$('body').removeClass('show-aside');
		Feedback.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);

	return (
		<>
			{!loading && (
				<>
					<div className="d-sm-flex align-items-center justify-content-between mg-b-30">
						<h1 className="main-title-page mg-b-0-f">
							{t('Feedback of teacher')}
						</h1>
						{overview && Object.keys(overview).length > 0 && (
							<div className="form-group d-inline-block wd-200 w-full mg-b-0-f mg-t-15 mg-sm-t-0-f">
								<Select
									components={{ Option: FeedbackOption }}
									value={filterOption}
									onChange={(value) => setFilterOption(value)}
									styles={appSettings.selectStyle}
									options={[
										{
											label: 'Tất cả đánh giá',
											value: '0',
											count: overview.AllEvaluation,
										},
										{
											label: '5 Stars',
											count: overview.EvaluationRate5,
											value: '5',
										},
										{
											label: '4 Stars',
											count: overview.EvaluationRate4,
											value: '4',
										},
										{
											label: '3 Stars',
											count: overview.EvaluationRate3,
											value: '3',
										},
										{
											label: '2 Stars',
											count: overview.EvaluationRate3,
											value: '2',
										},
										{
											label: '1 Stars',
											count: overview.EvaluationRate3,
											value: '1',
										},
									]}
									getOptionLabel={(option) => option.label}
									getOptionValue={(option) => option.value}
								/>
								{/* <select
									className="form-control main-color bg-white"
									style={{ fontFamily: 'FontAwesome' }}
									onChange={fetchListEvaluation}
								>
									<option value="0">Tất cả ({overview.AllEvaluation})</option>
									<option value="5">
										&#xf005; &#xf005; &#xf005; &#xf005; &#xf005; (
										{overview.EvaluationRate5})
									</option>
									<option value="4">
										&#xf005; &#xf005; &#xf005; &#xf005; (
										{overview.EvaluationRate4})
									</option>
									<option value="3">
										&#xf005; &#xf005; &#xf005; ({overview.EvaluationRate3})
									</option>
									<option value="2">
										&#xf005; &#xf005; ({overview.EvaluationRate2})
									</option>
									<option value="1">
										&#xf005; ({overview.EvaluationRate1})
									</option>
								</select> */}
							</div>
						)}
					</div>
					{/* <div className="fb-summary-container">
						{overview && Object.keys(overview).length > 0 ? (
							<>
								<p className="tx-16 mg-b-0">
									Trung bình 100 phản hồi gần nhất của giáo viên:{' '}
									<span className="tx-primary tx-16 tx-bold">
										{data.Overview[0].Avarage}
									</span>
								</p>
							</>
						) : (
							!loading && (
								<div className="tx-center">
									<span className="d-block text-center tx-danger tx-medium">
										Không có dữ liệu
									</span>
									<img
										src="/static/assets/img/error.svg"
										alt="error"
										className="wd-200 mg-b-15"
									/>
								</div>
							)
						)}
					</div> */}
				</>
			)}
			<div className="feedback-container">
				{loadingListEvaluation ? (
					<SkeletonFeedback />
				) : (
					<div className="fb-list">
						{!!feedback && feedback.length > 0 ? (
							feedback.map((item) => (
								<StudentCommentItem
									key={item.ElearnBookingID}
									ScheduleTimeVN={item.ScheduleTimeVN}
									TeacherName={item.TeacherName}
									TeacherIMG={item.TeacherIMG}
									EvaluationID={item.EvaluationID}
									Note={item.Note}
									CreatedDate={item.CreatedDate}
									Rate={item.Rate}
									LinkDetail={item.EvaluationID}
									LinkFile={item.LinkFile}
									CoursesName={item.CoursesName}
									t={t}
								/>
							))
						) : (
							<div className="card card-custom shadow">
								<div className="card-body tx-center">
									<span className="d-block tx-center tx-danger tx-medium">
										Bạn không có phản hồi{' '}
										{filterOption.value !== '0' && (
											<>
												{filterOption.value}
												<i className="fa fa-star"></i>
											</>
										)}{' '}
										nào
									</span>
									<img
										src="/static/img/no-data.svg"
										alt="no-booking"
										className="wd-200 mg-b-15"
									/>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
			{pageSize < totalResult && (
				<Pagination
					innerClass="pagination justify-content-end mt-3"
					activePage={page}
					itemsCountPerPage={pageSize}
					totalItemsCount={totalResult}
					pageRangeDisplayed={3}
					itemClass="page-item"
					linkClass="page-link"
					onChange={handlePageChange.bind(this)}
				/>
			)}
		</>
	);
};

// Feedback.getLayout = getStudentLayout;

// export default Feedback;

Feedback.getLayout = getStudentLayout;

export default withTranslation('common')(Feedback);
