import React from 'react';
import './index.module.scss';
import { decodeHTML } from '~/utils';
import dayjs from 'dayjs';
const StudentCommentItem = ({
	ScheduleTimeVN,
	TeacherName,
	TeacherIMG,
	TeacherUID,
	Note,
	Rate,
	LinkDetail,
	DocumentName,

	CreatedDate,
	Evaluation,
	StudentIMG,
	StudentName,
}) => {
	return (
		<div className="fb-item">
			<div className="fb-avatar">
				<img
					src={
						!!TeacherIMG
							? TeacherIMG
							: !!StudentIMG
							? StudentIMG
							: '/static/assets/img/default-avatar.png'
					}
					alt="avatar"
					className="avatar"
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = '/static/assets/img/default-avatar.png';
					}}
				/>
			</div>
			<div className="fb-info">
				<div className="name-rating">
					{!!TeacherName ? (
						<a
							className="no-hl"
							href={`/ElearnStudent/teacherDetail?ID=${TeacherUID}`}
						>
							<p className="name">{TeacherName}</p>
						</a>
					) : !!StudentName ? (
						<p className="name">{StudentName}</p>
					) : (
						''
					)}
					<div className="rating-wrap">
						<div className="rating-stars">
							<span className="empty-stars">
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
							</span>
							<span className="filled-stars" style={{ width: `${Rate * 20}%` }}>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
							</span>
						</div>
					</div>
				</div>
				<div className="feedback-comment">
					<p
						className="word-break"
						dangerouslySetInnerHTML={{
							__html: decodeHTML(
								!!Note ? Note : !!Evaluation ? Evaluation : '',
							),
						}}
					></p>
				</div>
				<div className="metas">
					{ScheduleTimeVN ? (
						<div className="meta">
							Time: <span>{ScheduleTimeVN} </span>{' '}
						</div>
					) : CreatedDate ? (
						<div className="meta">
							Time:{' '}
							<span>
								{dayjs(CreatedDate).format('dddd, MMMM D, YYYY h:mm A')}
							</span>{' '}
						</div>
					) : (
						''
					)}
					{DocumentName && <div className="meta">{DocumentName}</div>}
				</div>
				{LinkDetail && (
					<div className="readmore">
						<a href={LinkDetail}>
							Xem chi tiết <i className="fas fa-arrow-right"></i>
						</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default StudentCommentItem;
