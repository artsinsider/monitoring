import React, { Component }                    from 'react'
import { Table, Button, Modal, Icon, Select, } from 'antd'

export default class ListNewResources extends Component {
    state =  {
        visible: false,
        activUpdate: true,
        columnsNew:[
            {
                title: 'ТСН',
                dataIndex: 'kod_tsn',
                key: 'kod_tsn',
                width: 70
            },{
                title: 'Название',
                dataIndex: 'nazvanie',
                key: 'nazvanie',
                width: 180
            },{
                title: 'Код ОКП',
                dataIndex: 'kod_okp',
                key: 'kod_okp',
                width: 90
            },{
                title: 'Код ОКПД 2',
                dataIndex: 'kod_okpd2',
                key: 'kod_okpd2',
                width: 90
            },{
                title: 'Масса гросс',
                dataIndex: 'massa_gross',
                key: 'massa_gross',
                width: 85
            },{
                title: 'Масса нетто',
                dataIndex: 'massa_netto',
                key: 'massa_netto',
                width: 85
            },{
                title: 'Удал.',
                dataIndex: 'delete',
                key: 'delete',
                render: (text, record, index) =>  <Icon
                    style={{color: 'red'}}
                    className="editable-cell-icon-check"
                    type='delete'
                    onClick={() => this.props.openDeleteResources(record)}
                />,
                width: 50
            },{
                title: 'Статус',
                dataIndex: 'changeStatus',
                key: 'changeStatus',
                width: 115,
                render: (status, record, index) => (
                    <Select style={{ width: '100%' }}
                            key={index}
                            defaultValue={record.status.nazvanie}
                            name={record.status.kod}
                            onChange={(el) => this.props.chengeStatusResources(record.kod, this.props.resourcesFoolStatus.filter(status => status.kod == el)[0] )}>
                    {this.props.resourcesFoolStatus.map((status, index) =>
                        <Select.Option
                            key={status.kod}
                            value={'' + status.kod}
                        >
                            {status.nazvanie}
                        </Select.Option>)}
                    </Select>),
            }
        ],


        columnsEdit: [
            {
                title: 'ТСН',
                dataIndex: 'kod_tsn',
                key: 'kod_tsn',
                width: 70
            },{
                title: 'Название',
                dataIndex: 'nazvanie',
                key: 'nazvanie',
                width: 200
            },{
                title: 'Код ОКП',
                    dataIndex: 'kod_okp',
                    key: 'kod_okp',
                    width: 90
            },{
                title: 'Код ОКПД 2',
                    dataIndex: 'kod_okpd2',
                    key: 'kod_okpd2',
                    width: 90
            },{
                title: 'Масса гросс',
                    dataIndex: 'massa_gross',
                    key: 'massa_gross',
                    width: 85
            },{
                title: 'Масса нетто',
                    dataIndex: 'massa_netto',
                    key: 'massa_netto',
                    width: 85
            },{
                title: 'Ред.',
                    dataIndex: 'update',
                    key: 'update',
                    render: (text, record, index) =>  <Icon
                        key={index}
                        style={{color: '#49a9ee'}}
                        className="editable-cell-icon-check"
                        type='edit'
                        onClick={() => this.props.openUpdateResources(record)}
                     />,
                    width: 50
            },{
                title: 'Статус',
                dataIndex: 'changeStatus',
                key: 'changeStatus',
                width: 115,
                render: (status, record, index) => (
                    <Select style={{ width: '100%' }}
                            key={index}
                            defaultValue={record.status.nazvanie}
                            name={record.status.kod}
                            onChange={(el) => this.props.chengeStatusResources(record.kod, this.props.resourcesFoolStatus.filter(status => status.kod == el)[0] )}>
                        {this.props.resourcesFoolStatus.map((status, index) =>
                            <Select.Option
                                key={status.kod}
                                value={'' + status.kod}
                            >
                                {status.nazvanie}
                            </Select.Option>)}
                    </Select>),
            }
        ]

    }

    showModal = e => this.setState({ visible: true })

    closeModal = e => {
        this.setState({ visible: false })
    }

    selectedColumn = (type) => {
        this.setState({ type: type})
        this.showModal()
    }

    render() {
        const {resources=[] , resourcesFoolStatus, editingResources} = this.props
        const calculateWidthTable = window.innerWidth - 500

        const modalProps = {
            title: this.state.type === 'columnsNew' ? 'Список новых ресурсов' : 'Список ресурсов на редактировании',
            visible: this.state.visible ,
            onOk: this.closeModal,
            onCancel: this.closeModal,
            okText: 'Закрыть',
            confirmLoading: false,
            maskClosable: false,
            cancelText: 'Отмена',
            width: calculateWidthTable,

        }

        const dataNew = []
        resources.forEach(resours => dataNew.push({
             ...resours,
            key: resours.kod,
            mera: resours.mera,
            tip_resursa: resours.tip_resursa,
            status_deistviya: resours.status_deistviya,
            status: resours.status,
            razdel: resours.razdel,
        }))

        const dataEdit = []
        editingResources.forEach(resours => dataEdit.push({
            ...resours,
            key: resours.kod,
            mera: resours.mera,
            tip_resursa: resours.tip_resursa,
            status_deistviya: resours.status_deistviya,
            status: resours.status,
            razdel: resours.razdel,

        }))

        return(
                <span className="service-btn">
                    <Button style={{marginLeft: '10px'}} key='new' type="primary" icon="database" onClick={() => this.selectedColumn('columnsNew')}> Список новых ресурсов </Button>	&#8194;
                    <Button key='edit' type="primary" icon="layout" onClick={() => this.selectedColumn('columnsEdit')}> Список ресурсов на редактировании </Button>

                    <Modal key="update" { ...modalProps }>
                        <Table
                            className="table"
                            bordered
                            size="small"
                            dataSource={this.state.type === 'columnsNew' ? dataNew : dataEdit}
                            columns={this.state.type === 'columnsNew' ? this.state.columnsNew : this.state.columnsEdit}
                        />

                    </Modal>
                </span>
        )
    }
}


// TO DO  до востребованности

// {
//     title: 'Удал.',
//         dataIndex: 'delete',
//     key: 'delete',
//     render: (text, record, index) =>  <Icon
//     style={{color: 'red'}}
//     className="editable-cell-icon-check"
//     type='delete'
//     onClick={() => this.props.openDeleteResources(record)}
//
// />,
//     width: 50
// },