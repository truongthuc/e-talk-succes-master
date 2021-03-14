import React from 'react';
import LessonCard from '~/components/common/LessonCard';

const NoteForStudentModal = () => {
	const [note, setNote] = React.useState('');
	return (
		<>
			<div
				className="modal effect-scale"
				tabIndex={-1}
				role="dialog"
				id="js-md-note"
			>
				<div
					className="modal-dialog modal-dialog-centered modal-lg"
					role="document"
				>
					<div className="modal-content">
						<form>
							<div className="modal-body">
								<LessonCard
									courseName="IELST Professional 8.0"
									studentName="Truong Van Lam"
									lessonDate="Monday, 30/04/2020"
									lessonStart="10:30AM"
									lessonEnd="11:00AM"
									lessonStatus="Lesson 2"
									studentNote="Good job, you have excellent coding skills !!"
									cancellable={true}
									documents={[
										{
											id: 1,
											name: 'doc 1',
											extension: 'docx',
											link: 'http://mona.media',
										},
										{
											id: 2,
											name: 'doc 2',
											extension: 'exce',
											link: 'http://mona.media',
										},
									]}
									actionDisplay={false}
								/>
								<div className="required-list mg-t-15 bd-t pd-t-15">
									<div className="required-text-box mg-t-15">
										<label className="tx-medium">Note for student:</label>
										<div className="form-group">
											<textarea
												rows={4}
												className="form-control"
												defaultValue={note}
												onChange={setNote}
												plcaeholder="Note..."
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-light"
									data-dismiss="modal"
								>
									Close
								</button>
								<button type="button" className="btn btn-primary">
									Add note
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default NoteForStudentModal;
