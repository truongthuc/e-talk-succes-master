import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import dayjs from 'dayjs';

const ActiveSlotModal = ({
	data,
	handleOpenSlot,
	showModal = false,
	closeModal,
	openModal,
	modalData,
	dataUser,
	statusBook,
	t,
}) => {
	const {
		start = '',
		end = '',
		dataPopup = null,
		Avatar,
		TeacherName,
		StudyTime,
	} = modalData;

	const [onSending, sOnSending] = React.useState(false);
	const [infoSubmit, setInfoSubmit] = useState({});
	const [select, setSelect] = useState();

	const useStyles = makeStyles((theme) => ({
		root: {
			'& .MuiTextField-root': {
				margin: theme.spacing(1),
				width: '25ch',
			},
		},

		styleInput: {
			border: '1px solid #dadce0',
			padding: '7px 10px',
			borderRadius: '5px',
			width: '100%',
			marginBottom: '1rem',
		},
		styleSelect: {
			border: '1px solid #dadce0',
			padding: '7px 10px',
			borderRadius: '5px',
			width: '100%',
			marginBottom: '1rem',
		},
		rowInfo: {},
		modalBody: {
			padding: '1rem 4rem',
			[theme.breakpoints.down('sm')]: {
				padding: '1rem 1rem',
			},
		},
		boxInfo: {
			width: '78%',
			margin: 'auto',
			padding: '15px 55px',
			boxShadow: '1px 1px 12px #0000001a',
			borderRadius: '10px',
			border: '2px solid #ffffff21',
			[theme.breakpoints.down('sm')]: {
				width: '88%',
				padding: '15px 7px',
			},
		},
		modalHeader: {
			background: '#f12b71',
			backgroundImage:
				'linear-gradient(to right top, #f12b71, #f2417d, #f25388, #f26293, #f2709e)',
		},
		imgUser: {
			width: '60px',
			height: '60px',
			objectFit: 'cover',
			border: '2px solid #ffffffcf',
			borderRadius: '50%',
		},
	}));

	const convertDate = (time) => {
		time = time.split(' ');
		return time[0];
	};

	const convertHours = (time) => {
		time = time.split(' ');
		return time[1];
	};

	const dateStart = convertDate(start);
	const dateEnd = convertDate(end);
	const timeStart = convertHours(start);
	const timeEnd = convertHours(end);

	const handldeChange_getValue = (event) => {
		let text = event.target.value;
		setInfoSubmit({
			...infoSubmit,
			program: text,
		});
	};

	const handleSelect = (event) => {
		setInfoSubmit({
			...infoSubmit,
			courseID: parseInt(event.target.value),
		});
	};

	const classes = useStyles();
	const [value, setValue] = React.useState('Controlled');

	const handleChange = (event) => {
		setValue(event.target.value);
	};

	useEffect(() => {
		onSending && handleOpenSlot(infoSubmit);
	}, [onSending]);

	useEffect(() => {
		sOnSending(false);
	}, [statusBook]);

	useEffect(() => {
		setInfoSubmit({
			program: '',
			packageID: dataPopup?.Package.PackageID,
			courseID: dataPopup?.ListCourse[0].CourseID,
			start: start,
			end: end,
			StudyTime: StudyTime,
		});
	}, [dataPopup]);

	return (
		<>
			<Modal
				show={showModal}
				// backdrop="static"   //Prevent close when click overlay
				keyboard={false}
				centered
				animation={false}
				onHide={closeModal}
			>
				<Modal.Header closeButton className={classes.modalHeader}>
					<div className={classes.boxInfo}>
						<div className="row">
							<div className="col-3">
								<img
									className={classes.imgUser}
									src={Avatar ? Avatar : '/static/img/user.png'}
									alt=""
								/>
							</div>
							<div className="col-9 d-flex align-items-center">
								<h6 style={{ color: 'white' }}>{TeacherName}</h6>
							</div>
						</div>
					</div>
				</Modal.Header>
				<Modal.Body className={`modal-body-form ${classes.modalBody}`}>
					<div className={`row ${classes.rowInfo}`}>
						<div className="col-4">
							<p className="label-style">{t('Program')}:</p>
						</div>
						<div className="col-8">
							<input
								type="text"
								className={classes.styleInput}
								onChange={handldeChange_getValue}
								placeholder="Nhập nội dung"
							></input>
						</div>
					</div>
					<div className={`row ${classes.rowInfo}`}>
						<div className="col-4">
							<p className="label-style">{t('Time')}</p>
						</div>
						<div className="col-8">
							<p>
								<span className="tx-medium" id="js-start-time">
									{/* {timeStart} - {timeEnd} */}
									{StudyTime}
								</span>
							</p>
						</div>
					</div>
					<div className={`row ${classes.rowInfo}`}>
						<div className="col-4">
							<p className="label-style">{t('Date')}</p>
						</div>
						<div className="col-8">
							<p>
								<span className="tx-medium" id="js-start-time">
									{dateStart} - {dateEnd}
								</span>
							</p>
						</div>
					</div>
					{dataPopup !== null && (
						<>
							<div className={`row ${classes.rowInfo}`}>
								<div className="col-4">
									<p className="label-style">{t('Package')}</p>
								</div>
								<div className="col-8">
									<select className={classes.styleSelect}>
										<option value={dataPopup?.Package.PackageID}>
											{dataPopup?.Package.PackageName}
										</option>
									</select>
								</div>
							</div>
							<div className={`row ${classes.rowInfo}`}>
								<div className="col-4">
									<p className="label-style">{t('Course')}</p>
								</div>
								<div className="col-8">
									<select
										onChange={handleSelect}
										className={classes.styleSelect}
										value={select}
									>
										{dataPopup?.ListCourse.map((item) => (
											<option value={item.CourseID}>{item.CourseName}</option>
										))}
									</select>
								</div>
							</div>
							<div className="d-flex justify-content-center mt-3">
								<button
									type="button"
									className="btn btn-default btn-sm tx-primary"
									onClick={closeModal}
									style={{ marginRight: '10px' }}
								>
									<span>{t('Cancel')}</span>
								</button>
								<button
									type="button"
									disabled={onSending}
									className="btn btn-primary btn-sm tx-primary"
									onClick={() => sOnSending(true)}
								>
									{onSending ? (
										<span>
											<i class="fas fa-spinner fa-spin"></i> {t('Booking')}
										</span>
									) : (
										<span>{t('Booking')}</span>
									)}
								</button>
							</div>
						</>
					)}
				</Modal.Body>
			</Modal>
		</>
	);
};

export default ActiveSlotModal;
