import * as actionTypes from '../constants/actionTypes'
import { MON_API_HOST } from '../constants/api'

export const loadReportsMonitoring = (type, idPeriod, format, name, description) => ({
    type: actionTypes.LOAD_REPORT_MONITORING,
    payload:{type, idPeriod, name, description} ,
    $api: {
        url: `${MON_API_HOST}resursiperioda/otchet?kod_perioda=${idPeriod}&report_type=${type}&report_format=${format}`,
        xhrFields: {
            responseType : 'blob'
        },
        headers: {
            'Content-Type': 'application/json'
        },
    }
})

export const calculationMethod = () => ({
    type: actionTypes.CALCULATION_METHOD,
    $api: {
        url: MON_API_HOST + 'metodvichisleniy/zapros'
    }
})


export const changeCalculationMethod = (method) => ({
    type: actionTypes.CHANGE_CALCULATION_METHOD,
    $api: {
        url: `${MON_API_HOST}metodvichisleniy/redaktor`,
        type: 'POST',
        data: JSON.stringify(method),
        headers: {
            'Content-Type': 'application/json'
        }
    },
})