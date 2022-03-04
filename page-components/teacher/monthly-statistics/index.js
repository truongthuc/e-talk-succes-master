import React from 'react';
import { getLayout } from '~/components/Layout';
import './index.module.scss';
import { teacherMonthlyStatistics } from '~/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import Select from 'react-select';
import { appSettings } from '~/config';
import { i18n, Link, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';
const timeOptions = [
	{
		value: 1,
		label: 'This month',
	},
	{
		value: 2,
		label: '30 days ago',
	},
	{
		value: 3,
		label: 'Last month',
	},
	{
		value: 4,
		label: 'Last 3 month',
	},
];

const MonthlyStatistics = ({ t }) => {
	const router = useRouter();

	const [isLoading, setIsloading] = React.useState(true);
	const [state, setState] = React.useState(null);
	const [select, setSelect] = React.useState(timeOptions[0]);

	const getAPI = async (params) => {
		setIsloading(true);
		const res = await teacherMonthlyStatistics(params);
		if (res.Code === 200) {
			setState(res.Data);
		} else {
			setState({});
		}
		setIsloading(false);
	};

	React.useEffect(() => {
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

		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		getAPI({
			typeSearch: select.value,
			UID: UID,
			Token: Token,
		});
	}, [select]);
	return (
		<>
			<div className="d-md-flex align-items-center justify-content-end pos-relative">
				{/* <h1 className="main-title-page">{t('monthly-statistics')}</h1> */}
				<div className="select-wrap mg-t-15 mg-md-t-0 wd-md-150">
					<Select
						options={timeOptions}
						onChange={setSelect}
						defaultValue={select}
						styles={appSettings.selectStyle}
					/>
				</div>
			</div>
			<div className="report__container pos-relative z-index-0">
				<div className="mx-auto">
					<div className="row price-table-wrapper pd-b-40-f">
						<div className="col-12 col-xs-6 col-md-6 col-lg-4 col-xl-4">
							<div className="table-card bg-1">
								<div className="card">
									<div className="card-body">
										<p className="name bg-1">{t('time-slot')}</p>
										<ul className="feather">
											<li className="rp-info">
												<span className="label">{t('opened-slots')}</span>
												<span className="value">
													{isLoading ? (
														<Skeleton width={25} />
													) : !!state && state.OpenSlot ? (
														state.OpenSlot
													) : (
														0
													)}
												</span>
											</li>
											<li className="rp-info">
												<span className="label">{t('finished-classes')}</span>
												<span className="value">
													{isLoading ? (
														<Skeleton width={25} />
													) : !!state && state.FinishedClass ? (
														state.FinishedClass
													) : (
														0
													)}
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12 col-xs-6 col-md-6 col-lg-4 col-xl-4">
							<div className="table-card bg-2">
								<div className="card">
									<div className="card-body">
										<p className="name bg-2">{t('participation')}</p>
										<ul className="feather">
											<li className="rp-info">
												<span className="label">
													{t('Teacher booked slot')}{' '}
												</span>
												<span className="value">
													{isLoading ? (
														<Skeleton width={25} />
													) : !!state && state.CancellationSlots ? (
														state.CancellationSlots
													) : (
														0
													)}
												</span>
											</li>
											<li className="rp-info">
												<span className="label">
													{t('teacher-no-show-slots')}{' '}
												</span>
												<span className="value">
													{isLoading ? (
														<Skeleton width={25} />
													) : !!state && state.TeacherNoShowSlots ? (
														state.TeacherNoShowSlots
													) : (
														0
													)}
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12 col-xs-6 col-md-6 col-lg-4 col-xl-4">
							<div className="table-card bg-3">
								<div className="card">
									<div className="card-body">
										<p className="name bg-3">{t('feebback')}</p>
										<ul className="feather">
											<li className="rp-info">
												<span className="label">
													{t('5-stars-feedback-rate')}
												</span>
												<span className="value">
													{isLoading ? (
														<Skeleton width={25} />
													) : !!state && state.FiveStarRate ? (
														state.FiveStarRate
													) : (
														0
													)}
												</span>
											</li>
											<li className="rp-info">
												<span className="label">
													{t('feedback-submission-rate')}
												</span>
												<span className="value">
													{isLoading ? (
														<Skeleton width={25} />
													) : !!state && state.SubmissionRate ? (
														state.SubmissionRate
													) : (
														0
													)}{' '}
													%
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* <div className="card">
					<div className="card-body">
						<div className="table-responsive">
							<table
								className="table table-bordered table-vcenter table-explane table-hover"
								style={{ borderCollapse: 'separate' }}
							>
								<tbody>
									<tr>
										<td rowSpan={2} className="valign-middle tx-center">
											<h5 className="tx-bold">{t('time-slot')}</h5>
										</td>
										<td>
											<h5>{t('opened-slots')}</h5>
											<p className="tx-gray-500 mg-b-0">{t('note-1')}</p>
										</td>
									</tr>
									<tr>
										<td>
											<h5>{t('finished-classes')}</h5>
											<p className="tx-gray-500 mg-b-0">{t('note-2')} </p>
										</td>
									</tr>
								</tbody>
								<tbody>
									<tr>
										<td rowSpan={2} className="valign-middle tx-center">
											<h5 className="tx-bold">{t('participation')}</h5>
										</td>
										<td>
											<h5>{t('class-finished-rate')}</h5>
											<p className="tx-gray-500 mg-b-0">{t('note-3')}</p>
										</td>
									</tr>
								</tbody>
								<tbody>
									<tr>
										<td rowSpan={2} className="valign-middle tx-center">
											<h5 className="tx-bold">{t('student-feedback')}</h5>
										</td>
										<td>
											<h5>{t('5-stars-feedback-rate')}</h5>
											<p className="tx-gray-500 mg-b-0">{t('note-5')}</p>
										</td>
									</tr>
									<tr>
										<td>
											<h5>{t('teacher-feedback-timely-submission-rate')}</h5>
											<p className="tx-gray-500 mg-b-0">{t('note-6')}</p>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div> */}
			</div>
		</>
	);
};

MonthlyStatistics.getLayout = getLayout;
MonthlyStatistics.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(MonthlyStatistics);
