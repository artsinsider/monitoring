import React, { PureComponent }                                                  from 'react'
import { connect }                                                               from 'react-redux'
import { Form, Modal, Button, Input, Select, DatePicker, Alert, Spin, Row, Col } from 'antd'
import moment                                                                    from 'moment'
import { isEmpty }                                                               from 'ramda'
import {changePeriod, addNewPeriod}                                              from  '../../AC/periods'
import {changeCalculationMethod}                                                 from '../../AC/reports'
import EditableTable                                                             from './EditableTable'
import './styles.css'

const { RangePicker } = DatePicker
const Option = Select.Option
const Item = Form.Item
const dateFormat = 'DD.MM.YYYY'


class PeriodsForm extends PureComponent {
    state = {
        visible: false,
        inputs: {
            name: '',
            rangeDate: [],
            currentStatus: '',
            currentResourceType: null
        },
        periodChoosed: null
    }

    selectedStatusIdPeriod = (idPeriod) => {
        const {periodStatuses} = this.props
        const nameStatus = periodStatuses.filter( status => { return status.kod == idPeriod})[0]
        this.setState({ inputs: {...this.state.inputs, currentStatus: nameStatus } })
    }

    selectedResoursesType = (idType) => {
        const {resourceTypes} = this.props
        const nameStatus = resourceTypes.filter( status => { return status.kod == idType})[0]
        this.setState({ inputs: {...this.state.inputs, currentResourceType: nameStatus } })
    }

    availableType = (periods) => {
        const { resourceTypes = [] } = this.props
        return  periods.filter( period =>
                    (period.tip_resursov.kod == 5 || period.tip_resursov.kod == 4) && period.status.kod != 3 && period.status.kod != 2)
                    .length === 0 ? resourceTypes : resourceTypes.filter(type => type.kod == periods[0].tip_resursov.kod)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { userInterfaces } = this.props
        const modalProps = {
            title: 'Управление периодами',
            visible: this.state.visible,
            onOk: this.handleSubmit,
            onCancel: this.closeModal,
            footer: false
        }
        const buttonProps = {
            type: this.props.btnType,
            onClick: this.showModal,
            style: {
              marginRight: '10px'
            }
        }
        const { periodStatuses, periods = [], loading, methodCalculation=[], methodActive, testPeriodsOpen } = this.props
        return (
            <span >
                <Button { ...buttonProps }>{this.props.btnText}</Button>
                <Modal { ...modalProps } width="950px">
                  <div className="modal-period-form" >
                      <Spin spinning={loading} tip="Обновление данных по периодам...">
                        {userInterfaces.interface.unist ?
                        <Form >
                            { testPeriodsOpen ?
                            <div className="block-add">
                                <Row gutter={40}>
                                    <Col span={8} >
                                        <Item label="Метод расчета">
                                            {getFieldDecorator('method', {
                                                initialValue: methodActive== undefined ? '' : methodActive.opisanie
                                            })(
                                                <Select  className="field" onChange={this.selectedMethodCalculation} >
                                                    { methodCalculation.map( method => {return <Select.Option key={method.kod} value={'' + method.kod} >{method.opisanie}</Select.Option>} ) }
                                                </Select>
                                            )}
                                        </Item>
                                        <Item label="Наименование">
                                            {getFieldDecorator('name', {
                                                //rules: [{ required: true, message: 'Введите название периода' }]
                                            })(
                                                <Input
                                                    className="field"
                                                    onChange={e => this.setState({
                                                        inputs: {
                                                            ...this.state.inputs,
                                                            name: e.target.value
                                                        }
                                                    })}
                                                />
                                            )}
                                        </Item>
                                    </Col>
                                    <Col span={8} >
                                        <Item label="Продолжительность периода">
                                            {getFieldDecorator('rangeDate', {
                                                //rules: [{ required: true, message: 'Выберите период' }]
                                            })(
                                                <RangePicker
                                                    className="field"
                                                    format={dateFormat}
                                                    onChange={(momentArr, dateArr) => this.setState({
                                                        inputs: {
                                                            ...this.state.inputs,
                                                            rangeDate: dateArr
                                                        }
                                                    })}
                                                />
                                            )}
                                        </Item>
                                        <Item label="Статус">
                                            {getFieldDecorator('status', {
                                                //rules: [{  required: true,  message: 'Выберите статус' }]
                                            })(
                                                <Select
                                                    className="field"
                                                    onChange={this.selectedStatusIdPeriod}
                                                >
                                                    {periodStatuses.map(status => <Option key={status.kod} value={'' + status.kod}>{status.nazvanie}</Option>)}
                                                </Select>
                                            )}
                                        </Item>
                                    </Col>
                                    <Col span={8} >
                                        <Item label="Тип ресурса">
                                            {getFieldDecorator('resourceType', {
                                                //rules: [{ required: true, message: 'Выберите тип ресурса' }]
                                                //initialValue: isEmpty(testDataType)? '' : ''+ testDataType[0].nazvanie
                                            })(
                                                <Select
                                                    className="field"
                                                    onChange={this.selectedResoursesType}
                                                >
                                                    {this.availableType(periods).map(resource => <Option
                                                        key={resource.kod}>{resource.nazvanie}</Option>)}
                                                </Select>
                                            )}
                                        </Item>
                                    </Col>
                                </Row>
                                <div className="add">
                                    <Button type="primary" icon="plus" onClick={this.handleOnAddPeriod}>Создать период</Button>
                                </div>
                            </div>
                            :
                                <Alert
                                    style={{marginTop: 10, fontSize: 19}}
                                    description="Создание нового периода будет доступно, если по одному из типов ресурсов будут закрыты все периоды"
                                    type="info"
                                    showIcon
                                />
                            }
                        </Form>
                        : null}
                          <div className="table-period" style={{marginTop: 30}}>
                                <EditableTable
                                    userInterfaces={this.props.userInterfaces}
                                    periods={periods}
                                    periodStatuses={periodStatuses}
                                    changePeriod={this.props.changePeriod}
                                    periodChoosed={this.state.periodChoosed}
                                    methodCalculation={methodCalculation}
                                    onRowClick={this.handleOnRowClick}
                                />
                            </div>
                      </Spin>
                  </div>
                </Modal>
            </span>
        )
    }

    showModal = () => { this.setState({ visible: true }) }

    closeModal = () => {
        this.props.form.resetFields()
        this.setState({ visible: false })
    }

    selectedMethodCalculation = (id) => {
        const { changeCalculationMethod, methodCalculation } = this.props
        const selectedMethod = methodCalculation.filter( method => method.kod == id )[0]
        selectedMethod.activen = true
        changeCalculationMethod(selectedMethod)
    }

    handleOnAddPeriod = () => {
        const { validateFields, resetFields ,getFieldProps} = this.props.form

        validateFields((err, values) => {
            if (err) return
            const { inputs } = this.state
            const period = {
                nazvanie: inputs.name,
                ot: moment(inputs.rangeDate[0], dateFormat).toDate(),
                do: moment(inputs.rangeDate[1], dateFormat).toDate(),
                status: {
                    kod: inputs.currentStatus.kod,
                    nazvanie: inputs.currentStatus.nazvanie
                },
                tip_resursov: {
                    kod: inputs.currentResourceType.kod,
                    nazvanie: inputs.currentResourceType.nazvanie
                },
                metod_vichisleniy : this.props.methodActive
            }
            this.props.addNewPeriod(period, resetFields)
            // this.closeModal()

        })
    }
    handleOnRowClick = period => this.setState({ periodChoosed: period })
}

const initForm = Form.create()

export default connect(state => ({
    methodCalculation: state.reports.calculationMethod,
    methodActive: state.reports.methodActive,
    loading: state.periods.loading,
    periods: state.periods.allPeriods,
    periodStatuses: state.periods.periodStatuses,
    testPeriodsOpen: state.periods.testPeriodsOpen,
    resourceTypes: state.resourceTypes.resourceTypes
}),{changePeriod, addNewPeriod, changeCalculationMethod })(initForm(PeriodsForm))