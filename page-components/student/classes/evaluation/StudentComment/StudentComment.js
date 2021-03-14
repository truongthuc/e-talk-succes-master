import React, { useState, useEffect } from 'react';
import StudentCommentItem from './StudentCommentItem';
import Pagination from 'react-js-pagination';
import { GetEvaluationContent } from '~/api/studentAPI';
import SkeletonFeedback from './../SkeletonFeedback';
import Skeleton from 'react-loading-skeleton';

const StudentComment = ({ TeacherUID }) => {
	const [state, setState] = useState([]);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [loading, setLoading] = useState(true);

	const handlePageChange = (pageNumber) => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			getCommentAPI({
				TeacherUID,
				Page: pageNumber,
			});
		}
	};

	const getCommentAPI = async (params) => {
		setLoading(true);
		const res = await GetEvaluationContent(params);
		if (res.Code === 200) {
			setState(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		}
		setLoading(false);
	};

	useEffect(() => {
		getCommentAPI({
			TeacherUID,
			Page: page,
		});
	}, []);
	return loading ? (
		<>
			<Skeleton className="mb-2" height={20} width={200} />
			<SkeletonFeedback />
		</>
	) : (
		<>
			<div className="tc-comment-wrap bd-t-0-f mg-t-0-f pd-t-0-f">
				<h6 className="mg-b-15">
					{totalResult == 0
						? 'Giáo viên hiện chưa có phản hồi'
						: `${totalResult} học viên đã để lại phản hồi:`}
				</h6>
				<div className="comment__wrapper">
					{!!state &&
						state.length > 0 &&
						state.map((item, index) => (
							<StudentCommentItem
								key={item.ElearnBookingID}
								ScheduleTimeVN={item.ScheduleTimeVN}
								TeacherName={item.TeacherName}
								TeacherIMG={item.TeacherIMG}
								EvaluationID={item.EvaluationID}
								Note={item.Note}
								CreatedDate={item.CreatedDate}
								Rate={item.Rate}
								LinkDetail={item.LinkDetail}
							/>
						))}
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
			</div>
		</>
	);
};
export default StudentComment;
