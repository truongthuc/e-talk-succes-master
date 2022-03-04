import React, { useEffect, useContext, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from '~/i18n';
import './index.module.scss';
import { useAuth } from '~/api/auth.js';
import { useRouter } from 'next/router';

const TeacherMenu = ({ t }) => {
	const router = useRouter();

	const url = router.pathname.toString();

	console.log('url: ', url);

	// const returnActive = (url) => {
	// 	if(url.inc)
	// };

	return (
		<ul className="nav nav-aside">
			<li className={`nav-item ${url.includes('/home') && 'active'} `}>
				<Link href="/teacher/home" as={`/teacher/home`}>
					<a href={true} className="nav-link">
						<FontAwesomeIcon
							icon="tachometer-alt"
							className="fas fa-tachometer-alt"
						/>
						<span>{t('Dashboard')}</span>
					</a>
				</Link>
			</li>
			{/* <li className="nav-item">
				<Link
					href="/teacher/monthly-statistics"
					as={`/teacher/monthly-statistics`}
				>
					<a href={true} className="nav-link">
						<FontAwesomeIcon
							icon="project-diagram"
							className="fas fa-project-diagram"
						/>
						<span>{t('monthly-statistics')}</span>
					</a>
				</Link>
			</li> */}
			{/* <li className="nav-item">
		<Link href="/teacher/salary">
			<a href={true} className="nav-link">
				<FontAwesomeIcon
					icon="money-bill-alt"
					className="fas fa-money-bill-alt"
				/>
				<span>Salary Report</span>
			</a>
		</Link>
	</li> */}

			<li className={`nav-item ${url.includes('/manage-slot') && 'active'} `}>
				<Link
					href="/teacher/schedule/manage-slot"
					as="/teacher/schedule/manage-slot"
				>
					<a href={true} className="nav-link">
						<FontAwesomeIcon icon="calendar" className="far fa-calendar" />
						<span>{t('Schedule')}</span>
					</a>
				</Link>
			</li>
			<li className="nav-item with-sub">
				<a href={true} className="nav-link">
					<FontAwesomeIcon
						icon="person-booth"
						className="fas fa-calendar-check"
					/>
					<span>{t('Classrooms')}</span>
				</a>
				<ul>
					<li className={` ${url.includes('/all-class') && 'active'} `}>
						<Link
							href="/teacher/classes/all-class"
							as="/teacher/classes/all-class"
						>
							<a href={true} className="">
								<FontAwesomeIcon
									icon="user-friends"
									className="fas fa-user-friends"
								/>{' '}
								<span>{t('All classes')}</span>
							</a>
						</Link>
					</li>
					{/* <li className={` ${url.includes('/upcoming-class') && 'active'} `}>
						<Link
							href="/teacher/classes/upcoming-class"
							as="/teacher/classes/upcoming-class"
						>
							<a href={true} className="">
								<FontAwesomeIcon
									icon="user-clock"
									className="fas fa-user-clock"
								/>{' '}
								<span>{t('upcoming-classes')}</span>
							</a>
						</Link>
					</li> */}
					<li
						className={` ${url.includes('/missing-evaluation') && 'active'} `}
					>
						<Link
							href="/teacher/classes/missing-evaluation"
							as="/teacher/classes/missing-evaluation"
						>
							<a href={true} className="">
								<FontAwesomeIcon
									icon="comment-dots"
									className="fas fa-comment-dots"
								/>{' '}
								<span>{t('Missing Evaluation')}</span>
							</a>
						</Link>
					</li>
					<li className={` ${url.includes('/evaluated-class') && 'active'} `}>
						<Link
							href="/teacher/classes/evaluated-class"
							as="/teacher/classes/evaluated-class"
						>
							<a href={true} className="">
								<FontAwesomeIcon
									icon="file-signature"
									className="fas fa-file-signature"
								/>{' '}
								<span>{t('Evaluated')}</span>
							</a>
						</Link>
					</li>
				</ul>
			</li>
			<li className="nav-item with-sub">
				<a href={true} className="nav-link">
					<FontAwesomeIcon
						icon="user-graduate"
						className="fas fa-calendar-check"
					/>
					<span>{t('Students')}</span>
				</a>
				<ul>
					<li className={` ${url.includes('/attendance-record') && 'active'} `}>
						<Link
							href="/teacher/attendance-record"
							as="/teacher/attendance-record"
						>
							<a href={true} className="">
								<FontAwesomeIcon
									icon="user-check"
									className="fas fa-user-check"
								/>{' '}
								<span>{t('attendance-record')}</span>
							</a>
						</Link>
					</li>
					<li className={` ${url.includes('/feedback') && 'active'} `}>
						<Link href="/teacher/feedback" as="/teacher/feedback">
							<a href={true} className="">
								<FontAwesomeIcon icon="comments" className="fas fa-comments" />{' '}
								<span>{t('Feedback')}</span>
							</a>
						</Link>
					</li>
					<li className={` ${url.includes('/student-package') && 'active'} `}>
						<Link href="/teacher/student-package" as="/teacher/student-package">
							<a href={true} className="">
								<FontAwesomeIcon
									icon="user-graduate"
									className="fas fa-user-graduate"
								/>{' '}
								<span>{t('End Date Package')}</span>
							</a>
						</Link>
					</li>
				</ul>
			</li>
			<li className={`nav-item ${url.includes('/notification') && 'active'} `}>
				<Link href="/teacher/notification" as="/teacher/notification">
					<a href={true} className="nav-link">
						<FontAwesomeIcon icon="candy-cane" className="fas fa-candy-cane" />{' '}
						<span>{t('Day off')}</span>
					</a>
				</Link>
			</li>
			{/* <li className={`nav-item ${url.includes('/support') && 'active'} `}>
				<Link href="/teacher/support" as="/teacher/support">
					<a href={true} className="nav-link">
						<FontAwesomeIcon
							icon="envelope-open-text"
							className="fas fa-envelope-open-text"
						/>
						<span>{t('ticket-support')}</span>
					</a>
				</Link>
			</li> */}
			{/* <li className="nav-item">
		<Link href="/teacher/library">
			<a href={true} className="nav-link">
				<FontAwesomeIcon icon="book" className="fas fa-book" />
				<span>Libraries</span>
			</a>
		</Link>
	</li> */}
		</ul>
	);
};

const StudentMenu = ({ t }) => {
	const router = useRouter();

	const url = router.pathname.toString();
	return (
		<ul className="nav nav-aside">
			{/* <li className="nav-item active">
				<Link href="/student/home" as="/student/home">
					<a href={true} className="nav-link">
						<FontAwesomeIcon
							icon="tachometer-alt"
							className="fas fa-tachometer-alt"
						/>
						<span>{t('menu-student:dashboard')}</span>
					</a>
				</Link>
			</li>
			<li className="nav-item">
				<Link href="/student/package" as="/student/package">
					<a href={true} className="nav-link">
						<FontAwesomeIcon icon="cubes" className="fas fa-tachometer-alt" />
						<span>{t('menu-student:package')}</span>
					</a>
				</Link>
			</li>
			<li className="nav-label mg-t-25">{t('menu-student:schedule')}</li>
			<li className="nav-item">
				<Link href="/student/booking-schedule" as="/student/booking-schedule">
					<a href={true} className="nav-link">
						<FontAwesomeIcon icon="calendar" className="far fa-calendar" />
						<span>{t('menu-student:booking-schedule')}</span>
					</a>
				</Link>
			</li>
			<li className="nav-item with-sub">
				<a href={true} className="nav-link">
					<FontAwesomeIcon
						icon="calendar-check"
						className="fas fa-calendar-check"
					/>
					<span>{t('menu-student:booked-schedule')}</span>
				</a>
				<ul>
					<li>
						<Link
							href="/student/booked-schedule/calendar"
							as="/student/booked-schedule/calendar"
						>
							<a href={true}>
								<span>{t('menu-student:calendar-view')}</span>
							</a>
						</Link>
					</li>
					<li>
						<Link
							href="/student/booked-schedule/table"
							as="/student/booked-schedule/table"
						>
							<a href={true}>
								<span>{t('menu-student:table-view')}</span>
							</a>
						</Link>
					</li>
				</ul>
			</li>
			<li className="nav-label mg-t-25">{t('menu-student:classes')}</li>
			<li className="nav-item">
				<Link
					href="/student/classes/attendance-record"
					as="/student/classes/attendance-record"
				>
					<a href={true} className="nav-link">
						<FontAwesomeIcon icon="user-check" className="fas fa-user-check" />{' '}
						<span>{t('attendance-record')}</span>
					</a>
				</Link>
			</li>
			<li className="nav-item">
				<Link
					href="/student/classes/evaluation"
					as="/student/classes/evaluation"
				>
					<a href={true} className="nav-link">
						<FontAwesomeIcon
							icon="file-signature"
							className="fas fa-file-signature"
						/>{' '}
						<span>{t('menu-student:lesson-feedback')}</span>
					</a>
				</Link>
			</li>
			<li className="nav-item">
				<Link href="/student/classes/history" as="/student/classes/history">
					<a href={true} className="nav-link">
						<FontAwesomeIcon icon="history" className="fas fa-history" />{' '}
						<span>{t('menu-student:lesson-history')}</span>
					</a>
				</Link>
			</li>

			<li className="nav-label mg-t-25">{t('notification')}</li>
			<li className="nav-item">
				<Link
					href="/student/notification/discount"
					as="/student/notification/discount"
				>
					<a href={true} className="nav-link">
						<FontAwesomeIcon icon="tags" className="fas fa-tags" />{' '}
						<span>{t('menu-student:course-discount')}</span>
					</a>
				</Link>
			</li>
			<li className="nav-item">
				<Link href="/student/notification/day-off">
					<a href={true} className="nav-link">
						<FontAwesomeIcon
							icon="calendar-times"
							className="fas fa-calendar-times"
						/>{' '}
						<span>{t('menu-student:day-off')}</span>
					</a>
				</Link>
			</li>
			<li className="nav-label mg-t-25">{t('menu-student:other')}</li>

			<li className="nav-item">
				<Link href="/student/referral" as="/student/referral">
					<a href={true} className="nav-link">
						<FontAwesomeIcon icon="handshake" className="fas fa-file-alt" />{' '}
						<span>{t('menu-student:referral')}</span>
					</a>
				</Link>
			</li>
			<li className="nav-item">
				<Link href="/student/question" as="/student/question">
					<a href={true} className="nav-link">
						<FontAwesomeIcon
							icon="question-circle"
							className="fas fa-file-alt"
						/>{' '}
						<span>{t('menu-student:f&a')}</span>
					</a>
				</Link>
			</li> */}
			<li className={`nav-item ${url.includes('/home') && 'active'} `}>
				<Link href="/student/home" as="/student/home">
					<a href={true} className="nav-link">
						<FontAwesomeIcon
							icon="tachometer-alt"
							className="fas fa-tachometer-alt"
						/>
						<span>{t('menu-student:Dashboard')}</span>
					</a>
				</Link>
			</li>
			<li
				className={`nav-item ${url.includes('/profile-teacher') && 'active'} `}
			>
				<Link href="/student/profile-teacher" as="/student/profile-teacher">
					<a href={true} className="nav-link">
						<FontAwesomeIcon icon="copy" className="fas fa-copy" />
						<span>{t('menu-student:Teacher/Booking')}</span>
					</a>
				</Link>
			</li>
			<li className={`nav-item ${url.includes('/package') && 'active'} `}>
				<Link href="/student/package" as="/student/package">
					<a href={true} className="nav-link">
						<FontAwesomeIcon icon="cubes" className="fas fa-tachometer-alt" />
						<span>{t('menu-student:My Packages')}</span>
					</a>
				</Link>
			</li>
			{/* <li
				className={`nav-item ${
					url.includes('/schoolarship-feedback') && 'active'
				} `}
			>
				<Link
					href="/student/schoolarship-feedback"
					as="/student/schoolarship-feedback"
				>
					<a href={true} className="nav-link">
						<FontAwesomeIcon icon="comments" className="fas fa-comments" />
						<span>{t('menu-student:Scholarship Feedback')}</span>
					</a>
				</Link>
			</li> */}

			<li className="nav-item with-sub">
				<a href={true} className="nav-link">
					<FontAwesomeIcon
						icon="calendar-alt"
						className="fas fa-calendar-check"
					/>
					<span>{t('menu-student:Schedule')}</span>
				</a>
				<ul>
					{/* <li className="">
						<Link
							href="/student/booking-schedule"
							as="/student/booking-schedule"
						>
							<a href={true} className="">
								<FontAwesomeIcon
									icon="user-friends"
									className="far fa-calendar"
								/>
								<span>{t('menu-student:teacher-list')}</span>
							</a>
						</Link>
					</li> */}
					<li className=" with-sub">
						{/* <a href={true} className="">
							<FontAwesomeIcon
								icon="calendar-check"
								className="fas fa-calendar-check"
							/>
							<span>{t('menu-student:booked-schedule')}</span>
						</a> */}
						<ul>
							<li className={`${url.includes('/calendar') && 'active'} `}>
								<Link
									href="/student/booked-schedule/calendar"
									as="/student/booked-schedule/calendar"
								>
									<a href={true}>
										<span>{t('menu-student:Calendar View')}</span>
									</a>
								</Link>
							</li>
							<li
								className={`${
									url.includes('/booked-schedule/table') && 'active'
								} `}
							>
								<Link
									href="/student/booked-schedule/table"
									as="/student/booked-schedule/table"
								>
									<a href={true}>
										<span>{t('menu-student:Table View')}</span>
									</a>
								</Link>
							</li>
						</ul>
					</li>
				</ul>
			</li>
			<li className="nav-item with-sub">
				<a href={true} className="nav-link">
					<FontAwesomeIcon icon="users" className="fas fa-calendar-check" />
					<span>{t('menu-student:Classes')}</span>
				</a>
				<ul>
					<li className={`${url.includes('/attendance-record') && 'active'} `}>
						<Link
							href="/student/classes/attendance-record"
							as="/student/classes/attendance-record"
						>
							<a href={true} className="">
								<FontAwesomeIcon
									icon="user-check"
									className="fas fa-user-check"
								/>{' '}
								<span>{t('menu-student:Attendance Record')}</span>
							</a>
						</Link>
					</li>
					<li
						className={` ${
							url.includes('/schoolarship-feedback') && 'active'
						} `}
					>
						<Link
							href="/student/schoolarship-feedback"
							as="/student/schoolarship-feedback"
						>
							<a href={true}>
								<FontAwesomeIcon icon="comments" className="fas fa-comments" />
								<span>{t('menu-student:Scholarship Feedback')}</span>
							</a>
						</Link>
					</li>
					{/* <li className={`${url.includes('/evaluation') && 'active'} `}>
						<Link
							href="/student/classes/evaluation"
							as="/student/classes/evaluation"
						>
							<a href={true} className="">
								<FontAwesomeIcon
									icon="file-signature"
									className="fas fa-file-signature"
								/>{' '}
								<span>{t('menu-student:Lesson Feedback')}</span>
							</a>
						</Link>
					</li> */}
					<li className={`${url.includes('/history') && 'active'} `}>
						<Link href="/student/classes/history" as="/student/classes/history">
							<a href={true} className="">
								<FontAwesomeIcon icon="history" className="fas fa-history" />{' '}
								<span>{t('menu-student:Payment History')}</span>
							</a>
						</Link>
					</li>
					<li className={`${url.includes('/course-duration') && 'active'} `}>
						<Link
							href="/student/classes/course-duration"
							as="/student/classes/course-duration"
						>
							<a href={true} className="">
								<FontAwesomeIcon
									icon="graduation-cap"
									className="fas fa-graduation-cap"
								/>{' '}
								<span>{t('menu-student:Course Duration')}</span>
							</a>
						</Link>
					</li>
				</ul>
			</li>

			<li className="nav-item with-sub">
				<a href={true} className="nav-link ani-tb">
					<FontAwesomeIcon icon="bell" className="fas fa-calendar-check" />
					<span>{t('menu-student:Notification')}</span>
				</a>
				<ul>
					<li className={`${url.includes('/discount') && 'active'} `}>
						<Link
							href="/student/notification/discount"
							as="/student/notification/discount"
						>
							<a href={true} className="">
								<FontAwesomeIcon icon="tags" className="fas fa-tags" />{' '}
								<span>{t('menu-student:Course Discount')}</span>
							</a>
						</Link>
					</li>
					<li className={`${url.includes('/day-off') && 'active'} `}>
						<Link href="/student/notification/day-off">
							<a href={true} className="">
								<FontAwesomeIcon
									icon="calendar-times"
									className="fas fa-calendar-times"
								/>{' '}
								<span>{t('menu-student:Day Off')}</span>
							</a>
						</Link>
					</li>
					{/* <li className="">
						<Link href="/student/notification/other">
							<a href={true} className="">
								<FontAwesomeIcon
									icon="flag"
									className="fas fa-calendar-times"
								/>{' '}
								<span>{t('menu-student:tuition-others')}</span>
							</a>
						</Link>
					</li> */}
				</ul>
			</li>

			<li className={`nav-item ${url.includes('/referral') && 'active'} `}>
				<Link href="/student/referral" as="/student/referral">
					<a href={true} className="nav-link have-new">
						<FontAwesomeIcon icon="handshake" className="fas fa-file-alt" />{' '}
						<span>{t('menu-student:Referral')}</span>
						<span className="item-new">{t('menu-student:New')}</span>
					</a>
				</Link>
			</li>
		</ul>
	);
};

const Menu = ({ t, isStudent }) => {
	const handleClick_logout = () => {
		let UID = localStorage.getItem('UID');
		handleLogout(UID);
	};
	const { dataUser, handleLogout } = useAuth();

	let linkImg = dataUser?.AvatarThumnail;
	if (linkImg?.charAt(0) === '/') {
		linkImg = linkImg?.substring(1);
	}

	return (
		<>
			<aside className="aside aside-fixed">
				<div className="aside-header">
					<Link
						href={isStudent ? '/student/home' : '/teacher/home'}
						as={isStudent ? '/student/home' : '/teacher/home'}
					>
						<a href={true} className="aside-logo">
							<img src="/static/img/logo-white-1.jpg" alt="logo" />
						</a>
					</Link>{' '}
					<a href={true} className="aside-menu-link">
						<FontAwesomeIcon icon="bars" className="fas fa-bars" />{' '}
						<FontAwesomeIcon icon="times" className="fas fa-times" />
					</a>
				</div>
				<div className="aside-body tx-14">
					<div className="aside-loggedin">
						<div className="aside-loggedin-user tx-center">
							<div className="d-flex align-items-center justify-content-center">
								<a href={`#loggedinMenu`} data-toggle="collapse" className="">
									<img
										src={linkImg ? linkImg : '/static/img/user.png'}
										className="rounded-circle avatar-xl object-fit"
										alt=""
									/>
								</a>
							</div>
							<a
								href={`#loggedinMenu`}
								className="d-flex align-items-center justify-content-center mg-b-0 mg-t-10"
								data-toggle="collapse"
							>
								<h6 className="tx-semibold tx-16 mg-b-0 tx-white">
									{dataUser?.StudentName}
								</h6>
								<FontAwesomeIcon
									icon="angle-down"
									className="fas fa-angle-down mg-l-10 tx-white"
								/>
							</a>
							<p className="tx-white tx-12 mg-b-0 mg-t-5">
								{isStudent
									? t('menu-student:Student')
									: t('menu-student:Teacher')}
							</p>
						</div>
						<div className="collapse" id="loggedinMenu">
							<ul className="nav nav-aside mg-b-0 ">
								<li className="nav-label mg-t-25">{t('label-account')}</li>
								<li className="nav-item">
									<Link
										href={isStudent ? '/student/profile' : '/teacher/profile'}
										as={isStudent ? '/student/profile' : '/teacher/profile'}
									>
										<a href className="nav-link">
											<FontAwesomeIcon
												icon="user-edit"
												className="fas fa-user-edit"
											/>{' '}
											<span>{t('edit-profile')}</span>
										</a>
									</Link>
								</li>
								<li className="nav-item">
									<Link
										href={
											isStudent
												? '/student/profile/password'
												: '/teacher/profile/password'
										}
										as={
											isStudent
												? '/student/profile/password'
												: '/teacher/profile/password'
										}
									>
										<a href={true} className="nav-link">
											<FontAwesomeIcon icon="key" className="fas fa-key" />{' '}
											<span>{t('change-password')}</span>
										</a>
									</Link>
								</li>
								{/* <li className="nav-item">
									<Link
										href={
											isStudent
												? '/student/profile/payment'
												: '/teacher/profile/payment'
										}
										as={
											isStudent
												? '/student/profile/payment'
												: '/teacher/profile/payment'
										}
									>
										<a href={true} className="nav-link">
											<FontAwesomeIcon
												icon="credit-card"
												className="fas fa-key"
											/>{' '}
											<span>
												{isStudent
													? t('menu-student:payment-history')
													: t('payment')}
											</span>
										</a>
									</Link>
								</li> */}
								<li className="nav-item">
									<a
										href={true}
										className="nav-link"
										onClick={() => handleClick_logout()}
									>
										<i data-feather="log-out" />
										<span>{t('sign-out')}</span>
									</a>
								</li>
							</ul>
						</div>
					</div>
					{isStudent ? <StudentMenu t={t} /> : <TeacherMenu t={t} />}
				</div>
			</aside>{' '}
		</>
	);
};

Menu.getInitialProps = async () => ({
	namespacesRequired: ['menu', 'menu-student'],
});

export default withTranslation(['menu', 'menu-student'])(Menu);
