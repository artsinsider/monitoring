import { START, FAIL, SUCCESS } from '../constants/actionTypes'
import * as AC                  from '../constants/actionTypes'
import * as helper              from './helpers/periodHelper'
import { notification }         from 'antd'
import {periodi}                from './dataActon/periodi'

notification.config({ duration: 20, bottom: 50, placement: 'topLeft'})
const initialState = {
    periodStatuses: [],
    allPeriods: periodi,
    periodSelected: periodi[0]
}

const testPeriodsOpen = (periods) => periods.filter(period => { return period.status.kod == 1}).length === 2

export default (periods = initialState, action) => {
    const { type, payload, response, error } = action

    switch (type) {
        case AC.LOAD_PERIODS + START:
        case AC.LOAD_ALL_PERIOD_STATUSES + START:
        case AC.LOAD_TIPRESURSOV + START:
            return { ...periods }

        case AC.CHANGE_PERIOD + START:
        case AC.ADD_NEW_PERIOD + START:
            return { ...periods, loading:true }

        /** Получеине списка периодов*/
        case AC.LOAD_PERIODS + SUCCESS :
            return helper.periodActive({ ...periods, allPeriods: response , loading:false})

        /** Получеине списка типов ресурсов*/
        case AC.LOAD_TIPRESURSOV + SUCCESS:
            return helper.typeResourcesActive({ ...periods, allType: response })

        /** Выбор другого периода*/
        case AC.CHANGE_CURRENT_PERIOD:
            return ({ ...periods, periodSelected: payload , typeSelected: payload.tip_resursov })

        /** Создание нового периода*/
        case AC.ADD_NEW_PERIOD + SUCCESS:
            notification.info({message: `Период ${response.nazvanie} ${response.status.nazvanie.toLowerCase()}`, description: ''})
            return helper.addPeriod({ ...periods, allPeriods: response, loading: false})

        /** Получеине положительного ответа от сервера при моздании нововго периода*/
        case AC.CHANGE_PERIOD + SUCCESS:
            notification.warn({message: `Период ${response.nazvanie} - статус ${response.status.nazvanie.toLowerCase()}`, description: ''})
            return helper.chengePeriod({ ...periods, request: response })

        /** Получеине списка стаутсов периода*/
        case AC.LOAD_ALL_PERIOD_STATUSES + SUCCESS:
            return ({...periods , periodStatuses:response})

        case AC.LOAD_ALL_PERIOD_STATUSES + FAIL:
        case AC.LOAD_PERIODS + FAIL:
            return { ...periods }

        case AC.LOAD_TIPRESURSOV + FAIL:
        case AC.ADD_NEW_PERIOD + FAIL:
            console.error(type, error)
            return {...periods, error: error, loading: false, visibleError: true }

        case AC.CHANGE_PERIOD + FAIL:
            notification.error({message: error.responseJSON.opisanie_oshibki, description: ''})
            return {...periods, error: error, loading: false}

        default: return periods
    }
}
