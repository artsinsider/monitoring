import {
  LOAD_ALL_UNITS,
  CREATE_UNIT,
  UPDATE_UNIT,
  DELETE_UNIT
} from '../constants/actionTypes'
import { MON_API_HOST } from '../constants/api'

export const loadAllUnits = () => ({
  type: LOAD_ALL_UNITS,
  $api: {
    url: MON_API_HOST + '/meri/zapros'
  }
})

export const createUnit = unit => ({
  type: CREATE_UNIT,
  payload: { ...unit },
  $api: {
    url: MON_API_HOST + '/meri/novoe',
    type: 'POST',
    data: JSON.stringify(unit),
    headers: {
      'Content-Type': 'application/json'
    }
  }
})

export const deleteUnit = unit => ({
  type: DELETE_UNIT,
  payload: { ...unit },
  $api: {
    url: MON_API_HOST + '/meri/udalenie',
    type: 'POST',
    data: JSON.stringify(unit),
    headers: {
      'Content-Type': 'application/json'
    }
  }
})
