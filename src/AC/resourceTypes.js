import { LOAD_ALL_RESOURCE_TYPES, LOAD_MEASURE } from '../constants/actionTypes'
import { MON_API_HOST } from '../constants/api'

export const loadAllResourceTypes = () => ({
  type: LOAD_ALL_RESOURCE_TYPES,
  $api: {
    url: `${MON_API_HOST}tipiresursov/zapros`
  }
})

export const loadMeasure = () => ({
    type: LOAD_MEASURE,
    $api: {
        url: `${MON_API_HOST}meri/zapros`
    }
})
