import { Record } from 'immutable'
import { arrayToOrderedMap } from '../utils'
import { START, SUCCESS,  FAIL } from '../constants/actionTypes'
import * as AC from '../constants/actionTypes'

import { notification } from 'antd'

notification.config({ duration: 7 })

const SectionModel = Record({
  kod: null,
  nazvanie: null,
  roditel: null,
  isLeaf: false,
  tip_resursa: null,
  udalena: null,
  sotrudnik: null,
  count_resources: null
})

const initialState = Record({
  entities: arrayToOrderedMap('kod', [], SectionModel),
  entitiesUser: arrayToOrderedMap('kod', [], SectionModel),
  loading: false,
  loadingUserCard: false,
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
        case AC.LOAD_ALL_SECTIONS + START:
        // case LOAD_ALL_SECTIONS_BY_ID + START:

            return sections.set('loading', true)

        case AC.LOAD_SECTIONS_BY_USER_ID + START:
            return sections.set('loadingUserCard', true)

        case AC.LOAD_ALL_SECTIONS + SUCCESS:
            return sections.withMutations(sections => {
                sections.set('entities', arrayToOrderedMap('kod', response, SectionModel).sort(new Intl.NumberFormat(undefined, {numeric: true, sensitivity: 'base'}).compare).sort(naturalSorter))
                sections.set('loading', false)
            })

        case AC.LOAD_ALL_SECTIONS_BY_ID + SUCCESS:
            return sections.withMutations(sections => {
                sections.set('entities', arrayToOrderedMap('kod', response, SectionModel))
                sections.set('loading', false)
            })

        case AC.LOAD_SECTIONS_BY_USER_ID + SUCCESS:
            return sections.withMutations(sections => {
                sections.set('entitiesUser', arrayToOrderedMap('kod', response, SectionModel))
                sections.set('loadingUserCard', false)
            })

        case AC.EMPLOYEE_ADD_SECTIOONS+ SUCCESS:
            return sections.withMutations(sections => {
                sections.updateIn(['entities', +payload.idSection], item => item.set('sotrudnik', payload.id))
            })
            
        case AC.LOAD_SECTIONS_BY_PARENTID + START:
            return sections.set('loading', true)
      
        case AC.LOAD_SECTIONS_BY_PARENTID + SUCCESS:
        //Поставить флаг isLeaf если ответ - пустой массив => нет смысла дальше ломиться.
            if (!!response.length) {
                return sections.withMutations(sections => {
                    sections.mergeIn(['entities'], arrayToOrderedMap('kod', response, SectionModel)
                        .sort(new Intl.NumberFormat(undefined, {numeric: true, sensitivity: 'base'}).compare).sort(naturalSorter))
                    sections.set('loading', false)
                })
            } else {
                return sections.withMutations(sections => {
                    sections.updateIn(['entities', +payload], item => item.set('isLeaf', true))
                    sections.set('loading', false)
                })
            }
            
        case AC.CREATE_SECTION + START:
            return sections.set('loading', true)

        case AC.CREATE_SECTION + SUCCESS:
            return sections.withMutations(sections => {
                sections.setIn(['entities', response.kod], new SectionModel(response))
                sections.set('loading', false)
            })

        case AC.UPDATE_SECTION + START:
            return sections.set('loading', true)

        case AC.UPDATE_SECTION + SUCCESS:
            return sections.withMutations(sections => {
                sections.setIn(['entities', response.kod], new SectionModel(response))
                sections.set('loading', false)
            })

        case AC.DELETE_SECTION + START:
            return sections.set('loading', true)

        case AC.DELETE_SECTION + SUCCESS:
            return sections.withMutations(sections => {
                sections.deleteIn(['entities', payload.section.kod])
                sections.set('activeSectionId', null)
                sections.set('loading', false)
            })


      case AC.FILTER_SECTIONS:
        return sections.set('searchValue', payload.searchValue)

      case AC.SET_ACTIVE_SECTION:
        return sections.set('activeSectionId', payload.id)

      case AC.LOAD_ALL_SECTIONS + FAIL:
      case AC.CREATE_SECTION + FAIL:
      case AC.UPDATE_SECTION + FAIL:
      case AC.DELETE_SECTION + FAIL:
      case AC.LOAD_SECTIONS_BY_USER_ID + FAIL:
        notification.error({ message: `${error.status}  ${error.statusText}`, description: error.responseText })
        return sections.set('loading', false)

      default:
        return sections
    }
}
