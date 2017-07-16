import * as RAC from '../constants/resourcesActionType'

import { MON_API_HOST } from '../constants/api'

export function toggleResource(id, status) {
    return {
        type: RAC.TOGGLE_RESOURCE,
        payload: id
    }
}

export function toggleAllResources(status) {
    return {
        type: RAC.TOGGLE_ALL_RESOURCES,
        payload: status
    }
}

export function toggleColumn(columnName) {
    return {
        type: RAC.TOGGLE_COLUMN,
        payload: columnName
    }
}

export function filterColumn(columnName, value) {
    return {
        type: RAC.FILTER_COLUMN,
        payload: { columnName, value }
    }
}

export const loadAllResources = () => ({
    type: RAC.LOAD_ALL_RESOURCES,
    $api: {
        url: `${MON_API_HOST}resursi/zapros?razdel=1`
    }
})

export const loadResourcesStatus = () => ({
    type: RAC.LOAD_ALL_RESOURCES_STATUS,
    $api: {
        url: `${MON_API_HOST}resursstatusi/zapros`
    }
})

export const loadResourcesStatusAction = () => ({
    type: RAC.LOAD_ALL_RESOURCES_STATUS_ACTION,
    $api: {
        url: `${MON_API_HOST}resursstatusideistviya/zapros`
    }
})

/**  Создание ресурса */
export const createResources = resources => ({
    type: RAC.CREATE_NEW_RESOURCES,
    $api: {
        url: MON_API_HOST + 'resursi/novoe',
        type: 'POST',
        data: JSON.stringify(resources),
        headers: { 'Content-Type': 'application/json'  }
    },
    payload:resources
})


export const loadNewResources = () => ({
    type: RAC.LOAD_NEW_RESOURCES,
    $api: {
        url: `${MON_API_HOST}resursi/zapros?status_deistviya=1`
    }
})

export const loadEditingResources = () => ({
    type: RAC.LOAD_EDITING_RESOURCES,
    $api: {
        url: `${MON_API_HOST}resursi/zapros?status_deistviya=2`
    }
})



export const updateResources = (resources) => ({
    type: RAC.UPDATE_RESOURCES,
    $api: {
        url: MON_API_HOST + 'resursi/redaktor',
        type: 'POST',
        data: JSON.stringify(resources),
        headers: {  'Content-Type': 'application/json'  }
    }
})

/**  Редактирование ресурса */
export const openViweeResources = (resourcesId) => ({
    type: RAC.OPEN_VIEW_RESOURCES,
    $api: {
        url: `${MON_API_HOST}resursiperioda/zapros?kod=${resourcesId}`
    },
    payload: resourcesId
})

export const closeViweeResources = (resourcesId) => ({
    type: RAC.CLOSE_VIEW_RESOURCES,
})

export const openUpdateResources = (resourcesId) => ({
   type: RAC.OPEN_UPDATE_RESOURCES,
    $api: {
        url: `${MON_API_HOST}resursiperioda/zapros?kod=${resourcesId}`
    },
    payload: resourcesId
})

export const closeUpdateResources = () => ({
    type: RAC.CLOSE_UPDATE_RESOURCES,
})

/** Удалеине ресурса */
export const openDeleteResources = (resources) => ({
    type: RAC.OPEN_DELETE_RESOURCES,
    payload: resources
})

export const closeDeleteResources = () => ({
    type: RAC.CLOSE_DELETE_RESOURCES,
})

export const findTsn = (tsn) => ({
    type: RAC.FIND_TSN,
    $api: `${MON_API_HOST}resursi/check_tsn?tsn=${tsn}`
})


export const deleteResources = (resources) => ({
    type: RAC.DELETE_RESOURCES,
    $api: {
        url: MON_API_HOST + 'resursi/udalenie',
        type: 'POST',
        data: JSON.stringify(resources),
        headers: { 'Content-Type': 'application/json' }
    },
    payload: resources
})

/** Смена статуса ресурсу */
export const chengeStatusResources = (idStatus, status) => ({
        type: RAC.CHANGE_STATUS_RESOURCES,
        $api: {
            url: `${MON_API_HOST}resursi/change_status?kod_resursa=${idStatus}`,
            type: 'POST',
            data: JSON.stringify(status),
            headers: { 'Content-Type': 'application/json' }
        },
        payload: status
    }
)
