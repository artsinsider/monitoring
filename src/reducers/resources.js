import { SUCCESS, START, FAIL } from '../constants/actionTypes'
import * as RES                 from '../constants/resourcesActionType'
import { notification }         from 'antd'

notification.config({ duration: 20, bottom: 50, placement: 'topLeft'})

const initialState = {
  selected: [],
  dataFiltred: [],
  filterStatus: false,
  areAllSelected: false,
  columnNames: ['nazvanie', 'polnoe_nazvanie', 'nachalnaya_cena', 'izmenennaya_cena', 'delta', 'primechanie', 'primechanie', 'harakteristika', 'kod_okp', 'kod_okpd2', 'kod_tsn', 'massa_gross', 'massa_netto','mera','s_transportnymi_rashodami', 'sotrudnik', 'status', 'organization' ],
  columnsSelected: JSON.parse(localStorage.getItem('columnsSelected')) || ['nazvanie', 'polnoe_nazvanie', 'nachalnaya_cena', 'izmenennaya_cena', 'delta', 'primechanie', 'primechanie', 'harakteristika', 'kod_okp', 'kod_okpd2', 'kod_tsn', 'massa_gross', 'massa_netto','mera','s_transportnymi_rashodami', 'sotrudnik', 'status', 'organization' ],
  newResources:[],
  loading: false,
  visibleModal:false,
  resourcesData:{},
  resourcesId: '',
  findTsn: false
}

/**
 * Добавляет созданный ресурс в таблицу 'Список новых ресурсов'
 * @param state
 * @returns {{newResources: array}}
 */
function addNewResources(state) {
    const {newResources, newResourcesRequest} = state
    newResources.push(newResourcesRequest)
    return ({...state, newResources: newResources})
}

/**
 * Обновление данных при редактировании или создании новых ресурсов
 * @param state
 * @returns {{state, editingResources: [], resourcesUpdate: object}}
 */
function updateData(state){
    const {resourcesUpdate, editingResources} = state
    const lengthEditingResources = editingResources.filter( res => {return  res.kod === resourcesUpdate.kod }).length
    if(lengthEditingResources === 0){
        editingResources.push(resourcesUpdate)
        return ({...state, editingResources: editingResources})
    }
    const updateArrResources = editingResources.map( res => {return  res.kod === resourcesUpdate.kod ? res = resourcesUpdate : res })
    return({...state, editingResources: updateArrResources, resourcesUpdate:{}})
}

/** Удаление ресурса из таблиц*/
function deleteResources(state) {
    const {deleteResourcesData, editingResources, newResources} = state

    if(editingResources.filter(res => {return res.kod === deleteResourcesData.kod}).length !== 0 ){
        const deletingResourcesFromEditTable = editingResources.filter( resources => {return resources.kod !== deleteResourcesData.kod} )
        return({...state, editingResources: deletingResourcesFromEditTable, deleteResourcesData:{} })
    }

    if(newResources.filter(res => {return res.kod === deleteResourcesData.kod}).length !== 0 ){
        const deletingResourcesFromNewTable = newResources.filter( resources => {return resources.kod !== deleteResourcesData.kod} )
        return({...state, newResources: deletingResourcesFromNewTable, deleteResourcesData:{} })
    }
    return({...state})
}

export default (resources = initialState, action) => {
    const { type, payload, response, error } = action

    switch(type) {

        case RES.LOAD_ALL_RESOURCES_STATUS + START:
        case RES.LOAD_ALL_RESOURCES_STATUS_ACTION + START:
        case RES.LOAD_NEW_RESOURCES + START:
            return {...resources, loading: true}

        case RES.CREATE_NEW_RESOURCES + START:
        case RES.LOAD_EDITING_RESOURCES + START:
        case RES.UPDATE_RESOURCES + START:
        case RES.DELETE_RESOURCES + START:
        // case RES.CHANGE_STATUS_RESOURCES + START:
        case RES.FIND_TSN + START:
            return {...resources}

        case RES.LOAD_ALL_RESOURCES + SUCCESS :
            return ({...resources, loadAllResources: response});

        case RES.LOAD_ALL_RESOURCES_STATUS + SUCCESS:
            return ({...resources , resourcesFoolStatus: response})

        case RES.LOAD_ALL_RESOURCES_STATUS_ACTION + SUCCESS:
            return ({...resources , resourcesStatusAction: response})

        case RES.CREATE_NEW_RESOURCES + SUCCESS:
            return addNewResources({...resources , newResourcesRequest: response})

        case RES.LOAD_NEW_RESOURCES + SUCCESS:
            return ({...resources , newResources: response})

        case RES.LOAD_EDITING_RESOURCES + SUCCESS:
            return ({...resources , editingResources: response})

        /** Редактирование ресурса ресурса*/
        // case RES.OPEN_UPDATE_RESOURCES + START:
        //      return ({...resources, visibleModal: true})
        case RES.OPEN_UPDATE_RESOURCES + SUCCESS:
            return ({...resources , resourcesData: response[0], visibleModal: true})

        case RES.CLOSE_UPDATE_RESOURCES:
            return ({...resources , resourcesData: {}, visibleModal: false})

        case RES.FIND_TSN + SUCCESS:
            return ({...resources , findTsn: response })

        case RES.UPDATE_RESOURCES + SUCCESS:
            notification.success({message: response.nazvanie  , description: 'Успешно отредактирован' })
            return updateData({...resources , resourcesUpdate: response})

        /** Удаление ресурса ресурса*/
        case RES.OPEN_DELETE_RESOURCES:
            return ({...resources , deleteResourcesData: payload, visibleModalDelete: true})

        case RES.CLOSE_DELETE_RESOURCES:
            return ({...resources , deleteResourcesData: {}, visibleModalDelete: false})

        case RES.DELETE_RESOURCES + SUCCESS:
            notification.warning({message: 'Удаление', description: `Ресурс ${payload.nazvanie} удален` })
            return deleteResources({...resources , deleteResourcesData: payload })


        /** Получение ресурса длая вывода в карточку*/
        case RES.OPEN_VIEW_RESOURCES:
            return ({...resources , viewResourcesData: payload, resourcesId: payload.kod, visibleModalView: true})

        case RES.OPEN_VIEW_RESOURCES + SUCCESS:
            return ({...resources , viewResourcesData: response[0], resourcesId: response[0].kod, visibleModalView: true})

        case RES.CLOSE_VIEW_RESOURCES :
            return ({...resources , viewResourcesData: {}, visibleModalView: false, resourcesId: null})

        // case RES.CHANGE_STATUS_RESOURCES + SUCCESS:
        //     notification.warning({message: 'Удаление', description: `Ресурс ${payload.nazvanie} удален` })
        //     return deleteResources({...resources , deleteResourcesData: payload })


        case RES.CANCEL_DELETE_RESOURCES:
            notification.destroy()
            return ({...resources , visibleModal: false})

        case RES.LOAD_ALL_RESOURCES_STATUS + FAIL:
        case RES.LOAD_ALL_RESOURCES_STATUS_ACTION + FAIL:
        case RES.CREATE_NEW_RESOURCES + FAIL:
        case RES.LOAD_NEW_RESOURCES + FAIL:
        case RES.LOAD_EDITING_RESOURCES + FAIL:
        case RES.UPDATE_RESOURCES + FAIL:
        case RES.DELETE_RESOURCES + FAIL:
        case RES.FIND_TSN + FAIL:
        // case RES.CHANGE_STATUS_RESOURCES + FAIL:
            notification.error({message: error.status , description: error.responseJSON.opisanie_oshibki })
            return {...resources, dataFail: response , resourcesData: false, resourcesUpdate: false }

        default: return {...resources}
    }
}