import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Button }           from 'antd'
import NewResourceForm      from './NewResourceForm'
import ListNewResources     from './ListNewResources'
import * as resources       from '../../AC/resources'
import { isNil }            from 'ramda'
import './styles.css'

class ListActionsAnResources extends Component {
    state = {
        visible: false,
        edit: false,
        visibleEdit: false
    }

    render() {
        const {resourceTypes,
            organization,
            sections,
            measure,
            resourcesFoolStatus,
            resourcesStatusAction,
            newResources=[],
            visibleModal,
            editingResources=[],
            tsnFind,
            resourcesId
        } = this.props

        return (
            <div className="block" >
                 <NewResourceForm
                     btnText="Создание ресурса"
                     btnType="primary"
                     btnIcon="file"
                     measure={measure}
                     sections={sections}
                     organization={organization}
                     resourceTypes={resourceTypes}
                     resourcesFoolStatus={resourcesFoolStatus}
                     resourcesStatusAction={resourcesStatusAction}
                     createResources={this.props.createResources}
                     findTsn={this.props.findTsn}
                     tsnFind={tsnFind}
                 />
                 
                  <Button
                    className='btn-resource-edit'
                    key='edit'
                    type="primary"
                    icon="edit"
                    disabled={isNil(resourcesId)}
                    onClick={() => this.props.openUpdateResources(resourcesId)}>Редактировать ресурс</Button>

                 <ListNewResources
                    resources={newResources}
                    editingResources={editingResources}
                    resourcesFoolStatus={resourcesFoolStatus}
                    resourcesStatusAction={resourcesStatusAction}
                    openUpdateResources={this.props.openUpdateResources}
                    openDeleteResources={this.props.openDeleteResources}
                    chengeStatusResources={this.props.chengeStatusResources}
                    visibleModal={visibleModal}
                  />
            </div>
        )
    }

    saveFormRef = form => this.form = form

    showFormCreate = e => {
        this.setState({
            visible: true,
            edit: false
        })
    }

    showFormEdit = e => {
        this.setState({
            visibleEdit: true,
            edit: true,
        })
    }

    closeForm = () => {
        this.setState({
            visible: false,
        }, () => this.form.resetFields())
    }

    closeFormEdit = () => {
        this.setState({
            visibleEdit: false
        }, () => this.form.resetFields())
    }

    handleSubmit = (section) => {
        const form = this.form
        form.validateFields((err, values) => {
            if (!err) {
                return;
            }
            form.resetFields();
            this.setState({ visible: false});
            this.props.createSection(section)
        });
    }

    handleSubmitEdit = (section) => {
        // const form = this.form
        // form.validateFields((err, values) => {
        //     if (!err) {
        //         return;
        //     }
        //     form.resetFields();
        //
        // });
        this.setState({ visibleEdit: false});
        this.props.updateSection(section)
    }
}

export default connect(state =>({
        resourceTypes: state.resourceTypes.resourceTypes,
        resourcesFoolStatus: state.resources.resourcesFoolStatus,
        resourcesStatusAction: state.resources.resourcesStatusAction,
        organization: state.periodResources.organization,
        sections: state.sections.get('entities').toArray(),
        measure: state.resourceTypes.measure,
        newResources: state.resources.newResources,
        editingResources: state.resources.editingResources,
        loading: state.resources.loading,
        visibleModal: state.resources.visibleModal,
        resourcesData: state.resources.resourcesData,
        tsnFind: state.resources.findTsn,
        resourcesId: state.resources.resourcesId
}) , { ...resources })(ListActionsAnResources)