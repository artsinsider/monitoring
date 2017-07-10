import {
  LOAD_ALL_STATES,
  CREATE_STATE,
  UPDATE_STATE,
  DELETE_STATE
} from '../constants/actionTypes'

export function createState(newState) {
  return {
    type: 'CREATE_STATE_SUCCESS',
    payload: { ...newState }
  }
}

export function deleteState(state) {
  return {
    type: 'DELETE_STATE_SUCCESS',
    payload: { ...state }
  }
}
