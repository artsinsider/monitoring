import * as AC from '../constants/actionTypes'
import * as RAC from '../constants/resourcesActionType'
import {MON_API_HOST, ORG_API_HOST} from '../constants/api'

export const loadPeriods = () => {
    return (dispatch, getState) => {
        dispatch({
            type: AC.LOAD_PERIODS,
            $api: `${MON_API_HOST}periodi/zapros`,
            onSuccess: () => {
                dispatch({
                    type: AC.LOAD_TIPRESURSOV,
                    $api: `${MON_API_HOST}tipiresursov/zapros`,
                    onSuccess: () => {
                        dispatch({
                            type: AC.LOAD_ALL_ORGANIZATION,
                            $api: `${ORG_API_HOST}organizacii/zapros`,
                            onSuccess: () => {
                                dispatch({
                                    type: AC.LOAD_ALL_PERIOD_RESOURCES,
                                    $api: `${MON_API_HOST}resursiperioda/zapros?period=${getState().periods.periodSelected.kod}`,
                                    data: getState().user.users,
                                    onSuccess: () => {
                                        dispatch({
                                            type: RAC.OPEN_VIEW_RESOURCES,
                                            payload: getState().periodResources.viewResourcesData,
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}

/** Получение ресурсов по указанной организации (отрабатывает при переходе из справочника организаций)*/
export const loadPeriodsForOrganization = () => {
    return (dispatch, getState) => {
        dispatch({
            type: AC.LOAD_PERIODS,
            $api: `${MON_API_HOST}periodi/zapros`,
            onSuccess: () => {
                dispatch({
                    type: AC.LOAD_TIPRESURSOV,
                    $api: `${MON_API_HOST}tipiresursov/zapros`,
                    onSuccess: () => {
                        dispatch({
                            type: AC.LOAD_ALL_ORGANIZATION,
                            $api: `${ORG_API_HOST}organizacii/zapros`,
                            onSuccess: () => {
                                dispatch({
                                    type: AC.LOAD_ALL_PERIOD_RESOURCES,
                                    $api: `${MON_API_HOST}resursiperioda/zapros?period=${getState().periods.periodSelected.kod}&organizaciya=${localStorage.getItem('ogrId')}`,
                                    onSuccess: () => {
                                        dispatch({
                                            type: RAC.OPEN_VIEW_RESOURCES,
                                            payload: getState().periodResources.viewResourcesData
                                        })
                                        localStorage.removeItem('ogrId')
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}

export const loadPeriodsFullUser = () => {
    return (dispatch, getState) => {
        dispatch({
            type: AC.LOAD_PERIODS,
            $api: `${MON_API_HOST}periodi/zapros`,
            onSuccess: () => {
                dispatch({
                    type: AC.LOAD_TIPRESURSOV,
                    $api: `${MON_API_HOST}tipiresursov/zapros`,
                    onSuccess: () => {
                        dispatch({
                            type: AC.LOAD_ALL_ORGANIZATION,
                            $api: `${ORG_API_HOST}organizacii/zapros`,
                            onSuccess: () => {
                                dispatch({
                                    type: AC.LOAD_ALL_PERIOD_RESOURCES_FIRST,
                                    $api: `${MON_API_HOST}resursiperioda/zapros?period=${getState().periods.periodSelected.kod}&sotrudnik=${getState().user.userData.kod}`,
                                    onSuccess: () => {
                                        dispatch({
                                            type: AC.LOAD_ALL_PERIOD_RESOURCES_SECOND,
                                            $api: `${MON_API_HOST}resursiperioda/zapros?period=${getState().periods.periodSelected.kod}&sotrudnik=${getState().user.userData.kod}`,
                                            onSuccess: () => {
                                                dispatch({
                                                    type: RAC.OPEN_VIEW_RESOURCES,
                                                    payload: getState().periodResources.viewResourcesData
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}

export const changeCurrentPeriod = period => ({
    type: AC.CHANGE_CURRENT_PERIOD,
    payload: period
})

export const addNewPeriod = period => ({
    type: AC.ADD_NEW_PERIOD,
    $api: {
        url: `${MON_API_HOST}periodi/novoe`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: JSON.stringify(period)
    }
})

export function changePeriod(period) {
    return {
        type: AC.CHANGE_PERIOD,
        $api: {
            url: `${MON_API_HOST}periodi/redaktor`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            data: JSON.stringify(period)
        },
        payload: period
    }
}
