import React, { Component }      from 'react'
import { connect }               from 'react-redux'
import { Tree }            from 'antd'
import * as actionCreators       from '../../AC/sections'
import { loadSectionsResources, loadSectionsResourcesForUser } from '../../AC/periodResources'
import { isEmpty }                 from 'ramda'
const TreeNode = Tree.TreeNode

class Treev2 extends Component {
    state = {
        stateSearchValue: '',
        sectionHead: [],
        section: []
    }

    componentDidMount = () => this.props.loadAllSections()

    setLeaf = (treeData, curKey, level) =>  {
        const loopLeaf = (data, lev) => {
            const l = lev - 1;
            data.forEach((item) => {
                if (((''+item.kod).length > curKey.length) ? item.key.indexOf(curKey) !== 0 :
                        curKey.indexOf(''+item.kod) !== 0) {
                    return;
                }
                if (item.children) {
                    loopLeaf(item.children, l);
                } else if (l < 1) {
                    item.isLeaf = true;
                }
            });
        };
        loopLeaf(treeData, level + 1);
        this.setState({ sectionHead: treeData });
    }

    getNewTreeData = (treeData, curKey, child, section) => {
        const ggg  = section.filter( node => node.kod == curKey)
        ggg[0].children = child
        this.setState({ sectionHead: ggg });
    }

    onLoadData = (treeNode) => {
        const key = treeNode.props.eventKey;
        const childerbNode = this.props.sections.filter( node => node.roditel == key)
        this.setState({isLeaf : !isEmpty(childerbNode), sectionHead: this.props.sectionHead})
        return new Promise((resolve) => {
            const sectionHeads = isEmpty(this.state.sectionHead) ? this.props.sectionHead : [...this.state.sectionHead];
            this.getNewTreeData(sectionHeads, key, childerbNode, this.props.sections);
            resolve();
        });
    }


    render() {
        const { sectionHead } = this.props

        const loop = data => data.map((item) => {
            if (item.children) {
                return <TreeNode title={item.nazvanie} key={item.kod} isLeaf={this.state.isLeaf} >{loop(item.children)}</TreeNode>;
            }
            return <TreeNode title={item.nazvanie} key={item.kod}  />;
        });
        const treeNodes = loop(sectionHead);

        return (
            <Tree onSelect={this.onSelect} loadData={this.onLoadData} onExpand={(idNode, node) => this.setState({id: node.node.props.eventKey, expanded: node.expanded})} >
                {treeNodes}
            </Tree>

        )
    }
}

export default connect(state => ({
    sections: state.sections.get('entities').toArray(),
    sectionHead: state.sections.get('entities').toArray().filter( sec => sec.roditel == null),
    searchValue: state.sections.get('searchValue'),
    loading: state.sections.get('loading'),
    period: state.periods.allPeriods,
    selectedPeriod: state.periods.periodSelected,
    user: state.user.userData
}),{ ...actionCreators , loadSectionsResources, loadSectionsResourcesForUser })(Treev2)