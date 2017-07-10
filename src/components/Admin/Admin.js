import React, { Component } from 'react'
import { Modal, Button }    from 'antd'
import Units                from '../Units'
import AdminForm            from './AdminForm'

class Admin extends Component {

  state = {
    visible: false
  }

  render () {
    const { visible } = this.state
    const modalProps = {
      title: 'Администрирование',
      visible,
      footer: false,
      onCancel: () => {
        this.setState({ visible: false })
      },
      width: 600
    }

    return (
      <span style={{marginRight: '10px'}}>
        <Button type="primary" onClick={this.showModal}>Администрирование</Button>
        <Modal {...modalProps}>
          { visible ? this.renderModalBody() : null }
        </Modal>
      </span>
    )
  }

  showModal = () => {
    this.setState({ visible: true })
  }

  renderModalBody() {
    const {userInterfaces } = this.props
    return (
      <div>
          <AdminForm userInterfaces={userInterfaces}  />
          <Units/>
      </div>
    )
  }
}

export default Admin
