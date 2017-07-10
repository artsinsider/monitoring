import React, { Component }   from 'react'
import { connect }            from 'react-redux'
import { Select }             from 'antd'
import { loadResourceStatus } from '../../AC/recourceStatus'

class ResourceStatus extends Component {

    componentDidMount() {
        this.props.loadResourceStatus()
    }

    /**  Хендлер для выбора статуса */
    handleChange = value => {
        return `selected ${value}`;
    };

    render() {
        const { resourceStatus } = this.props;
        const Option = Select.Option;
        return (
            <div className="resource" style={{padding: '25px'}}>
                <Select defaultValue='Выбрать статус' style={{ width: 170 }} onChange={this.handleChange}>
                    {
                        resourceStatus.map( el => {
                            return  <Option key={el.kod} value={el.nazvanie}>{el.nazvanie}</Option>
                        })
                    }
                </Select>
            </div>
        )
    }
}

export default connect(state => ({
    resourceStatus: state.resourceStatus.get('entities').map(res => res.toJS()).toArray()
}),{loadResourceStatus})(ResourceStatus)