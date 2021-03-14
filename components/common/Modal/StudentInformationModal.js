import React from 'react';
import { teacherGetStudentInfo } from '~/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import dataInfo from '../../../data/data.json';

function getData() {
	const andt = dataInfo.InfoModalStudent;
	return andt;
}
const initialState = {
	stImageUrl: '../assets/img/default-avatar.png',
	stPhone: '',
	stEmail: '',
	stSkypeId: '',
	stName: '',
	stSex: '',
	stCourseLearning: '',
	stLastLesson: '',
	stLanguage: '',
	stIntroduce: '',
	StudentName: '',
	stTimeZone: '',
	stDescription: '',
};

const StudentInformationModal = React.forwardRef(({ studentId }, ref) => {
	const [state, setState] = React.useState(initialState);
	const [isLoading, setIsloading] = React.useState(true);
	const getAPI = async (params) => {
		setIsloading(true);
		// if (!!!studentId) return;

		const res = await teacherGetStudentInfo(params);
		// const res = await teacherGetStudentInfo({ params, StudentUID: studentId });
		if (res.Code !== 200) {
			setIsloading(false);
			setState(initialState);
			return;
		}
		setState({
			...res.data,
			stImageUrl: res.Data.Avatar,
			stStudentName: res.Data.StudentName,
			stSex: res.Data.Gender,
			stLanguage: res.Data.LanguageString,
			stTimeZone: res.Data.TimezoneName,
			stIntroduce: res.Data.Introduce,
			stSkypeId: res.Data.SkypeID,
			stEmail: res.Data.Email,
			stPhone: res.Data.Phone,
		});
		setIsloading(false);
	};

	const hotData = getData();

	React.useEffect(() => {
		getAPI({
			UID: 61230,
			studentUID: 61215,
			Token: '',
		});
	}, [studentId]);
	return (
		<>
			<div
				className="modal effect-scale show"
				tabIndex={-1}
				role="dialog"
				id="js-md-studentInfo"
				ref={ref}
			>
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Student information</h5>
							<button
								type="button"
								className="close"
								data-dismiss="modal"
								aria-label="Close"
							>
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<div className="modal-body">
							<div className="d-flex">
								<div className="flex-shrink-0 mg-r-15">
									<img
										src={dataInfo.InfoModalStudent[0].stImageUrl}
										className="avatar-xxl avatar-xl rounded object-fit"
									/>
								</div>
								<div className="flex-grow-1">
									<div className="d-flex mg-b-15">
										<div className="wd-150 tx-medium">
											<span>Full name:</span>
										</div>
										<div className="col">
											<span>{state.stStudentName}</span>
										</div>
									</div>
									<div className="d-flex mg-b-15">
										<div className="wd-150 tx-medium">
											<span>SkypeID:</span>
										</div>
										<div className="col">
											<span>{state.stSkypeId}</span>
										</div>
										{/* <div className="col"> */}
										{/* <span className="valign-middle mg-r-5 tx-primary"><i className="fa fa-mars" /></span> */}

										{/* {dataInfo.InfoModalStudent[0].stSex === 1 && (
												<span className="valign-middle mg-r-5 tx-primary">
													<i className="fa fa-mars" />
												</span>
											)}
											{dataInfo.InfoModalStudent[0].stSex === 2 && (
												<span className="valign-middle mg-r-5 tx-primary">
													<i className="fa fa-venus" />
												</span>
											)}
											{dataInfo.InfoModalStudent[0].stSex === 3 && (
												<span className="valign-middle mg-r-5 tx-primary">
													<i className="fa fa-genderless" />
												</span>
											)}
											<span>{dataInfo.InfoModalStudent[0].stSex}</span> */}
										{/* </div> */}
									</div>
									<div className="d-flex mg-b-15">
										<div className="wd-150 tx-medium">
											<span>Phone:</span>
										</div>
										<div className="col">
											<span>{state.stPhone}</span>
										</div>
									</div>
									<div className="d-flex mg-b-15">
										<div className="wd-150 tx-medium">
											<span>Email:</span>
										</div>
										<div className="col">
											<span>{state.stEmail}</span>
										</div>
									</div>
									{/* <div className="d-flex mg-b-15">
                                        <div className="wd-150 tx-medium">
                                            <span>Language:</span>
                                        </div>
                                        <div className="col">
                                            <span>{!isLoading ? state.stLanguage : <Skeleton />}</span>
                                        </div>
                                    </div> */}

									<div className="d-flex mg-b-15">
										<div className="wd-150 tx-medium">
											<span>Timezone:</span>
										</div>
										<div className="col">
											<span>{state.stTimeZone}</span>
										</div>
									</div>
								</div>
							</div>
							<div className="required-list mg-t-5 bd-t pd-t-5">
								<div className="required-text-box mg-t-15">
									<label className="tx-medium">
										<i className="fas fa-info-circle mg-r-5"></i> Student
										description:
									</label>
									<p>{state.stIntroduce}</p>
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
						</div>
					</div>
				</div>
			</div>
		</>
	);
});

export default StudentInformationModal;
