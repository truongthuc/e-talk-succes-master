import React, { useState, useEffect, useContext } from 'react';
import { getTeacherInfo } from '~/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import { Modal, Button } from 'react-bootstrap';
import { updatePassAPI } from '~/api/optionAPI';
import { toastInit } from '~/utils';
import { Context as ProfileContext } from '~/context/ProfileContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const initialState = {
	FullName: 'Hoang Uyen Than',
	Address: 'Hồ Chí Minh',
	Gender: 1,
	BirthDay: '2020-07-10T09:52:14.5215882+07:00',
	SkypeID: 'live:shockdie1995',
	Phone: '0909090909',
	Username: 'thaivietdat',
	Email: 'thaivietdat@gmail.com',
	Avatar: '',
};

const SideBar = ({ setActive, activePage }) => {
	// const [state, setState] = useState(initialState);
	const { state } = useContext(ProfileContext);
	// const fetchData = async () => {
	//     setIsLoading(true);
	//     const res = await getTeacherInfo();
	//     if (res.Code === 1 && res.Data) {
	//         setState(res.Data);
	//     }
	//     setIsLoading(false);
	// }

	// useEffect(() => {
	//     fetchData();
	// }, [])

	return (
		<>
			<div className="card card-custom gutter-b wd-100p">
				{/*begin::Body*/}
				<div className="card-body">
					{/*begin::Wrapper*/}
					<div className="d-flex justify-content-between flex-column h-100">
						{/*begin::Container*/}
						<div>
							{/*begin::Header*/}
							<div className="d-flex flex-column flex-center  tx-center">
								{/*begin::Symbol*/}
								<div className="symbol symbol-120 symbol-circle symbol-success overflow-hidden mg-b-15">
									<span className="symbol-label">
										{!state.isLoading ? (
											<img
												src={`${
													state?.Avatar ?? '../assets/img/default-avatar.png'
												}`}
												className="avatar-xxl align-self-end object-fit rounded-5"
												alt="Avatar Teacher"
											/>
										) : (
											<Skeleton width={100} height={100} />
										)}
									</span>
								</div>
								{/*end::Symbol*/}
								{/*begin::Username*/}
								<a
									href={true}
									className="card-title tx-primary tx-bolder tx-16"
								>
									{!state.isLoading ? (
										state?.FullName ?? ''
									) : (
										<Skeleton width={50} />
									)}
								</a>
								{/*end::Username*/}
								{/*begin::Info*/}
								<div className="d-flex justify-content-between align-items-center mg-b-5">
									<span className="tx-medium">Phone:</span>
									<a href="tel:0987654321" className="tx-gray-400">
										{!state.isLoading ? (
											state?.Phone ?? ''
										) : (
											<Skeleton width={50} />
										)}
									</a>
								</div>
								<div className="d-flex justify-content-between align-items-center mg-b-15">
									<span className="tx-medium">Email:</span>
									<a
										href={`mailto:${state.Email || ''}`}
										className="tx-gray-400"
									>
										{!state.isLoading ? (
											state?.Email ?? ''
										) : (
											<Skeleton width={50} />
										)}
									</a>
								</div>

								{/*end::Info*/}
							</div>
							{/*end::Header*/}
							{/*begin::Body*/}
							<div>
								<ul className="pd-l-0 sidebar-profile mg-b-0">
									<li className={activePage === 'profile' ? 'active' : ''}>
										<a
											href={true}
											className="d-flex align-items-center nav-link"
											onClick={() => setActive('profile')}
										>
											<span className="icon">
												<FontAwesomeIcon icon="user" className="fas fa-user" />
											</span>
											<span className="mg-l-10">Profile</span>
										</a>
									</li>
									<li className={activePage === 'password' ? 'active' : ''}>
										<a
											href={true}
											className="d-flex align-items-center nav-link"
											onClick={() => setActive('password')}
										>
											<span className="icon">
												<FontAwesomeIcon icon="key" className="fas fa-key" />
											</span>
											<span className="mg-l-10">Change password</span>
										</a>
									</li>
									<li className={activePage === 'payment' ? 'active' : ''}>
										<a
											href={true}
											className="d-flex align-items-center nav-link"
											onClick={() => setActive('payment')}
										>
											<span className="icon">
												<FontAwesomeIcon
													icon="credit-card"
													className="fas fa-credit-card"
												/>
											</span>
											<span className="mg-l-10">Payment Information</span>
										</a>
									</li>
								</ul>
							</div>
							{/*end::Body*/}
						</div>
						{/*eng::Container*/}
					</div>
					{/*end::Wrapper*/}
				</div>
				{/*end::Body*/}
			</div>
		</>
	);
};

export default SideBar;
