import React from 'react';
import { Modal } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		'& > * + *': {
			marginLeft: theme.spacing(2),
		},
	},
	styleLoading: {
		width: '20px!important',
		height: '20px!important',
		color: 'white!important',
		marginRight: '7px!important',
	},
}));

const ActiveSlotModal = ({
	data,
	handleOpenSlot,
	showModal = false,
	closeModal,
	openModal,
	loadingSlot,
	t,
}) => {
	const { date = '', start = '', end = '' } = data;
	const classes = useStyles();
	return (
		<>
			<Modal
				show={showModal}
				// backdrop="static"   //Prevent close when click overlay
				keyboard={false}
				centered
				onHide={closeModal}
				animation={false}
			>
				<Modal.Header closeButton>
					<Modal.Title>{t('Confirm Active')}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>{t('Do you want to open slot from')}?</p>
					<div className="row">
						<div className="col">
							<p>
								{t('Start')}:{' '}
								<span className="tx-medium" id="js-start-time">
									{start}
								</span>
							</p>
						</div>
						<div className="col">
							<p>
								{t('End')}:{' '}
								<span className="tx-medium" id="js-end-time">
									{end}
								</span>
							</p>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<button
						type="button"
						className="btn btn-light btn-sm"
						onClick={closeModal}
					>
						{t('Close')}
					</button>
					<button
						type="button"
						className="btn btn-primary btn-sm tx-primary"
						style={{ display: 'flex', alignItems: 'center' }}
						onClick={handleOpenSlot}
					>
						{loadingSlot && (
							<CircularProgress className={classes.styleLoading} />
						)}
						{t('Open Slot')}
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ActiveSlotModal;
