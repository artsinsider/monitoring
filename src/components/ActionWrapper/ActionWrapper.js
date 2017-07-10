import React, { Component }                               from 'react'
import { connect }                                        from 'react-redux'
import * as periodResources                               from '../../AC/periodResources'
import { loadExtremeValues }                              from '../../AC/administration'
import { loadMeasure,loadAllResourceTypes }               from '../../AC/resourceTypes'
import * as resources                                     from '../../AC/resources'
import {loadNewUsers, refreshToken}                       from '../../AC/users'
import * as periods                                       from '../../AC/periods'
import { loadAllperiodStatuses }                          from '../../AC/statuses'
import { calculationMethod }                              from '../../AC/reports'

class ActionWrapper extends Component {

    componentDidMount() {
        this.props.loadNewUsers(this.props.token)
        this.props.loadExtremeValues()
        this.props.loadMeasure()
        this.props.loadResourcesStatus()
        this.props.loadResourcesStatusAction()
        this.props.loadAllResourceTypes()
        this.props.loadAllperiodStatuses()
        this.props.calculationMethod()
        if(localStorage.getItem('ogrId')) {
           this.props.loadPeriodsForOrganization()
        }
        else{
            this.props.role == 'user' ? this.props.loadPeriodsFullUser() : this.props.loadPeriods()
        }
    }

    render() {
        return (
            <div>{this.props.children}</div>
        )
    }
}
export default connect(state => ({
}),{
    ...periodResources,
    ...resources,
    ...periods,
    loadExtremeValues,
    loadMeasure,
    loadAllResourceTypes,
    loadNewUsers,
    loadAllperiodStatuses,
    refreshToken,
    calculationMethod
})(ActionWrapper)

// this.props.loadAllUsers()
// this.props.loadAllOrganization()
// this.props.loadNewResources()
// this.props.loadEditingResources()