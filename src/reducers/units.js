import { Record } from 'immutable'
import { arrayToMap } from '../utils'
import {
  LOAD_ALL_UNITS,
  CREATE_UNIT,
  UPDATE_UNIT,
  DELETE_UNIT,
  START,
  SUCCESS,
  FAIL
} from '../constants/actionTypes'
import { notification } from 'antd'

notification.config({ duration: 7 })

export const UnitModel = Record({
  kod: null,
  code: null,
  nazvanie: null
})

const initialState = Record({
  entities: arrayToMap('kod', [], UnitModel),
  loading: false
})

export default (units = new initialState(), action) => {
    const { type, payload, response, error } = action

    switch (type) {
      case LOAD_ALL_UNITS + SUCCESS:
        return units.set('entities', arrayToMap('kod', response, UnitModel))
          .set('loading', false)

      case CREATE_UNIT + SUCCESS:
        return units.setIn(['entities', response.kod], new UnitModel(response))
          .set('loading', false)

      case DELETE_UNIT + SUCCESS:
        return units.deleteIn(['entities', payload.kod])
          .set('loading', false)

      case LOAD_ALL_UNITS + FAIL:
      case CREATE_UNIT + FAIL:
      case UPDATE_UNIT + FAIL:
      case DELETE_UNIT + FAIL:
        notification.error({ message: `${error.status}  ${error.statusText}`, description: error.responseText })
        return units.set('loading', false)

      default:
        return units
    }
}
