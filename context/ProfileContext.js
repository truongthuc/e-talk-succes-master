import CreateDataContext from './CreateDataContext';

const ProfileReducer = (state, action) => {
    switch (action.type) {
    case 'UPDATE_INFO':
        return {
            ...state,
            ...action.payload,
            isLoading:false,
        };

    default:
        return state;
    }
};



const updateUserInfo = (dispatch) => async (data) => {
    dispatch({ type: 'UPDATE_INFO', payload: data });
};


export const { Context, Provider } = CreateDataContext(
    ProfileReducer,
    {
        updateUserInfo
    },
    {
        FullName:'',
        Phone:'',
        Email:'',
        isLoading:true,
        Avatar:'',
    },
);
