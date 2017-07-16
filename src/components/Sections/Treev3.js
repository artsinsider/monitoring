import React, { PureComponent }      from 'react'
import { connect }                   from 'react-redux'
import { Tree, TreeSelect }          from 'antd'
import { loadSectionsByParentId }    from '../../AC/sections'
import { isEmpty }                   from 'ramda'
const TreeNode = Tree.TreeNode

class Treev3 extends PureComponent {
    state = {
        stateSearchValue: ''
    }

    onLoadData = (treeNode) => {
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
