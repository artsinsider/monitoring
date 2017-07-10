import React, { PureComponent }                           from 'react'
import { connect }                                    from 'react-redux'
import { Button, Menu, Dropdown, Icon, Badge, Modal, Spin, Tree } from 'antd';
import { employeeAddSections }                        from '../../AC/users'
import { isNil, isEmpty }                                      from 'ramda'
import {unUser}                                       from './fakeUser'
import { loadSectionsByUserId }                     from '../../AC/sections'

const TreeNode = Tree.TreeNode
class Users extends PureComponent {
    state = {
        visible: false,
        userData: {},
        visibleModal: false
    }

    saveUsersInResource = () => { debugger;
        const { idSection } = this.props
        const resKodLen = idSection.length;
        for (let kod = 0; kod < resKodLen; kod++) {
            this.props.employeeAddSections(idSection[kod], this.state.userId)
            resKodLen === kod + 1 ? this.setState({visible: false}) : this.setState({...this.state})
        }
    }

    selectedUser = (e)=> {
        const { users } = this.props
        const userSelected = users.filter( user => e.key == user.kod )[0]
        this.setState({visible: true, userId: userSelected.kod, userData: userSelected })
        //
    }

    showModal = () => { this.setState({ visibleModal: true }) }

    closeModal = () => {
        // this.props.form.resetFields()
        this.setState({ visibleModal: false })
    }

    getSectionByUserId = (id) => {
        const { periodSelected }= this.props
        this.props.loadSectionsByUserId(id, periodSelected.tip_resursov.kod)
        this.showModal()
    }

    renderNestedList(data, parentId) {
        const list = []
        data.forEach(item => {
            const { roditel, kod, nazvanie } = item
            if (roditel === parentId) {
                const children = this.renderNestedList(data, kod)
                const name=  nazvanie == '' ? 'Не отпределено' : nazvanie
                list.push(
                    children && children.length
                        ? <TreeNode key={kod} title={name}>{children}</TreeNode>
                        : <TreeNode key={kod} title={name} />
                )
            }
        })
        return list
    }

    render() {
        const { users, disables, rows , sectionsUser, loadingUserCard} = this.props
        const {userData, visibleModal} = this.state
        const modalProps = {
            visible: this.state.visibleModal,
            onOk: this.closeModal,
            onCancel: this.closeModal,
            title: `Разделы для сотрудника ${isEmpty(userData) ? '' : `${userData.familiya} ${userData.imya[0]}. ${userData.otchestvo[0]}.`}`,
            wrapClassName: 'modal-user-card',
            footer: false
    }

        const menu = (
            <Menu onClick={this.selectedUser}>
                { users.map((user, i) =>
                    <Menu.Item key={user.kod}>
                        {`${user.familiya} ${user.imya[0]}. ${user.otchestvo[0]}.`} &emsp;
                        <Badge count={ rows.filter( resources => user.kod == resources.sotrudnik.idUser).length } overflowCount={99999} style={{ backgroundColor: '#87d068' }} />
                        <Icon onClick={() => this.getSectionByUserId(user.kod)} className="user-list-resources-by-sections" type="idcard" />
                    </Menu.Item>)}
            </Menu>
        );

        return (
            <div className='users-data' style={{display: 'inline', width: '160px', marginLeft: '10px'}}>
                <Dropdown overlay={menu}>
                    <Button type="primary"> Сотрудники <Icon type="down" /> </Button>
                </Dropdown>
                { this.state.visible ?
                    <div className="save-add-user" >
                        <Button type="primary" disabled={!disables} onClick={() => this.saveUsersInResource()}>
                            Сохранить
                        </Button>&emsp;
                        <div className="information-line">
                            {`${this.state.userData.familiya} ${this.state.userData.imya[0]}. ${this.state.userData.otchestvo[0]}. `}
                        </div>&emsp;
                        <Button type="primary" onClick={() => this.setState({visible: false})}>
                            Отмена
                        </Button>
                    </div>
                    : null }

                    <Modal { ...modalProps } height={window.innerHeight - 200}  width="800px">
                        {isEmpty(sectionsUser) && !loadingUserCard ? <p className="full-description">Данному сотруднику не назначен ни один раздел</p> : null }
                        <Spin spinning={loadingUserCard} style={{ marginTop: 20 }} tip="Обновление данных по разделам сотрудника...">
                            {!visibleModal ? null : <Tree
                                defaultExpandAll={true}
                                checkStrictly
                                autoExpandParent={true}
                                defaultExpandedKeys={['null']}
                                onCheck= { (keys, e) => this.checkedNode(keys, e)}
                                onSelect={ keys => this.selectNode(keys)}
                            >
                                {this.renderNestedList(sectionsUser, null)}
                            </Tree>}
                        </Spin>
                    </Modal>
            </div>
        )
    }
}

export default connect(state => ({
    rows: state.periodResources.data,
    users: state.user.users,
    idSection: state.user.idSection,
    disables: state.user.disables,
    periodSelected: state.periods.periodSelected,
    sectionsUser: state.sections.get('entitiesUser').toArray(),
    loadingUserCard: state.sections.loadingUserCard,
}), { employeeAddSections, loadSectionsByUserId })(Users)
