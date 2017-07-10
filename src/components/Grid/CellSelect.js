import React, { Component } from 'react'

export default class HeaderCellSelect extends Component {
    render() {
        const { handleOnChange } = this.props
        return <div style={{textAlign: 'center'}}><input type="checkbox" onChange={handleOnChange} /></div>
    }
}
