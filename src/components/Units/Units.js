import React, { Component }       from 'react'
import { connect }                from 'react-redux'
import * as units                 from '../../AC/units'
import { Table, Popconfirm ,Icon} from 'antd'
import UnitsForm                  from './UnitsForm'

class Units extends Component {

  componentDidMount() {
    this.props.loadAllUnits()
  }
  
  render () {
    const { units, createUnit, deleteUnit } = this.props
    const tableProps = {
      columns: [
      {
        title: 'Аббревиатура',
        dataIndex: 'code',
        key: 'code',
        width: 150
      }, {
        title: 'Полное наименование',
        dataIndex: 'nazvanie',
        key: 'nazvanie',
        width: 150
      },{
        title: 'Удалить',
        key: 'operation',
        width: '40px',
        render: (text, record) => (
          <Popconfirm title="Удалить?" onConfirm={() => deleteUnit(record.toJS())}>
            <Icon type="delete"
                  className="editable-cell-icon-check"
                  onClick={this.check}/>
          </Popconfirm>
        )
      }
      ],
      bordered: true,
      dataSource: units,
      rowKey: 'kod',
      pagination: false,
      size: 'small',
      scroll:{ y: 300 }
    }

    return (
        <div>
        <div style={{ padding: '10px 0'}} >Справочник единиц измерения:</div>
          <div className="units-box" style={{ padding: 10, border: '1px solid #d4d4d4', borderRadius: 3}} >
            <UnitsForm createUnit={createUnit} units={units} />
            <Table {...tableProps} />
          </div>
        </div>
    )
  }
}

export default connect(state => ({
  units: state.units.get('entities').sortBy((item) => -item.get('kod')).toArray()
}), { ...units })(Units)
