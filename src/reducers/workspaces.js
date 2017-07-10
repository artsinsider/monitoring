import * as workspacesHelp from './helpers/workspacesHelper'
import * as actionsWorkspaces from '../constants/actionTypes'
import { notification } from 'antd'

notification.config({ duration: 7 })

const initialState = { }

export default (workspaces = initialState, action) => {
    const {payload, type, response } = action;

    switch (type) {

        case actionsWorkspaces.CREATE_WORKSPACES:
            return ({...workspaces, workspacesLength: payload});

        case  actionsWorkspaces.GET_USER_ID:
            return ({...workspaces, userId: payload });

        case  actionsWorkspaces.GET_RESOURCES_ID:
            return ({...workspaces, resourcesId: payload });

        case actionsWorkspaces.GET_DATA_WORKSPACES:
            return workspacesHelp.data({...workspaces, resources:payload})

        default:
            return workspaces
    }

}