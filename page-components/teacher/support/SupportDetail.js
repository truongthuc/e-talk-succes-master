import React from 'react';
import { randomId } from '~/utils';
import TeacherSupportModal from './TeacherSupportModal';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { getTicketDetail, cancelTicketSupport } from '~/api/teacherAPI';
import dayjs from 'dayjs';
import { Modal, Button } from 'react-bootstrap';
import TinyEditor, {
	imageUploadHandle,
} from '~/page-components/teacher/support/TinyEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const initialState = {
	author: 'Trương Văn Lam',
	location: 'Vietnam',
	avatar: null,
	title: 'Yêu cầu trả lương trước tết !!',
	content: `<p>Greetings!</p>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </p>
            <p>Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. </p>
            <p>Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem.</p><p><span>Sincerely yours,</span><br /><strong>Mona Media Team</strong></p>`,
	files: [
		{
			id: 1,
			name: 'Image 1',
			url: 'https://drive.google.com/drive/',
		},
		{
			id: 2,
			name: 'Image 2',
			url: 'https://drive.google.com/drive/',
		},
	],
	date: '20/04/2020 10:30AM',
};

const ModalConfirmCancel = ({ show, hideConfirm, _onSubmit }) => {
	return (
		<Modal
			show={show}
			onHide={hideConfirm}
			size="sm"
			dialogClassName="modal-warning"
			centered={true}
		>
			<Modal.Header>
				<h3>Warning !!</h3>
			</Modal.Header>
			<Modal.Body>
				<p>Do you want to cancel this ticket ?</p>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="danger" onClick={_onSubmit}>
					Cancel
				</Button>
				<Button variant="light" onClick={hideConfirm}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

const SupportDetail = ({ onClickBack, detailId, afterCancelSuccess }) => {
	const [state, setState] = React.useState(null);
	const [isLoading, setIsLoading] = React.useState(true);
	const [show, setShow] = React.useState(false);
	const [showEdit, setShowEdit] = React.useState(false);
	const getDetail = async () => {
		setIsLoading(true);
		try {
			const res = await getTicketDetail({ ID: detailId });
			res.Code === 1 && setState(res.Data);
		} catch (err) {
			console.log(
				err?.message ?? 'Call api getTicketDetail không thành công !!',
			);
		}
		setIsLoading(false);
	};

	const showModal = () => setShow(true);
	const hideModal = () => setShow(false);

	const _onClickBack = (e) => {
		e.preventDefault();
		onClickBack();
	};

	const _onClickCancel = (e) => {
		e.preventDefault();
		showModal();
	};

	// const _onClickEdit = (e) => {
	//     e.preventDefault();
	//     //showModal();
	// }

	const cancelTicket = async () => {
		try {
			const res = await cancelTicketSupport({ ID: state.ID });
			res.Code === 1 && toast.success('Ticket was cancelled !!');
			res.Code !== 1 && toast.error('Ticket cancel failed !!');
			afterCancelSuccess(state.ID);
		} catch (error) {
			console.log(error?.message ?? 'Ticket cancel failed');
		}
		hideModal();
	};

	React.useEffect(() => {
		getDetail();
		$('.btn-icon').tooltip();
	}, [detailId]);
	return (
		<>
			<div className="">
				<div
					className="d-flex align-items-center justify-content-between mg-b-30"
					style={{ marginLeft: '-10px', marginRight: '-10px' }}
				>
					<button
						type="button"
						className="btn btn-sm btn-light mg-x-10"
						onClick={_onClickBack}
					>
						<FontAwesomeIcon
							icon="arrow-left"
							className="fas fa-arrow-left mg-r-5"
						/>{' '}
						Back
					</button>
				</div>

				<div className="mg-b-30 bd-b pd-b-10 d-flex align-items-center justify-content-between">
					<h5 className="mg-b-0">
						{isLoading ? (
							<Skeleton width={200} height={25} />
						) : (
							state?.SupportTitle ?? ''
						)}
					</h5>
				</div>

				<div className="content-answer">
					<div className="d-flex justify-content-between">
						<div className="d-flex align-items-center">
							<span className="avatar avatar-md">
								{isLoading ? (
									<Skeleton circle={true} width={48} height={48} />
								) : (
									<img
										src={
											state?.TeacherIMG ?? '../assets/img/default-avatar.png'
										}
										className="rounded-circle"
										onError={(e) => {
											e.target.onerror = null;
											e.target.src = '../assets/img/default-avatar.png';
										}}
									/>
								)}
							</span>
							<div className="mg-l-10">
								<h6 className="tx-semibold mg-b-0">
									{isLoading ? (
										<Skeleton width={100} height={25} />
									) : (
										state?.TeacherName ?? ''
									)}
								</h6>
								<span className="tx-gray-300">
									{isLoading ? (
										<Skeleton width={100} height={25} />
									) : (
										dayjs(state?.CreatedDate).format('DD/MM/YYYY HH:mm') ?? ''
									)}
								</span>
							</div>
						</div>
						<div className="action d-flex align-items-center">
							{/* <button 
                            data-toggle="tooltip" data-placement="top" title="Edit ticket"
                            type="button" className="btn btn-icon btn-warning mg-r-10 btn-sm wd-35" onClick={_onClickEdit}><i className="fas fa-pen" ></i></button> */}
							{!!state && !!state.Status && state.Status !== 4 && (
								<button
									data-toggle="tooltip"
									data-placement="top"
									title="Cancel ticket"
									type="button"
									className="btn btn-icon btn-danger btn-sm wd-35"
									onClick={_onClickCancel}
								>
									<FontAwesomeIcon icon="times" className="fas fa-times" />
								</button>
							)}
						</div>
					</div>
					{isLoading ? (
						<div className="pd-y-30">
							<Skeleton count={5} />
						</div>
					) : (
						<div
							className="pd-y-30"
							// dangerouslySetInnerHTML={{
							// 	__html:
							// 		tinymce.html.Entities.decode(state?.SupportContent) ?? '',
							// }}
						></div>
					)}
				</div>
				{!!state &&
					!!state.AdminReplyContent &&
					state.AdminReplyContent !== '' && (
						<>
							<hr
								className="mg-b-30 mg-t-0"
								style={{ borderStyle: 'dashed' }}
							/>

							<div className="content-answer">
								<div className="d-flex align-items-center">
									<span className="avatar avatar-md">
										{isLoading ? (
											<Skeleton circle={true} width={48} height={48} />
										) : (
											<img
												src={'../assets/img/default-avatar.png'}
												className="rounded-circle"
											/>
										)}
									</span>
									<div className="mg-l-10">
										<h6 className="tx-semibold mg-b-0">
											{state?.AdminReplyName ?? ''}
										</h6>
										<span className="tx-gray-300">
											{isLoading ? (
												<Skeleton width={100} height={25} />
											) : (
												dayjs(state?.AdminReplyDate).format(
													'DD/MM/YYYY HH:mm',
												) ?? ''
											)}
										</span>
									</div>
								</div>
								{isLoading ? (
									<div className="pd-y-30">
										<Skeleton count={5} />
									</div>
								) : (
									<div
										className="pd-y-30"
										dangerouslySetInnerHTML={{
											__html: tinymce.html.Entities.decode(
												state?.AdminReplyContent ?? '',
											),
										}}
									></div>
								)}
							</div>
						</>
					)}
			</div>
			<ModalConfirmCancel
				show={show}
				hideConfirm={hideModal}
				_onSubmit={cancelTicket}
			/>
		</>
	);
};

export default SupportDetail;
