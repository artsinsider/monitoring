import * as interfaceActionTypes from '../constants/interfaceActionTypes'

export const cancelAddUser = () => ({
    type: interfaceActionTypes.CANCEL_ADD_USER_IN_TAB,
})


export const selectedTabs = (id) => ({
    type: interfaceActionTypes.SELECTED_TABS,
    payload: id
})