import { CREATE_WORKSPACES, GET_USER_ID ,GET_RESOURCES_ID,GET_DATA_WORKSPACES } from '../constants/actionTypes'
import { MON_API_HOST } from '../constants/api'

/**
 * Создаем рабочую область
 * @param payload
 */
export const createWorkspaces = (payload) => ({
    type: CREATE_WORKSPACES,
    payload: payload
});

/**
 * Получаем id(kod) сотрудника
 */
export const getUserId = (payload) => ({
    type: GET_USER_ID,
    payload: payload
});

/**
 * Получаем id(kod)-ы ресурсов
 */
export const getResourcesId = (payload) => ({
    type: GET_RESOURCES_ID,
    payload: payload
});


export const getData = (payload) => ({
    type: GET_DATA_WORKSPACES,
    payload: payload
})
