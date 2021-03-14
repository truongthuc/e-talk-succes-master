import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		width: '30%',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: '30px 24px 24px',
		borderRadius: '5px',
	},
	styleInput: {
		border: '1px solid #dadce0',
		padding: '7px 10px',
		borderRadius: '5px',
		width: '80%',
		marginBottom: '1rem',
	},
	styleSelect: {
		width: '80%',
		border: '1px solid #dadce0',
		padding: '7px 10px',
		borderRadius: '5px',
		marginBottom: '1rem',
	},
	rowInfo: {
		display: 'flex',
		flexWrap: 'nowrap',
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
}));

export default function ModalUpdate({
	onShow,
	dataUpdate,
	updateStatus,
	onClose,
}) {
	console.log('Data Update: ', dataUpdate);

	console.log('on Show: ', onShow);

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
		Rating: '',
		Homework: '',
	});

	const [changeInput, setChangeInput] = useState(false);

	useEffect(() => {
		setSelect(ClassStatus);
		setOpen(onShow);
	}, [onShow]);

	console.log('Info Submit: ', infoSubmit);

	const [select, setSelect] = useState();

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		onClose();
	};

	const updateInfo = () => {
		updateStatus(infoSubmit);
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
		setInfoSubmit({
			...infoSubmit,
			ClassStatus: parseInt(event.target.value),
		});
	};

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
						<div className={`${classes.rowInfo}`}>
							<div className={classes.colLeft}>
								<p>Giáo viên:</p>
							</div>
							<div className={classes.colRight}>
								<input
									type="text"
									className={classes.styleInput}
									onChange={handldeChange_getValue}
									placeholder="Nhập nội dung"
									disabled
									value={TeacherName}
								></input>
							</div>
						</div>
						<div className={`${classes.rowInfo}`}>
							<div className={classes.colLeft}>
								<p>Học viên</p>
							</div>
							<div className={classes.colRight}>
								<input
									type="text"
									className={classes.styleInput}
									onChange={handldeChange_getValue}
									placeholder="Nhập nội dung"
									value={StudentName}
									disabled
								></input>
							</div>
						</div>

						<div className={`${classes.rowInfo}`}>
							<div className={classes.colLeft}>
								<p>Mã học viên</p>
							</div>
							<div className={classes.colRight}>
								<input
									type="text"
									className={classes.styleInput}
									onChange={handldeChange_getValue}
									placeholder="Nhập nội dung"
									value={StudentCode}
									disabled
								></input>
							</div>
						</div>

						<div className={`${classes.rowInfo}`}>
							<div className={classes.colLeft}>
								<p>Chủ đề</p>
							</div>
							<div className={classes.colRight}>
								<input
									type="text"
									className={classes.styleInput}
									onChange={handldeChange_getValue}
									placeholder="Nhập nội dung"
									value={Program}
									disabled
								></input>
							</div>
						</div>

						<div className={`${classes.rowInfo}`}>
							<div className={classes.colLeft}>
								<p>Gói học</p>
							</div>
							<div className={classes.colRight}>
								<input
									type="text"
									className={classes.styleInput}
									onChange={handldeChange_getValue}
									placeholder="Nhập nội dung"
									value={PackageName}
									disabled
								></input>
							</div>
						</div>

						<div className={`${classes.rowInfo}`}>
							<div className={classes.colLeft}>
								<p>Khóa học</p>
							</div>
							<div className={classes.colRight}>
								<input
									type="text"
									className={classes.styleInput}
									onChange={handldeChange_getValue}
									placeholder="Nhập nội dung"
									value={CourseName}
									disabled
								></input>
							</div>
						</div>

						<div className={`${classes.rowInfo}`}>
							<div className={classes.colLeft}>
								<p>Lớp học </p>
							</div>
							<div className={classes.colRight}>
								<input
									type="text"
									className={classes.styleInput}
									onChange={handldeChange_getValue}
									placeholder="Nhập nội dung"
									value={ClassName}
									disabled
								></input>
							</div>
						</div>

						<div className={`${classes.rowInfo}`}>
							<div className={classes.colLeft}>
								<p>Trạng thái lớp học</p>
							</div>
							<div className={classes.colRight}>
								<select
									onChange={handleSelect}
									className={classes.styleSelect}
									value={select}
								>
									<option value={1}>Học viên có mặt</option>
									<option value={2}>Giáo viên vắng mặt</option>
									<option value={3}>Học viên vắng không phép</option>
									<option value={4}>Mất mạng/ Mất điện</option>
									<option value={5}>Sắp diễn ra</option>
								</select>
							</div>
						</div>

						<div className={`${classes.rowInfo}`}>
							<div className={classes.colLeft}>
								<p>Nhận xét</p>
							</div>
							<div className={classes.colRight}>
								<input
									type="text"
									name="Rating"
									className={classes.styleInput}
									defaultValue={Remark}
									onChange={handldeChange_getValue}
									placeholder="Nhập nội dung"
								></input>
							</div>
						</div>

						<div className={`${classes.rowInfo}`}>
							<div className={classes.colLeft}>
								<p>Bài tập về nhà</p>
							</div>
							<div className={classes.colRight}>
								<input
									type="text"
									name="Homework"
									className={classes.styleInput}
									defaultValue={HomeWork}
									onChange={handldeChange_getValue}
									placeholder="Nhập nội dung"
								></input>
							</div>
						</div>

						<div className={classes.boxBtn}>
							<Button
								onClick={handleClose}
								className={classes.styleBtn}
								variant="contained"
							>
								Close
							</Button>
							{ClassStatus === 5 && (
								<Button
									className={classes.styleBtn}
									variant="contained"
									color="secondary"
									onClick={updateInfo}
								>
									Save
								</Button>
							)}
						</div>
					</div>
				</Fade>
			</Modal>
		</div>
	);
}
