import React, { Component }     from 'react'
import { connect }              from 'react-redux'
import { Modal, Button }        from 'antd'
import SectionForm              from './SectionForm'
import SectionFormEdit          from './SectionFormEdit'
import * as sections            from '../../AC/sections'
import { isNil }                from 'ramda'
const confirm = Modal.confirm

class SectionControls extends Component {
  state = {
    visible: false,
    edit: false,
    visibleEdit: false
  }

  render() {
    const { sections, activeSection, resourceTypes} = this.props
    const activeNodeEdit = isNil(activeSection)
    const { visible, edit, visibleEdit } = this.state
    return (
        <span style={{marginRight: '10px'}}>

            <Button icon="folder-add" type="primary" onClick={this.showFormCreate}> Создать раздел </Button>&emsp;
            <Button disabled={!activeSection} icon="edit" type="primary" onClick={this.showFormEdit}> Редактировать </Button>&emsp;
            <Button disabled={!activeSection} icon="delete" onClick={this.showConfirm(activeSection)} type="danger"> Удалить </Button>

          <SectionForm
            sections={sections}
            ref={this.saveFormRef}
            data={activeSection}
            activeSection={activeSection}
            visible={visible}
            resourceTypes={resourceTypes}
            onCancel={this.closeForm}
            onCreate={this.handleSubmit}
        />

          <SectionFormEdit
              sections={sections}
              ref={this.saveFormRef}
              data={activeSection}
              activeSection={activeSection}
              visible={visibleEdit}
              resourceTypes={resourceTypes}
              isEdit={edit}
              onCancel={this.closeFormEdit}
              onCreate={this.handleSubmitEdit}
              active={activeNodeEdit}
          />
        </span>
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
      edit: false
    }, () => this.form.resetFields())
  }

    closeFormEdit = () => {
        this.setState({
            visibleEdit: false,
            edit: false
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
        this.setState({ visibleEdit: false});
        this.props.updateSection(section)
    }

  showConfirm = section => () => {
    const { deleteSection } = this.props
    confirm({
      title: 'Удаление раздела',
      content: `Вы действительно хотите удалить раздел "${section.nazvanie}"?`,
      onOk() {
        deleteSection(section)
      },
        onCancel() { console.info(`Undelete a section , id: ${section.kod}`) }
    })
  }

}
export default connect(state => {
  const activeSectionId = state.sections.get('activeSectionId')
  return {
    sections: state.sections.get('entities').toArray().sort(),
    activeSectionId,
    activeSection: state.sections.getIn(['entities', activeSectionId]),
    resourceTypes: state.resourceTypes.resourceTypes
  }
}, { ...sections })(SectionControls)
