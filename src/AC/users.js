import * as actionTypes from '../constants/actionTypes'
import { MON_API_HOST, ADMIN_API_HOST, AUTHORIZATION_API_URL } from '../constants/api'
import {extiModule}  from './../config/redirect'


export const addUserToResource = (user) => ({
        type: actionTypes.ADD_USER_TO_RESOURCE,
        payload: user
    }
)

export const getCountForUser = (id) => ({
    type: actionTypes.GET_COUNT_RESOURCES_USER,
    $api: {
        url: `${MON_API_HOST}resursi/count_by?sotrudnik=${id}`,
    },
    payload: id
})



export const employeeAddSections = (idSection, id) =>
    ({
        type: actionTypes.EMPLOYEE_ADD_SECTIOONS,
        $api: {
            url: `${MON_API_HOST}razdeli/set_employee?sotrudnik=${id}&razdel=${idSection}`,
            type: 'POST',
        },
        payload: {idSection, id}
    })

const refreshToken = tokenToRefresh => (console.log('tokenToRefresh',tokenToRefresh),{
    type: actionTypes.REFRESH_TOKEN,
    async: true,
    api: {
        url: `${AUTHORIZATION_API_URL}token/refresh`,
        headers: {
            'X-Authorization': `Bearer ${tokenToRefresh}`
        },
    }
})

export const loadNewUsers = (token) => {
    return (dispatch, getState) => {
        dispatch({
        type: actionTypes.LOAD_NEW_USER,
        async: true,
        $api: {
            url: `${AUTHORIZATION_API_URL}polzovatel/zapros`,
            headers: {
                'X-Authorization': `Bearer ${token}`
            }
        },
        payload: token,
        onError: (error) => {
            if (error.responseJSON.errorCode == 11){
                extiModule()
            }
            if (error.responseJSON.errorCode == 10){
                refreshToken(getState().user.dataAuthorization.tokenToRefresh)
            }
            return null
        }})
    }
}

export const addSection = (idSection) => ({
    type: actionTypes.ADD_SECTION,
    payload: idSection
})

