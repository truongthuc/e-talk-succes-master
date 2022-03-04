export const colors = {
	primary: '#fa005e',
	primaryDarken: '#004bb2',
	primaryLighten: '#3389ff',
	secondary: '#d9ecf2',
	secondaryDarken: '#ab003c',
	secondaryLighten: '#f73378',
	green: '#4caf50',
	greenDarken: '#388e3c',
	grayText: '#b4b4b4',
};

export const appSettings = {
	baseURL: 'https://online.e-talk.vn',
	key: 'VnVOQG0zODlNb25hRGV2',
	colors: {
		second: '#d9ecf2',
		primary: '#fa005e',
	},
	selectStyle: {
		control: (oldStyle, state) => {
			return {
				...oldStyle,
				borderColor:
					state.isFocused || state.isSelected || state.isHovered
						? '#fa005e !important'
						: '#c0ccda',
				outline: 0,
				boxShadow: state.isFocused
					? '0 0 0 0.2rem rgba(250, 0, 94, 0.35)'
					: 'none',
				borderRadius: '3px',
			};
		},
		multiValue: (oldStyle, state) => {
			return {
				...oldStyle,
				backgroundColor: '#d9ecf2',
				color: '#000',
				fontWeight: '500',
				border: '1px solid #d9ecf2',
			};
		},
		multiValueLabel: (oldStyle, state) => {
			return {
				...oldStyle,
				color: '#000',
			};
		},
		option: (oldStyle, state) => {
			return {
				...oldStyle,
				backgroundColor: state.isSelected
					? 'rgba(217, 236, 242, 1)'
					: state.isFocused
					? 'rgba(217, 236, 242, .4)'
					: '#fff',
				color: '#000',
			};
		},
	},
	UID: 1071, //20 teacher || 1071 student
};
