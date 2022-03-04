import React, { useState, useEffect, useReducer, useRef } from 'react';

import {
	GetNotifications,
	studentLoadDetailNotification,
} from '~/api/studentAPI';
import { getFormattedDate, randomId } from '~/utils';
import { getStudentLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Pagination from '@material-ui/lab/Pagination';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import ReactHtmlParser, {
	processNodes,
	convertNodeToElement,
	htmlparser2,
} from 'react-html-parser';

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		position: 'relative',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		borderRadius: '10px',
		width: '68%',
		height: '98%',

		[theme.breakpoints.down('md')]: {
			width: '75%',
		},
		[theme.breakpoints.down('sm')]: {
			width: '98%',
			padding: '16px 10px 24px 10px',
		},
	},
	btnClose: {
		position: 'absolute',
		bottom: '13px',
		left: '50%',
		transform: 'translateX(-50%)',
	},
	iconClose: {
		position: 'absolute',
		top: '0px',
		right: '0px',
		padding: '15px',
		border: 'none',
		background: 'none',
	},
	styleTitle: {
		'&:hover': {
			color: '#fa005e',
		},
	},
}));

const BlogItem = ({
	PostIMG,
	NotificationID,
	NotificationTitle,
	NotificationIMG,
	CreatedBy,
	CreatedDate,
	NotificationContent,
	URL,
	isLoading,
	showDetail,
	ID,
}) => {
	const classes = useStyles();
	const getID = (e) => {
		e.preventDefault();
		showDetail(ID);
	};

	console.log('Noti ID: ', ID);

	return (
		<div className="card card-event">
			{isLoading ? (
				<Skeleton height={150} />
			) : (
				<img src={PostIMG} className="card-img-top" alt="" />
			)}

			<div className="card-body tx-13">
				<a href="#" onClick={getID}>
					<h5 className={classes.styleTitle}>
						{isLoading ? <Skeleton /> : NotificationTitle}
					</h5>
				</a>
				<p className="meta mg-t-5">
					{isLoading ? (
						<Skeleton width={100} />
					) : (
						<>
							<span className="author main-color bg-transparent">
								{CreatedBy}
							</span>
							<span className="tx-12 tx-color-03">
								{getFormattedDate(CreatedDate)}
							</span>
						</>
					)}
				</p>
				{isLoading ? (
					<Skeleton count={3} />
				) : (
					<p
						className="mg-b-0 mg-t-10 tx-thumbnail"
						dangerouslySetInnerHTML={{ __html: NotificationContent }}
					></p>
				)}
			</div>
		</div>
	);
};

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

const Discount = ({ t }) => {
	const [open, setOpen] = React.useState(false);
	const classes = useStyles();

	const router = useRouter();
	const [pagi, dispatch] = useReducer(reducer, initialState);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [state, setState] = useState([]);
	const [loading, setLoading] = useState(false);

	const [dataDetail, setDataDetail] = useState();

	console.log('DATA Detail: ', dataDetail);

	const refID = useRef(null);

	const handlePageChange = (pageNumber) => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			getAPI({
				page: pageNumber,
			});
		}
	};

	const closeModal = () => {
		setOpen(false);
	};

	const getAPI = async (params) => {
		setLoading(true);

		const res = await GetNotifications(params);
		if (res.Code === 200) {
			dispatch({ type: 'ADD_PAGE', res });
			setState(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		}
		setLoading(false);
	};

	const showDetail = (notiID) => {
		console.log('Noti ID: ', notiID);

		setOpen(true);

		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		(async () => {
			try {
				const res = await studentLoadDetailNotification({
					ID: notiID,
					Token: Token,
				});
				if (res.Code === 200) {
					setDataDetail(res.Data);
				}
			} catch (error) {
				console.log(error);
			}
		})();
	};

	useEffect(() => {
		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

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
			$('body').removeClass('show-aside');
		}

		getAPI({
			UID: UID,
			Token: Token,
			Page: pagi.page,
		});
	}, [pagi.page]);

	useEffect(() => {
		Discount.getInitialProps = async () => ({
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
						<div className="paper-detail-noti">
							<button className={classes.iconClose} onClick={closeModal}>
								<CloseIcon />
							</button>

							{ReactHtmlParser(dataDetail?.TitlePost)}
							{ReactHtmlParser(dataDetail?.ContentPost)}
						</div>
					</div>
				</Fade>
			</Modal>
			<h1 className="main-title-page">{t('Course Discount')}</h1>
			<div className="blog__wrapper">
				<div className="row row-sm mg-b-25 blog-list">
					{loading ? (
						<>
							{' '}
							<div className="col-md-6 col-lg-4 mg-t-20">
								{' '}
								<BlogItem isLoading={loading} />
							</div>{' '}
							<div className="col-md-6 col-lg-4 mg-t-20">
								{' '}
								<BlogItem isLoading={loading} />
							</div>{' '}
							<div className="col-md-6 col-lg-4 mg-t-20">
								{' '}
								<BlogItem isLoading={loading} />
							</div>{' '}
						</>
					) : !!state && Array.isArray(state) && state.length > 0 ? (
						state.map((item) => (
							<div
								className="col-md-6 col-lg-4 mg-t-20"
								key={item.NotificationID}
							>
								<BlogItem
									NotificationID={item.NotificationID}
									NotificationTitle={item.TitlePost}
									NotificationIMG={item.PostIMG}
									CreatedBy={item.CreatedBy}
									ID={item.ID}
									CreatedDate={item.CreatedDate}
									NotificationContent={item.ContentPost}
									URL={item.URL}
									isLoading={loading}
									showDetail={(e) => showDetail(e)}
									refID={refID}
									PostIMG={item.PostIMG}
								/>
							</div>
						))
					) : (
						<div className="col-12">
							<span className="tx-danger tx-medium">
								Hiện không có thông báo nào
							</span>
						</div>
					)}
				</div>
				{state.TotalResult > 0 && (
					<Box display={`flex`} justifyContent={`center`} mt={4}>
						<Pagination
							count={Math.ceil(state?.TotalResult / state?.PageSize)}
							color="secondary"
							onChange={(obj, page) => dispatch({ type: 'SELECT_PAGE', page })}
						/>
					</Box>
				)}
			</div>
		</>
	);
};

// Discount.getLayout = getStudentLayout;
// export default Discount;

Discount.getLayout = getStudentLayout;

export default withTranslation('common')(Discount);
