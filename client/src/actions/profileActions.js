import axios from 'axios';
import { GET_PROFILE,PROFILE_LOADING,GET_ERRORS, CLEAR_CURRENT_PROFILE } from './types';

//Get current profile
export const getCurrentProfile=()=>dispatch=>{
    dispatch(setProfileLoading());
    axios.get('/api/profile')
    .then(res=>{
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        })
    })
    .catch(err=>dispatch({
        type:GET_PROFILE,
        payload:{}
    }))
}

export const setProfileLoading=()=>dispatch=>{
    dispatch({
        type:CLEAR_CURRENT_PROFILE
    })
}

export const clearCurrentProfile=()=>dispatch=>{
    dispatch({
        type:CLEAR_CURRENT_PROFILE
    });
}