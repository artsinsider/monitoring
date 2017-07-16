import * as AC                    from '../constants/actionTypes'
import * as RES                   from '../constants/resourcesActionType'
import {START, SUCCESS, FAIL}     from '../constants/actionTypes'
import * as periodResourcesHelper from './helpers/periodResourcesHelper'
import { notification }           from 'antd'

import { periodResources }        from './dataActon/periodRedcources'
import { org }        from './dataActon/organization'

notification.config({ duration: 20, bottom: 50, placement: 'topLeft'})

const initialState = {
    loading: false,
    searchValue: [],
    organization: [],
    enableAdd:false,
    data: periodResources,
    visibleError:false,
    dataFirst: [],
    dataSecond:[],
    extremeValue: [{"kod":1,"znachenie":100}]

}

export default (periodResources = initialState, action) => {
    const {type, payload, response, error, data, flag, props} = action;

    switch (type) {
        case AC.LOAD_ALL_PERIOD_RESOURCES + START:
        case AC.LOAD_SECTIONS_RESOURCES + START:
        case AC.LOAD_PERIOD_RESOURCES_BY_ID + START:
        case AC.LOAD_SECTIONS_RESOURCES_FOR_USER_START:
        case AC.LOAD_ALL_ORGANIZATION + START:
            return ({...periodResources, loading: true})

        /*** Загружает русурсы по периоду  */
        case AC.LOAD_ALL_PERIOD_RESOURCES + SUCCESS:
            return periodResourcesHelper.dataPeriodResources({...periodResources, data: response, users: data});

            /*** Загружает русурсы по периоду для простых сотрудников */
        case AC.LOAD_ALL_PERIOD_RESOURCES_FIRST + SUCCESS:
            return({...periodResources, dataFirst: response});

        case AC.LOAD_ALL_PERIOD_RESOURCES_SECOND + SUCCESS:
            return periodResourcesHelper.concatDataPeriodResources({...periodResources, dataSecond: response});


        /*** Загружает русурсы по периоду от указанной секции  для простых сотрудников */
        case AC.LOAD_SECTIONS_RESOURCES_FOR_USER_FIRST :
            return({...periodResources, dataFirst: payload});

        case AC.LOAD_SECTIONS_RESOURCES_FOR_USER_SECOND:
            return periodResourcesHelper.concatDataPeriodResources({...periodResources, dataSecond: payload});

        /*** Загружает русурсы по разделу  */
        case AC.LOAD_SECTIONS_RESOURCES + SUCCESS:
            return periodResourcesHelper.dataPeriodResources({...periodResources, data: response, id: payload});

        /*** Загружает русурсы по выбранному периоду  */
        case AC.LOAD_PERIOD_RESOURCES_BY_ID + SUCCESS:
            return periodResourcesHelper.dataPeriodResources({...periodResources, data: response, id: payload});

        /*** Глобальный поиск по таблице  */
        case AC.SEARCH_WHOLE_TABLE:
            return periodResourcesHelper.searchWholeTable({...periodResources, searchValue: payload});

        /** Сброс поиска*/
        case AC.RESET_SEARCH:
            return ({...periodResources, searchValue: '', searchData: []});

        /** Получить коридор значения */
        case AC.LOAD_EXTREME_VALUE + SUCCESS:
            return ({...periodResources, extremeValue: response});


        /** Загрузить список организаций */
        case AC.LOAD_ALL_ORGANIZATION + SUCCESS:
            return ({...periodResources, organization: org});

        /** Отправить редактируемый ресурс на сохранение */
        case AC.UPLOAD_RESOURCES_SUCCESS:
            return periodResourcesHelper.selectedtResources({...periodResources, getResourcesOnUpdated: payload})

        case AC.GET_RESOURCES_UPDATE + SUCCESS:
            return periodResourcesHelper.updateResources({...periodResources, getResourcesUpdated: response , flag, props})

        case AC.SEND_RESOURCES + SUCCESS:
            props == 'izmenennaya_cena' ? notification.info({message: 'Цена изменена' , description: `Цена текущего периода ${response.izmenennaya_cena/100} руб.`}) : null
            return periodResourcesHelper.updateDataInTable({...periodResources, receivedResources: response});

        /** Изменить редактируемый ресурс (front) */
        case AC.DATA_RESOURCES_UPDATE:
            return periodResourcesHelper.updateSelectedtResources({...periodResources, dataResources: payload})

        /** Добавление нового поставщика */
        case AC.CREATE_VENDOR_PRICE + SUCCESS:
            return periodResourcesHelper.updatePeriodResources({...periodResources, newVendorPrice: response })

        case AC.LOAD_ALL_RESOURCES_STATUS + SUCCESS:
            return ({...periodResources , resourcesFoolStatus: response})

        case RES.UPDATE_RESOURCES + SUCCESS:
            return periodResourcesHelper.updateData({...periodResources, updateResources: response})

        case RES.DELETE_RESOURCES + SUCCESS:
            return periodResourcesHelper.deleteResources({...periodResources , deleteResourcesData: payload })

        case RES.CHANGE_STATUS_RESOURCES + SUCCESS:
            notification.info({message: 'Статус изменен'  , description: ''})
            return ({...periodResources , fullStatusResources: payload })

        case AC.LOAD_SECTIONS_RESOURCES + FAIL:
        case AC.LOAD_PERIOD_RESOURCES_BY_ID + FAIL:
        case AC.LOAD_SECTIONS_RESOURCES_FOR_USER_FAIL:
            return ({...periodResources});
        case AC.GET_RESOURCES_UPDATE + FAIL:
            return ({...periodResources, done:false});

        case AC.LOAD_ALL_PERIOD_RESOURCES + FAIL:
            return {...periodResources, error: error, loading:false, visibleError: true }

        case AC.SEND_RESOURCES + FAIL:
            props == 'izmenennaya_cena' ? notification.error({message: error.responseJSON.opisanie_oshibki , description: ``}) : null
            return {...periodResources, error: error }

        default:
            return periodResources
    }
}
