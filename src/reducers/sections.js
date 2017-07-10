import { Record } from 'immutable'
import { arrayToMap } from '../utils'
import {
  LOAD_ALL_SECTIONS_BY_ID,
  LOAD_ALL_SECTIONS,
  FILTER_SECTIONS,
  SET_ACTIVE_SECTION,
  CREATE_SECTION,
  UPDATE_SECTION,
  DELETE_SECTION,
  START,
  SUCCESS,
  FAIL
} from '../constants/actionTypes'

import { notification } from 'antd'

notification.config({ duration: 7 })

const SectionModel = Record({
  kod: null,
  nazvanie: null,
  roditel: null,
  tip_resursa: null,
  udalena: null,
})

const initialState = Record({
  entities: arrayToMap('kod', [], SectionModel),
  loading: false,
  activeSectionId: null,
  searchValue: ''
})

function naturalSorter(as, bs){
    let a, b, a1, b1, i= 0, n, L,
        rx=/(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;
    if(as=== bs) return 0;
    a= as.nazvanie.toLowerCase().match(rx);
    b= bs.nazvanie.toLowerCase().match(rx);
    L= a.length;
    while(i<L){
        if(!b[i]) return 1;
        a1= a[i],
            b1= b[i++];
        if(a1!== b1){
            n= a1-b1;
            if(!isNaN(n)) return n;
            return a1>b1? 1:-1;
        }
    }
    return b[i]? -1:0;
}

export default (sections = new initialState(), action) => {
    const { type, payload, response, error } = action

    switch (type) {
      case LOAD_ALL_SECTIONS + START:
        // case LOAD_ALL_SECTIONS_BY_ID + START:
        return sections.set('loading', true)

        case LOAD_ALL_SECTIONS + SUCCESS:
            return sections
                .set('entities', arrayToMap('kod', response, SectionModel).sort(new Intl.NumberFormat(undefined, {numeric: true, sensitivity: 'base'}).compare).sort(naturalSorter))
                .set('loading', false)

      case LOAD_ALL_SECTIONS_BY_ID + SUCCESS:
        return sections
                .set('entities', arrayToMap('kod', response, SectionModel))
                .set('loading', false)


      case CREATE_SECTION + START:
        return sections.set('loading', true)

      case CREATE_SECTION + SUCCESS:
        return sections
                .setIn(['entities', response.kod], new SectionModel(response))
                .set('loading', false)

      case UPDATE_SECTION + START:
        return sections.set('loading', true)

      case UPDATE_SECTION + SUCCESS:
        return sections
          .setIn(['entities', response.kod], new SectionModel(response))
          .set('loading', false)

      case DELETE_SECTION + START:
          return sections.set('loading', true)

      case DELETE_SECTION + SUCCESS:
        return sections
                .deleteIn(['entities', payload.section.kod])
                .set('activeSectionId', null)
                .set('loading', false)

      case FILTER_SECTIONS:
        return sections.set('searchValue', payload.searchValue)

      case SET_ACTIVE_SECTION:
        return sections.set('activeSectionId', payload.id)

      case LOAD_ALL_SECTIONS + FAIL:
      case CREATE_SECTION + FAIL:
      case UPDATE_SECTION + FAIL:
      case DELETE_SECTION + FAIL:
        notification.error({ message: `${error.status}  ${error.statusText}`, description: error.responseText })
        return sections.set('loading', false)

      default:
        return sections
    }
}
