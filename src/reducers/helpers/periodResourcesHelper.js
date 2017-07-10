import {concat as concatR, isNil}  from 'ramda'
import { notification }            from 'antd'
import {unUser}                    from '../../components/Users/fakeUser'
notification.config({ duration: 20, bottom: 50, placement: 'topLeft'})

/**
 * Редактирования выбранного ресурса для отправки на бек
 */
export function  selectedtResources(state) {
    const {dataResources, getResourcesOnUpdated } = state
    for(let prop in getResourcesOnUpdated[0]){
        for( let props in dataResources.updateFild) {
            prop == props ? getResourcesOnUpdated[0][prop] = +dataResources.updateFild[props]*100 : null
        }
    }
    return({ ...state, getResourcesOnUpdated : getResourcesOnUpdated[0]})
}

/**
 * Редактирование цены, выбранного ресурса на фронте
 */
export function updateSelectedtResources(state) {
    const { dataResources, data ,extremeValue} = state
    const foundResources = data.filter( resource => resource.kodResursPeriod == dataResources.kodResursPeriod)[0]
    for(let prop in foundResources){
        for( let props in dataResources.updateFild){
            const newValue = prop == props ? foundResources[prop] = +dataResources.updateFild[props] : null;
            foundResources[prop] == (+dataResources.updateFild[props]) ? foundResources.delta = calculatingDelta( foundResources.nachalnaya_cena, +newValue, extremeValue[0].znachenie) : null;
        }
    }
    const updateResources = data.map( resource => {
        return resource.kod == dataResources.idResources? foundResources : resource
        }
    )
    return({ ...state, data: updateResources })
}

/**
 * Считает разницу между ценами в периоде
 * @param previousValue - Цена за прошлый период
 * @param nextValue - Цена за текущий период
 * @returns {string}
 */

function calculatingDelta(previousValue, nextValue) {
    const controlNextValue = nextValue == 'null'? 1 : nextValue;
    return (((controlNextValue - previousValue)/previousValue)*100).toFixed(0);
}

/**
 * Указывает ФИС сотрудника назначенного русурсу
 * @param usersList - список сотрудников
 * @param userId - идетификатор сотрудника назначенного русурсу
 */
function foundUsers(usersList,userId){
    if (isNil(usersList)){  return 'Не назначен' }
    const tetsArrUser = isNil(usersList) ? usersList : unUser
    const userAndResource = tetsArrUser.filter( user => user.kod ==  userId )
    return userAndResource.length == 0 ? 'Не назначен' : `${userAndResource[0].familiya} ${userAndResource[0].imya[0]}. ${userAndResource[0].otchestvo[0]}.`
}

/**
 * Указывает ФИС сотрудника назначенного русурсу
 * @param state - состояние
 * @param orgId - идетификатор сотрудника назначенного русурсу
 */
function foundOrganization(state,orgId){
    const {organization} = state
    if (organization.length == 0 ){ return 'Не найден' }
        const orgAndResource = organization.filter( org => { return org.kod ==  orgId} )
        return orgAndResource.length == 0 ? 'Не назначен' : `${orgAndResource[0].nazvanie}`
}

/** Формируем данные для таблицы, по периоду со статусом " ОТКРЫТЫЙ "  + данные по роли сотрудника*/
export function concatDataPeriodResources(state) {
    const {dataSecond, dataFirst, extremeValue} = state
    const concatData = concatR(dataFirst,dataSecond)
    sortData(concatData)
    const viewResourcesData = concatData[0]
    const periodResourcesForUser = []
    concatData.forEach( (el, i) => { buildMap(periodResourcesForUser, el, i, state, extremeValue) })
    return({...state, data: periodResourcesForUser, viewResourcesData: viewResourcesData ,loading:false})
}

/**
 * Формируем данные для таблицы, по периоду со статусом " ОТКРЫТЫЙ "
 */
export function dataPeriodResources(state) { debugger;
    const {data, extremeValue, users} = state
    sortData(data)
    console.log('--data--', data[0])
    const viewResourcesData = data[0]
    const periodResources = []
    data.map( (el,i) => { buildMap(periodResources, el, i, state, extremeValue) })
    return ({...state , data: periodResources ,viewResourcesData: viewResourcesData , loading:false, selectResources: data[0]})
}

function sortData(arr) {
    return arr.sort( (a, b) => {
            switch (true) {
                case a.resurs.kod_tsn < b.resurs.kod_tsn: return -1
                case a.resurs.kod_tsn > b.resurs.kod_tsn: return 1
                default: return 0;
            }
        }
    )
}

function buildMap(arr, el, index, state, extremeValue) {
    return arr.push({
        key: el.resurs.kod,
        kodResursa: el.resurs.kod,
        kod: { value: el.kod },
        kodResursPeriod: { value: el.kod },
        nazvanie: { value: el.resurs.nazvanie },
        nachalnaya_cena: { value: el.nachalnaya_cena/100 } ,
        izmenennaya_cena: { editable: false,  value: el.izmenennaya_cena/100  },
        delta: { value: (() => el.izmenennaya_cena == null ? '' : calculatingDelta( el.nachalnaya_cena, el.izmenennaya_cena, extremeValue ))() },
        primechanie: { value: el.resurs.primechanie },
        harakteristika: { value: el.resurs.harakteristika },
        kod_tsn: { value: el.resurs.kod_tsn },
        s_transportnymi_rashodami: { value: el.s_transportnymi_rashodami },
        status: { value: el.resurs.status.kod },
        organization: { value: (() =>  foundOrganization(state, el.organizaciya))() },
        proizvoditel: { value: el.proizvoditel },
        otklonenie_ot_osnovnoi_ceni: { value: el.otklonenie_ot_osnovnoi_ceni },
        proverka: { value: el.proverka },
        vozvrat_sotrudniku: { value: el.vozvrat_sotrudniku },
        vozvrat_rukovoditelju: { value: el.vozvrat_rukovoditelju },
        eto_osnovnaya_cena: {value: el.eto_osnovnaya_cena},
        sotrudnik: { value: (() =>  foundUsers(state.users, el.resurs.razdel.sotrudnik))(), idUser: el.resurs.razdel.sotrudnik},
        razdel: {razdel: el.resurs.razdel.kod ,roditel: el.resurs.razdel.roditel} ,
    })
}

/**
 * Редактирования выбранного ресурса для отправки на бек
 */
export function updateResources(state) {
    const {getResourcesUpdated , flag, props} = state
    getResourcesUpdated[0][props] = flag
    return({ ...state, getResourcesUpdated: getResourcesUpdated[0]})
}

/** Перезаписываем данные в стейт*/
export function updateDataInTable(state) {
    const {receivedResources, extremeValue, data, props,} = state
    if(props == 'udalena') {
        notification.info({message: 'Операция удаления прошла успешно.' , description: `Цена на ресурс ${receivedResources.resurs.nazvanie}.`})
        return({ ...state, data: data.filter(resources => resources.kodResursPeriod.value != receivedResources.kod), getResourcesUpdated:{}, props:''})
    }
    const mutable =[]
    buildMap(mutable, receivedResources, receivedResources.kod, state, extremeValue)
    return({ ...state, data: sortDataDefore(data.map(resources => resources.kodResursPeriod.value == receivedResources.kod ? mutable[0] : resources )), getResourcesUpdated:{}, props:''})
}

export function updatePeriodResources(state) {
    const {newVendorPrice, extremeValue, data} = state
    const mutable =[]
    buildMap(mutable, newVendorPrice, newVendorPrice.kod, state, extremeValue)
    notification.info({message: 'Операция создания поставщика прошла успешно.' , description: `Поставщик ${mutable[0].organization.value} добален с ценой ${mutable[0].izmenennaya_cena.value} руб.`})
    return({ ...state, data: sortDataDefore([...data, mutable[0]])})
}

function sortDataDefore(arr) {
    return arr.sort( (a, b) => {
            switch (true) {
                case a.kod_tsn.value < b.kod_tsn.value: return -1
                case a.kod_tsn.value > b.kod_tsn.value: return 1
                default: return 0;
            }
        }
    )
}

/**
 * Производит глобальный поиск по таблице
 * @returns {{searchData: Array, loading: boolean}}
 */
export function searchWholeTable(state) {
    const {data,searchValue} = state
    const searchString = data.filter(e =>  (JSON.stringify(e).toLowerCase().indexOf(searchValue) !== -1) ? e: false)
                             .map(el => el.kodResursPeriod.value)
    return({...state, searchData: searchString , loading:false})
}

/**
 * Обновлинеи даннх таблицы при изменении данных ресурс периода
 * @returns {{state: object, data: array, updateResources: object }}
 */
export function updateData(state) {
    const {data,updateResources, organization, users} = state
    if(updateResources.status_deistviya.nazvanie !== "Создание"){
    const searchPeriodResources =  data.filter( resoucesPeriod => resoucesPeriod.kod == updateResources.kod)[0]
    const filterOrg = organization.filter( org => updateResources.organizaciya === org.kod )[0].nazvanie
    const filterUser = users.filter( user => updateResources.sotrudnik == user.kod )
    const userName = `${filterUser[0].familiya} ${filterUser[0].imya[0]}. ${filterUser[0].otchestvo[0]}.`
    const updateData =  data.filter( res => {return  res.kod !== updateResources.kod})
    return({...state, data: updateData, updateResources:{} })
    }
    return ({...state, updateResources:{}})
}

/** Возвращает массив без удаленного ресурса*/
export function deleteResources(state) {
    const {deleteResourcesData, data} = state
    const excludeResource = data.filter( resources =>  resources.kod !== deleteResourcesData.kod )
    return({...state, data: sortData(excludeResource), deleteResourcesData:{}})
}

// kod: el.resurs.kod,
//     kodPeriod: el.period.kod,
//     kodResursPeriod: el.kod,
//     nazvanie: el.resurs.nazvanie,
//     // polnoe_nazvanie: el.resurs.polnoe_nazvanie,
//     nachalnaya_cena: el.nachalnaya_cena/100 ,
//     izmenennaya_cena: el.izmenennaya_cena/100 ,
//     delta: (() => el.izmenennaya_cena == null ? '' : calculatingDelta( el.nachalnaya_cena, el.izmenennaya_cena, extremeValue ))(),
//     primechanie: el.resurs.primechanie,
//     harakteristika: el.resurs.harakteristika,
//     // kod_okp: el.resurs.kod_okp,
//     // kod_okpd2: el.resurs.kod_okpd2,
//     kod_tsn: el.resurs.kod_tsn,
//     // massa_gross: el.resurs.massa_gross,
//     // massa_netto: el.resurs.massa_netto,
//     // mera: el.resurs.mera.code,
//     s_transportnymi_rashodami: {transportation: el.s_transportnymi_rashodami, resursKod: el.kod},
// // sotrudnik: (() =>  foundUsers(state, el.resurs.sotrudnik))(),
// status: el.resurs.status.kod,
//     organization: (() =>  foundOrganization(state, el.organizaciya))(),
//     proizvoditel: ' ',
// // view:  el.resurs.kod,
// // edit:  el.resurs,
// // delete: el.resurs,