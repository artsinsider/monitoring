/**
 * Формируем данные для отправки на сервер
 * @returns {{workSpaces: {kod: null, kod_sotrudnika: string, resursi: Array}}}
 */

export function data(state) {
    const {resources, userId, resourcesId, workspacesLength} = state;
    const selectedResources = [];
        for(var i = 0; i < resourcesId.length; i ++){
            resources.filter( el => {
                return (el.kod == resourcesId[i]) ? selectedResources.push(el): null;
            })
        }

    const dataWorkspaces = {
        kod: null,
        kod_sotrudnika: '' + userId,
        resursi: selectedResources
    }
    return { ...state, dataWorkspaces: dataWorkspaces }
}