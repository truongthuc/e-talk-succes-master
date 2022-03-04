import React, {
	useState,
	useEffect,
	useReducer,
	useRef,
	useContext,
} from 'react';
import { UploadFilePost } from '~/api/optionAPI';
import { i18n, withTranslation } from '~/i18n';

const ProfileAvatar = React.forwardRef((props, ref) => {
	const [isLoading, setIsLoading] = useState(false);
	// const [myAvatar, setAvatar] = useState();

	const inputFileRef = useRef(true);
	const handleUploadImage = async () => {
		setIsLoading(true);
		try {
			const input = inputFileRef.current;
			if (input.files && input.files[0]) {
				const res = await UploadFilePost(input.files);
				if (!!res && res?.rs) {
					props.updateAvatar('avatar', res?.g ?? '');
				}
			}
		} catch (error) {
			console.log(error?.message ?? 'Lỗi gọi api');
		}
		setIsLoading(false);
	};
	const checkValidURL = () => {
		const urltmp = props?.getValues('avatar');
		if (!!urltmp) {
			return urltmp.toString().trim().replace(/\//g, '').length > 0;
		} else {
			return false;
		}
	};
	return (
		<>
			<div
				className={`teacher-avatar ${
					isLoading ? 'loading-style' : ''
				} mg-x-auto`}
			>
				<div className="lds-ellipsis">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
				<div className="upload-container wd-100 ht-100">
					<label className="upload-avatar">
						<input
							ref={inputFileRef}
							type="file"
							accept="image/*"
							className="upload-box hidden d-none upload-file"
							onChange={handleUploadImage}
						/>
						<img
							src={
								checkValidURL()
									? props?.getValues('avatar')
									: '/static/assets/img/default-avatar.png'
							}
							alt="avatar"
							className="image-holder  object-fit"
						/>
					</label>
				</div>
			</div>
		</>
	);
});

ProfileAvatar.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(ProfileAvatar);
