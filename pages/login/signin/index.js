import React, { useEffect, useContext, useState } from 'react';
import Layout from '~/components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { appSettings } from '~/config';
import { LoginAPI } from '~/api/authAPI';
import Slider from 'react-slick';
import { useAuth } from '~/api/auth.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { i18n, withTranslation } from '~/i18n';
import { I18nContext } from 'next-i18next';
import Select, { components } from 'react-select';
import CircularProgress from '@material-ui/core/CircularProgress';
import Skeleton from '@material-ui/lab/Skeleton';

const LangOptions = [
	{
		label: 'Vietnamese',
		value: 'vi',
		flag: 'vn',
	},
	{
		label: 'English',
		value: 'en',
		flag: 'us',
	},
];

const FlatOption = (props) => {
	const { data } = props;
	return (
		<components.Option {...props}>
			<div className="d-flex align-items-center">
				<span className={`flag-icon flag-icon-${data.flag}`}></span>
				<span className="mg-l-10">{data.label}</span>
			</div>
		</components.Option>
	);
};
const useStyles = makeStyles((theme) => ({
	styleInput: {
		paddingLeft: '5px',
		width: '100%',
		display: 'block',
		marginBottom: '10px',
		'& > div': {
			width: '100%',
		},
	},
	wrapBtn: {
		position: 'relative',
	},
	formLogin: {
		width: '60%',
		margin: 'auto',
		[theme.breakpoints.down('sm')]: {
			width: '90%',
		},
	},
	styleLoadingLogin: {
		width: '23px!important',
		height: '23px!important',
		marginRight: '15px',
		color: 'white',
	},
	boxBtn: {
		textAlign: 'center',
		width: '100%',
	},
	btnLogin: {
		width: '100%',
	},
	modalResult: {
		display: 'none',
		position: 'fixed',
		top: '100px',
		right: '15px',
		boxShadow: '1px 2px 10px #00000038',
		zIndex: '999',
		[theme.breakpoints.down('sm')]: {
			width: '100%',
			left: '50%',
			transform: 'translateX(-50%)',
			top: '0px',
			borderRadius: '0',
		},
	},
	animatedIn: {
		animation: `$show 500ms ${theme.transitions.easing.easeInOut}`,
		display: 'flex',
	},
	wrapLoading: {
		width: '25%',
		margin: 'auto',
		marginTop: '70px',
	},
	'@keyframes show': {
		'0%': {
			opacity: 0,
			top: '-20px',
		},
		'100%': {
			opacity: 1,
			top: '100px',
		},
		[theme.breakpoints.down('sm')]: {
			'@keyframes show': {
				'0%': {
					opacity: 0,
					top: '-20px',
				},
				'100%': {
					opacity: 1,
					top: '0px',
				},
			},
		},
	},
	colorSke: {
		backgroundColor: '#d400501c',
	},
	boxError: {
		marginTop: '15px',
		textAlign: 'center',
		color: 'red',
		fontWeight: '600',
		[theme.breakpoints.down('sm')]: {
			fontSize: '13px',
		},
	},

	styleLoading: {
		width: '30px!important',
		height: '30px!important',
		position: 'absoulte!important',
		top: '20px!important',
		right: '20px!important',
	},
	textSuccses: {
		color: 'green',
		fontWeight: '600',
		textAlign: 'center',
	},
}));
const SimpleSlider = () => {
	var settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
	};
	return (
		<Slider {...settings}>
			<div>
				<h3>1</h3>
			</div>
			<div>
				<h3>2</h3>
			</div>
			<div>
				<h3>3</h3>
			</div>
			<div>
				<h3>4</h3>
			</div>
			<div>
				<h3>5</h3>
			</div>
			<div>
				<h3>6</h3>
			</div>
		</Slider>
	);
};
const Signin = ({ t, isStudent }) => {
	const { i18n } = useContext(I18nContext);
	const [lang, setLang] = useState(LangOptions[0]);
	const [loadLogin, setLoadLogin] = useState(false);

	const _handleChangeSelect = (selected) => {
		setLang(selected);
		i18n.changeLanguage(selected.value === 'en' ? 'en' : 'vi');
		window.localStorage.setItem('language', JSON.stringify(selected.value));
	};

	const setSelectLanguage = (key) => {
		setLang(LangOptions.find((item) => item.value === key));
	};

	const checkDefaultLanguage = () => {
		if (typeof window === 'undefined') return;
		try {
			const language = window.localStorage.getItem('language');
			console.log({ language });
			language !== null && setSelectLanguage(JSON.parse(language));
			language === null &&
				window.localStorage.setItem(
					'language',
					JSON.stringify(i18n?.language ?? 'en'),
				);
		} catch (error) {}
	};
	useEffect(() => {
		isStudent ? (appSettings.UID = 1071) : (appSettings.UID = 20);
	}, [isStudent]);

	useEffect(() => {
		checkDefaultLanguage();
		if (localStorage.getItem('isLogin')) {
			let dataUser = localStorage.getItem('dataUser');
			dataUser = JSON.parse(dataUser);

			let RoleID = dataUser.RoleID;

			if (RoleID == 4) {
				router.push({
					pathname: '/teacher',
				});
			}
			if (RoleID == 5) {
				router.push({
					pathname: '/student',
				});
			}
		} else {
			setLoadLogin(true);
		}
	}, []);
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [loginSuccess, setLoginSuccess] = useState({
		status: false,
		message: '',
	});

	const [error, setError] = useState(null);
	const [resultError, setResultError] = useState({
		status: false,
		message: '',
	});
	const [stateValues, setStateValues] = React.useState({
		username: '',
		password: '',
	});

	// console.log('state Values: ', stateValues);

	// console.log('resultError: ', resultError);

	const handleChange = (evt) => {
		const valueInput = evt.target.value;

		if (resultError) {
			setResultError({
				...resultError,
				status: false,
			});
		}

		setStateValues({
			...stateValues,
			[evt.target.name]: valueInput,
		});
	};

	const { handleLogin } = useAuth();

	const handleClick_moveToForget = (e) => {
		e.preventDefault();
		router.push({
			pathname: '/login/forgotPassword/',
		});
	};

	const handleClick_login = (e) => {
		e.preventDefault();

		console.log('Check handle login in Page');

		setLoading(true);

		let check = handleLogin(stateValues);
		check.then(function (value) {
			if (!value.status && value.status !== null) {
				setTimeout(() => {
					setLoading(false);
					setResultError({
						status: true,
						message: value.message,
					});
				}, 2000);
			} else {
				setLoginSuccess({
					status: true,
					message: value.message,
				});
			}
		});
	};
	// handle button click of login form
	// const handleLogin = async () => {
	// 	setError(null);
	// 	setLoading(true);

	// 	try {
	// 		const res = await LoginAPI(stateValues);
	// 		setLoading(false);
	// 		if (res.Code === 1) {
	// 			localStorage.setItem('TokenUser', res.Data.account.TokenApp);
	// 			localStorage.setItem('DataUser', JSON.stringify(res.Data.account));
	// 			router.push('/home');
	// 		}
	// 		if (res.Code === 2) {
	// 			res.Code === 2 && setError(res.Message);
	// 		}
	// 	} catch (error) {
	// 		setLoading(false);
	// 		setError('Loi khong ket noi');
	// 		console.log(error);
	// 	}
	// };

	const classes = useStyles();
	return (
		<>
			{!loadLogin ? (
				<div className={classes.wrapLoading}>
					<Skeleton className={classes.colorSke} />
					<Skeleton className={classes.colorSke} animation={false} />
					<Skeleton className={classes.colorSke} animation="wave" />
				</div>
			) : (
				<div
					className="d-flex flex-column align-items-center justify-content-center"
					style={{
						background:
							'url(http://mypage.e-talk.vn/Content/form/images/bl1.jpg) no-repeat center center ',
						backgroundSize: 'cover',
					}}
				>
					<div className="headerLogin">
						<div className="mainLogo">
							<a href="#">
								<img src="/static/img/logo.png" alt="" />
							</a>
						</div>
						<div className="headerRight">
							<ul className="listMenu">
								{/* <li>
								<a href="#">{t('home-page')}</a>
							</li>
							<li>
								<a href="#">{t('log-in')}</a>
							</li> */}
								<li>
									<Select
										isSearchable={false}
										options={LangOptions}
										formatOptionLabel={(context) => (
											<div className="d-flex align-items-center">
												<span
													className={`flag-icon flag-icon-${context.flag}`}
												></span>
												<span className="mg-l-10">{context.label}</span>
											</div>
										)}
										components={{
											Option: FlatOption,
											IndicatorSeparator: () => null,
										}}
										value={lang}
										onChange={_handleChangeSelect}
										className="wd-150 mg-l-15"
										styles={{
											control: (oldStyle, state) => {
												return {
													...oldStyle,
													border: 0,
													outline: 0,
													boxShadow: 'none',
													borderRadius: 0,
													backgroundColor: '#efefef',
												};
											},
										}}
									/>
								</li>
							</ul>
						</div>
					</div>
					<div className="loginWrap">
						<div className="container">
							<h2 className="titleForm">{t('LOGIN')}</h2>
							{/* {loginSuccess.status ? (
							<h3 className={classes.textSuccses}>{loginSuccess.message}</h3>
						) : (
							
						)} */}

							<div className="boxForm">
								<form
									onSubmit={handleClick_login}
									className="formLogin"
									noValidate
									autoComplete="off"
								>
									<TextField
										id="standard-basic"
										label="Username"
										name="username"
										className="styleInput"
										onChange={handleChange}
										disabled={loading && true}
									/>
									<TextField
										type="password"
										id="standard-basic"
										label="Password"
										name="password"
										className="styleInput"
										onChange={handleChange}
										disabled={loading && true}
									/>
									<br />
									<div
										className="boxRemember"
										style={{ justifyContent: 'flex-end' }}
									>
										{/* <div className="remember-item">
										<label className="boxLabel">
											<input type="checkbox" />
											{t('remember')}
											<span class="checkmark"></span>
										</label>
									</div> */}
										<div className="forgotPass">
											<a href="#" onClick={handleClick_moveToForget}>
												{t('forgot-password')}
											</a>
										</div>
									</div>
									{resultError.status && (
										<div className={classes.boxError}>
											<span className={classes.textError}>
												{resultError.message}
											</span>
										</div>
									)}

									<div className={`boxBtn ${classes.wrapBtn} `}>
										<Button
											type="submit"
											variant="contained"
											value={loading ? 'Loading...' : 'Đăng nhập'}
											// disabled={loading}
											color="primary"
											className="btnLogin"
										>
											{loading && (
												<CircularProgress
													color="secondary"
													className={classes.styleLoadingLogin}
												/>
											)}
											{!loading && (
												<FontAwesomeIcon
													icon="sign-in-alt"
													className="fas fa-sign-in-alt"
												/>
											)}{' '}
											{t('log-in')}
										</Button>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className="footerLogin">
						<div className="container">
							<div className="tableFooter">
								<div className="columns">
									<div className="colum">
										<div className="boxLogoFooter">
											<a href="#">
												<img src="/static/img/logo-white.png" alt="" />
											</a>
										</div>
										<div className="contentFt">
											<p>{t('lg-1')}</p>
										</div>
									</div>
									<div className="colum">
										<ul className="listFt padding-left">
											<li>
												<a href="#">{t('about-us')}</a>
											</li>
											<li>
												<a href="#">Tutor</a>
											</li>
											<li>
												<a href="#">FAQs</a>
											</li>
										</ul>
									</div>
									<div className="colum">
										<ul className="listFt">
											<li>
												<a href="#">{t('sign-up-for-a-free-trial')}</a>
											</li>
											<li>
												<a href="#">{t('follow-us')}</a>
											</li>
										</ul>
									</div>
									<div className="colum">
										<ul className="listFt">
											<li>
												<a href="#">{t('contact')}</a>
											</li>
											<li>
												<a href="#">
													<FontAwesomeIcon
														icon="phone-square-alt"
														className="fas fa-phone-square-alt"
													/>{' '}
													0903.329.682
												</a>
											</li>
											<li>
												<a href="#">
													<FontAwesomeIcon
														icon="envelope"
														className="fas fa-envelope"
													/>{' '}
													hocngoainguquaskype@gmail.com
												</a>
											</li>
											<li>
												<a href="#">
													<FontAwesomeIcon
														icon="home"
														className="fas fa-home"
													/>{' '}
													197 Purok 2 Rimando Road Baguio City, Philippines
												</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div className="copyRight">
							<p>Copyright © 2016 E-Talk.vn</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

// export default Index;
Signin.Layout = Layout;
Signin.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(Signin);
