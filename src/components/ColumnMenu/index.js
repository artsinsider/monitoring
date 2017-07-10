import React, { Component }                       from 'react'
import { Dropdown, Menu, Button, Icon, Checkbox } from 'antd'
import { connect }                                from 'react-redux'
import { toggleColumn }                           from '../../AC/resources'
import './styles.css'

class ColumnMenu extends Component {
    state = {
        visible: false,
        columnsGrid: this.props.columns,
    }

    render() {
        const {columns} = this.props
        const menuColumns = (
            <Menu>
                {columns.map( item =>
                 <Menu.Item key={item.key}>
                     <span>
                         <Checkbox key={item.key} options={item.name} defaultChecked={true} defaultValue={[item.name]} >{item.name}</Checkbox>
                     </span>
                 </Menu.Item>
                )}
            </Menu>)

        return (
            <Dropdown overlay={menuColumns} onVisibleChange={this.handleVisibleChange} visible={this.state.visible}>
                <Button>Столбцы <Icon type="down" /></Button>
            </Dropdown>
        )
    }

    handleVisibleChange = flag => {
        this.setState({ visible: flag })
    }
}

export default connect(state => ({
  columnsSelected: state.resources.columnsSelected
}), { toggleColumn })(ColumnMenu)
