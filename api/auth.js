// contexts/auth.js

import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useCallback,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Router, { useRouter } from 'next/router';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//api here is an axios instance which has the baseURL set according to the env.

import { LoginAPI } from '~/api/authAPI';
import { LogoutAPI } from '~/api/authAPI';

// // Get API
// import { profileAPI } from '~/api/profileAPI';
// import { updateProfileAPI } from '~/api/profileAPI';
// import { updateImage } from '~/api/profileAPI';
// import { updatePassword } from '~/api/profileAPI';

const useStyles = makeStyles((theme) => ({
	modal: {
		minWidth: '500px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		[theme.breakpoints.down('sm')]: {
			minWidth: '100%',
		},
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		border: 'none',
		borderRadius: '3px',
		width: '448px',
		'&:focus': {
			outline: 'none',
			border: 'none',
		},
		[theme.breakpoints.down('sm')]: {
			width: '90%',
		},
	},
	boxBtn: {
		display: 'flex',
		justifyContent: 'center',
		marginTop: '10px',
	},
	titleModal: {
		textAlign: 'center',
	},
	textModal: {
		textAlign: 'center',
		fontSize: '16px',
		fontWeight: '500',
		color: '#d00000',
	},
}));

const AuthContext = createContext({});

export const AuthProvider = ({ children, history }) => {
	console.log('History: ', history);

	const classes = useStyles();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [dataProfile, setDataProfile] = useState();

	const [checkToken, setCheckToken] = useState({
		code: null,
		message: '',
	});
	const [openModal, setOpenModal] = useState(false);
	const router = useRouter();
	const [checkLogin, setCheckLogin] = useState({
		isLogin: null,
		UID: null,
		data: '',
	});

	const [loginFirst, setLoginFirst] = useState(false);

	useEffect(() => {
		async function loadUserFromCookies() {
			if (localStorage.getItem('isLogin') !== null) {
				setCheckLogin({
					isLogin: true,
					data: JSON.parse(localStorage.getItem('dataUser')),
					UID: localStorage.getItem('UID'),
					token: localStorage.getItem('token'),
				});
				// loadDataProfile(localStorage.getItem('TokenUser'));
			}
		}
		loadUserFromCookies();
	}, []);

	//LOAD DATA PROFILE
	const loadDataProfile = () => {
		if (checkLogin.token !== null) {
			console.log('Load profile');
			(async () => {
				try {
					const res = await profileAPI(checkLogin.token);
					res.Code === 1 ? setDataProfile(res.Data) : '';
					console.log('Load code: ', res.Code);
					// res.Code === 0 && changeIsAuth();
				} catch (error) {
					console.log(error);
				}
			})();
		}
	};

	const updateProfile = async (dataUpdate) => {
		let check = null;
		try {
			const res = await updateProfileAPI(dataUpdate, checkLogin.token);
			res.Code === 1 && (check = true);
			res.Code === 0 && changeIsAuth();
			res.Code === 2 && (check = false);
		} catch (error) {
			console.log(error);
		}
		return check;
	};

	const updateImg = async (dataImg) => {
		let check = null;
		try {
			const res = await updateImage(dataImg);
			res.Code === 1 ? (check = true) : (check = false);
		} catch (error) {
			console.log(error);
		}
		return check;
	};

	const updatePass = async (dataPass) => {
		let check = null;
		try {
			const res = await updatePassword(dataPass);
			res.Code === 1 && (check = true);
			res.Code === 0 && changeIsAuth();
			res.Code === 2 && (check = false);
		} catch (error) {
			console.log(error);
		}
		return check;
	};

	const checkTeacher = (string) => {
		let check = false;
		if (string.indexOf('teacher') >= 0) {
			check = true;
		}
		console.log('Check teacher: ', check);
		return check;
	};

	const checkStudent = (string) => {
		let check = false;
		if (string.indexOf('student') >= 0) {
			check = true;
		}
		console.log('Check student: ', check);
		return check;
	};

	const handleLogin = async (values) => {
		let check = {
			status: null,
			message: '',
		};

		try {
			const res = await LoginAPI(values);
			setLoading(false);
			if (res.Code === 200) {
				localStorage.setItem('isLogin', 'true');
				localStorage.setItem('UID', res.Data.UID);
				localStorage.setItem('token', res.Data.Token);
				localStorage.setItem('RoleID', res.Data.RoleID);
				localStorage.setItem('dataUser', JSON.stringify(res.Data));

				toast.success('Login success');

				setCheckLogin({
					isLogin: true,
					data: res.Data,
					UID: res.Data.UID,
					token: res.Data.Token,
				});

				if (history.length < 1) {
					if (res.Data.RoleID == 5) {
						router.push('/student/home');
					}
					if (res.Data.RoleID == 4) {
						router.push('/teacher/home');
					}
				} else {
					let url = null;
					if (history.length == 1) {
						url = history[0];
					} else {
						url = history[history.length - 2];
					}

					if (res.Data.RoleID == 5) {
						if (checkStudent(url)) {
							router.back();
						} else {
							router.push('/student');
						}
					}
					if (res.Data.RoleID == 4) {
						if (checkTeacher(url)) {
							router.back();
						} else {
							router.push('/teacher');
						}
					}
				}
			} else if (res.Code === 201) {
				toast.error('Username or Password wrong!');
			} else {
				toast.error(res.Message);
			}
		} catch (error) {
			// setLoading(false);
			console.log('Error Login: ', error);
		}
		return check;
	};

	const handleClick_MoveToLogin = () => {
		setOpenModal(false);
		setCheckLogin({
			isLogin: false,
		});

		router.push({
			pathname: '/auth/login',
		});
	};

	const changeIsAuth = () => {
		setOpenModal(true);

		localStorage.clear();
	};

	const changeDataUser = (linkImg, timezoneName, timezoneValue, userName) => {
		console.log('timezone bên auth: ', timezoneName);
		let data = JSON.parse(localStorage.getItem('dataUser'));
		data.AvatarThumnail = linkImg;
		data.TimeZoneName = timezoneName;
		data.TimeZoneValue = timezoneValue;
		if (userName !== '') {
			data.StudentName = userName;
		}

		localStorage.setItem('dataUser', JSON.stringify(data));

		setCheckLogin({
			...checkLogin,
			data: data,
		});
	};

	const handleLogout = async (UID) => {
		try {
			const res = await LogoutAPI(UID);
			if (res.Code === 200) {
				setCheckLogin({
					isLogin: false,
				});
				router.push('/');
				localStorage.clear();
			}
		} catch (error) {
			console.log('Error Logout: ', error);
		}
	};

	return (
		<>
			<ToastContainer
				position="top-center"
				autoClose={2000}
				hideProgressBar={true}
			/>
			<AuthContext.Provider
				value={{
					isAuthenticated: checkLogin,
					dataUser: checkLogin.data,
					dataProfile: dataProfile,
					checkToken: checkToken,
					changeIsAuth,
					loadDataProfile,
					updateProfile,
					updateImg,
					updatePass,
					handleLogin,
					handleLogout,
					changeDataUser,
				}}
			>
				{children}
				<Modal
					aria-labelledby="transition-modal-title"
					aria-describedby="transition-modal-description"
					className={classes.modal}
					open={openModal}
					closeAfterTransition
					BackdropComponent={Backdrop}
					BackdropProps={{
						timeout: 500,
					}}
				>
					<Fade in={openModal}>
						<div className={classes.paper}>
							<h2 id="transition-modal-title" className={classes.titleModal}>
								Thông báo
							</h2>
							<p
								id="transition-modal-description"
								className={classes.textModal}
							>
								Phiên đăng nhập đã hết hạn <br></br> Vui lòng đăng nhập lại
							</p>

							<div className={classes.boxBtn}>
								<Button
									className={classes.mgBtn}
									variant="contained"
									color="primary"
									onClick={handleClick_MoveToLogin}
								>
									Đăng nhập
								</Button>
							</div>
						</div>
					</Fade>
				</Modal>
			</AuthContext.Provider>
		</>
	);
};

export const useAuth = () => useContext(AuthContext);
