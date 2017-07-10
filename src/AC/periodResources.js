import * as actionTypes from '../constants/actionTypes'
import * as RAC from '../constants/resourcesActionType'
import {MON_API_HOST, ADMIN_API_HOST, ORG_API_HOST} from '../constants/api'

// export const loadPeriodResourcesByResourcesType = (id) => ({
//         type: actionTypes.LOAD_PERIOD_RESOURCES_BY_RESOURCES_TYPE,
//             $api:
//         {
//             url: `${MON_API_HOST}resursiperioda/zapros?period=${id.periodSelected}&razdel=${id.selectedType}`
//         }
// })

export const loadSectionsResources = (id) => {
    return (dispatch, getState) => {
        dispatch({
        type: actionTypes.LOAD_SECTIONS_RESOURCES,
            $api: {
            url: `${MON_API_HOST}resursiperioda/zapros?period=${id.periodActive}&razdel=${id.sectionId}`
            },
            onSuccess: () => {
                dispatch({
                    type: RAC.OPEN_VIEW_RESOURCES,
                    payload: getState().periodResources.viewResourcesData
                })
            }
        })
    }
}

export const loadAllPeriodResourcesById = (idPeriod, userId) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.LOAD_PERIOD_RESOURCES_BY_ID,
            $api: {
                url: `${MON_API_HOST}resursiperioda/zapros?period=${idPeriod}&sotrudnik=${userId}`,
            },
            onSuccess: () => {
                dispatch({
                    type: RAC.OPEN_VIEW_RESOURCES,
                    payload: getState().periodResources.viewResourcesData
                })
            }
        })
    }
}

export const searchWholeTable = (value) => ({
    type: actionTypes.SEARCH_WHOLE_TABLE,
    payload: value
})

export const resetSearch = () => ({
    type: actionTypes.RESET_SEARCH
})

export const loadAllUsers = () => ({
    type: actionTypes.LOAD_ALL_USERS,
    $api: {
        url: `${ADMIN_API_HOST}polzovatel/zapros`
    }
})

export const resourcesUpdate = (kod, flag, props) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.GET_RESOURCES_UPDATE,
            $api: `${MON_API_HOST}resursiperioda/zapros?kod=${kod}`,
            flag,
            props,
            onSuccess: () => {
                console.log('getState', getState().periodResources.getResourcesUpdated)
                dispatch({
                    type: actionTypes.SEND_RESOURCES,
                    $api: {
                        url: `${MON_API_HOST}resursiperioda/redaktor`,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        },
                        data: JSON.stringify(getState().periodResources.getResourcesUpdated)
                    },
                    props
                })
            }
        })
    }
}

export const dataUpdateResources = (kod, flag, props) => {
    return (dispatch) => {
        fetch(`${MON_API_HOST}resursiperioda/zapros?kod=${kod}`)
            .then(response => response.json())
            .then(response => {
                dispatch({
                    type: actionTypes.GET_RESOURCES_UPDATE_SUCCESS,
                    payload: response,
                    flag: flag,
                    props: props
                })

                fetch(`${MON_API_HOST}resursiperioda/redaktor`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify(response[0])
                })
                    .then(response => response.json())
                    .then(response => {
                    })
                    .catch(error => console.error(error))
            })
            .catch(error => dispatch({
                type: actionTypes.UPLOAD_RESOURCES_FAIL,
                error,
            }))
    }
}

export const transportationCostsUpdate = (kod, flag, props) => {
    return (dispatch) => {
        fetch(`${MON_API_HOST}resursiperioda/zapros?kod=${kod}`)
            .then(response => response.json())
            .then(response => {
                dispatch({
                    type: actionTypes.GET_RESOURCES_UPDATE_SUCCESS,
                    payload: response,
                    flag: flag,
                    props: props
                })

                fetch(`${MON_API_HOST}resursiperioda/redaktor`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify(response[0])
                })
                    .then(response => response.json())
                    .then(response => {
                    })
                    .catch(error => console.error(error))
            })
            .catch(error => dispatch({
                type: actionTypes.UPLOAD_RESOURCES_FAIL,
                error,
            }))
    }
}

export const dataResourcesUpdate = (data) => ({
    type: actionTypes.DATA_RESOURCES_UPDATE,
    payload: data
})

export function getResourcesUpdate(data) {
    return (dispatch, getState) => {
        resourcesUpdate(data)
    }
}

// export const loadSectionsResourcesForUser = (data) => ({
//     type: actionTypes.LOAD_SECTIONS_RESOURCES_FOR_USER_FIRST,
//     $api: {
//         url: `${MON_API_HOST}resursiperioda/zapros?period=${data.periodSelected.kod}&status_deistviya=5&status=1&sotrudnik=${data.userData.kod}`
//     }
// })
//
// export const loadSectionsResourcesForUserSecond = (data) => ({
//     type: actionTypes.LOAD_SECTIONS_RESOURCES_FOR_USER_SECOND,
//     $api: {
//         url: `${MON_API_HOST}resursiperioda/zapros?period=${data.periodSelected.kod}&status_deistviya=3&status=1&sotrudnik=${data.userData.kod}`
//     }
// })

export const loadSectionsResourcesForUser = (sectionId) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.LOAD_SECTIONS_RESOURCES_FOR_USER_START
        })
        fetch(`${MON_API_HOST}resursiperioda/zapros?period=${getState().periods.periodSelected.kod}&sotrudnik=${getState().user.userData.kod}&razdel=${sectionId}`)
            .then(response => response.json())
            .then(response => {
                dispatch({
                    type: actionTypes.LOAD_SECTIONS_RESOURCES_FOR_USER_FIRST,
                    payload: response
                });
                fetch(`${MON_API_HOST}resursiperioda/zapros?period=${getState().periods.periodSelected.kod}&sotrudnik=${getState().user.userData.kod}&razdel=${sectionId}`)
                    .then(response => response.json())
                    .then(response => {
                        dispatch({
                            type: actionTypes.LOAD_SECTIONS_RESOURCES_FOR_USER_SECOND,
                            payload: response
                        })
                    })
                    .catch(error => dispatch({
                        type: actionTypes.LOAD_SECTIONS_RESOURCES_FOR_USER_FAIL,
                        error,
                    }))
            })
    }
}

/**  Создание цены на поставщика*/
export const createVendorPrice = resources => ({
    type: actionTypes.CREATE_VENDOR_PRICE,
    $api: {
        url: MON_API_HOST + 'resursiperioda/novoe',
        type: 'POST',
        data: JSON.stringify(resources),
        headers: { 'Content-Type': 'application/json'  }
    }
})
//&status_deistviya=5&status=1
//&status_deistviya=3&status=1