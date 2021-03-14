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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
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
const groupStyles = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
};
const groupBadgeStyles = {
	backgroundColor: '#EBECF0',
	borderRadius: '2em',
	color: '#172B4D',
	display: 'inline-block',
	fontSize: 12,
	fontWeight: 'normal',
	lineHeight: '1',
	minWidth: 1,
	padding: '0.16666666666667em 0.5em',
	textAlign: 'center',
};
const colourOptions = [
	{
		value: '0',
		label: 'Please choose course',
	},
	{
		value: '1',
		label: 'Phát âm chuyên sâu',
	},
	{
		value: '2',
		label: 'Giao tiếp thực hành',
	},
	{ value: '3', label: 'Phát triển từ vựng' },
	{
		value: '4',
		label: 'Tiếng anh thương mại thực hành',
	},
	{ value: '5', label: 'Tiếng anh trẻ em' },
	{ value: '6', label: 'Tiếng anh theo yêu cầu' },
	{ value: '7', label: 'Luyện phản xạ chuyên nghiệp' },
];
const groupedOptions = [
	{
		label: 'Please choose course',
		options: colourOptions,
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
	formLogin: {
		width: '60%',
		margin: 'auto',
		[theme.breakpoints.down('sm')]: {
			width: '90%',
		},
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
const Index = ({ t, isStudent }) => {
	const { i18n } = useContext(I18nContext);
	const [lang, setLang] = useState(LangOptions[0]);

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

	console.log('resultError: ', resultError);

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
	const handleClick_login = () => {
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
	const [startDate, setStartDate] = useState(new Date());
	const formatGroupLabel = (data) => (
		<div style={groupStyles}>
			<span>{data.label}</span>
			<span style={groupBadgeStyles}>{data.options.length}</span>
		</div>
	);
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
	const RadioButtonsGroup = () => {
		const [value, setValue] = React.useState('female');

		const handleChange = (event) => {
			setValue(event.target.value);
		};
	};
	return (
		<div
			className="d-flex flex-column align-items-center justify-content-center"
			style={{
				height: 'var(--app-height)',
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
						<li>
							<a href="#">{t('home-page')}</a>
						</li>
						<li>
							<a href="#">{t('log-in')}</a>
						</li>
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
			<div className="loginWrap w-1170">
				<div className="container">
					<h2 className="titleForm">Đăng Kí Học Thử Miễn Phí</h2>
					{loginSuccess.status ? (
						<h3 className={classes.textSuccses}>{loginSuccess.message}</h3>
					) : (
						<div className="boxForm">
							<form
								className="formRegister form-flex w-760"
								noValidate
								autoComplete="off"
							>
								<div className="boxInput">
									<TextField
										id="standard-basic"
										label="Fullname *"
										name="text"
										className="styleInput"
										onChange={handleChange}
									/>
								</div>
								<div className="boxInput">
									<DatePicker
										selected={startDate}
										onChange={(date) => setStartDate(date)}
										isClearable
										dateFormat="dd/MM/yyyy"
										className="form-control custom-date"
										placeholderText="Day of birth *"
										name="Day of birth"
									/>
								</div>
								<div className="boxInput">
									<TextField
										id="standard-basic"
										label="Email *"
										name="email"
										className="styleInput"
										onChange={handleChange}
									/>
								</div>
								<div className="boxInput">
									<TextField
										id="standard-basic"
										label="Phone number *"
										name="number"
										className="styleInput"
										onChange={handleChange}
									/>
								</div>
								<div className="boxInput mar-t-10">
									<Select
										defaultValue={colourOptions[0]}
										options={groupedOptions}
										formatGroupLabel={formatGroupLabel}
									/>
								</div>
								<div className="boxInput">
									<TextField
										id="standard-basic"
										label="Skype *"
										name="skyid"
										className="styleInput"
										onChange={handleChange}
									/>
								</div>
								<div className="boxInput w-100">
									<textarea
										id=""
										rows="3"
										className="form-control"
										placeholder="Massage"
										name="RequestWithTeacher"
									></textarea>
								</div>
								<div className="boxInput label-radio">
									<FormControl component="fieldset">
										<FormLabel component="legend">
											Bạn biết E-talk qua kênh thông tin nào:
										</FormLabel>
										<RadioGroup
											aria-label="gender"
											name="gender1"
											onChange={handleChange}
										>
											<FormControlLabel
												value="female"
												control={<Radio />}
												label="Tìm kiếm trên Google"
											/>
											<FormControlLabel
												value="male"
												control={<Radio />}
												label="Fanpage Facebook E-talk"
											/>
											<FormControlLabel
												value="other"
												control={<Radio />}
												label="Bạn bè giới thiệu"
											/>
											<FormControlLabel
												value="disabled"
												control={<Radio />}
												label="Khác (Tờ rơi, Forum, Banner…)"
											/>
										</RadioGroup>
									</FormControl>
								</div>
								{resultError.status && (
									<div className={classes.boxError}>
										<span className={classes.textError}>
											{resultError.message}
										</span>
									</div>
								)}
							</form>
						</div>
					)}
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
											<FontAwesomeIcon icon="home" className="fas fa-home" />{' '}
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
	);
};

// export default Index;
Index.Layout = Layout;
Index.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(Index);
