import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const ActiveSlotModal = ({
	data,
	handleOpenSlot,
	showModal = false,
	closeModal,
	openModal,
	modalData,
}) => {
	const { start = '', end = '', dataPopup = null } = modalData;

	const [onSending, sOnSending] = React.useState(false);
	const [infoSubmit, setInfoSubmit] = useState({});
	const [select, setSelect] = useState();

	console.log('Data trong modal: ', modalData);

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

	console.log('ON Sending: ', onSending);

	useEffect(() => {
		onSending && handleOpenSlot(infoSubmit);
	}, [onSending]);

	useEffect(() => {
		setInfoSubmit({
			program: '',
			packageID: dataPopup?.Package.PackageID,
			courseID: dataPopup?.ListCourse[0].CourseID,
			start: start,
			end: end,
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
				<Modal.Header closeButton>
					<Modal.Title>Confirm active</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className={`row ${classes.rowInfo}`}>
						<div className="col">
							<p>Program:</p>
						</div>
						<div className="col">
							<input
								type="text"
								className={classes.styleInput}
								onChange={handldeChange_getValue}
								placeholder="Nhập nội dung"
							></input>
						</div>
					</div>
					<div className={`row ${classes.rowInfo}`}>
						<div className="col">
							<p>Time</p>
						</div>
						<div className="col">
							<p>
								<span className="tx-medium" id="js-start-time">
									{timeStart} - {timeEnd}
								</span>
							</p>
						</div>
					</div>
					<div className={`row ${classes.rowInfo}`}>
						<div className="col">
							<p>Date</p>
						</div>
						<div className="col">
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
								<div className="col">
									<p>Package</p>
								</div>
								<div className="col">
									<select className={classes.styleSelect}>
										<option value={dataPopup?.Package.PackageID}>
											{dataPopup?.Package.PackageName}
										</option>
									</select>
								</div>
							</div>
							<div className={`row ${classes.rowInfo}`}>
								<div className="col">
									<p>Course</p>
								</div>
								<div className="col">
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
						</>
					)}
				</Modal.Body>
				<Modal.Footer>
					<button
						type="button"
						disabled={onSending}
						className="btn btn-light btn-sm"
						onClick={closeModal}
					>
						Close
					</button>
					<button
						type="button"
						disabled={onSending}
						className="btn btn-primary btn-sm tx-primary"
						onClick={() => sOnSending(true)}
					>
						{onSending ? (
							<span>
								<i class="fas fa-spinner fa-spin"></i> Open slot
							</span>
						) : (
							<span>Open slot</span>
						)}
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ActiveSlotModal;
