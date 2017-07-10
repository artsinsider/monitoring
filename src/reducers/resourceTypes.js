import { Record } from 'immutable'
import { arrayToMap } from '../utils'
import {
  LOAD_MEASURE,
  LOAD_ALL_RESOURCE_TYPES,
  START,
  SUCCESS,
  FAIL
} from '../constants/actionTypes'

const resourceTypeModel = Record({
  kod: null,
  nazvanie: null
})

const initialState = Record({
  entities: arrayToMap('kod', [], resourceTypeModel),
  loading: false
})

export default (resourceTypes = new initialState(), action) => {
    const { type, payload, response, error } = action

    switch (type) {
        case LOAD_ALL_RESOURCE_TYPES + START:
        case LOAD_MEASURE + START:
            return ({...resourceTypes, loading: true})

        case LOAD_ALL_RESOURCE_TYPES + SUCCESS:
            return ({...resourceTypes, resourceTypes: response})

        case LOAD_MEASURE + SUCCESS:
            return ({...resourceTypes, measure: response})

      case LOAD_ALL_RESOURCE_TYPES + FAIL:
      case LOAD_MEASURE + FAIL:
            return ({...resourceTypes, loading: false})

      default:
        return resourceTypes
    }
}


