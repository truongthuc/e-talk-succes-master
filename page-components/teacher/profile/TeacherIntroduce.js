import React, { useState, useEffect, useReducer, useRef } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import { useForm } from 'react-hook-form';
import { appSettings } from '~/config';
import { Modal, Button, Tab, Nav } from 'react-bootstrap';
import Select from 'react-select';
import { randomId } from '~/utils';
import { getTeacherIntroduce, updateTeacherIntroduce } from '~/api/teacherAPI';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { i18n, withTranslation } from '~/i18n';
const initialState = {
	isLoading: true,
	showGuideModal: false,
	youtubeUrl: 'https://www.youtube.com/embed/w0Nc-d3gFiU',
	introduce: `While I have no soccer skills, I once played in a fairly competitive adult soccer league with my then-teenage stepson. I was terrible, but I played because he asked me to. (When your kids get older and ask you to do something with them, the first time you say no might be the last time you get asked.) I was trying to match the drollness of my \"Wow\" when my stepson stepped in, half-smile on his lips and full twinkle in his eyes, and rescued me by saying, \"Come on, we need to get ready.\" Was Louis cocky? Certainly, but only on the surface. His $400 cleats, carbon fiber shin guards, and \"I'm the king of the business world\" introduction was an unconscious effort to protect his ego. His introduction said, \"Hey, I might not turn out to be good at soccer, but out there in the real world, where it really matters, I am the Man.\" As we took the field before a game, a guy on the other team strutted over, probably picking me out because I was clearly the oldest player on the field. (There's a delightful sentence to write.`,
};

const reducer = (prevState, { type, payload }) => {
	switch (type) {
		case 'SET_LOADING':
			return { ...prevState, isLoading: payload.value };
			break;
		case 'UPDATE_STATE':
			return { ...prevState, [payload.key]: payload.value };
			break;
		case 'SET_DATA':
			return { ...prevState, ...payload };
			break;
		default:
			return prevState;
			break;
	}
};

function TeacherIntroduce({ props, t }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [submitLoading, setSubmitLoading] = useState(false);

	const setIsLoading = (value) =>
		dispatch({ type: 'SET_LOADING', payload: { value } });
	const updateState = (key, value) =>
		dispatch({ type: 'UPDATE_STATE', payload: { key, value } });
	const setDefaultState = (data) =>
		dispatch({ type: 'SET_DATA', payload: data });

	const showGuide = () => {
		updateState('showGuideModal', true);
	};

	const hideGuide = () => {
		updateState('showGuideModal', false);
	};

	const loadTeacherIntroduce = async () => {
		setIsLoading(true);
		const res = await getTeacherIntroduce();
		res.Code === 1
			? setDefaultState({
					...res.Data,
					introduce: res.Data.Introduce,
					youtubeUrl: res.Data.LinkVideo,
			  })
			: setDefaultState(initialState);
		setIsLoading(false);
	};

	const _handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitLoading(true);
		try {
			const res = await updateTeacherIntroduce({
				Introduce: state.introduce,
				LinkVideo: state.youtubeUrl,
			});
			res.Code === 1 &&
				toast.success('Introduce updated successfully  !!', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
			res.Code !== 1 &&
				toast.error('Update introduce failed !!', {
					position: toast.POSITION.TOP_CENTER,
					autoClose: 2000,
				});
		} catch (err) {
			console.log(
				err?.message ?? 'Call api updateTeacherIntroduce không thành công !!',
			);
		}
		setSubmitLoading(false);
	};

	useEffect(() => {
		loadTeacherIntroduce();
	}, []);

	return (
		<form onSubmit={_handleSubmit}>
			<div className="content-block">
				<div className="mg-b-30">
					<h5 className="">
						<FontAwesomeIcon
							icon="info-circle"
							className="fas fa-info-circle mg-r-5"
						/>
						{t('summary')}
					</h5>
					<p className="tx-gray-500">{t('intro-1')}</p>
					<div className="introduce-content">
						<textarea
							name="introduce"
							className="form-control"
							value={state?.introduce ?? ''}
							rows={7}
							onChange={(e) => updateState('introduce', e.target.value)}
						/>
					</div>
				</div>
				<hr className="mg-b-30 mg-t-0" style={{ borderStyle: 'dashed' }} />
				<div className="mg-b-30">
					<h5 className="">
						<FontAwesomeIcon
							icon={['fab', 'youtube']}
							className="fab fa-youtube mg-r-5"
						/>
						{t('introduce-video')}
					</h5>
					<p className="tx-gray-500">{t('intro-2')} </p>
					<div className="introduce-content">
						<div className="input-group mg-t-15 mg-b-15">
							<div className="input-group-prepend">
								<span className="input-group-text">Youtube embed</span>
							</div>
							<input
								type="text"
								className="form-control"
								placeholder="Youtube embed iframe src..."
								name="youtubeUrl"
								value={state.youtubeUrl}
								onChange={(e) => updateState('youtubeUrl', e.target.value)}
							/>
							<div className="input-group-append">
								<button
									className="input-group-text bg-primary tx-white"
									type="button"
									onClick={showGuide}
								>
									<FontAwesomeIcon
										icon={['far', 'question-circle']}
										className="far fa-question-circle mg-r-5"
									/>{' '}
									How to get iframe url
								</button>
							</div>
						</div>
						<div className="mg-b-30">
							{state?.youtubeUrl && state.youtubeUrl !== '' && (
								<iframe
									width={`100%`}
									height={450}
									src={state.youtubeUrl}
									frameBorder={0}
									allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									title="youtube"
								/>
							)}
						</div>
					</div>
					<Modal show={state.showGuideModal} onHide={hideGuide} size="lg">
						<Modal.Header closeButton>
							<Modal.Title>Các bước lấy embed nhúng của youtube</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<div>
								<div className="mg-b-30">
									<h6 className="sub-title">
										Bước 1: Bấm vào nút chia sẻ bên dưới video
									</h6>
									<img
										src="../assets/img/step-1.png"
										alt=""
										className="img-responsive mg-t-10 wd-100p"
									/>
								</div>
								<div className="mg-b-30">
									<h6 className="sub-title">
										Bước 2: Click vào nút nhúng bên dưới
									</h6>
									<img
										src="../assets/img/step-2.png"
										alt=""
										className="img-responsive mg-t-10 wd-100p"
									/>
								</div>
								<div className="mg-b-30">
									<h6 className="sub-title">
										Bước 3: Copy đường dẫn bên trong thẻ (src=""){' '}
									</h6>
									<img
										src="../assets/img/step-3.png"
										alt=""
										className="img-responsive mg-t-10 wd-100p"
									/>
								</div>
								<div className="mg-b-30">
									<h6 className="sub-title">
										Bước 4: Dán vào khung đường dẫn bên dưới profile{' '}
									</h6>
									<p>
										Nếu xuất hiện khung video bên dưới tức là đường đã được thêm
										chính xác, nếu không hiển thị vui lòng làm lại theo đúng
										trình tự trên.
									</p>
									<img
										src="../assets/img/step-4.png"
										alt=""
										className="img-responsive mg-t-10 wd-100p"
									/>
								</div>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="light" onClick={hideGuide}>
								Close
							</Button>
						</Modal.Footer>
					</Modal>
				</div>
			</div>

			<div className="tx-center mg-t-30">
				<button
					type="submit"
					className="btn btn-primary d-inline-flex align-items-center"
					disabled={submitLoading}
				>
					{submitLoading ? (
						<div className="spinner-border wd-20 ht-20 mg-r-5" role="status">
							<span className="sr-only">Submitting...</span>
						</div>
					) : (
						<>
							<FontAwesomeIcon className="fa fa-save mg-r-5" icon="save" />
						</>
					)}
					<span>{submitLoading ? 'Updating' : 'Save'} introduce</span>
				</button>
			</div>
		</form>
	);
}

// export default TeacherIntroduce;

TeacherIntroduce.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(TeacherIntroduce);
