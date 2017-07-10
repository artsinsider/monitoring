import React, { Component } from 'react'
import { Popconfirm, Button } from 'antd'

export default class HrefRow extends Component {
    render() {
        const { url = '#' } = this.props
        return (
            <div>
              <Button style={{marginRight: '10px'}} icon="edit" />

              <Popconfirm title="Удалить?" onConfirm={e => console.log(e)}>
                <Button icon="delete" />
              </Popconfirm>
            </div>
        )
    }
}
