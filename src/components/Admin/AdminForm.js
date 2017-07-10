import React, {Component}                                from 'react'
import {Form, Select, Button, InputNumber, notification, message} from 'antd'
import {connect}                                         from 'react-redux'
import {updateExtremeValues, loadExtremeValues}          from '../../AC/administration'


const FormItem = Form.Item
const FormInit = Form.create()

class AdminForm extends Component {
    state = {
        extreme: this.props.extreme[0].znachenie
    }
    updateExtremeNumber = (e) => {
        const controlExtremeValue = this.state.extreme == e ? this.state.extreme : e
        return this.setState({extreme: controlExtremeValue})
    }

    uploadExtremeValue = () => {
        const {extreme} = this.state
        const extremeValues = {
            kod: '1',
            znachenie: extreme
        }
        this.props.updateExtremeValues(extremeValues)
        this.setState({extreme: extreme})
        message.success('Коридор цены был изменен, для обновления значений в таблице страница будет перезагружена');
        setTimeout(() =>  location.reload(), 4000)
    }


    render() {
        const {getFieldDecorator} = this.props.form
        const {userInterfaces} = this.props

        return (
            <Form style={{marginBottom: '15px'}} onSubmit={() => {
            }}>
                <FormItem label="Коридор изменения цены, %">
                    <InputNumber
                        min={1}
                        max={100}
                        size="default"
                        defaultValue={this.state.extreme}
                        onChange={this.updateExtremeNumber}
                    />
                    <Button
                        type="primary"
                        style={{float: 'right'}}
                        size="default"
                        onClick={this.uploadExtremeValue}
                    >
                        Сохранить
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

export default connect(state => (   {
    extreme: state.administration.extremeValue,
}), { updateExtremeValues, loadExtremeValues})(FormInit(AdminForm))