import React, { useRef, useEffect, useState } from 'react';
import { getStudentLayout } from '~/components/Layout';
import { GetReferral } from '~/api/studentAPI';
import './index.module.scss';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';
import ReactHtmlParser, {
	processNodes,
	convertNodeToElement,
	htmlparser2,
} from 'react-html-parser';
const Referral = ({ t }) => {
	const router = useRouter();
	const [url, setUrl] = useState('');
	const [isCopy, setIsCopy] = useState(false);
	const [dataRefer, setDataRefer] = useState();
	const refInput = useRef(true);
	const [loading, setLoading] = useState(false);
	const copy = (element) => {
		return () => {
			document.execCommand('copy', false, element.select());
			setIsCopy(true);
			setTimeout(() => {
				setIsCopy(false);
			}, 3000);
		};
	};

	console.log('Data refer: ', dataRefer);

	const getAPI = async (params) => {
		setLoading(true);
		const res = await GetReferral(params);
		console.log(res);
		if (res.Code === 200) {
			setDataRefer(res.Data);
		} else {
			setDataRefer({});
		}
		setLoading(false);
	};

	const copyShareUrl = copy(refInput.current);

	useEffect(() => {
		setUrl('https://etalk.vn/student/referral/code=325454');
		return () => {
			refInput.current && (refInput.current = false);
		};
	}, []);

	useEffect(() => {
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
		}

		let UID = null;
		let Token = null;
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		getAPI({
			UID: UID,
			Page: 1,
			Token: Token,
		});
		$('body').removeClass('show-aside');
		Referral.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});
	}, []);
	return (
		<>
			<h1 className="main-title-page">{t('referral')}</h1>
			<div className="card">
				<div className="card-body">
					<div className="row">
						<div className="col-12">
							<div className="mg-b-30">
								{/* <h2>“{t('more-friends-more-fun')}”</h2> */}
								<h2>{dataRefer?.TitlePost}</h2>
								<p>
									{t('p-1')} <strong>{t('p-2')}.</strong>
								</p>
							</div>
						</div>
						{/* <div className="col-md-6">
							<h5>{t('how-to-join')}</h5>
							<ul>
								<li>{t('p-4')}</li>
								<li>{t('p-5')}</li>
								<li>{t('p-6')}</li>
								<li style={{ listStyle: 'none' }}>
									<ul>
										<li>{t('p-7')}</li>
										<li>{t('p-8')}</li>
									</ul>
								</li>
								<li>{t('p-9')}</li>
							</ul>
						</div>
						<div className="col-md-6">
							<h5>{t('terms-&-conditions')}</h5>
							<ul>
								<li>{t('p-10')}</li>
								<li>{t('p-11')}</li>
								<li>{t('p-12')}</li>
								<li>{t('p-13')}</li>
								<li>{t('p-14')}</li>
								<li>{t('p-15')}</li>
								<li>{t('p-16')}</li>
							</ul>
						</div> */}
						<div>
							<img src={dataRefer?.ImgPost} />
						</div>
						<div className="refer-content">
							{ReactHtmlParser(dataRefer?.ContentPost)}
						</div>
						<div className="col-12 mg-t-30">
							<div className="tx-center mg-b-30">
								<h4 className="tx-primary mg-b-15">{t('p-3')}</h4>
								<div className="form-group mg-x-auto" style={{ maxWidth: 600 }}>
									<input
										onClick={copyShareUrl}
										ref={refInput}
										className="shareUrl-input js-shareUrl form-control tx-center bg-secondary bd-secondary"
										type="text"
										readonly="readonly"
										value={dataRefer?.RegisterLink}
									/>
								</div>
								{isCopy ? (
									<p className="tx-success mg-t-15">
										{t('successfully-copied')}
									</p>
								) : (
									''
								)}
							</div>
							<h5 className="mg-b-15">Danh sách đã mời</h5>
							<div className="table-responsive ">
								<table className="table table-fb table-500">
									<thead>
										<tr>
											<th>ID</th>
											<th>{t('invited-account')}</th>
											<th>{t('join-date')}</th>
											<th>{t('reward-points')}</th>
										</tr>
									</thead>
									<tbody>
										{dataRefer?.RefferFriend.length > 0 ? (
											dataRefer.RefferFriend.map((item) => (
												<tr>
													<td>{item.ID}</td>
													<td>{item.FullName}</td>
													<td>{item.CreatedDate}</td>
													<td>{item.RewardPoints}</td>
												</tr>
											))
										) : (
											<div>There's not have data</div>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

// Referral.getLayout = getStudentLayout;
// export default Referral;

Referral.getLayout = getStudentLayout;

export default withTranslation('common')(Referral);
