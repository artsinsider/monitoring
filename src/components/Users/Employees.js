import React, { PureComponent }                                      from 'react'
import { connect }                                                   from 'react-redux'
import { Button, Menu, Dropdown, Icon, Modal, Spin, Tree, Row, Col } from 'antd';
import { employeeAddSections, getCountForUser }                                       from '../../AC/users'
import { isNil, isEmpty, uniq }                                      from 'ramda'
import { loadSectionsByUserId, loadSectionsByParentId }              from '../../AC/sections'
import './employee.css'

const TreeNode = Tree.TreeNode
class Employees extends PureComponent {
    state = {
        visible: false,
        userData: {},
        visibleModal: false,
        colorList: [
            '#FF6347',
            '#CD5C5C',
            '#3CB371',
            '#1E90FF',
            '#6A5ACD',
            '#696969',
            '#008080',
            '#A0522D',
            '#A52A2A',
            '#483D8B'
        ],
        sheckNode:[],
    }
    componentDidMount() {
        const { users } = this.props
        const userListLen = users.length
        for (let kod = 0; kod < userListLen; kod++) {
            this.props.getCountForUser(users[kod].kod)
        }
    }


    saveUsersInResource = (userId, flag) => {
        const { sheckNode } = this.state
        const resKodLen = sheckNode.length;
        for (let kod = 0; kod < resKodLen; kod++) {
            this.props.employeeAddSections(sheckNode[kod], flag ==='EMPTY' ? 'EMPTY' :  userId)
            // resKodLen === kod + 1 ? this.setState({sheckNode: []}) : this.setState({...this.state})
        }
    }

    selectedNode = (e) => {
        console.log('e', e)
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
        const { rows,  users, sectionsUser  } = this.props
        const list = []
        const dropDown = (name, sotrudnik, id, count) => {
            const us = this.state.users.filter( r => r.kod == sotrudnik)[0]
            // const count = rows.filter(resurs => resurs.razdel.razdel== id || resurs.razdel.roditel == id).length
            return <div>
                {!isNil(us) ?
                    <span style={{ background: us.color }} className="small-badge-employee">{us.familiya[0]}{us.imya[0]}</span>
                    :
                    <span className="small-badge-employee" style={{background: 'grey'}}>НН</span>}
                {name} <sup className="sup-section" > {count}</sup>
            </div>
        }
        data.forEach(item => {
            const { roditel, kod, nazvanie, isLeaf, sotrudnik, count_resources } = item
            if (roditel === parentId) {
                const children = this.renderNestedList(data, kod)
                list.push(
                    children && children.length
                        ? <TreeNode value={''+kod} key={kod} title={ dropDown(nazvanie, sotrudnik, kod, count_resources) } isLeaf={isLeaf}>{children}</TreeNode>
                        : <TreeNode value={''+kod} key={kod} title={ dropDown(nazvanie, sotrudnik, kod, count_resources) } isLeaf={isLeaf} />
                )
            }
        })
        return list
    }
    // <span style={{opacity: 0.3}}> ---- </span>

    showModal = () => {
        this.props.users.forEach( (user, i) =>  user.color = this.state.colorList[i] )
        this.setState({ visibleModal: true , users: this.props.users})
    }
    closeModal = () => this.setState({ visibleModal: false })

    render() {
        const {sections, loading, users} = this.props
        const {visibleModal} = this.state
        const modalProps = {
            visible: this.state.visibleModal,
            onOk: this.closeModal,
            onCancel: this.closeModal,
            title: `Форма назначения ресурсам сотрудников`,
            wrapClassName: 'modal-user-card',
            footer: false
        }
        const count = 0;


        return (
            <div className="employee" >
                <Button type="primary" onClick={this.showModal} >Сотрудники</Button>
                <Modal { ...modalProps } width={window.innerWidth < 1024 ? window.innerWidth - 100: window.innerWidth - 700}>
                    <div className='users-data'>
                        <Spin spinning={loading} style={{ marginTop: 20 }} tip="Обновление данных по разделам сотрудника...">
                            {!visibleModal ? null :
                            <Row gutter={40}>
                                <Col span={16}  style={{borderRight : '1px solid #d4d4d4'}}>
                                    <div style={{ marginBottom: 20}}  >
                                        <Tree
                                            checkable={true}
                                            onCheck= { (keys) => this.setState({sheckNode: keys.checked})}
                                            loadData={this.onLoadData}
                                            defaultExpandAll={true}
                                            checkStrictly
                                            autoExpandParent={true}
                                            defaultExpandedKeys={['null']}
                                            onSelect={this.selectedNode}
                                        >
                                            {this.renderNestedList(sections, null)}
                                        </Tree>
                                    </div>
                                </Col>
                                <Col span={4} >
                                    <div className="list">
                                        <div style={{marginTop: 5}}><span className="badge-employee" style={{background: 'grey'}}>НН</span> НН - не назначенные разделы</div>
                                        {this.state.users.map( u => <div className="list-employee" key={u.kod}>
                                            <span style={{ background: u.color }} className="badge-employee">{`${u.familiya[0]}${u.imya[0]}`}</span>
                                            {`${u.familiya} ${u.imya}. ${u.otchestvo}.`}  <sup className="sup-section" >
                                            {  users.filter( us => us.kod == u.kod )[0].count }
                                            </sup> &nbsp;&nbsp;
                                            <Button size="small" shape="circle" icon="plus" onClick={() => this.saveUsersInResource(u.kod, false)}  />&nbsp;&nbsp;
                                            <Button size="small" shape="circle" icon="minus" onClick={() => this.saveUsersInResource(u.kod, 'EMPTY')} />
                                        </div>)}
                                    </div>
                                </Col>
                            </Row> }
                        </Spin>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(state => ({
    rows: state.periodResources.data,
    users: state.user.users,

    sectionsUser: state.sections.get('entitiesUser').toArray(),
    loadingUserCard: state.sections.loadingUserCard,

    sections: state.sections.get('entities').toArray(),
    loading: state.sections.get('loading'),
}), { employeeAddSections, loadSectionsByUserId, loadSectionsByParentId, getCountForUser })(Employees)


// <Icon style={{ color: '#216ae9' }} type="plus-circle-o" onClick={() => this.selectedUser(u.kod, false)}  />&nbsp;&nbsp;
// <Icon style={{ color: '#e94851' }} type="minus-circle-o" onClick={() => this.selectedUser(u.kod, 'EMPTY')}  />
