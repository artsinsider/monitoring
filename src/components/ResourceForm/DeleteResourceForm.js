import React, { Component } from 'react'
import { Form, Modal}       from 'antd'
import { connect }          from 'react-redux'
import * as resources       from '../../AC/resources'

const Item = Form.Item
const confirm = Modal.confirm

class DeleteResourceForm extends Component {
    showConfirm = () => {
        const { deleteResourcesData, deleteResources, closeDeleteResources, visibleModalDelete } = this.props
        const content = <div style={{color: '#4d4d4d', fontSize: 15, paddingTop: 10, paddingLeft: 10}}>
                            Вы действительно хотите удалить ресурс:
                            <p style={{color: '#108ee9'}}>{deleteResourcesData.nazvanie}</p>
                        </div>;
        const title = <div style={{color: '#4d4d4d', fontSize: 17}}> Удаление ресурса </div>
        confirm({
            title: title,
            content: content,
            visible: {visibleModalDelete},
            iconType: "close-circle",
            width: 500,
            onOk() {  deleteResources(deleteResourcesData)
                      closeDeleteResources()
                    },
            onCancel() { closeDeleteResources() }
        })
    }

    render() {
        const { visibleModalDelete } = this.props
        return (
            <span className="delete-resources-dialog">
                {visibleModalDelete ? (this.showConfirm)() : null}
            </span>

        )
    }
}

const formInit = Form.create()

export default connect(state =>({
    visibleModalDelete: state.resources.visibleModalDelete,
    deleteResourcesData: state.resources.deleteResourcesData,
}) , { ...resources })(formInit(DeleteResourceForm))