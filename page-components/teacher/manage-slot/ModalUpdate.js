import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		width: '60%',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: '30px 24px 24px',
		borderRadius: '5px',
		[theme.breakpoints.down('lg')]: {
			width: '70%!important',
		},
		[theme.breakpoints.down('sm')]: {
			width: '98%!important',
			padding: '16px 10px 24px 10px',
		},
	},
	styleInput: {
		border: '1px solid #dadce0',
		padding: '7px 10px',
		borderRadius: '5px',
		width: '80%',
	},
	styleSelect: {
		width: '80%',
		border: '1px solid #dadce0',
		padding: '7px 10px',
		borderRadius: '5px',
	},
	rowInfo: {
		display: 'flex',
		flexWrap: 'nowrap',
		marginBottom: '1rem',
	},
	colRight: {
		width: '75%',
	},
	colLeft: {
		fontWeight: 'bold',
		width: '35%',
	},
	boxBtn: {
		textAlign: 'center',
	},
	styleBtn: {
		margin: '0 5px',
	},
	error: {
		display: 'block',
		color: '#c30000',
		fontSize: '12px',
		fontStyle: 'italic',
		marginTop: '5px',
	},
	StyleLoading: {
		width: '20px!important',
		height: '20px!important',
		color: 'white!important',
		marginRight: '5px!important',
	},
}));

export default function ModalUpdate({
	onShow,
	dataUpdate,
	updateStatus,
	onClose,
	t,
}) {
	const {
		BookingID = '',
		BookingStatus = '',
		ClassName = '',
		ClassStatus = '',
		Color = '',
		DateOff = '',
		EndDate = '',
		HomeWork = '',
		OpenID = '',
		Program = '',
		Remark = '',
		StartDate = '',
		StudentCode = '',
		StudentName = '',
		StudentSkype = '',
		TeacherName = '',
		TextColor = '',
		PackageName = '',
		CourseName = '',
	} = dataUpdate;

	const classes = useStyles();
	const [open, setOpen] = React.useState(onShow);
	const [infoSubmit, setInfoSubmit] = useState({
		BookingID: BookingID,
		ClassStatus: ClassStatus,
		Rating: Remark,
		Homework: HomeWork,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState({
		Homework: false,
		Remark: false,
		ClassStatus: false,
	});

	const [changeInput, setChangeInput] = useState(false);

	useEffect(() => {
		setInfoSubmit({
			BookingID: BookingID,
			ClassStatus: ClassStatus,
			Rating: Remark,
			Homework: HomeWork,
		});
		setSelect(ClassStatus);
		setOpen(onShow);
	}, [onShow]);

	const [select, setSelect] = useState();

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		onClose();
	};

	const updateInfo = (e) => {
		e.preventDefault();
		let Homework = false;
		let Remark = false;
		let ClassStatus = false;
		let check = null;
		setIsLoading(true);

		if (
			infoSubmit.Rating === '' ||
			infoSubmit.Homework === '' ||
			infoSubmit.ClassStatus === 5
		) {
			if (infoSubmit.Homework === '') {
				Homework = true;
			}
			if (infoSubmit.Rating === '') {
				Remark = true;
			}
			if (infoSubmit.ClassStatus === 5) {
				ClassStatus = true;
			}
			setError({
				Homework: Homework,
				Remark: Remark,
				ClassStatus: ClassStatus,
			});
			setIsLoading(false);
		}

		if (
			infoSubmit.Rating !== '' &&
			infoSubmit.Homework !== '' &&
			infoSubmit.ClassStatus !== 5
		) {
			check = updateStatus(infoSubmit);
			check.then(function (value) {
				if (value) {
					setIsLoading(false);
				}
			});
			setError({
				Homework: false,
				Remark: false,
			});
		}
	};

	const handldeChange_getValue = (event) => {
		setChangeInput(true);
		let text = event.target.value;
		setInfoSubmit({
			...infoSubmit,
			[event.target.name]: text,
		});
	};

	const deleteValue = (event) => {
		event.target.value = '';
	};

	const handleSelect = (event) => {
		setSelect(event.target.value);
		setInfoSubmit({
			...infoSubmit,
			ClassStatus: parseInt(event.target.value),
		});
	};

	useEffect(() => {
		setError({
			Homework: false,
			Remark: false,
		});
	}, []);

	return (
		<div>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<div className={classes.paper}>
						<form onSubmit={updateInfo}>
							<div className="row">
								<div className="col-md-6 col-12">
									<div className={`${classes.rowInfo}`}>
										<div className={classes.colLeft}>
											<p>{t('Teacher')}</p>
										</div>
										<div className={classes.colRight}>
											<input
												type="text"
												className={classes.styleInput}
												onChange={handldeChange_getValue}
												placeholder={t('Type content')}
												disabled
												value={TeacherName}
											></input>
										</div>
									</div>

									<div className={`${classes.rowInfo}`}>
										<div className={classes.colLeft}>
											<p>{t('Student')}</p>
										</div>
										<div className={classes.colRight}>
											<input
												type="text"
												className={classes.styleInput}
												onChange={handldeChange_getValue}
												placeholder={t('Type content')}
												value={StudentName}
												disabled
											></input>
										</div>
									</div>

									<div className={`${classes.rowInfo}`}>
										<div className={classes.colLeft}>
											<p>{t('Student Code')}</p>
										</div>
										<div className={classes.colRight}>
											<input
												type="text"
												className={classes.styleInput}
												onChange={handldeChange_getValue}
												placeholder={t('Type content')}
												value={StudentCode}
												disabled
											></input>
										</div>
									</div>

									<div className={`${classes.rowInfo}`}>
										<div className={classes.colLeft}>
											<p>{t('Title')}</p>
										</div>
										<div className={classes.colRight}>
											<input
												type="text"
												className={classes.styleInput}
												onChange={handldeChange_getValue}
												placeholder={t('Type content')}
												value={Program}
												disabled
											></input>
										</div>
									</div>

									<div className={`${classes.rowInfo}`}>
										<div className={classes.colLeft}>
											<p>{t('Package')}</p>
										</div>
										<div className={classes.colRight}>
											<input
												type="text"
												className={classes.styleInput}
												onChange={handldeChange_getValue}
												placeholder={t('Type content')}
												value={PackageName}
												disabled
											></input>
										</div>
									</div>
								</div>
								<div className="col-md-6 col-12">
									<div className={`${classes.rowInfo}`}>
										<div className={classes.colLeft}>
											<p>{t('Course')}</p>
										</div>
										<div className={classes.colRight}>
											<input
												type="text"
												className={classes.styleInput}
												onChange={handldeChange_getValue}
												placeholder={t('Type content')}
												value={CourseName}
												disabled
											></input>
										</div>
									</div>
									<div className={`${classes.rowInfo}`}>
										<div className={classes.colLeft}>
											<p>{t('Class')}</p>
										</div>
										<div className={classes.colRight}>
											<input
												type="text"
												className={classes.styleInput}
												onChange={handldeChange_getValue}
												placeholder={t('Type content')}
												value={ClassName}
												disabled
											></input>
										</div>
									</div>

									<div className={`${classes.rowInfo}`}>
										<div className={classes.colLeft}>
											<p>{t('Status')}</p>
										</div>
										<div className={classes.colRight}>
											<select
												onChange={handleSelect}
												className={classes.styleSelect}
												value={select}
												disabled={ClassStatus !== 5 ? true : false}
											>
												<option value={1}>{t('Student is present')}</option>
												<option value={2}>{t('Teacher is absent')}</option>
												<option value={3}>
													{t('Student is absent without notice')}
												</option>
												<option value={4}>
													{t('No internet/power interuption')}
												</option>
												<option value={5}>{t('Upcoming')}</option>
											</select>
											{error.ClassStatus && (
												<span className={classes.error}>
													{t('You have to change status')}
												</span>
											)}
										</div>
									</div>

									<div className={`${classes.rowInfo}`}>
										<div className={classes.colLeft}>
											<p>{t('Remark')}</p>
										</div>
										<div className={classes.colRight}>
											<textarea
												type="text"
												name="Rating"
												className={classes.styleInput}
												defaultValue={Remark}
												onChange={handldeChange_getValue}
												placeholder={t('Type content')}
											></textarea>
											{error.Remark && (
												<span className={classes.error}>
													{t('You have to type this content')}
												</span>
											)}
										</div>
									</div>

									<div className={`${classes.rowInfo}`}>
										<div className={classes.colLeft}>
											<p>{t('Homework')}</p>
										</div>
										<div className={classes.colRight}>
											<textarea
												type="text"
												name="Homework"
												className={classes.styleInput}
												defaultValue={HomeWork}
												onChange={handldeChange_getValue}
												placeholder={t('Type content')}
											></textarea>
											{error.Homework && (
												<span className={classes.error}>
													${t('You have to type this content')}
												</span>
											)}
										</div>
									</div>
								</div>
							</div>

							<div className={classes.boxBtn}>
								<Button
									onClick={handleClose}
									className={classes.styleBtn}
									variant="contained"
								>
									{t('Close')}
								</Button>
								<Button
									type="submit"
									className={classes.styleBtn}
									variant="contained"
									color="secondary"
								>
									{isLoading && (
										<CircularProgress className={classes.StyleLoading} />
									)}
									{t('Update')}
								</Button>
							</div>
						</form>
					</div>
				</Fade>
			</Modal>
		</div>
	);
}
