import * as AC from '../constants/actionTypes'
import {START, SUCCESS, FAIL } from '../constants/actionTypes'
import { notification } from 'antd'
notification.config({ duration: 7 })

const initialState = {}

export default (administration = initialState, action) => {
    const {payload, type, response } = action;

    switch (type) {

        case AC.LOAD_EXTREME_VALUE + START:
            return ({...administration})

        case AC.LOAD_EXTREME_VALUE + SUCCESS:
            return ({...administration, extremeValue: response });

        case AC.LOAD_EXTREME_VALUE + FAIL:
            return ({...administration, exeption: response});

        case AC.UPDATE_EXTREME_VALUE + SUCCESS:
            return({...administration, updateExtreme:response })

        default:
            return administration
    }

}