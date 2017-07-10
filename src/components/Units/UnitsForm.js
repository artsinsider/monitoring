import React, { Component }    from 'react'
import { Form, Input, Button } from 'antd'

class UnitsForm extends Component {

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form layout='inline' style={{marginBottom: '15px'}} onSubmit={this.handleSubmit}>
        <Form.Item hasFeedback>
          {getFieldDecorator('code', {
            rules: [{ required: true, message: 'Укажите аббревиатуру' }],
          })(
            <Input type="text" style={{width: '120px'}} size="default" placeholder="Аббревиатура"/>
          )}
        </Form.Item>
        <Form.Item hasFeedback>
          {getFieldDecorator('nazvanie', {
            rules: [{ required: true, message: 'Укажите наименование' }],
          })(
            <Input type="text"  size="default" placeholder="Полное наименование"/>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" size="default" icon="plus-circle-o" htmlType="submit">
            Добавить
          </Button>
        </Form.Item>
      </Form>
    )
  }

  handleSubmit = e => {
    e.preventDefault()
    const { validateFields, resetFields, setFields } = this.props.form
    const { createUnit, units } = this.props

    validateFields((err, values) => {
      if (!err) {
        if (units.filter(unit => unit.nazvanie === values.nazvanie).length && !values.kod) {
          setFields({
            name: {
              value: values.nazvanie,
              errors: [new Error('Единица измерения с таким названием уже создана')]
            }
          })
          return
        }
        createUnit(values)
        resetFields()
      }
    })
  }
}

export default Form.create()(UnitsForm)
