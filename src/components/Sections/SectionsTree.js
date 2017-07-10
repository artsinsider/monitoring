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
//const TreeNode = Tree.TreeNode

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

    // onLoadData = (treeNode) => {
    //     //TBD: Rewrite to check, if sections.key isLeaf is null or false.
    //     // If false => load stuff
    //     // If true => reject
    //     const { sections } = this.props
    //     const key = treeNode.props.eventKey;
    //     return new Promise((resolve, reject) => {
    //         const isAlreadyLoaded = sections.filter(item => (item.roditel === +key))
    //         if (isEmpty(isAlreadyLoaded)) {
    //             this.props.loadSectionsByParentId(key)
    //             resolve();
    //         } else {
    //             reject()
    //         }
    //     });
    // }

    /** TO DO убрал чек боксы -- возможно временно */
        // checkable={userInterfaces.sectionCheckEmployee}
        // checkStrictly

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

    /*renderNestedList(data, parentId) {
        const list = []
        data.forEach(item => {
            const { roditel, kod, nazvanie } = item
            if (roditel === parentId) {
                const children = this.renderNestedList(data, kod)
                const name=  nazvanie == '' ? 'Не назначено' : nazvanie
                list.push(
                    children && children.length
                        ? <TreeNode key={kod} title={name} >{children}</TreeNode>
                        : <TreeNode key={kod} title={name} />
                )
            }
        })
        return list
    } */

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

//checkable -- ÑƒÐ±Ñ€Ð°Ð» Ñ‡ÐµÐ±Ð¾ÐºÑÑ‹
//onDrop={e => this.drag(e)} -- ÑƒÐ±Ñ€Ð°Ð» drag&drop
//   draggable


// drag(info) {
//     const dropKey = info.node.props.eventKey
//     const dragKey = info.dragNode.props.eventKey
//     const section = this.props.sections.filter(section => section.kod === +dragKey)[0].toObject()
//     section.roditel = +dropKey
//     this.props.updateSection(section)
// }