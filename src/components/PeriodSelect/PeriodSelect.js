import React, { PureComponent }                 from 'react'
import { connect }                          from 'react-redux'
import { Select, Form }                           from 'antd'
import { loadAllPeriodResourcesById }       from '../../AC/periodResources'
import { loadPeriods, changeCurrentPeriod } from '../../AC/periods'
import { loadAllSectionsById }              from '../../AC/sections'
import {isNil}                              from 'ramda'
import SearchFilter                         from '../TableData/SearchFilter'
const formInit = Form.create()

class PeriodSelect extends PureComponent {
    state = {
        targetValue: []
    }

    targetValue = (idTypePeriod) => {
        const {periods=[], activPeriod, users, userInterfaces} = this.props;
        const targetValue = periods.filter(target => target.tip_resursov.kod == idTypePeriod);
        const activeFromSelectedPeriods = targetValue.filter(period => period.status.kod == 1)
        const loadedePeriod = isNil(activeFromSelectedPeriods)? activeFromSelectedPeriods : targetValue
        const findRoleUser = ((userInterfaces.role === 'chief') || (userInterfaces.role ==='leader')) ? '' : users.kod
        this.props.loadAllPeriodResourcesById(loadedePeriod[0].kod, findRoleUser)
        this.props.changeCurrentPeriod(loadedePeriod[0])
        // this.props.loadAllSectionsById(loadedePeriod[0].tip_resursov.kod)
        this.setState({targetValue:targetValue})
    }

    render() {
        const {periods=[], periodSelected, typeResources=[], activPeriod} = this.props;
        const { getFieldDecorator } = this.props.form
        const target = this.state.targetValue.length == 0 ? periods.filter(target => target.tip_resursov.kod == activPeriod.tip_resursov.kod) : this.state.targetValue

        return (
            <div className="group-selected" >
                {getFieldDecorator('typeResources',{ initialValue: isNil(activPeriod) ? '' : activPeriod.tip_resursov.nazvanie })
                (<Select
                    showSearch
                    className="service-btn"
                    style={{width: '95px'}}
                    optionFilterProp="children"
                    onChange={this.targetValue}
                >
                    {typeResources.map((type, i) =>
                        <Select.Option
                            key={i}
                            value={'' +type.kod}
                        >
                            {type.nazvanie}
                        </Select.Option>)}
                </Select>)}

                {getFieldDecorator('periods',{ initialValue: isNil(activPeriod) ? '' : activPeriod.nazvanie })
                (<Select
                    showSearch
                    className="service-btn"
                    style={{width: '200px'}}
                    optionFilterProp="children"
                    onChange={this.handleOnChangeCurrentPeriod}
                >
                    {
                        target.map((period, i) =>
                    <Select.Option
                        key={i}
                        value={period.nazvanie}
                    >
                        {`${period.nazvanie} ${new Date(period.do).getFullYear()}`}
                    </Select.Option>)}
                </Select>)}

            </div>
        )
    }

    handleOnChangeCurrentPeriod = index => {
        const {periods, users, userInterfaces} = this.props;
        const findRoleUser = ((userInterfaces.role === 'chief') || (userInterfaces.role ==='leader')) ? '' : users.kod
        const selectedPeriod = periods.filter(period => {return period.nazvanie == index})[0]
        this.props.changeCurrentPeriod(selectedPeriod)
        this.props.loadAllPeriodResourcesById(selectedPeriod.kod, findRoleUser)
    }
}

export default connect(state => ({
    activPeriod:  state.periods.periodSelected,
    periods: state.periods.allPeriods,
    currentPeriod: state.periods.currentPeriod,
    typeResources: state.resourceTypes.resourceTypes,
    users: isNil(state.user.userData) ? '' : state.user.userData
}), { loadPeriods, changeCurrentPeriod, loadAllPeriodResourcesById,loadAllSectionsById })(formInit(PeriodSelect))
