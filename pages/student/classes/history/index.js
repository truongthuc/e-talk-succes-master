import React, { useState, useEffect, useReducer } from 'react';
import Pagination from 'react-js-pagination';
import {
	GetPaymentHistory,
	LoadCourseStudent,
	CreateFeeConfirm,
	UpdateFeeConfirm,
	LoadFeeConfirm,
	DeleteFeeConfirm,
} from '~/api/studentAPI';
// import { convertDateFromTo, randomId } from '~/utils';
import Skeleton from 'react-loading-skeleton';
import './index.module.scss';
import { getStudentLayout } from '~/components/Layout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import dayjs from 'dayjs';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';

// import DateTimePicker from 'react-datetime-picker';

import { makeStyles } from '@material-ui/core/styles';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AirlineSeatIndividualSuiteSharp } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		position: 'relative',
		outline: 'none',
		border: 'none',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: '35px 20px',
		borderRadius: '5px',
		width: '45%',
		height: 'auto',

		[theme.breakpoints.down('lg')]: {
			width: '55%!important',
			height: '98%!important',
		},
		[theme.breakpoints.down('sm')]: {
			width: '98%!important',
			height: '98%!important',
		},
	},
	CloseIconModal: {
		position: 'absolute',
		padding: '10px',
		right: '0',
		top: '0px',
		cursor: 'pointer',
		background: 'none',
		border: 'none',
	},
	styleLoading: {
		width: '20px!important',
		height: '20px!important',
		color: 'white',
		marginRight: '5px',
	},
	btnSubmit: {},
}));

let start = '',
	end = '';

const LessonItem = ({ data, funcEdit, funcDelete }) => {
	const fixInfo = () => {
		funcEdit(data.ID);
	};

	const deleteInfo = () => {
		funcDelete(data.ID);
	};

	return (
		<>
			<tr>
				<td style={{ letterSpacing: '0.5px' }}>{data.CoursesName}</td>
				<td style={{ whiteSpace: 'pre-line' }}>{data.DocumentName}</td>
				<td className="">{data.TotalNumberofClass}</td>
				<td className="">
					<span>{data.RegistedPhone}</span>
				</td>
				<td className="">
					<span>{data.PaymentDate}</span>
				</td>
				<td className="">
					<span>{data.Amount}</span>
				</td>
				<td className="">
					<span>{data.PayerName}</span>
				</td>
				<td className="">
					<span>{data.PaymentTypeName}</span>
				</td>
				<td className="">
					<span>{data.ModifiedBy}</span>
				</td>
				<td className="">
					<span>{data.Reason}</span>
				</td>
				<td className="text-primary">
					<span>{data.StatusName}</span>
				</td>
				<td className=" tx-center">
					{data.Status === 0 && (
						<td>
							<a
								href={true}
								className="d-inline-block btn-icon btn btn-sm btn-edit rounded-5 mg-sm-r-5-f"
								onClick={fixInfo}
							>
								<EditIcon />
							</a>

							<a
								href={true}
								className="d-inline-block btn-icon btn btn-sm btn-delete rounded-5 mg-sm-r-5-f"
								onClick={deleteInfo}
							>
								<DeleteIcon />
							</a>
						</td>
					)}
				</td>
			</tr>
		</>
	);
};

const EvaluationLists = ({ t }) => {
	const router = useRouter();

	const classes = useStyles();
	const [data, setData] = useState({});
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [loading, setLoading] = useState(true);
	const [statusUpdate, setStatusUpdate] = useState(false);

	const getAPI = async (params) => {
		setLoading(false);
		const res = await GetPaymentHistory(params);
		if (res.Code === 200) {
			setData(res.Data);
			setLoading(true);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		} else {
			setData({});
		}
		setLoading(false);
	};

	const [startDate, setStartDate] = useState(new Date());
	const [showBox, setShowBox] = useState(false);

	// ---- modal ----
	const [edit, setEdit] = useState(false);
	const [dataEdit, setDataEdit] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [infoPack, setInfoPack] = useState();
	const [values, setValues] = useState({
		CourseStudentID: null,
		PayerName: '',
		RegistedPhone: '',
		Amount: '',
		DayTrading: new Date(),
		PaymentType: 1,
		ToBank: '',
		FromBank: '',
		PaymentMethod: 0,
	});
	console.log('Value: ', values);
	const [open, setOpen] = React.useState(false);
	const [listErrors, setListErrors] = useState({
		PayerName: false,
		RegistedPhone: false,
		Amount: false,
		ToBank: false,
		FromBank: false,
	});
	const openModal = (e) => {
		e.preventDefault();
		setOpen(true);
		getInfo_Student();
		setValues({
			...values,
			DayTrading: new Date(),
			PaymentType: 1,
			ToBank: '',
			FromBank: '',
			PaymentMethod: 0,
		});
		setShowBox(false);
	};

	const getInfo_Student = () => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		(async () => {
			try {
				const res = await LoadCourseStudent({
					UID: UID,
					Token: Token,
				});

				if (res.Code === 200) {
					if (res.Data) {
						setInfoPack(res.Data);
						setValues({
							...values,
							CourseStudentID: res.Data.CourseStudentID.toString(),
							UID: UID,
							Token: Token,
							PayerName: '',
							RegistedPhone: '',
							Amount: '',
							DayTrading: new Date(),
							PaymentType: 1,
							ToBank: '',
							FromBank: '',
							PaymentMethod: 0,
						});
					}
				} else if (res.Code === 403) {
					localStorage.clear();
					router.push({
						pathname: '/login/signin',
					});
				} else {
					toast.error('Something wrong!');
				}
			} catch (error) {
				console.log('Error: ', error);
			}
		})();
	};

	const closeModal = () => {
		setOpen(false);
	};

	const handleChange_getValue = (e) => {
		let text = e.target.value;
		setValues({
			...values,
			[e.target.name]: text,
		});
	};

	const handleChange_choose = (e) => {
		if (e.target.value === '1') {
			setShowBox(false);
			setValues({
				...values,
				PaymentMethod: 0,
			});
		} else {
			setShowBox(true);
		}
		setValues({
			...values,
			PaymentType: parseInt(e.target.value),
		});
	};

	const handleChange_select = (e) => {
		let method = parseInt(e.target.value);
		setValues({
			...values,
			PaymentMethod: method,
		});
	};

	const updatePayment = () => {
		setIsLoading(true);

		(async () => {
			try {
				const res = await UpdateFeeConfirm(values);
				if (res.Code === 200) {
					toast.success(res.Message);
					setStatusUpdate(true);
					setEdit(false);
				} else if (res.Code === 403) {
					localStorage.clear();
					router.push({
						pathname: '/',
					});
				} else {
					toast.error(res.Message);
				}
			} catch (error) {
				console.log('Error: ', error);
			}
			setOpen(false);
			setIsLoading(false);
		})();
	};

	const createPaymentAPI = () => {
		setListErrors({
			PayerName: false,
			RegistedPhone: false,
			Amount: false,
			ToBank: false,
			FromBank: false,
		});
		(async () => {
			try {
				const res = await CreateFeeConfirm(values);
				if (res.Code === 200) {
					toast.success(res.Message);
					setStatusUpdate(true);
				} else if (res.Code === 403) {
					localStorage.clear();
					router.push({
						pathname: '/',
					});
				} else {
					toast.error(res.Message);
				}
			} catch (error) {
				console.log('Error: ', error);
			}
			setOpen(false);
			setIsLoading(false);
		})();
	};

	const createPayment = () => {
		setIsLoading(true);

		let PayerName = false;
		let RegistedPhone = false;
		let Amount = false;
		let ToBank = false;
		let FromBank = false;

		if (
			values.PayerName === '' ||
			values.RegistedPhone === '' ||
			values.Amount === '' ||
			values.ToBank === '' ||
			values.FromBank === ''
		) {
			if (values.PayerName == '') {
				PayerName = true;
			}
			if (values.RegistedPhone == '') {
				RegistedPhone = true;
			}
			if (values.Amount == '') {
				Amount = true;
			}

			if (values.PaymentType === 0) {
				if (values.FromBank == '') {
					FromBank = true;
				}
				if (values.ToBank == '') {
					ToBank = true;
				}
			}

			setListErrors({
				PayerName: PayerName,
				RegistedPhone: RegistedPhone,
				Amount: Amount,
				ToBank: ToBank,
				FromBank: FromBank,
			});
			setIsLoading(false);
		}

		if (values.PaymentType === 1) {
			if (
				values.PayerName !== '' &&
				values.RegistedPhone !== '' &&
				values.Amount !== ''
			) {
				createPaymentAPI();
			}
		} else {
			if (
				values.PayerName !== '' &&
				values.RegistedPhone !== '' &&
				values.Amount !== '' &&
				values.FromBank !== '' &&
				values.ToBank !== ''
			) {
				createPaymentAPI();
			}
		}
	};

	const funcDelete = (ID) => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		(async () => {
			try {
				const res = await DeleteFeeConfirm({
					UID: UID,
					Token: Token,
					FeeConfirmID: ID,
				});

				if (res.Code === 200) {
					toast.success(res.Message);
					setStatusUpdate(true);
				} else if (res.Code === 403) {
					localStorage.clear();
					router.push({
						pathname: '/login/signin',
					});
				} else {
					toast.error('Something wrong!');
				}
			} catch (error) {
				console.log('Error: ', error);
			}
		})();
	};

	const funcEdit = (ID) => {
		setOpen(true);
		setEdit(true);

		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		(async () => {
			try {
				const res = await LoadFeeConfirm({
					UID: UID,
					Token: Token,
					FeeConfirmID: ID,
				});

				if (res.Code === 200) {
					console.log('TEST: ', res.Data.DayTrading);
					setValues({
						...values,
						UID: UID,
						Token: Token,
						FeeConfirmID: ID,
						PayerName: res.Data.PayerName,
						RegistedPhone: res.Data.RegistedPhone,
						Amount: res.Data.Amount,
						DayTrading: dayjs(res.Data.DayTrading, 'DD/MM/YYYY HH:mm').toDate(),
						PaymentType: res.Data.PaymentType,
						ToBank: res.Data.ToBank,
						FromBank: res.Data.FromBank,
						PaymentMethod: res.Data.PaymentMethod,
					});
					if (res.Data.PaymentType === 0) {
						setShowBox(true);
					}
				} else if (res.Code === 403) {
					localStorage.clear();
					router.push({
						pathname: '/login/signin',
					});
				} else {
					toast.error('Something wrong!');
				}
			} catch (error) {
				console.log('Error: ', error);
			}
		})();
	};
	// ---- ----- ----

	console.log(
		'TEST NEW DATE: ',
		dayjs('14/05/2021 14:15', 'MM/DD/YYYY HH:mm').toDate(),
	);

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

	useEffect(() => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		if (statusUpdate) {
			getAPI({
				UID: UID,
				Page: 1,
				Token: Token,
				fromdate: '',
				todate: '',
			});
			setStatusUpdate(false);
		}
	}, [statusUpdate]);

	useEffect(() => {
		console.log('run this');
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
		getInfo_Student();

		getAPI({
			UID: UID,
			Page: 1,
			Token: Token,
			fromdate: '',
			todate: '',
		});

		$('body').removeClass('show-aside');
		EvaluationLists.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);
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
						<button
							className={classes.CloseIconModal}
							onClick={() => setOpen(false)}
						>
							<CloseIcon />
						</button>
						<div className="container form-his">
							<div className="box-border">
								<div className="box-title">
									<h5 class="title-form border-title">Package Information</h5>
								</div>
								<div className="row">
									<div className="col-md-6 col-12">
										<div className="row-input">
											<label>Student Code</label>
											<input
												type="text"
												name="studentCode"
												value={infoPack?.StudentCode}
												disabled
												required
											></input>
										</div>

										<div className="row-input mb-0">
											<label>Course</label>
											<input
												type="text"
												name="course"
												value={infoPack?.CourseName}
												disabled
												required
											></input>
										</div>
									</div>
									<div className="col-md-6 col-12">
										<div className="row-input ">
											<label>Package</label>
											<input
												type="text"
												name="Package"
												value={infoPack?.PackageName}
												disabled
												required
											></input>
										</div>

										<div className="row-input mb-0">
											<label>Total Number Of Classes</label>
											<input
												type="text"
												name="total"
												value={infoPack?.StudyDay}
												disabled
												required
											></input>
										</div>
									</div>
								</div>
							</div>
							<div className="box-border mt-5">
								<div className="box-title">
									<h5 className="text-center title-form border-title">
										Submit Payment
									</h5>
								</div>
								<div className="row">
									<div className="col-md-6 col-12">
										<div className="row-input">
											<label>Payer Name</label>
											<input
												type="text"
												onChange={handleChange_getValue}
												name="PayerName"
												value={values?.PayerName}
												required
											></input>
											{listErrors.PayerName && (
												<p class="error">
													{t('You have to type this content')}
												</p>
											)}
										</div>
										<div className="row-input">
											<label>Registed Phone</label>
											<input
												type="number"
												onChange={handleChange_getValue}
												name="RegistedPhone"
												required
												value={values?.RegistedPhone}
											></input>
											{listErrors.RegistedPhone && (
												<p class="error">
													{t('You have to type this content')}
												</p>
											)}
										</div>
										<div className="row-input">
											<label>Amount</label>
											<input
												type="number"
												onChange={handleChange_getValue}
												name="Amount"
												value={values?.Amount}
												required
											></input>
											{listErrors.Amount && (
												<p class="error">
													{t('You have to type this content')}
												</p>
											)}
										</div>
										<div className="row-input">
											<label>Day Trading</label>
											<DatePicker
												className="datebook"
												dateFormat="dd/MM/yyyy"
												selected={values?.DayTrading}
												// onChange={(date) => setStartDate(date)}
												onChange={(value) => {
													setStartDate(value);
													setValues({
														...values,
														DayTrading: value,
													});
												}}
												showTimeSelect
												timeFormat="p"
												timeIntervals={15}
												dateFormat="Pp"
											/>
										</div>
									</div>
									<div className="col-md-6 col-12">
										<div className="row-input">
											<label>Payment Type</label>
											<select
												onChange={handleChange_choose}
												value={values?.PaymentType}
											>
												<option value="1">Cash</option>
												<option value="0">Bank</option>
											</select>
										</div>
										{showBox && (
											<>
												<div className="row-input">
													<label>To Bank</label>
													<input
														type="text"
														onChange={handleChange_getValue}
														name="ToBank"
														value={values?.ToBank}
													></input>
													{listErrors.ToBank && (
														<p class="error">
															{t('You have to type this content')}
														</p>
													)}
												</div>
												<div className="row-input">
													<label>From bank</label>
													<input
														type="text"
														onChange={handleChange_getValue}
														name="FromBank"
														value={values?.FromBank}
													></input>
													{listErrors.FromBank && (
														<p class="error">
															{t('You have to type this content')}
														</p>
													)}
												</div>
												<div className="row-input">
													<label>Payment Method</label>
													<select
														onChange={handleChange_select}
														value={values?.PaymentMethod}
													>
														<option value="1">ATM</option>
														<option value="2">Internet Banking</option>
														<option value="0">Tiền mặt</option>
													</select>
												</div>
											</>
										)}
									</div>
								</div>
							</div>
							<div className="row mt-3">
								<div className="col-12 text-center">
									{edit ? (
										<Button
											className={classes.btnSubmit}
											variant="contained"
											color="secondary"
											onClick={updatePayment}
										>
											{isLoading && (
												<CircularProgress className={classes.styleLoading} />
											)}
											Update
										</Button>
									) : (
										<Button
											className={classes.btnSubmit}
											variant="contained"
											color="secondary"
											onClick={createPayment}
										>
											{isLoading && (
												<CircularProgress className={classes.styleLoading} />
											)}
											Create
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>
				</Fade>
			</Modal>

			<h1 className="main-title-page">{t('payment-history')}</h1>
			<div className="card">
				<div className="card-body">
					{values?.CourseStudentID !== null && (
						<div className="d-flex justify-content-end row-add-new">
							<a
								href={data.LinkFile}
								className="d-inline-block btn-icon btn btn-sm btn-primary rounded-5 mg-sm-r-5-f"
								onClick={openModal}
							>
								Add new
							</a>
						</div>
					)}

					<div className="table-responsive mg-t-20">
						<table className="table table-his table-fb">
							<thead className="">
								<tr>
									<th>{t('course')}</th>
									<th>{t('lesson')}</th>
									<th>{t('Total Class')}</th>
									<th>{t('phone')}</th>
									<th>{t('payment-date')}</th>
									<th>{t('Amount')}</th>
									<th>{t('Payer name')}</th>
									<th>{t('Payment Type')}</th>
									<th>{t('Role')}</th>
									<th>{t('Reason')}</th>
									<th>{t('Status')}</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
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
								) : !!data && Array.isArray(data) && data.length > 0 ? (
									data.map((item) => (
										<LessonItem
											// key={item.BookingID}
											// BookingID={item.BookingID}
											// DocumentID={item.DocumentID}
											// DocumentName={item.CoursesName}
											// DocumentDetailID={item.DocumentDetailID}
											// LessionName={item.DocumentName}
											// LessonDetail={item.LessonDetail}
											// date={item.PaymentDate}
											// TeacherUID={item.TeacherUID}
											// TeacherName={item.PayerName}
											// StatusName={item.StatusName}
											// StatusString={item.StatusString}
											data={item}
											funcEdit={(ID) => funcEdit(ID)}
											funcDelete={(ID) => funcDelete(ID)}
										/>
									))
								) : data.length === 0 ? (
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
											<Link href="/student/booking-schedule">
												<a href={true} className="btn btn-primary">
													Đặt lịch học
												</a>
											</Link>
										</td>
									</tr>
								) : (
									!loading && (
										<tr className="bg-transparent">
											<td colSpan="6" className="tx-center">
												<span className="d-block text-center tx-danger tx-medium">
													Đã có lỗi xảy ra, xin vui lòng thử lại
												</span>
												<img
													src="/static/assets/img/error.svg"
													alt="error"
													className="wd-200 mg-b-15"
												/>
											</td>
										</tr>
									)
								)}
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
	);
};

// EvaluationLists.getLayout = getStudentLayout;

// export default EvaluationLists;

EvaluationLists.getLayout = getStudentLayout;

export default withTranslation('common')(EvaluationLists);
