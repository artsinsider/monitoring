import React, { PureComponent }  from 'react'
import {  Input, Icon }          from 'antd'
import './styles.css'

export default class EditableCell extends PureComponent {
    state = {
        value: this.props.value,
        editable: false
    }

    handleChange = e => {
        const value = e.target.value
        this.setState({ value })
    }

    check = () => {
        this.setState({ editable: false })
        if (this.props.onChange) {
            this.props.onChange(this.state.value)
        }
    }

    edit = () => this.setState({ editable: true })

    render() {
        const { value, editable } = this.state
        return (
            <div className="editable">
                { editable ?
                    <div className="editable-cell-input-wrapper">
                        <Input
                            value={value}
                            onChange={this.handleChange}
                            onPressEnter={this.check}
                        />
                        <Icon
                            className="editable-cell-icon-check"
                            type="check"
                            onClick={this.check}
                        />
                    </div>
                    :
                    <div className="editable-cell-text-wrapper">
                        {value || ''}
                        <Icon
                            className="editable-cell-icon"
                            type="edit"
                            onClick={this.edit}
                        />
                    </div>
                }
            </div>
        )
    }
}