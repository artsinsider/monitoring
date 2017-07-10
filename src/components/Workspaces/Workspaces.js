import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'antd'
import WorkspacesForm from './WorkspacesForm'
import DynamicFormItem from './DynamicFormItem'
import * as workspaces from '../../AC/workspaces'

class Workspaces extends Component {
       state = {
            visible: false,
            formVisible: false
        }
    componentDidMount() {

    }
    /**
     * Добаляет форму рабочей области
     */
    showForm = () => {
        this.setState({ formVisible: true})
    }

    closeForm = () => {
        this.setState({ formVisible: false })
    }

    showModal = () => {
        this.setState({ visible: true })
    }


    renderForm() {
        const { sections, resources } = this.props
        return (
            <div>
              <WorkspacesForm
                  closeForm={this.closeForm}
                  sections={sections}
                  resources={resources}
              />
            </div>
        )
    }

  render () {
    const { visible, formVisible } = this.state
      const { sections, resources, users, arrIdResours, userKod ,loading, workspaces=[]} = this.props

     /** Свойства модального окна */
    const modalProps = {
      title: 'Управление рабочими областями',
      visible,
      footer: false,
      onCancel: () => {
        this.closeForm()
        this.setState({ visible: false })
      }
    }

    return (
      <span>
        <Button type="primary" onClick={this.showModal}>Рабочие области</Button>
        <Modal {...modalProps}  width="500" >
            <DynamicFormItem
                sections={sections}
                resources={resources}
                createWorkspaces={this.props.createWorkspaces}
                users={users}
                userId={this.props.getUserId}
                resourcesId={this.props.getResourcesId}
                getDatas={this.props.getData}
                arrIdResours={arrIdResours}
                userKod={userKod}
                loading={loading}
                workspaces={workspaces}
            />
        </Modal>
      </span>
    )
  }
}

export default connect(state => ({
  sections: state.sections.get('entities').map(res => res.toJS()).toArray(),
  resources: state.resources.data,
  users: state.workspaces.users,
  userKod: state.workspaces.userId,
  arrIdResours: state.workspaces.dataWorkspaces,
  loading: state.workspaces.load,
  workspaces: state.workspaces.loadWorkspaces
}), { ...workspaces,  })(Workspaces)
