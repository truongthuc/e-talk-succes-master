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
import { Slide } from 'react-slideshow-image';
import './signin.module.scss';
import 'react-slideshow-image/dist/styles.css';
import { useCookies } from 'react-cookie';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

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

const slideImages = [
	'/static/img/img-1.jpg',
	'/static/img/img-2.jpg',
	'/static/img/img-3.jpg',
];
const properties = {
	// duration: 5000,
	// transitionDuration: 500,
	autoplay: true,
	infinite: true,
	indicators: false,
	Easing: 'linear',
	arrows: false,
	canSwipe: false,
};
const Slideshow = () => {
	return (
		<Slide {...properties}>
			<div className="each-slide">
				<img src={slideImages[0]} className="object-fit height-mobile" alt="" />
			</div>
			<div className="each-slide">
				<img src={slideImages[1]} className="object-fit height-mobile" alt="" />
			</div>
			<div className="each-slide">
				<img src={slideImages[2]} className="object-fit height-mobile" alt="" />
			</div>
		</Slide>
	);
};

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
	const [lang, setLang] = useState(LangOptions[1]);
	const [loadLogin, setLoadLogin] = useState(false);
	const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

	const _handleChangeSelect = (selected) => {
		setLang(selected);
		i18n.changeLanguage(selected.value === 'en' ? 'en' : 'vi');
		window.localStorage.setItem('language', JSON.stringify(selected.value));
	};

	const setSelectLanguage = (key) => {
		setLang(LangOptions.find((item) => item.value === key));
	};

	const [stateRemember, setStateRemember] = React.useState(false);

	const handleChange_remember = (event) => {
		setStateRemember(event.target.checked);
	};

	const checkDefaultLanguage = () => {
		if (typeof window === 'undefined') return;
		try {
			const language = window.localStorage.getItem('language');
			console.log({ language });
			language !== null && setSelectLanguage(JSON.parse(language));
			if (language === null) {
				setSelectLanguage('en');
				window.localStorage.setItem(
					'language',
					JSON.stringify(i18n?.language ?? 'en'),
				);
			}
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

		$('body').removeClass('show-aside');
		Signin.getInitialProps = async () => ({
			namespacesRequired: ['common'],
		});

		if (cookies.username) {
			let username = cookies.username;
			let password = cookies.password;

			setStateRemember(true);

			setStateValues({
				...stateValues,
				username: username,
				password: password,
			});
		} else {
			setStateRemember(false);
		}
	}, []);
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [loginSuccess, setLoginSuccess] = useState({
		status: false,
		message: '',
	});
	const [typePass, setTypePass] = useState(true);
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

	const returnYear = () => {
		let d = new Date();
		let currentYear = d.getFullYear();

		return currentYear;
	};

	const { handleLogin } = useAuth();

	const handleClick_moveToForget = (e) => {
		e.preventDefault();
		router.push({
			pathname: '/login/forgotPassword/',
		});
	};

	const changeTypePass = () => {
		if (typePass === false) {
			setTypePass(true);
		} else {
			setTypePass(false);
		}
	};

	const handleClick_login = (e) => {
		e.preventDefault();
		setLoading(true);

		if (stateRemember) {
			setCookie('username', stateValues.username, { path: '/' });
			setCookie('password', stateValues.password, { path: '/' });
		}

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
				setLoading(false);
				setLoginSuccess({
					status: true,
					message: value.message,
				});
			}
		});
	};

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
					className="d-flex flex-column login-page"
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
						<div className="slick-slider">
							<Slideshow></Slideshow>
						</div>
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
										value={stateValues.username}
										id="standard-basic"
										label={t('Username')}
										name="username"
										className="styleInput"
										onChange={handleChange}
										disabled={loading && true}
									/>
									<div className="row-pass">
										<TextField
											value={stateValues.password}
											type={typePass ? 'password' : 'text'}
											id="standard-basic"
											label={t('Password')}
											name="password"
											className="styleInput"
											onChange={handleChange}
											disabled={loading && true}
										/>
										<a className="icon-pass" onClick={changeTypePass}>
											{!typePass ? (
												<i class="fas fa-eye"></i>
											) : (
												<i class="fas fa-eye-slash"></i>
											)}
										</a>
									</div>

									<div className="remember-item">
										<FormControlLabel
											control={
												<Checkbox
													checked={stateRemember}
													onChange={handleChange_remember}
													name="checkedA"
												/>
											}
											label={t('Save password')}
										/>
									</div>
									<div
										className="boxRemember"
										style={{ justifyContent: 'flex-end' }}
									>
										<div
											className="forgotPass"
											style={{
												textAlign: 'center',
												display: 'flex',
												width: '100%',
												justifyContent: 'center',
											}}
										>
											<a href="#" onClick={handleClick_moveToForget}>
												{t('Forgot password')}
											</a>
											<span style={{ margin: '0 5px' }}>{t('or')}</span>
											<a
												style={{ color: '#e61e65' }}
												href="https://online.e-talk.vn/login/register"
											>
												{t('Sign up')}
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
													className="fas fa-sign-in-alt mr-2"
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
												<a href="https://e-talk.vn/">{t('about-us')}</a>
											</li>
											<li>
												<a href="https://online.e-talk.vn/login/signin/">
													{t('Tutor')}
												</a>
											</li>
											<li>
												<a href="https://e-talk.vn/">FAQs</a>
											</li>
										</ul>
									</div>
									<div className="colum">
										<ul className="listFt">
											<li>
												<a href="https://online.e-talk.vn/Login/Register">
													{t('Free trial')}
												</a>
											</li>
											<li>
												<a href="#">{t('Follow us')}</a>
												<div className="d-flex align-items-center footer-list-icon">
													<a
														href="https://www.facebook.com/EtalkVN/?fref=ts"
														className="mr-3 bg-fb"
													>
														<i class="fab fa-facebook-f"></i>
													</a>
													<a
														href="https://www.youtube.com/channel/UC8jBWQJfB9pBRIJTPCYJVkg"
														className="bg-youtube"
													>
														<i class="fab fa-youtube"></i>
													</a>
												</div>
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
													support@e-talk.vn
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
							<p>Copyright © {returnYear()} E-Talk.vn</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

// export default Index;
Signin.Layout = Layout;

export default withTranslation('common')(Signin);
