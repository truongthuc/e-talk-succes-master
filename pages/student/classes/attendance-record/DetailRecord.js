import React, { useState, useEffect } from 'react';
// import TeacherInformation from './TeacherInformation';
// import TeacherIntroduce from '~/page-components/teacher/profile/TeacherIntroduce';
// import TeacherExperience from '~/page-components/teacher/profile/TeacherExperience';
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
import {
	GetTeacherProfile,
	studentGetDetailAttendanceRecord,
} from '~/api/studentAPI';
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
}));

const DetailRecord = ({ t, dataTeacher }) => {
	console.log('Data Teacher: ', dataTeacher);

	const router = useRouter();

	const classes = useStyles();
	const [activePage, setActivePage] = useState('profile');
	const [dataProfile, setDataProfile] = useState();
	const [isLoading, setIsLoading] = useState(true);

	console.log('Data profile: ', dataProfile);

	useEffect(() => {
		let UID = null;
		let Token = null;

		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		(async () => {
			try {
				const res = await studentGetDetailAttendanceRecord({
					BookingID: dataTeacher,
					UID: UID,
					Token: Token,
				});
				setIsLoading(false);
				if (res.Code === 200) {
					setDataProfile(res.Data);
				}
				if (res.Code === 403) {
					router.push("'login/signin");
				}
			} catch {}
		})();

		$('body').removeClass('show-aside');
	}, []);

	return (
		<>
			<h1
				style={{ marginBottom: '1rem', fontSize: '20px' }}
				className="main-title-page"
			>
				{t('Record Detail')}
			</h1>

			<div className="box-detail-teacher box-detail-record">
				<div className="row">
					<div className="col-md-6 border-right">
						{isLoading ? (
							<Skeleton variant="text" className={classes.skeLong} />
						) : (
							<div className="form-row  mg-b-20">
								<div className="col-sm-4 col-label-fixed">
									<p className="mg-b-0 tx-medium">{t('Course Name')}:</p>
								</div>
								<div className="col-sm-8">
									<p className="mg-b-0 ">{dataProfile?.CourseName}</p>
								</div>
							</div>
						)}
						{isLoading ? (
							<Skeleton variant="text" className={classes.skeLong} />
						) : (
							<div className="form-row  mg-b-20">
								<div className="col-sm-4 col-label-fixed">
									<p className="mg-b-0 tx-medium">{t('Student Code')}:</p>
								</div>
								<div className="col-sm-8">
									<p className="mg-b-0 ">{dataProfile?.StudentCode}</p>
								</div>
							</div>
						)}
						{isLoading ? (
							<Skeleton variant="text" className={classes.skeLong} />
						) : (
							<div className="form-row  mg-b-20">
								<div className="col-sm-4 col-label-fixed">
									<p className="mg-b-0 tx-medium">{t('Student Name')}:</p>
								</div>
								<div className="col-sm-8">
									<p className="mg-b-0 ">{dataProfile?.Studentname}</p>
								</div>
							</div>
						)}

						{isLoading ? (
							<Skeleton variant="text" className={classes.skeLong} />
						) : (
							<div className="form-row  mg-b-20">
								<div className="col-sm-4 col-label-fixed">
									<p className="mg-b-0 tx-medium">{t('Teacher Name')}:</p>
								</div>
								<div className="col-sm-8">
									<p className="mg-b-0 ">{dataProfile?.TeacherName}</p>
								</div>
							</div>
						)}

						{isLoading ? (
							<Skeleton variant="text" className={classes.skeLong} />
						) : (
							<div className="form-row  mg-b-20">
								<div className="col-sm-4 col-label-fixed">
									<p className="mg-b-0 tx-medium">{t('Remark')}:</p>
								</div>
								<div className="col-sm-8">
									<p className="mg-b-0">{dataProfile?.Remark}</p>
								</div>
							</div>
						)}

						{isLoading ? (
							<Skeleton variant="text" className={classes.skeLong} />
						) : (
							<div className="form-row  mg-b-20">
								<div className="col-sm-4 col-label-fixed">
									<p className="mg-b-0 tx-medium">{t('Package Name')}:</p>
								</div>
								<div className="col-sm-8">
									<p className="mg-b-0">{dataProfile?.PackageName}</p>
								</div>
							</div>
						)}
						{isLoading ? (
							<Skeleton variant="text" className={classes.skeLong} />
						) : (
							<div className="form-row  mg-b-20">
								<div className="col-sm-4 col-label-fixed">
									<p className="mg-b-0 tx-medium">{t('Homework')}:</p>
								</div>
								<div className="col-sm-8">
									<p className="mg-b-0">{dataProfile?.HomeWork}</p>
								</div>
							</div>
						)}
					</div>
					<div className="col-md-6 pa-l-50">
						{isLoading ? (
							<Skeleton variant="text" className={classes.skeLong} />
						) : (
							<div className="form-row  mg-b-20">
								<div className="col-sm-4 col-label-fixed">
									<p className="mg-b-0 tx-medium">{t('Class')}:</p>
								</div>
								<div className="col-sm-8">
									<p className="mg-b-0">{dataProfile?.Class}</p>
								</div>
							</div>
						)}

						{isLoading ? (
							<Skeleton variant="text" className={classes.skeLong} />
						) : (
							<div className="form-row  mg-b-20">
								<div className="col-sm-4 col-label-fixed">
									<p className="mg-b-0 tx-medium">{t('Class Status')}:</p>
								</div>
								<div className="col-sm-8">
									<p className="mg-b-0">{dataProfile?.ClassStatus}</p>
								</div>
							</div>
						)}

						{isLoading ? (
							<Skeleton variant="text" className={classes.skeLong} />
						) : (
							<div className="form-row  mg-b-20">
								<div className="col-sm-4 col-label-fixed">
									<p className="mg-b-0 tx-medium">{t('Class Time')}:</p>
								</div>
								<div className="col-sm-8">
									<p className="mg-b-0 ">{dataProfile?.ClassTime}</p>
								</div>
							</div>
						)}

						{isLoading ? (
							<Skeleton variant="text" className={classes.skeLong} />
						) : (
							<div className="form-row  mg-b-20">
								<div className="col-sm-4 col-label-fixed">
									<p className="mg-b-0 tx-medium">{t('Curriculum')}:</p>
								</div>
								<div className="col-sm-8">
									<p className="mg-b-0 ">{dataProfile?.Curriculum}</p>
								</div>
							</div>
						)}

						{isLoading ? (
							<Skeleton variant="text" className={classes.skeLong} />
						) : (
							<div className="form-row  mg-b-20">
								<div className="col-sm-4 col-label-fixed">
									<p className="mg-b-0 tx-medium">{t('Date')}:</p>
								</div>
								<div className="col-sm-8">
									<p className="mg-b-0 ">{dataProfile?.Date}</p>
								</div>
							</div>
						)}

						{isLoading ? (
							<Skeleton variant="text" className={classes.skeLong} />
						) : (
							<div className="form-row  mg-b-20">
								<div className="col-sm-4 col-label-fixed">
									<p className="mg-b-0 tx-medium">{t('Time')}:</p>
								</div>
								<div className="col-sm-8">
									<p className="mg-b-0 ">{dataProfile?.Time}</p>
								</div>
							</div>
						)}

						{/* <div className="col-md-12 text-center mg-t-25">
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
									className="btn btn-icon btn-scheduleee mar-l-10"
								>
									Đặt lịch học
								</Button>
							)}
						</div> */}
					</div>
				</div>
			</div>
		</>
	);
};

// ProfileInfor.getLayout = getLayout;
// export default ProfileInfor;

DetailRecord.getLayout = getLayout;
DetailRecord.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(DetailRecord);
