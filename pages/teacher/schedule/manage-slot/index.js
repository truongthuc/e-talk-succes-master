import React, { useEffect } from 'react';
import { getLayout } from '~/components/Layout';
import NoteForStudentModal from '~/components/common/Modal/NoteForStudentModal';
import BookingCalendar from '~/page-components/teacher/manage-slot/BookingCalendar';
import { ToastContainer } from 'react-toastify';
import { getTeacherInfo } from '~/api/teacherAPI';
import './index.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';

const ManageSlot = ({ t }) => {
	const router = useRouter();
	const [timeZone, setTimeZone] = React.useState('');
	const getProfile = async () => {
		const res = await getTeacherInfo();
		res.Code === 1 && setTimeZone(res?.Data.TimeZoneString ?? '');
	};

	useEffect(() => {
		if (!localStorage.getItem('isLogin')) {
			router.push({
				pathname: '/',
			});
		} else {
			let RoleID = parseInt(localStorage.getItem('RoleID'));
			if (RoleID !== 4) {
				localStorage.clear();
				router.push({
					pathname: '/',
				});
			}
		}

		getProfile();
		$('body').removeClass('show-aside');
	}, []);

	return (
		<>
			<div className="d-md-flex justify-content-between align-items-center flex-wrap mg-b-30">
				<h1 className="main-title-page mg-b-15-f mg-md-b-0-f">
					{t('Manage Slot')}
				</h1>
				{/* <span className="pd-y-10 d-inline-block tx-dark pd-y-10 d-inline-block tx-dark bg-white rounded pd-x-10">
					<FontAwesomeIcon
						icon="globe-europe"
						className="fas fa-globe-europe mg-r-5"
					/>
					Timezone: <span className="tx-medium tx-primary">{timeZone}</span>
				</span> */}
			</div>
			<div className="book__container mg-t-5 teacher-custom">
				<div className="card">
					<div className="card-body">
						{/* <div
							className="custom-control custom-checkbox mg-b-15"
							id="student-toggle"
						>
							<input
								type="checkbox"
								className="custom-control-input"
								id="student-toggle-checkbox"
							/>
							<label
								className="custom-control-label"
								htmlFor="student-toggle-checkbox"
							>
								{t('only-show-student-booking-hours')}
							</label>
						</div> */}
						<BookingCalendar />
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
			<NoteForStudentModal />
		</>
	);
};

// ManageSlot.getLayout = getLayout;

// export default ManageSlot;

ManageSlot.getLayout = getLayout;
ManageSlot.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(ManageSlot);
