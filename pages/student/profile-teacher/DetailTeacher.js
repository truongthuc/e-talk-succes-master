import React, { useState } from 'react';
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
		width: '68%',
		height: '98%',
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
		height: '89%',
		overflowY: 'auto',
	},
}));

const DetailTeacher = ({ t, dataTeacher }) => {
	console.log('Data Teacher: ', dataTeacher);

	const classes = useStyles();
	const [activePage, setActivePage] = useState('profile');

	console.log('Data Teacher trong detail: ', dataTeacher);

	return (
		<>
			<h1
				style={{ marginBottom: '1rem', fontSize: '20px' }}
				className="main-title-page"
			>
				{t('profile-teacher')}
			</h1>
			<ProfileProvider>
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
			</ProfileProvider>
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
