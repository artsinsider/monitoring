import {
  LOAD_ALL_SECTIONS,
  FILTER_SECTIONS,
  CREATE_SECTION,
  UPDATE_SECTION,
  DELETE_SECTION,
  SET_ACTIVE_SECTION,
  LOAD_ALL_SECTIONS_BY_ID,
  LOAD_SECTIONS_BY_PARENTID,
    LOAD_SECTIONS_BY_USER_ID
} from '../constants/actionTypes'
import { MON_API_HOST } from '../constants/api'

export const loadAllSections = () => ({
  type: LOAD_ALL_SECTIONS,
  $api: {
    url: MON_API_HOST + 'razdeli/zapros?koren=true'
  }
})

/** to do -- никак иначе --  ?sotrudnik=${userId}&tip_resursov=${type}`*/
export const loadSectionsByUserId = (parentId) => ({
    type: LOAD_SECTIONS_BY_USER_ID,
        $api: {
        url: MON_API_HOST + `razdeli/zapros?roditel=${parentId}`
    }
})

// export const loadAllSectionsById = (type) => ({
//     type: LOAD_ALL_SECTIONS_BY_ID,
//     $api: {
//         url: MON_API_HOST + `razdeli/zapros?tip_resursov=${type}`
//     }
// })
export const loadSectionsByParentId = parentId => ({
    type: LOAD_SECTIONS_BY_PARENTID,
    payload: parentId,
    $api: {
        url: MON_API_HOST + `razdeli/zapros?roditel=${parentId}`
    }
})

export const   createSection = section => ({
  type: CREATE_SECTION,
  $api: {
    url: MON_API_HOST + 'razdeli/novoe',
    type: 'POST',
    data: JSON.stringify(section),
    headers: {
      'Content-Type': 'application/json'
    }
  }
})

export const updateSection = section => (

    {
  type: UPDATE_SECTION,
  $api: {
    url: `${MON_API_HOST}razdeli/redaktor`,
    type: 'POST',
    data: JSON.stringify(section),
      headers: {
          'Content-Type': 'application/json'
      }
  }
})

export const deleteSection = section => ({
  type: DELETE_SECTION,
  payload: { section },
  $api: {
    url: MON_API_HOST + 'razdeli/udalenie',
    type: 'POST',
    data: JSON.stringify(section),
    headers: {
      'Content-Type': 'application/json'
    }
  }
})

export const setActiveSection = id => ({
  type: SET_ACTIVE_SECTION,
  payload: { id }
})

export const filterSections = searchValue => ({
  type: FILTER_SECTIONS,
  payload: { searchValue }
})
