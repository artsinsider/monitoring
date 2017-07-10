import {
    LOAD_ALL_PERIOD_STATUSES
} from '../constants/actionTypes'
import { MON_API_HOST } from '../constants/api'

export function loadAllperiodStatuses() {
    return {
        type: LOAD_ALL_PERIOD_STATUSES,
        $api: {
            url: `${MON_API_HOST}periodstatusi/zapros`
        }
    }
}