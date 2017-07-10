import React, { PureComponent }      from 'react'
import { connect }               from 'react-redux'
import { Tree, TreeSelect, Badge}            from 'antd'
import * as actionCreators       from '../../AC/sections'
import * as users                  from '../../AC/users'
import { delay }                 from '../../utils'
import { loadSectionsResources, loadSectionsResourcesForUser } from '../../AC/periodResources'
import { loadSectionsByParentId } from '../../AC/sections'
import {equals, isEmpty, isNil}  from 'ramda'
import {interfaceSettings}       from  '../../config/InterfaceSettings'
const TreeNode = Tree.TreeNode

class Treev3 extends PureComponent {
    state = {
        stateSearchValue: ''
    }

    onLoadData = (treeNode) => {
        //TBD: Rewrite to check, if sections.key isLeaf is null or false.
        // If false => load stuff
        // If true => reject
        const { sections } = this.props
        const key = treeNode.props.eventKey;
        return new Promise((resolve, reject) => {
            const isAlreadyLoaded = sections.filter(item => (item.roditel === key))
            if (isEmpty(isAlreadyLoaded)) {
                this.props.loadSectionsByParentId(key)
                resolve();
            } else {
                reject()
            }
        });
    }

    renderNestedList = (data, parentId) => {
        const { rows } = this.props
        const list = []
        data.forEach(item => {
        const { roditel, kod, nazvanie, isLeaf } = item
        if (roditel === parentId) {
            // const countRes = (id, name) => {
            //     const count = rows.filter(resurs => resurs.razdel.razdel== id || resurs.razdel.roditel == id).length
            //     return isEmpty(rows) ? name : <div><Badge overflowCount={99999} count={count} style={{ backgroundColor: '#87d068' }} /> {name}</div>
            // }
            const children = this.renderNestedList(data, kod)
            list.push(
                children && children.length
                ? <TreeNode value={''+kod} key={kod} title={nazvanie} isLeaf={isLeaf}>{children}</TreeNode>
                : <TreeNode value={''+kod} key={kod} title={nazvanie} isLeaf={isLeaf} />
            )
        }
        })
        return list
    }

    render() {
    const { sections, formEditItem, isSelectable } = this.props
    const props = this.props
    if (isSelectable) {
        return (
            <TreeSelect loadData={this.onLoadData}  {...props} >
                {formEditItem
                ? this.renderNestedList(formEditItem, null)
                : this.renderNestedList(sections, null)}
            </TreeSelect>
        )
    } else {
        return (
            <Tree  loadData={this.onLoadData} {...props}>
                {this.renderNestedList(sections, null)}
            </Tree>
        )}
    }
}

export default connect(state => ({
        sections: state.sections.get('entities').toArray(),
        rows: state.periodResources.data
}),{loadSectionsByParentId})(Treev3)
