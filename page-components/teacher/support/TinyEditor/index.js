// Import React dependencies.
import React, { useState, useCallback, memo } from 'react';
import { Editor } from '@tinymce/tinymce-react';
// import { uploadImageToServer } from '~/api/optionAPI';
const TinyEditor = ({ options, onChangeEvent }) => {
	const [state, setState] = useState('');
	const _handleChange = (content, editor) => {
		setState(content);
		onChangeEvent(content, editor);
	};

	return (
		<Editor
			init={options}
			onEditorChange={_handleChange}
			value={state}
			apiKey="e1mtlim1uia64sz4l2u880y2zrqjmk0lyk8h3f2wso0e4yi2"
		/>
	);
};

export const imageUploadHandle = async (
	blobInfo,
	success,
	failure,
	progress,
) => {
	const blob = await blobInfo.blob();
	try {
		const res = await uploadImageToServer([blob]);
		res.Code === 1 && res.Data.length > 0 && success(`${res.Data[0].UrlIMG}`);
		//success('https://vcdn-ngoisao.vnecdn.net/2020/07/08/MRAT6138-JPG-2263-1594179677_r_460x0.jpg');
	} catch (error) {
		console.log(error?.message ?? error);
	}
};

export default memo(TinyEditor);
