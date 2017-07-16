import { START, FAIL, SUCCESS } from '../constants/actionTypes'
import * as AC from '../constants/actionTypes'
import fileDownload                                      from 'react-file-download'
import { notification }                                  from 'antd'

notification.config({ duration: 20, bottom: 50, placement: 'topLeft'})

const initialState = { }

function findActivMethod(state) {
    const {calculationMethod} = state
    const findMethod = calculationMethod.filter( method => method.activen == true )[0]
    return ({...state, methodActive: findMethod })
}

function methodReplacement(state) {
    const {calculationMethod, calculationMethodReplacement} = state
    const methodReplacement = calculationMethod.filter( method => calculationMethodReplacement.kod != method.kod)[0]
    methodReplacement.activen = false
    const findMethod = calculationMethod.filter( method => method.activen == true )[0]
    return ({...state, methodActive:findMethod,  calculationMethod: calculationMethod })
}

export default (reports = initialState, action) => {
    const { type, payload, response, error } = action

    switch (type) {

        case AC.CALCULATION_METHOD + START:
        case AC.CHANGE_CALCULATION_METHOD + START:
            return ({...reports})

        case AC.LOAD_REPORT_MONITORING + START:
            return ({...reports , reportLoading: true})

        case AC.LOAD_REPORT_MONITORING + SUCCESS:
            fileDownload(response, payload.type + Date.now() + '.xlsx')
            return ({...reports , reportLoading: false})

        case AC.CALCULATION_METHOD + SUCCESS:
            return findActivMethod({...reports, calculationMethod: response})

        case AC.CHANGE_CALCULATION_METHOD + SUCCESS:
            notification.info({message: 'Метод расчета был изменен' , description: `Активнй метод расчета - ${response.opisanie}`})
            return methodReplacement({...reports, calculationMethodReplacement: response})

        case AC.LOAD_REPORT_MONITORING + FAIL:
            notification.error({message: error.status , description: `Ресурсы для формирования отчета '${payload.description}' не найдены. За период '${payload.name}'`})
            return ({...reports , reportLoading: false})

        case AC.CALCULATION_METHOD + FAIL:
        case AC.CHANGE_CALCULATION_METHOD + FAIL:
            return ({...reports})

        default: return reports
    }
}
