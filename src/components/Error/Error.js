import React, { Component }       from 'react'
import { Modal, Button, Icon }    from 'antd'
import { connect }                from 'react-redux'

class Error extends Component {
    render() {
        const { visibleModal, error, visibleModalP, error2 } = this.props
        const modalProps = {
            title: 'Ошибка',
            visible: visibleModal || visibleModalP,
            confirmLoading: false,
            maskClosable: false,
            width: 700,
            footer:null,
            closable: false
        }

        return (
            <span className="service-btn">
                <Modal { ...modalProps }  style={{ top: "30%" }}>
                    <div style={{ textAlign: 'center'}}>
                         <p style={{color: 'red', fontSize: "50px", padding: "10px 0" }}>
                             <Icon type="frown-o" style={{ padding: "0 10px", fontSize: "40px", color: 'red'}} />
                             Ошибка {error || error2 == undefined ? '' : error.status}
                         </p>
                         <p style={{ fontSize: "15px" }}>Произошла внутренняя ошибка сервера , обратитесь в службу технической поддержки  или перезагрузите страницу</p>
                         <Button icon='reload'  style={{ margin: "10px 0" }}type="primary" onClick={ () => location.reload()} > Перезагрузить страницу</Button>
                     </div>
                </Modal>
            </span>
        )
    }
}

export default connect(state =>({
    error: state.periodResources.error,
    visibleModal: state.periodResources.visibleError,
    visibleModalP: state.periods.visibleError,
    error2: state.periodResources.error,
}) )(Error)