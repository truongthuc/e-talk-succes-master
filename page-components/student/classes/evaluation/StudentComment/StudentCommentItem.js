import React from 'react';
import './StudentCommentItem.module.scss';
import { decodeHTML } from '~/utils';
import dayjs from 'dayjs';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const StudentCommentItem = ({
	ScheduleTimeVN,
	TeacherName,
	TeacherIMG,
	EvaluationID,
	Note,
	Rate,
	LinkDetail,
	LinkFile,
	CoursesName,
	DocumentName,
	CreatedDate,
	Evaluation,
	StudentIMG,
	StudentName,
	t,
}) => {
	return (
		<div className="fb-item">
			<div className="fb-avatar">
				<img src={'/static/img/avatar.jpg'} alt="avatar" className="avatar" />
			</div>
			<div className="fb-info">
				<div className="name-rating">
					{!!TeacherName ? (
						<a
							className="no-hl"
							href={`/ElearnStudent/teacherDetail?ID=${EvaluationID}`}
						>
							<p className="name">{TeacherName}</p>
						</a>
					) : !!StudentName ? (
						<p className="name">{StudentName}</p>
					) : (
						''
					)}
				</div>
				<div className="wrapCourse">
					<p style={{ marginBottom: '0' }}>
						<b>{t('Course Name')}:</b>{' '}
						<span style={{ color: '#fa005e', fontWeight: 'bold' }}>
							{CoursesName}
						</span>
					</p>
				</div>
				<div className="metas">
					{CreatedDate ? (
						<div className="meta">
							Time: <span>{CreatedDate} </span>{' '}
						</div>
					) : CreatedDate ? (
						<div className="meta">
							Time: <span>{dayjs(CreatedDate).format('LLLL')}</span>{' '}
						</div>
					) : (
						''
					)}
					{/* {CoursesName && <div className="meta"></div>} */}
				</div>
				<div className="feedback-comment mg-b-15-f">
					<p
						className="word-break"
						dangerouslySetInnerHTML={{
							__html: decodeHTML(
								!!Note ? Note : !!Evaluation ? Evaluation : '',
							),
						}}
					></p>
				</div>
				<div className="actions">
					{LinkDetail && (
						<Link href={LinkFile} as={LinkFile}>
							<a href={LinkFile} className="btn btn-sm btn-info mg-r-10">
								<FontAwesomeIcon
									icon="vote-yea"
									className="fas fa-vote-yea mg-r-5"
								/>{' '}
								{t('Feedback of teacher')}
							</a>
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default StudentCommentItem;
