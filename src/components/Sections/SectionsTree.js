import React, { Component }      from 'react'
import { connect }               from 'react-redux'
import { Tree, Spin }            from 'antd'
import * as actionCreators       from '../../AC/sections'
import * as users                  from '../../AC/users'
import { delay }                 from '../../utils'
import { loadSectionsResources, loadSectionsResourcesForUser } from '../../AC/periodResources'
import { loadSectionsByParentId } from '../../AC/sections'
import {isEmpty}                 from 'ramda'
import {interfaceSettings}   from  '../../config/InterfaceSettings'
import Treev3 from './Treev3'

class SectionsTree extends Component {
    state = {
        stateSearchValue: ''
    }

    componentDidMount = () => this.props.loadAllSections()

    selectNode = (sectionId) => {
        const { selectedPeriod, user } = this.props
        this.props.setActiveSection(+sectionId[0])
        const all = {sectionId: sectionId[0] ,periodActive: selectedPeriod.kod}
        const userName = isEmpty(user) ? user.imya_polzovatelya : 'dolotov'
        const userRole = interfaceSettings[userName].role
        if(isEmpty(sectionId)){
            return null
        }
        if (userRole == 'user') {
            return this.props.loadSectionsResourcesForUser(sectionId)
        }
        return this.props.loadSectionsResources(all)
    }

    render() {
        const { loading ,userInterfaces} = this.props
        return (
            <Spin spinning={loading}>
              <div style={{minHeight: 100}}>
                <Treev3
                    isSelectable={false}
                    autoExpandParent={true}
                    defaultExpandedKeys={['null']}
                    onCheck={ (keys, e) => this.props.addSection(keys.checked)}
                    onSelect={ keys => this.selectNode(keys)} >
                </Treev3>
              </div>
            </Spin>
        )
    }

    onChange = (e) => {
        const value = e.target.value
        this.changeSearchValue(value)
    }

    changeSearchValue = stateSearchValue => {
        const { filterSections } = this.props
        this.setState({ stateSearchValue })
        delay(() => filterSections(stateSearchValue))
    }
}

export default connect(state => ({
    sections: state.sections.get('entities').toArray(),
    searchValue: state.sections.get('searchValue'),
    loading: state.sections.get('loading'),
    period: state.periods.allPeriods,
    selectedPeriod: state.periods.periodSelected,
    user: state.user.userData
}),{ ...actionCreators, ...users , loadSectionsResources, loadSectionsResourcesForUser, loadSectionsByParentId })(SectionsTree)
