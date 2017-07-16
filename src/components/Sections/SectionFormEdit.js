import React, { Component }              from 'react'
import {Form, Input, Modal} from 'antd'
import {isEmpty}                         from 'ramda'
import Treev3 from './Treev3'

class SectionFormEdit extends Component {
   state = !this.props.active && this.props.isEdit ? {
        kod: this.props.data.kod ,
        nazvanie: this.props.data.nazvanie,
        roditel: this.props.data.roditel,
        udalena: this.props.data.udalena

    } : null

    componentWillReceiveProps() {
       return !this.props.active && !this.props.isEdit ? this.setState({
               kod: this.props.data.kod ,
               nazvanie: this.props.data.nazvanie,
               roditel: this.props.data.roditel,
               udalena: this.props.data.udalena

           }) : null
    }

    savCreateSection = () => {
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
       this.setState({ ...this.state, roditel: sectionId })
    }

    renderNameField = () => {
      const {data, isEdit} = this.props
        const tetsData = data == undefined ? '' : data.nazvanie
        return (
            <Form.Item label="Название раздела" hasFeedback>
                {this.props.form.getFieldDecorator('nazvanie', {
                    rules: [{
                        required: true,
                        message: 'Введите название раздела организации',
                    }],
                    initialValue: !isEdit ? null : tetsData
                })(<Input  onChange={ (e) => {this.setState({ ...this.state, nazvanie: e.target.value }) }} />)}
            </Form.Item>
        )
    }

    renderParentField(sections) {
        const { isEdit, data } = this.props
        const testData = data === undefined ? [] : data
        const nodeParent =  sections.filter( sec => sec.kod == testData.roditel)
        const validNodeParent = isEmpty(nodeParent) ? null : ['' + nodeParent[0]['kod']]
        const sectionsButOne = sections.filter( sec => sec.kod != testData.kod )

        return (
            <Form.Item label={isEdit ? 'Назначить в другой раздел' : "Список разделов"}>
                {this.props.form.getFieldDecorator('roditel', !isEdit ? { initialValue: validNodeParent } :  null  )(
                    <Treev3
                        isSelectable={true}
                        formEditItem={isEdit ? sectionsButOne : null}
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
        title='Редактирование раздела'
        okText='Сохранить'
        onCancel={this.cancel}
        onOk={this.savCreateSection }
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
export default formInit(SectionFormEdit)
