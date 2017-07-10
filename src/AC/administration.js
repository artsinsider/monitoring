import * as actionTypes from '../constants/actionTypes'
import { MON_API_HOST } from '../constants/api'

export const loadExtremeValues = () => ({
    type: actionTypes.LOAD_EXTREME_VALUE,
    $api: {
        url: `${MON_API_HOST}koridorizmeneniy/zapros`
    }
})

export const updateExtremeValues = extremeValues =>({
        type: actionTypes.UPDATE_EXTREME_VALUE,
        $api: {
            url: `${MON_API_HOST}koridorizmeneniy/redaktor`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            data: JSON.stringify(extremeValues)
        }
    })