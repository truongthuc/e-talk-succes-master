import React, { useReducer, useState, useRef, useEffect } from 'react';
import Pagination from 'react-js-pagination';
import { GetListFeedback, addEvaluation } from '~/api/studentAPI';
import { convertDateFromTo, randomId } from '~/utils';
import Skeleton from 'react-loading-skeleton';
import './index.module.scss';
import { getStudentLayout } from '~/components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { i18n, withTranslation } from '~/i18n';
import Modal from 'react-bootstrap/Modal';
import Button from '@material-ui/core/Button';
import TextareaAutosize from 'react-autosize-textarea';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';
import { toast, ToastContainer } from 'react-toastify';

const initialState = {
	isLoading: true,
	lessonInfo: null,
	rate: null,
	note: '',
	grammar: '',
	pronounce: '',
	memorize: '',
	summary: '',
	vocabulary: '',
	finishedType: '',
	internetRate: '',
	documentRate: '',
	performanceRate: '',
	satisfiedRate: '',
	ContentRate: '',
	finishedOptions: [],
	studentComments: [
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
	],
};
const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		marginBottom: '20px',
		'& > * + *': {
			marginTop: theme.spacing(1),
		},
	},
}));
const reducer = (prevState, { type, payload }) => {
	switch (type) {
		case 'UPDATE_STATE':
			return {
				...prevState,
				[payload.key]: payload.value,
			};
			break;

		default:
			break;
	}
};
const StatelessTextarea = (props) => {
	const [state, setState] = useState(props?.defaultValue ?? '');
	return (
		<TextareaAutosize
			{...props}
			onChange={(e) => setState(e.target.value)}
			value={state}
			onBlur={props.handleChangeValue}
		/>
	);
};
let start = '',
	end = '';

const LessonItem = ({
	BookingID,
	DocumentID,
	DocumentDetailID,
	CourseName,
	LessionName,
	PackgaeName,
	feedbackID,
	StudyDate,
	LessonDetail,
	start,
	end,
	date,
	t,
	TeacherUID,
	TeacherName,
	Status,
	StatusString,
	statusSubmit,
	ContentFeedBack,
	InternetRate,
	PerformanceRate,
	SatisfiedRate,
	DocumentRate,
}) => {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);

	const [state, dispatch] = useReducer(reducer, initialState);
	const updateState = (key, value) => {
		dispatch({ type: 'UPDATE_STATE', payload: { key, value } });
	};

	const handleShow = () => {
		setShow(true);
	};

	const [dataUser, setDataUser] = useState();

	console.log('Data Feed ID: ', feedbackID);

	const [submitLoading, setSubmitLoading] = useState(false);

	const _submitFeedback = async (e) => {
		e.preventDefault();
		try {
			// if (!state?.rate) {
			// 	toast.warning('Please leave your rate !!', {
			// 		position: toast.POSITION.TOP_CENTER,
			// 		autoClose: 2000,
			// 	});
			// 	return;
			// }
			// https: setSubmitLoading(true);
			const res = await addEvaluation({
				UID: dataUser.UID,
				token: dataUser.token,
				feedbackID: state.feedbackID,
				internetRate: state.internetRate,
				documentRate: state.documentRate,
				performanceRate: state.performanceRate,
				satisfiedRate: state.satisfiedRate,
				ContentRate: state.ContentRate,
				feedbackID: feedbackID,
			});
			if (res.Code === 200) {
				toast.success('Update feedback success!', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
				statusSubmit();
				setShow(false);
			} else {
				toast.error('Update feedback failed !!', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
			}
		} catch (error) {
			console.log(
				error?.message ?? 'Lỗi gọi api addEvaluation, vui lòng xem lại tham số',
			);
		}
		setSubmitLoading(false);
	};

	useEffect(() => {
		if (localStorage.getItem('isLogin')) {
			let UID = localStorage.getItem('UID');
			let token = localStorage.getItem('token');
			setDataUser({
				UID: UID,
				token: token,
			});
		}
		ScholarshipFeedback.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);

	const classes = useStyles();
	return (
		<tr>
			<td style={{ letterSpacing: '0.5px' }}>{CourseName}</td>
			<td>{PackgaeName}</td>
			<td className="tx-nowrap">{TeacherName}</td>
			<td style={{ whiteSpace: 'pre-line' }}>{StudyDate}</td>
			<td className="tx-nowrap">
				<span className="">{ContentFeedBack}</span>
				<ToastContainer
					position="top-right"
					autoClose={2000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</td>
			<td style={{ textAlign: 'right' }}>
				<Button className="btn  btn-icon btn-info" onClick={handleShow}>
					<i className="fas fa-file-alt mg-r-10"></i>
					{t('Remark')}
				</Button>

				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Thông tin đánh giá</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="raiting-box">
							<div className={classes.root}>
								<div className="rating-item">
									<span className="txt-rating">Kết nối mạng:</span>
									<Rating
										name="internetRate"
										defaultValue={InternetRate}
										size="large"
										onClick={(e) =>
											updateState(
												'internetRate',
												parseInt(e.target.getAttribute('value')),
											)
										}
									/>
								</div>
								<div className="rating-item">
									<span className="txt-rating">Sách / tài liệu:</span>
									<Rating
										name="documentRate"
										defaultValue={DocumentRate}
										size="large"
										onClick={(e) =>
											updateState(
												'documentRate',
												parseInt(e.target.getAttribute('value')),
											)
										}
									/>
								</div>
								<div className="rating-item">
									<span className="txt-rating">Hiệu quả giáo viên:</span>
									<Rating
										name="performanceRate"
										defaultValue={PerformanceRate}
										size="large"
										onClick={(e) =>
											updateState(
												'performanceRate',
												parseInt(e.target.getAttribute('value')),
											)
										}
									/>
								</div>
								<div className="rating-item">
									<span className="txt-rating">Hài lòng của học viên:</span>
									<Rating
										name="satisfiedRate"
										defaultValue={SatisfiedRate}
										size="large"
										onClick={(e) =>
											updateState(
												'satisfiedRate',
												parseInt(e.target.getAttribute('value')),
											)
										}
									/>
								</div>
							</div>
							<textarea
								defaultValue={ContentFeedBack}
								placeholder={t('Type feedback')}
								onChange={(e) => updateState('ContentRate', e.target.value)}
							></textarea>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button className="btn  btn-icon btn-default" onClick={handleClose}>
							{t('Close')}
						</Button>
						<Button
							className="btn  btn-icon btn-info mar-l-10"
							onClick={_submitFeedback}
						>
							{submitLoading ? (
								<span
									className="spinner-border wd-20 ht-20 mar-r-5"
									role="status"
								>
									<span className="sr-only">Submitting...</span>
								</span>
							) : (
								<>
									<FontAwesomeIcon icon="save" className="mar-r-5" />
								</>
							)}
							<span>{t('Submit Feedback')}</span>
						</Button>
					</Modal.Footer>
				</Modal>
			</td>
		</tr>
	);
};

const ScholarshipFeedback = ({ t }) => {
	const [data, setData] = useState({});
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [loading, setLoading] = useState(true);
	const [statusSubmit, setStatusSubmit] = useState(false);
	console.log('DATA feedback: ', data);

	const getAPI = async (params) => {
		setLoading(false);
		const res = await GetListFeedback(params);
		if (res.Code === 200) {
			setData(res.Data);
			// setLoading(true);
			// setPageSize(res.PageSize);
			// setTotalResult(res.TotalResult);
		} else {
			setData({});
		}
		setLoading(false);
	};

	const handlePageChange = (pageNumber) => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			getAPI({
				FromDate: fromDate,
				ToDate: toDate,
				Page: pageNumber,
			});
		}
	};

	const onSubmit = (e) => {
		e.preventDefault();
		getAPI({
			FromDate: fromDate,
			ToDate: toDate,
			Page: 1,
		});
		setPage(1);
		start = fromDate;
		end = toDate;
	};

	console.log('DATA: ', data);

	useEffect(() => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		if (statusSubmit) {
			getAPI({
				UID: UID,
				Token: Token,
				Page: 1,
			});

			setStatusSubmit(false);
		}
	}, [statusSubmit]);

	useEffect(() => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		getAPI({
			UID: UID,
			Token: Token,
			Page: 1,
		});
		$('body').removeClass('show-aside');
	}, []);
	return (
		console.log('render'),
		(
			<>
				<h1 className="main-title-page">{t('scholarship-feedback')}</h1>
				<div className="card">
					<div className="card-body">
						<div className="table-responsive mg-t-20">
							<table className="table  table-fb">
								<thead className="">
									<tr>
										<th>{t('course')}</th>
										<th>{t('package')}</th>
										<th>{t('teacher')}</th>
										<th>{t('date')}</th>
										<th>{t('feebback')}</th>
										<th>{t('Action')}</th>
									</tr>
								</thead>
								<tbody>
									{
										loading ? (
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
													<td>
														<Skeleton />
													</td>
												</tr>
											</>
										) : data?.length > 0 ? (
											data.map((item) => (
												<LessonItem
													key={item.BookingID}
													BookingID={item.BookingID}
													DocumentID={item.DocumentID}
													CourseName={item.CourseName}
													DocumentDetailID={item.DocumentDetailID}
													PackgaeName={item.PackgaeName}
													LessonDetail={item.LessonDetail}
													date={item.Schedule}
													TeacherUID={item.TeacherUID}
													TeacherName={item.TeacherName}
													Status={item.Status}
													StatusString={item.StatusString}
													StudyDate={item.StudyDate}
													feedbackID={item.ID}
													ContentFeedBack={item.ContentFeedBack}
													statusSubmit={() => setStatusSubmit(true)}
													t={t}
													InternetRate={item.InternetRate}
													DocumentRate={item.DocumentRate}
													PerformanceRate={item.PerformanceRate}
													SatisfiedRate={item.SatisfiedRate}
												/>
											))
										) : (
											data.length === 0 && (
												<tr className="bg-transparent">
													<td colSpan="6" className="tx-center">
														<img
															src="/static/img/no-data.svg"
															alt="no-booking"
															className="wd-200 d-block mx-auto"
														/>
														<p className="tx-danger tx-medium mg-t-15">
															{start.length > 0 && end.length > 0
																? `Bạn chưa đăng ký lớp học nào từ ${
																		start.length > 0 ? `${start}` : ''
																  }  ${end.length > 0 ? `đến ${end}` : ''}`
																: start.length === 0 && end.length === 0
																? `Bạn chưa đăng ký lớp học nào`
																: start.length === 0
																? `Bạn chưa đăng ký lớp học nào trước ${end}`
																: `Bạn chưa đăng ký lớp học nào sau ${start}`}
														</p>
														{/* <Link href="/student/booking-schedule">
															<a href={true} className="btn btn-primary">
																Đặt lịch học
															</a>
														</Link> */}
													</td>
												</tr>
											)
										)
										// : (
										// 	!loading && (
										// 		<tr className="bg-transparent">
										// 			<td colSpan="6" className="tx-center">
										// 				<span className="d-block text-center tx-danger tx-medium">
										// 					Đã có lỗi xảy ra, xin vui lòng thử lại
										// 				</span>
										// 				<img
										// 					src="/static/assets/img/error.svg"
										// 					alt="error"
										// 					className="wd-200 mg-b-15 m-auto"
										// 				/>
										// 			</td>
										// 			<td></td>
										// 		</tr>
										// 	)
										// )
									}
								</tbody>
							</table>
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
				</div>
			</>
		)
	);
};

// EvaluationLists.getLayout = getStudentLayout;

// export default EvaluationLists;

ScholarshipFeedback.getLayout = getStudentLayout;

export default withTranslation('common')(ScholarshipFeedback);
