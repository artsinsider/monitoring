import React, { PureComponent }            from 'react'
import { Form, Select, DatePicker, Table } from 'antd'
import moment                              from 'moment'
import { reverse }                         from 'ramda'
import EditableCell                        from './EditableCell'
import './styles.css'

const { RangePicker } = DatePicker
const Option = Select.Option
const Item = Form.Item
const dateFormat = 'DD.MM.YYYY'

export default class EditableTable extends PureComponent {
    constructor(props) {
        super(props)
        this.columns = [
            {
                title: 'Наименование',
                dataIndex: 'name',
                width: 200,
                render: (text, record, index) =>
                {  return record.status.kod != 3 ?
                    <EditableCell
                        name={record.period.kod}
                        value={text}
                        onChange={this.handleNameChange}
                    />
                    : record.name
                }
            },{
                title: 'Период',
                dataIndex: 'period',
                key: 'period',
                width: 210,
                render: (text, record, index) =>
                    <RangePicker
                        disabled={record.status.kod === 3}
                        ref={record.period.kod}
                        className="field"
                        value={record.period}
                        format={dateFormat}
                        onChange={this.handleDatesChange}
                    />
            },{
                title: 'Тип ресурса',
                dataIndex: 'type',
                width: 120
            },
            {
                title: 'Метод расчета',
                dataIndex: 'metod_vichisleniy',
                kry: 'metod_vichisleniy',
                width: 200,
                render: (method, record, index) => 
                  <Select 
                      style={{width: '100%'}} 
                      key={index}
                      defaultValue={record.metod_vichisleniy}
                      name={record.period.kod}
                      disabled={record.status.kod === 3}
                      onChange={this.handleCalculationMethodChange}>
                      {this.props.methodCalculation.map((method, index) => <Option key={method.kod} value={'' + method.kod}>{method.opisanie}</Option>)}
                    </Select>
            },
            {
                title: 'Статус',
                dataIndex: 'status',
                key: 'status',
                width: 180,
                render: (status, record, index) => (
                    <Select style={{width: '100%'}} key={index} defaultValue={record.status.nazvanie} name={record.period.kod} disabled={record.status.kod === 3} onChange={this.handleStatusChange}>
                        {this.props.periodStatuses.map((status, index) => 
                        { const isDisabled = this.props.userInterfaces.role === 'chief' && status.kod === 3
                          return <Option disabled={isDisabled} key={index}>{status.nazvanie}</Option>})}
                    </Select>)
            }
        ]
    }

    render() {
        const data = []
        const reversePeriods = reverse(this.props.periods)
        reversePeriods.forEach(period => data.push({
            key: period.kod,
            name: period.nazvanie,
            type: period.tip_resursov.nazvanie,
            period: [moment(new Date(period.ot), dateFormat), moment(new Date(period.do), dateFormat)],
            metod_vichisleniy: period.metod_vichisleniy.opisanie,
            status: period.status
        }))

        return <Table
            className="table"
            bordered
            size="small"
            dataSource={data}
            columns={this.columns}
            periodStatuses={this.props.periodStatuses}
            userInterfaces={this.props.userInterfaces}
            onRowClick={period => this.props.onRowClick(period)}
        />
    }

    handleNameChange = name => this.props.changePeriod(this.createNewPeriod({ nazvanie: name }))

    handleDatesChange = (moments, dates) => {
        const dateStart = moments[0].toDate()
        const dateEnd = moments[1].toDate()

        this.props.changePeriod(this.createNewPeriod({
            ot: dateStart,
            do: dateEnd
        }))
    }

    handleStatusChange = statusId => {
        this.props.changePeriod(this.createNewPeriod({ status: this.props.periodStatuses[statusId] }))
    }

    handleCalculationMethodChange = (methodId) => {
      const { methodCalculation} = this.props
      const selectedMethod = methodCalculation.filter( method => method.kod == methodId )[0]
      selectedMethod.activen = true
      const changedPeriod = this.createNewPeriod({
        metod_vichisleniy: selectedMethod
      })
      this.props.changePeriod(changedPeriod)
    }

    createNewPeriod= obj => {
        const periodFromStore = this.props.periods.find(period => period.kod === this.props.periodChoosed.key)

        return {
            kod: 'kod' in obj ? obj.kod : periodFromStore.kod,
            nazvanie: 'nazvanie' in obj ? obj.nazvanie : periodFromStore.nazvanie,
            ot: 'ot' in obj ? obj.ot : periodFromStore.ot,
            do: 'do' in obj ? obj.do : periodFromStore.do,
            status: 'status' in obj ? obj.status : periodFromStore.status,
            tip_resursov: 'tip_resursov' in obj ? obj.tip_resursov : periodFromStore.tip_resursov,
            metod_vichisleniy : 'metod_vichisleniy' in obj ? obj.metod_vichisleniy : periodFromStore.metod_vichisleniy
        }
    }
}