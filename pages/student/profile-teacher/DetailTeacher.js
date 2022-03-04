import React, { useState, useEffect } from 'react';
import TeacherInformation from './TeacherInformation';
import TeacherIntroduce from '~/page-components/teacher/profile/TeacherIntroduce';
import TeacherExperience from '~/page-components/teacher/profile/TeacherExperience';
import { Tab } from 'react-bootstrap';
import './index.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getLayout } from '~/components/Layout';
import { Provider as ProfileProvider } from '~/context/ProfileContext';
import { ToastContainer } from 'react-toastify';
import { i18n, withTranslation } from '~/i18n';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Button from '@material-ui/core/Button';
import { GetTeacherProfile } from '~/api/studentAPI';
import Skeleton from '@material-ui/lab/Skeleton';
import Router, { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		borderRadius: '10px',
		width: '50%',
		height: '60%',
		overflowY: 'auto',
	},
	col: {
		width: '50%',
		padding: '0 10px',
	},
	rowForm: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	scroll: {
		height: '60%',
		overflowY: 'auto',
	},
	skeShort: {
		width: '150px',
		margin: 'auto',
		marginBottom: '10px',
	},
	skeLong: {
		width: '98%',
		margin: 'auto',
		marginBottom: '10px',
	},
	skeImg: {
		width: '120px',
		height: '130px',
		margin: 'auto',
	},
	ratingCmt: {
		fontSize: '1.2rem',
	},
}));

const DetailTeacher = ({ t, dataTeacher }) => {
	const router = useRouter();

	const classes = useStyles();
	const [activePage, setActivePage] = useState('profile');
	const [dataProfile, setDataProfile] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [listFeedback, setListFeedback] = useState();
	const [RatingTeacher, setRatingTeacher] = useState(0);

	console.log('List feedback: ', listFeedback);
	console.log('Data Profile: ', dataProfile);

	console.log('Rating teacher: ', RatingTeacher);

	useEffect(() => {
		console.log('Chạy vô');
		if (dataProfile?.RateADT) {
			console.log('Chạy vô đây luôn');
			setRatingTeacher(dataProfile.RateADT);
		}
	}, [dataProfile]);

	useEffect(() => {
		let UID = null;
		let Token = null;

		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		(async () => {
			try {
				const res = await GetTeacherProfile({
					TeacherID: dataTeacher,
					UID: UID,
					Token: Token,
				});
				setIsLoading(false);
				if (res.Code === 200) {
					setDataProfile(res.Data);
					setListFeedback(res.Data.Feedback);
				}
				if (res.Code === 403) {
					router.push('login/signin');
				}
			} catch {}
		})();
	}, []);

	return (
		<>
			<h1
				style={{ marginBottom: '1rem', fontSize: '20px' }}
				className="main-title-page"
			>
				{t('profile-teacher')}
			</h1>
			<div className="profile-account">
				<div className="box-avatar text-center  mg-b-10">
					{isLoading ? (
						<Skeleton variant="text" className={classes.skeImg} />
					) : (
						<label className="upload-avatar">
							<img
								id="avatar"
								alt="Avatar"
								src={
									dataProfile?.Avatar
										? dataProfile.Avatar
										: '/static/img/user.png'
								}
							/>
						</label>
					)}
				</div>
				<div className="name-box text-center mg-b-10">
					{isLoading ? (
						<Skeleton variant="text" className={classes.skeShort} />
					) : (
						<h4 className="text">{dataProfile?.TeacherName}</h4>
					)}
				</div>
				<div class="rating-box text-center">
					{isLoading ? (
						<Skeleton variant="text" className={classes.skeShort} />
					) : (
						<div className="rating">
							<Rating
								name="disabled"
								value={RatingTeacher}
								size="large"
								disabled
							/>
						</div>
					)}
				</div>
				<div className="text-center mg-b-25">
					{isLoading ? (
						<Skeleton variant="text" className={classes.skeShort} />
					) : (
						<Button
							onClick={() => {
								router.push({
									pathname: `/student/booked-schedule/calendar`,
									query: { idgv: dataTeacher },
								});
							}}
							className="btn btn-icon btn-info-profile mar-l-10 btn-book-absolute"
						>
							{t('Book schedule')}
						</Button>
					)}
				</div>
				<div className="box-detail-teacher">
					<div className="row">
						<div className="col-md-6 border-right">
							{isLoading ? (
								<Skeleton variant="text" className={classes.skeLong} />
							) : (
								<div className="form-row align-items-center mg-b-20">
									<div className="col-sm-12 col-label-fixed">
										<p className="mg-b-0 tx-medium title-item">
											<i class="fas fa-graduation-cap"></i> {t('Course Name')}:
										</p>
									</div>
									<div className="col-sm-12">
										<p className="mg-b-0 ">{dataProfile?.CourseName}</p>
									</div>
								</div>
							)}
							{isLoading ? (
								<Skeleton variant="text" className={classes.skeLong} />
							) : (
								<div className="form-row align-items-center mg-b-20">
									<div className="col-sm-12 col-label-fixed">
										<p className="mg-b-0 tx-medium title-item">
											<i class="fas fa-link"></i> {t('Link Introduce')}:
										</p>
									</div>
									<div className="col-sm-12">
										{dataProfile?.LinkAudio ? (
											<audio src={dataProfile?.LinkAudio} controls></audio>
										) : (
											''
										)}
									</div>
								</div>
							)}

							{isLoading ? (
								<Skeleton variant="text" className={classes.skeLong} />
							) : (
								<div className="form-row align-items-center mg-b-20">
									<div className="col-sm-12 col-label-fixed">
										<p className="mg-b-0 tx-medium title-item">
											<i class="fas fa-user"></i> {t('Introduce')}:
										</p>
									</div>
									<div className="col-sm-12">
										<p className="mg-b-0 ">{dataProfile?.Introduce}</p>
									</div>
								</div>
							)}

							{isLoading ? (
								<Skeleton variant="text" className={classes.skeLong} />
							) : (
								<div className="form-row align-items-center mg-b-20">
									<div className="col-sm-12 col-label-fixed">
										<p className="mg-b-0 tx-medium title-item">
											<i class="fas fa-school"></i> {t('School Name')}:
										</p>
									</div>
									<div className="col-sm-12">
										<p className="mg-b-0">{dataProfile?.SchoolName}</p>
									</div>
								</div>
							)}
						</div>
						<div className="col-md-6 pa-l-50">
							{isLoading ? (
								<Skeleton variant="text" className={classes.skeLong} />
							) : (
								<div className="form-row align-items-center mg-b-20">
									<div className="col-sm-12 col-label-fixed ">
										<p className="mg-b-0 tx-medium title-item">
											<i class="fas fa-pencil-alt"></i> {t('Experience')}:
										</p>
									</div>
									<div className="col-sm-12">
										<p className="mg-b-0">{dataProfile?.Experience}</p>
									</div>
								</div>
							)}

							{isLoading ? (
								<Skeleton variant="text" className={classes.skeLong} />
							) : (
								<div className="form-row align-items-center mg-b-20">
									<div className="col-sm-12 col-label-fixed">
										<p className="mg-b-0 tx-medium title-item">
											<i class="fas fa-heart"></i> {t('Preference')}:
										</p>
									</div>
									<div className="col-sm-12">
										<p className="mg-b-0">{dataProfile?.PersonalPreference}</p>
									</div>
								</div>
							)}

							{isLoading ? (
								<Skeleton variant="text" className={classes.skeLong} />
							) : (
								<div className="form-row align-items-center mg-b-20">
									<div className="col-sm-12 col-label-fixed">
										<p className="mg-b-0 tx-medium title-item">
											<i class="fas fa-globe-africa"></i> {t('Nation Name')}:
										</p>
									</div>
									<div className="col-sm-12">
										<p className="mg-b-0 ">{dataProfile?.AccountNationName}</p>
									</div>
								</div>
							)}
						</div>
						{/* <div className="col-md-12 text-center mg-t-25">
							
						</div> */}
					</div>
					{isLoading ? (
						<Skeleton variant="text" className={classes.skeLong} />
					) : (
						<div className="row">
							<div className="col-12">
								<div className="box-comment">
									<p className="title">Review</p>
									{listFeedback?.length > 0 ? (
										listFeedback?.map((item, index) => (
											<div className="box-comment__item">
												<div className="avatar">
													<img
														className=""
														src={
															item.AvatarThumbnail !== ''
																? item.AvatarThumbnail
																: '/static/img/user.png'
														}
													></img>
												</div>
												<div className="detail">
													<p className="name">{item.StudentName}</p>
													<div className="d-flex align-items-center">
														<div className="time">
															<p>{item.RateDate}</p>
														</div>
														<Rating
															name="disabled"
															defaultValue={item?.FeedBackRate}
															size="large"
															className={classes.ratingCmt}
															disabled
														/>
													</div>

													<div className="detail-content">
														{item?.ContentFeedBack === '' ? (
															<p>...</p>
														) : (
															<p>{item.ContentFeedBack}</p>
														)}
													</div>
												</div>
											</div>
										))
									) : (
										<p style={{ fontStyle: 'italic' }}>
											{t('There are no reviews')}
										</p>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
			{/* <ProfileProvider>
				<div className={`card ${classes.scroll}`}>
					<div className="card-body">
						<div className="teacher__info-wrap">
							<Tab.Container
								activeKey={activePage}
								defaultActiveKey={activePage}
							>
								<Tab.Content>
									<Tab.Pane eventKey="profile">
										<TeacherInformation
											scroll={scroll}
											dataTeacher={dataTeacher}
										/>
									</Tab.Pane>
								</Tab.Content>
							</Tab.Container>
						</div>
					</div>
				</div>
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
			</ProfileProvider> */}
		</>
	);
};

// ProfileInfor.getLayout = getLayout;
// export default ProfileInfor;

DetailTeacher.getLayout = getLayout;
DetailTeacher.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(DetailTeacher);
