import * as IAC from '../constants/interfaceActionTypes'
import * as AC  from '../constants/actionTypes'

const initialState = {
    loading: false,
    enableAdd:false,
    selectedTabs: 'periods'
}

function testSelectedTabs(state) {
    const {selectedTabs} = state
    return selectedTabs === 'reports' ?  false :  {...state, enableAdd: false}
}

export default (interfaceAction = initialState, action) => {
    const {type, payload, response, error} = action;

    switch (type) {

        /** скрывает форму добаления ресурсу пользователя  */
        case AC.ADD_USER_TO_RESOURCE:
        case IAC.CANCEL_ADD_USER_IN_TAB:
            return {...interfaceAction, enableAdd: true}

        /** Отмена добавление пользователя ресурсу  */
        case AC.ADD_USER_TO_RESOURCE_CANCEL:
            return {...interfaceAction, enableAdd: false }

        /** id активного таба */
        case IAC.SELECTED_TABS:
            return ({...interfaceAction, selectedTabs: payload})

        default:
            return interfaceAction
    }
}
