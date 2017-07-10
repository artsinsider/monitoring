import {isNil} from 'ramda'

/**
 * Выполняется поиск активного периода
 * @param periods - все доступные периоды
 * @returns {{activPeriod}} - период со статусом "Открыт"
 */
export function periodActive(periods) {
    const {allPeriods} = periods
    const lastPeriod = allPeriods.length == 0 ? 0 : allPeriods.length - 1
    const periodOpen = allPeriods.filter(el => el.status.kod === 1)

    const periodSelect = () => {
        if(periodOpen.length == 0) {
            return allPeriods[lastPeriod]
        }
        return periodOpen.filter(el => el.tip_resursov.kod == 4)[0]
    }
    return({...periods, periodSelected: isNil(periodSelect())? periodOpen[0] : periodSelect() , testPeriodsOpen: testPeriodsOpen(allPeriods)})
}

export function typeResourcesActive(periods) {
    const {allType} = periods ;
    const typeSelected = allType[0]
    return({...periods, typeSelected: typeSelected })
}

export function addPeriod(periods) {
    const { allPeriods, newPeriod } = periods
    allPeriods.push(newPeriod)
    return({...periods, allPeriods: allPeriods , testPeriodsOpen: testPeriodsOpen(allPeriods)})
}

export function chengePeriod(periods) {
    const {allPeriods, request} = periods
    console.log('request', request)
    console.log('allPeriods - 0', allPeriods)
    const updatePeriodList = allPeriods.map(period => period.kod == request.kod ? request : period)
    console.log('allPeriods - 1', updatePeriodList)
    return ({ ...periods, allPeriods: updatePeriodList, testPeriodsOpen: testPeriodsOpen(updatePeriodList), loading: false })
}

const testPeriodsOpen = (periods) =>   periods.filter(period => { return period.status.kod == 1}).length !== 2
