import React, { useState, useEffect, useRef, useReducer } from 'react';

import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import {
	teacherMissingFeedback,
	UploadFileEvaluation,
	teacherSaveEvaluation,
} from '~/api/teacherAPI';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@material-ui/core/CircularProgress';

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
		[theme.breakpoints.down('sm')]: {
			width: '98%',
		},
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
		marginLeft: '10px',
	},
	loading: {
		width: '20px!important',
		height: '20px!important',
		color: 'white!important',
		marginRight: '10px!important',
	},
	btnClose: {
		marginTop: '15px',
		backgroundColor: '#c3c3c3',
		color: 'black',
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

const MissingFeedbackRow = ({ data, statusSubmit, t }) => {
	const classes = useStyles();

	const {
		IDStudent,
		CourseStudentID,
		ScheduleTimeVN,
		ScheduleTimeUTC,
		DocumentName,
		LessionName,
		EvaluationStatus,
	} = data;

	const router = useRouter();

	const [fileRating, setFileRating] = useState();
	const [fileRemark, setFileRemark] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [loadingFile, setLoadingFile] = useState(false);
	// ---- modal ----
	const [open, setOpen] = React.useState(false);

	const openModal = (e) => {
		e.preventDefault();
		setOpen(true);
	};

	const closeModal = () => {
		setOpen(false);
	};

	// -------------

	// ----- GET FILE AND SUBMIT -------

	const getFile = (e) => {
		let file = e.target.files[0];

		console.log('FILE: ', file);

		setLoadingFile(true);

		(async () => {
			try {
				const res = await UploadFileEvaluation(file);
				if (res.Code === 200) {
					setFileRating(res.Data.toString());
					setLoadingFile(false);
					setFileRemark(file.name);
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
				const res = await teacherSaveEvaluation({
					UID: UID,
					Token: Token,
					CourseStudentID: CourseStudentID,
					GeneralEvaluation: fileRating,
				});
				if (res.Code === 200) {
					toast.success('Update Success');
					setFileRemark('');
					statusSubmit();
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

	return (
		<>
			{/* Same as */}

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
								{t('Upload file here')}
							</h5>
							<div className={classes.boxFile}>
								{fileRemark !== '' && (
									<p>
										<b>Your file</b>: {fileRemark}
									</p>
								)}
								{!loadingFile ? (
									<input
										placeholder={fileRemark}
										type="file"
										className={classes.styleFile}
										onChange={getFile}
									></input>
								) : (
									<CircularProgress color="secondary" />
								)}
							</div>
							<Button
								variant="contained"
								style={{ marginTop: '15px' }}
								className={classes.btnClose}
								onClick={closeModal}
							>
								{t('Close')}
							</Button>
							<Button
								variant="contained"
								color="secondary"
								style={{ marginTop: '15px' }}
								className={classes.btnSubmit}
								onClick={onSubmit}
								disabled={fileRemark !== '' ? false : true}
							>
								{isLoading && <CircularProgress className={classes.loading} />}
								{t('Send')}
							</Button>
						</div>
					</div>
				</Fade>
			</Modal>
			<tr>
				<td>
					<div className="mg-b-5">
						<span className="tx-success student-code">{data.IDStudent}</span>
					</div>
				</td>
				<td>
					<span className="tx-success student-name">{data.StudentName}</span>
				</td>
				<td className="clr-time">
					<span>{data.StartDate}</span>
				</td>
				<td className="clr-time">
					<span>{data.EndDate}</span>
				</td>
				<td className="clr-lesson">
					<span>{data.PackageName}</span>
				</td>
				<td className="clr-lesson">
					<span>{data.CourseName}</span>
				</td>

				<td className="clr-actions text-right">
					{/* <Link href={`/teacher/evaluation/edit/${data.CourseStudentID}`}>
				
				</Link> */}
					<a
						href={true}
						className="btn btn-sm btn-info rounded-5"
						onClick={openModal}
					>
						{/* <FontAwesomeIcon
							icon="file-signature"
							className="fas fa-file-signature clrm-icon"
							
						/>{' '} */}
						{t('Evaluate')}
					</a>
				</td>
			</tr>
		</>
	);
};

const MissingFeedbackClasses = ({ t }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [state, dispatch] = useReducer(reducer, initialState);
	const [statusSubmit, setStatusSubmit] = useState(true);

	const loadMissingFeedback = async (params) => {
		try {
			const res = await teacherMissingFeedback(params);
			if (res?.Code && res.Code === 200) {
				dispatch({ type: 'ADD_PAGE', res });
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			} else {
				console.log('Code response khác 1');
			}
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
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

		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		if (statusSubmit) {
			loadMissingFeedback({
				page: state.page,
				UID: UID,
			});

			setStatusSubmit(false);
		}
	}, [statusSubmit]);

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

		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		loadMissingFeedback({
			page: state.page,
			UID: UID,
		});

		$('body').removeClass('show-aside');
		MissingFeedbackClasses.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, [state.page]);

	return (
		<>
			<h1 className="main-title-page">{t('missing-evaluation-classes')}</h1>
			<div className="card">
				<div className="card-body">
					<>
						<div className="table-responsive ">
							<table className="table table-classrooms table-borderless table-hover">
								<thead className="">
									<tr className="">
										<th className="clr-time">{t('Student Code')}</th>
										<th className="clr-time">{t('Student Name')}</th>
										<th className="clr-lesson">{t('Start Date')}</th>
										<th className="clr-lesson">{t('End Date')}</th>
										<th className="clr-feedbackStatus">{t('package')} </th>
										<th className="clr-feedbackStatus">{t('course')} </th>
										<th className="clr-actions">{t('actions')}</th>
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
											<MissingFeedbackRow
												key={`${item.BookingID}`}
												data={item}
												statusSubmit={() => setStatusSubmit(true)}
												t={t}
											/>
										))
									) : (
										<tr className="bg-white-f">
											<td colSpan={4}>
												<div className="empty-error tx-center mg-t-30 bg-white mg-x-auto">
													<img
														src="/static/img/no-data.svg"
														alt="no-booking"
														className="wd-200 mg-b-15"
													/>
													<p className=" tx-danger tx-medium">
														Greate, all courses are evaluated.
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
					</>
				</div>
			</div>
		</>
	);
};

// MissingFeedbackClasses.getLayout = getLayout;
// export default MissingFeedbackClasses;

MissingFeedbackClasses.getLayout = getLayout;

export default withTranslation('common')(MissingFeedbackClasses);
