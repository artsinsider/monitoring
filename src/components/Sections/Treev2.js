import React, { Component }      from 'react'
import { connect }               from 'react-redux'
import { Tree, Spin }            from 'antd'
import * as actionCreators       from '../../AC/sections'
import { delay }                 from '../../utils'
import { loadSectionsResources, loadSectionsResourcesForUser } from '../../AC/periodResources'
import {equals, isEmpty, isNil}                 from 'ramda'
import {interfaceSettings}   from  '../../config/InterfaceSettings'
const TreeNode = Tree.TreeNode

class Treev2 extends Component {
    state = {
        stateSearchValue: '',
        sectionHead: [],
        section: [],
        // sectionHead: this.props.sections.filter( sec => sec.roditel == null),
    }

    // componentDidMount = () => {
    //     this.props.loadResourcesBySection()
    // }

    componentDidMount = () => this.props.loadAllSections()

    // shouldComponentUpdate = (nextProps, nextState) => {
    //     return this.props.sections !== nextProps.sections || nextState.sections !== this.state.section
    // }

    // componentWillReceiveProps = (nextProps) => {
    //     const {sections=[],sectionResources=[]} = nextProps
    //     if (equals( sections , this.props.sections )){
    //         return false
    //     }
    //     this.setState({
    //         sectionHead: sections.filter( sec => sec.roditel == null),
    //         section:   sections
    //     })
    //     return true
    // }

    // generateTreeNodes =(treeNode) => {
    //     // const arr = [];
    //     const key = treeNode.props.eventKey;
    //     const childerbNode = this.state.section.filter( node => node.roditel == key)
    //     // for (let i = 0; i < 3; i++) {
    //     //     arr.push({ name: `leaf ${key}-${i}`, key: `${key}-${i}` });
    //     // }
    //
    //     return childerbNode;
    // }

    setLeaf = (treeData, curKey, level) =>  {
        // console.log('setLeaf',treeData, curKey, level)
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
        // console.log('getNewTreeData',treeData, curKey, child, level)
        // const loop = (data) => {
        //     data.forEach((item) => {
        //         if (item.kod == curKey || curKey == item.roditel){
        //             if (item.children) {
        //                 loop(item.children);
        //             } else {
        //                 item.children = child;
        //             }
        //         }
        //         loop(item.children)
        //     });
        // };

        // loop(treeData);
        // this.setLeaf(treeData, curKey, level);
        const ggg  = section.filter( node => node.kod == curKey)
        ggg[0].children = child


        this.setState({ sectionHead: ggg });
    }

    onSelect = (info) => {
        console.log('selected', info);
    }

    onLoadData = (treeNode) => {
    console.log(this.state)
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
        const { loading, sections,sectionHead,  sectionResources=[] } = this.props

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