import { LOAD_STATUS_RESOURCES } from '../constants/actionTypes'
import { MON_API_HOST } from '../constants/api'

export const loadResourceStatus = () => ({
    type: LOAD_STATUS_RESOURCES,
    $api: {
        url: `${MON_API_HOST}periodstatusi/zapros`
    }
})
