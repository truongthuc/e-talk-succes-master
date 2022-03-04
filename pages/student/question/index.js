import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { getFaqAPI } from '~/api/studentAPI';
import { getStudentLayout } from '~/components/Layout';
import { i18n, withTranslation } from '~/i18n';
import Router, { useRouter } from 'next/router';

const Faq = ({ t }) => {
	const router = useRouter();

	const [state, setState] = useState([]);
	const [loading, setLoading] = useState(false);

	const getAPI = async () => {
		setLoading(true);
		const res = await getFaqAPI();
		if (res.Code === 1) {
			setState(res.Data);
		}
		setLoading(false);
	};

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

		getAPI();
		$('body').removeClass('show-aside');
	}, []);

	return (
		<>
			<div className="faq-container">
				<h1 className="main-title-page">{t('faqs')}</h1>
				<div className="tx-center">
					<img
						src="/static/img/question.svg"
						alt="no-data"
						className="wd-300 mg-b-30"
					/>
				</div>

				{loading ? (
					<></>
				) : (
					<div id="accordion">
						{!!state && state.length > 0 ? (
							state.map((item, index) => (
								<div className="card" key={item.ID}>
									<div
										className="card-header collapsed"
										id={item.ID}
										data-toggle="collapse"
										aria-expanded={index === 0 ? 'true' : 'false'}
										data-target={`#collapse${item.ID}`}
										aria-controls={`collapse${item.ID}`}
									>
										<h5 className="mb-0">
											<button
												className="btn btn-link tx-medium"
												style={{ color: '#000' }}
											>
												{item.Title}
											</button>
										</h5>
									</div>
									<div
										data-parent="#accordion"
										id={`collapse${item.ID}`}
										className={`${index === 0 ? 'show' : ''} collapse`}
										aria-labelledby={item.ID}
									>
										<div
											className="card-body"
											dangerouslySetInnerHTML={{ __html: item.FaqContent }}
										></div>
									</div>
								</div>
							))
						) : (
							<div className="card card-custom shadow">
								<div className="card-body tx-center">
									<span className="d-block tx-center tx-danger tx-medium">
										Không có câu hỏi nào
									</span>
									<img
										src="/static/img/no-data.svg"
										alt="no-data"
										className="wd-200 mg-b-15"
									/>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
};
// Faq.getLayout = getStudentLayout;
// export default Faq;

Faq.getLayout = getStudentLayout;
Faq.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});

export default withTranslation('common')(Faq);
