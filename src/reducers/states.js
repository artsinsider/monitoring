import { Record } from 'immutable'
import { arrayToMap } from '../utils'
import {
  CREATE_STATE,
  DELETE_STATE,
  START,
  SUCCESS,
  FAIL
} from '../constants/actionTypes'

export const StateModel = Record({
  kod: null,
  name: null
})

const initialState = Record({
  entities: arrayToMap('kod', [], StateModel),
  loading: false
})

export default (states = new initialState(), action) => {
    const { type, payload, response, error } = action

    switch (type) {
      case CREATE_STATE + SUCCESS:
        return states.setIn(['entities', payload.kod], new StateModel(payload))
        .set('loading', false)

      case DELETE_STATE + SUCCESS:
        return states.deleteIn(['entities', payload.kod])
          .set('loading', false)

      default:
        return states
    }
}
