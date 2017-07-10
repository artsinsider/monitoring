import {START, SUCCESS, FAIL} from '../constants/actionTypes'
import {isEmpty}              from 'ramda'
import * as AC                from  '../constants/actionTypes'
import {unUser}               from '../../src/components/Users/fakeUser'
const initialState ={
    userData: null,
    disables: false,
    users: unUser
}

function conversionUsers(state) {
    const { users } = state
    const foundUserSuccesAuth = users.filter( user => user.imya_polzovatelya == localStorage.getItem('login'))[0]
    const token =  localStorage.getItem('token')
    const tokens = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzb21vdiIsImlzcyI6InJ1LnVyc2lwIiwiaWF0IjoxNDk1NDU4MDEyLCJleHAiOjE0OTU0NjcwMTJ9.OdY4QWW6dpsRaFB1Bwz50-8JRuBMx_aVpFONEi0QsAWn6Yo2C5lIFF1TiMZgksF1u5VRHIGWjibKwIcLwd30JQ"
     const tokenToRefresh = location.hostname == 'localhost' ? tokens : localStorage.getItem('tokenToRefresh')
    const foundRoleUser = users.filter( user => user.telefon == 1 )
    return ({ ...state, userData: foundUserSuccesAuth, users: foundRoleUser,  dataAuthorization:{ token: token, tokenToRefresh: tokenToRefresh}})
}

function setCountByUser(state) { debugger;
    const {users, count, userId} = state
    users.forEach( user => user.kod == userId ? user.count = count : user )
    return ({ ...state, users: users, userId: '' })
}

export default (user = initialState, action) => {
    const { type, payload, response, error } = action

    switch (type) {
        case  AC.LOAD_NEW_USER + START:
        case  AC.REFRESH_TOKEN + START:
        case  AC.GET_COUNT_RESOURCES_USER + START:
            return {...user}

        case AC.LOAD_NEW_USER + SUCCESS:
            return conversionUsers({...user, users: response})

        case AC.ADD_SECTION:
            return ({...user, idSection: payload, disables: !isEmpty(payload)})

        case AC.GET_COUNT_RESOURCES_USER + SUCCESS:
            return setCountByUser({...user, count: response, userId: payload })

        case AC.REFRESH_TOKEN + SUCCESS:
            return ({...user, refreshTokenUser: response, payloadL: payload})

        case AC.LOAD_NEW_USER + FAIL:
            return ({...user, error: error.responseJSON})

        case AC.REFRESH_TOKEN + FAIL:
        case AC.GET_COUNT_RESOURCES_USER + FAIL:
            return ({...user})

        default:
            return user
    }
}
