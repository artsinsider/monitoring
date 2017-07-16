import React, { Component }              from 'react'
import {Form, Input, Modal} from 'antd'
import Treev3 from './Treev3'


class SectionFrom extends Component {
    state = {
        kod:  null,
        nazvanie:  '',
        roditel:  null,
        udalena:  false
    }

    saveNewSection = () => {
        this.props.onCreate(this.state)
        this.props.form.resetFields()
        this.setState({state: {}})
    }

    cancel = () => {
        this.setState({
            kod: null,
            nazvanie: '',
            roditel: null,
            udalena: false
        })
        this.props.onCancel()
    }

    selectNode = (sectionId) => {
       this.setState({ roditel: sectionId })
    }

    renderNameField() {
        return (
            <Form.Item label="Название раздела" hasFeedback>
                {this.props.form.getFieldDecorator('nazvanie', {
                    rules: [{
                        required: true,
                        message: 'Введите название раздела организации'
                    }]
                })(<Input  onChange={ (e) => { this.setState({ nazvanie: e.target.value }) }} />)}
            </Form.Item>
        )
    }

    renderParentField(sections) {
        return (
            <Form.Item label="Список разделов">
                {this.props.form.getFieldDecorator('roditel' )(
                    <Treev3
                        isSelectable={true}
                        checkable={false}
                        style={{width: '100%'}}
                        searchPlaceholder="Поиск"
                        treeNodeFilterProp="title"
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="Выберите раздел"
                        allowClear
                        showSearch
                        onSelect={this.selectNode}
                    />
                )}
            </Form.Item>
        )
    }

  render() {
    const { sections, visible } = this.props
    return (
      <Modal
        width={600}
        maskClosable={false}
        visible={visible}
        title='Создание нового раздела'
        okText='Создать'
        onCancel={this.cancel}
        onOk={this.saveNewSection}
      >
        <Form>
          {this.renderNameField()}
          {this.renderParentField(sections)}
        </Form>
      </Modal>
    )
  }
}
const formInit = Form.create()
export default formInit(SectionFrom)

