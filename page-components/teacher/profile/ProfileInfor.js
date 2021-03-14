import React, { useState } from 'react';
import TeacherInformation from './TeacherInformation';
import TeacherIntroduce from './TeacherIntroduce';
import TeacherExperience from './TeacherExperience';
import Sidebar from './Sidebar';
import { Tab, Nav } from 'react-bootstrap';
import './ProfileInfor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const ProfileInfor = () => {
	const [activePage, setActivePage] = useState('profile');

	return (
		<>
			<div className="card card-custom">
				<div className="">
					<div className="tab-navigation">
						<ul className="list-tab" id="js-list-tab">
							<li className="tab-item">
								<a
									href={true}
									className={`tab-link ${activePage === 'profile' && 'active'}`}
									onClick={() => setActivePage('profile')}
								>
									<FontAwesomeIcon
										icon={['far', 'id-card']}
										className="far fa-id-card"
									/>{' '}
									Basic Information
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
									Introduce video
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
									Experience & Certificate
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="card-body">
					<div className="teacher__info-wrap">
						<Tab.Container activeKey={activePage} defaultActiveKey={activePage}>
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
		</>
	);
};

export default ProfileInfor;
