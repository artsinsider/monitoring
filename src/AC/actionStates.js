import {
  LOAD_ALL_ACTION_STATES,
  CREATE_ACTION_STATE,
  UPDATE_ACTION_STATE,
  DELETE_ACTION_STATE,
} from '../constants/actionTypes'

export function createActionState(newState) {
  return {
    type: 'CREATE_ACTION_STATE_SUCCESS',
    payload: { ...newState }
  }
}

export function deleteActionState(state) {
  return {
    type: 'DELETE_STATE_SUCCESS',
    payload: { ...state }
  }
}
