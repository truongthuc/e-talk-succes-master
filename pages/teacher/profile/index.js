import React, { useState } from 'react';
import TeacherInformation from '~/page-components/teacher/profile/TeacherInformation';
import TeacherIntroduce from '~/page-components/teacher/profile/TeacherIntroduce';
import TeacherExperience from '~/page-components/teacher/profile/TeacherExperience';
import { Tab } from 'react-bootstrap';
import './index.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getLayout } from '~/components/Layout';
import { Provider as ProfileProvider } from '~/context/ProfileContext';
import { ToastContainer } from 'react-toastify';
import { i18n, withTranslation } from '~/i18n';
const ProfileInfor = ({ t }) => {
	const [activePage, setActivePage] = useState('profile');

	return (
		<>
			<h1 className="main-title-page">{t('my-profile')}</h1>
			<ProfileProvider>
				<div className="card">
					<div className="card-body">
						<div className="tab-navigation">
							<ul className="list-tab" id="js-list-tab">
								<li className="tab-item">
									<a
										href={true}
										className={`tab-link ${
											activePage === 'profile' && 'active'
										}`}
										onClick={() => setActivePage('profile')}
									>
										<FontAwesomeIcon
											icon={['far', 'id-card']}
											className="far fa-id-card"
										/>{' '}
										{t('basic-information')}
									</a>
								</li>
								<li className="tab-item">
									<a
										href={true}
										className={`tab-link ${
											activePage === 'introduce' && 'active'
										}`}
										onClick={() => setActivePage('introduce')}
									>
										<FontAwesomeIcon
											icon={['fab', 'youtube']}
											className="fab fa-youtube"
										/>{' '}
										{t('introduce-video')}
									</a>
								</li>
								<li className="tab-item">
									<a
										href={true}
										className={`tab-link ${
											activePage === 'experience' && 'active'
										}`}
										onClick={() => setActivePage('experience')}
									>
										<FontAwesomeIcon
											icon="certificate"
											className="fas fa-certificate"
										/>{' '}
										{t('experience-certificate')}
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="card-body">
						<div className="teacher__info-wrap">
							<Tab.Container
								activeKey={activePage}
								defaultActiveKey={activePage}
							>
								<Tab.Content>
									<Tab.Pane eventKey="profile">
										<TeacherInformation />
									</Tab.Pane>
									<Tab.Pane eventKey="introduce">
										<TeacherIntroduce />
									</Tab.Pane>
									<Tab.Pane eventKey="experience">
										<TeacherExperience />
									</Tab.Pane>
								</Tab.Content>
								{/* <TeacherInformation />
                                <TeacherIntroduce />
                                <TeacherExperience /> */}
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

ProfileInfor.getLayout = getLayout;
ProfileInfor.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(ProfileInfor);
