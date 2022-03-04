import React, { useState, useEffect, useRef, useReducer } from 'react';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
import { getScheduleLog } from '~/api/teacherAPI';
// import Pagination from 'react-js-pagination';
import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import {
	teacherEvaluatedClasses,
	addScheduleLog,
	teacherDeleteEvaluation,
	UploadFileEvaluation,
	teacherUpdateEvaluation,
} from '~/api/teacherAPI';
import { Popover, OverlayTrigger, Overlay } from 'react-bootstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';
import { toast, ToastContainer } from 'react-toastify';
import { toastInit } from '~/utils';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		border: 'none',
		borderRadius: '5px',
		padding: '22px 25px',
		width: '400px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		outline: 'none!important',
	},
	paperContent: {
		width: '100%',
		textAlign: 'center',
		background: '#f3f3f3',
		padding: '20px',
		borderRadius: '5px',
	},
	styleFile: {
		margin: 'auto',
		width: '190px',
		display: 'block',
	},
	btnSubmit: {
		position: 'relative',
	},
	loading: {
		width: '20px!important',
		height: '20px!important',
		color: 'white!important',
		marginRight: '10px!important',
	},
	boxFile: {
		border: '1px solid #dadada',
		padding: '10px',
		borderRadius: '5px',
	},
}));

// ----------- PHÂN TRANG ---------------

const initialState = {
	page: 1,
	TotalResult: null,
	PageSize: null,
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'ADD_PAGE':
			return {
				...state,
				TotalResult: action.res.TotalResult,
				PageSize: action.res.PageSize,
			};
		case 'SELECT_PAGE':
			return {
				...state,
				page: action.page,
			};
		default:
			throw new Error();
	}
};

// ------------------------------------

const FinishedRow = ({ data, showStudentModal, statusDelete }) => {
	const {
		EvaluationID,
		BookingID,

		StudentName,
		StudentUID,
		LessonName,
		CoursesName,
		DocumentName,
		TimeZoneName,
		VNTime,
		LessionName,
		SkypeID,

		StudentCode,
		StatusString,
		Status,
		FinishedType,
		LessionMaterial,
		GenderID,
		SpecialRequest,
	} = data;
	const classes = useStyles();
	const [fileRating, setFileRating] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	console.log('file Rating: ', fileRating);

	const handleEnterClass = async (e) => {
		e.preventDefault();
		try {
			addScheduleLog({ BookingID });
		} catch (error) {
			console.log(error?.message ?? `Can't add schedule log !!`);
		}
		window.location.href = `skype:${SkypeID}?chat`;
	};

	// ---- modal ----
	const [open, setOpen] = React.useState(false);

	const openModal = (e) => {
		e.preventDefault();
		setOpen(true);
	};

	const closeModal = () => {
		setOpen(false);
	};

	// ---- ----- ----

	// ----- GET FILE AND SUBMIT ------

	const getFile = (e) => {
		let file = e.target.files[0];

		(async () => {
			try {
				const res = await UploadFileEvaluation(file);
				if (res.Code === 200) {
					setFileRating(res.Data.toString());
				} else if (res.Code === 403) {
					router.push('/login/signin');
				} else {
					toast.error('Somethings wrong!');
				}
			} catch (error) {
				console.log('Error: ', error);
			}
		})();
	};

	const onSubmit = () => {
		// let fileChange = fileRating?.toString();

		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}
		setIsLoading(true);
		(async () => {
			try {
				const res = await teacherUpdateEvaluation({
					UID: UID,
					Token: Token,
					EvaluationID: EvaluationID,
					GeneralEvaluation: fileRating,
				});
				if (res.Code === 200) {
					toast.success('Update Success');
					statusDelete();
				} else if (res.Code === 403) {
					localStorage.clear();
					router.push('/login/signin');
				} else {
					toast.error('Somethings wrong!');
				}
			} catch (error) {
				console.log('Error: ', error);
			}
			setIsLoading(false);

			setOpen(false);
		})();
	};

	const deleteItem = (e) => {
		e.preventDefault();

		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		(async () => {
			try {
				const res = await teacherDeleteEvaluation({
					UID: UID,
					Token: Token,
					EvaluationID: EvaluationID,
				});

				if (res.Code === 200) {
					statusDelete();
					toast.success('Delete feedback success!', {
						position: toast.POSITION.TOP_CENTER,
						autoClose: 2000,
					});
				}
			} catch (error) {
				console.log('Error: ', error);
			}
		})();
	};

	return (
		<>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={open}
				onClose={closeModal}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<div className={classes.paper}>
						<div className={classes.paperContent}>
							<h5 id="transition-modal-title" style={{ marginBottom: '20px' }}>
								Upload file here
							</h5>
							<div className={classes.boxFile}>
								<input
									type="file"
									className={classes.styleFile}
									onChange={getFile}
								></input>
							</div>
							<Button
								variant="contained"
								style={{ marginTop: '15px', marginRight: '10px' }}
								onClick={closeModal}
							>
								Close
							</Button>
							<Button
								variant="contained"
								color="secondary"
								style={{ marginTop: '15px' }}
								className={classes.btnSubmit}
								onClick={onSubmit}
								disable={isLoading}
							>
								{isLoading && <CircularProgress className={classes.loading} />}
								Send
							</Button>
						</div>
					</div>
				</Fade>
			</Modal>
			<tr>
				<td>
					<div className="mg-b-5">
						<span className="">{StudentCode}</span>
					</div>
				</td>
				<td style={{ textAlign: 'left' }}>
					<span> {StudentName}</span>
				</td>

				<td>
					<span className="">{CoursesName}</span>
				</td>
				<td style={{ width: '38%' }}>
					<p className="">{LessonName}</p>
				</td>

				<td
					className="clr-actions tx-center"
					style={{ width: '21%', textAlign: 'right' }}
				>
					<a
						href={true}
						className="d-inline-block btn btn-sm btn-secondary rounded-5 mg-sm-r-5-f"
						onClick={openModal}
					>
						<EditIcon />
					</a>
					<a
						href={data.LinkFile}
						className="d-inline-block btn btn-sm btn-success rounded-5 mg-sm-r-5-f"
						target="_blank"
					>
						<GetAppIcon />
					</a>
					<a
						href={true}
						className="d-inline-block btn btn-sm btn-danger rounded-5 mg-sm-r-5-f"
						onClick={deleteItem}
					>
						<DeleteIcon />
					</a>
				</td>
			</tr>
		</>
	);
};

const EvaluatedClasses = ({ t }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [studentId, setStudentId] = useState(null);
	const mdStudentInfo = useRef(true);
	const [state, dispatch] = useReducer(reducer, initialState);

	const [statusDelete, setStatusDelete] = useState(false);

	const showStudentModal = (StudentID) => {
		setStudentId(StudentID);
		$(mdStudentInfo.current).modal('show');
	};

	const unMountComponents = () => {
		mdStudentInfo.current = false;
	};

	useEffect(() => {
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
		return unMountComponents;
	}, []);

	const loadFinishedClass = async (params) => {
		try {
			const res = await teacherEvaluatedClasses(params);
			if (res.Code === 200) {
				dispatch({ type: 'ADD_PAGE', res });
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			}
			if (res.Code === 403) {
				localStorage.clear();
				router.push({
					pathname: '/',
				});
			}
			setIsLoading(false);
			return;
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
		setData([]);
	};

	useEffect(() => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		if (statusDelete) {
			loadFinishedClass({
				page: state.page,
				UID: UID,
			});

			setStatusDelete(false);
		}
	}, [statusDelete]);

	useEffect(() => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		loadFinishedClass({
			page: state.page,
			UID: UID,
		});

		$('body').removeClass('show-aside');
		EvaluatedClasses.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, [state.page, statusDelete]);

	return (
		<>
			<h1 className="main-title-page">{t('evaluated-classes')}</h1>
			<div className="card">
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-adt  table-borderless table-hover">
							<thead className="">
								<tr className="">
									<th>{t('student-code')}</th>
									<th>{t('student')}</th>
									<th>{t('course')}</th>
									<th className="text-left">{t('lesson')}</th>
									<th>{t('Action')}</th>
								</tr>
							</thead>
							{/*1 item*/}
							<tbody>
								{isLoading ? (
									<>
										<tr>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>

											<td>
												<Skeleton />
											</td>
										</tr>
										<tr>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>

											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
										</tr>
										<tr>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
											<td>
												<Skeleton />
											</td>
										</tr>
									</>
								) : !!data && !!data.length > 0 ? (
									data.map((item) => (
										<FinishedRow
											key={`${item.BookingID}`}
											data={item}
											showStudentModal={(StudentID) =>
												showStudentModal(StudentID)
											}
											statusDelete={() => setStatusDelete(true)}
										/>
									))
								) : (
									<tr className="bg-white-f">
										<td colSpan={5}>
											<div className="empty-error tx-center mg-t-30 bg-white mg-x-auto">
												<img
													src="/static/img/no-data.svg"
													alt="no-booking"
													className="wd-200 mg-b-15"
												/>
												<p className=" tx-danger tx-medium">
													You don't have any finished classes.
												</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{state?.TotalResult > 0 && (
						<Box display={`flex`} justifyContent={`center`} mt={4}>
							<Pagination
								count={Math.ceil(state?.TotalResult / state?.PageSize)}
								color="secondary"
								onChange={(obj, page) =>
									dispatch({ type: 'SELECT_PAGE', page })
								}
								c
							/>
						</Box>
					)}
				</div>
			</div>
			<StudentInformationModal ref={mdStudentInfo} studentId={studentId} />
		</>
	);
};

// EvaluatedClasses.getLayout = getLayout;
// export default EvaluatedClasses;

EvaluatedClasses.getLayout = getLayout;

export default withTranslation('common')(EvaluatedClasses);
