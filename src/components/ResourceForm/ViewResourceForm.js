import React, { Component }    from 'react'
import { connect }             from 'react-redux'
import { Modal, Card, Layout } from 'antd'
import { equals }              from 'ramda'
import * as resources          from '../../AC/resources'

const { Sider,Content } = Layout;
class ViewResourceForm extends Component {
    state = {
        disable: true,
        visible: false,
        inputs: {}
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.resourcesData == nextProps.resourcesData) {
            return
        }
        if(!equals(this.props.resourcesData ,nextProps.resourcesData)){
            this.setState({inputs: {...nextProps.resourcesData}})
            return true
        }
       return false
    }


    renderField = (label, field, field2) => field ?
        <Layout style={{margin: '5px 0',background: 'none', flex: '0 0 130px'}}>
            <Sider style={{background: 'none'}}>
                <strong style={{margin: '5px 0'}} >{ label }</strong>
            </Sider>
            <Layout style={{background: 'none'}}>
                <Content>{ field } </Content>
                <Content>{ field2 } </Content>
            </Layout>
        </Layout>
        : null

    render() {
        const {visibleModal, viewResourcesData } = this.props

        const modalProps = {
            title: 'Карточка ресурса',
            visible: visibleModal,
            onOk:  this.closeModal ,
            onCancel: this.closeModal,
            okText: 'Ок',
            confirmLoading: false,
            maskClosable: false,
            cancelText: 'Отмена',
            width: 700,
            footer:null
        }

        const styleGraphic = {
            width: 610,
            height: 295,
            margin: '0 auto',
            backgroundImage: 'url("static/img/grapfic.jpg")'
        }

        return (
            <div className="service-btn">
                {!visibleModal ? null: <Modal key="update" { ...modalProps } style={{ top: 40}}>
                    <Card className="resources-card" bordered={ false }>
                        { this.renderField('Тип ресурса:', viewResourcesData.resurs.tip_resursa.nazvanie) }
                        { this.renderField('Шифр:', viewResourcesData.resurs.kod_tsn) }
                        { this.renderField('Наименование:', viewResourcesData.resurs.nazvanie) }
                        { this.renderField('Полное наименование:', viewResourcesData.resurs.polnoe_nazvanie == '' ? ' ' : viewResourcesData.resurs.polnoe_nazvanie) }
                        <div className="kod">
                        { this.renderField('Код:', <p><strong style={{fontStyle: 'italic'}} > ОКП </strong> &nbsp;&nbsp; {viewResourcesData.resurs.kod_okp}</p>
                                                 , <p><strong style={{fontStyle: 'italic'}} > ОКП2 </strong> &nbsp;&nbsp; {viewResourcesData.resurs.kod_okpd2}</p>)}
                        </div>
                        <div className="unit">
                        { this.renderField('Вес:', <p>
                                                       <strong style={{fontStyle: 'italic'}} >Брутто </strong> &nbsp;&nbsp; {viewResourcesData.resurs.massa_gross}
                                                       <strong style={{paddingLeft: 150}} >Ед. измерения ТСН: </strong> &nbsp;&nbsp; {viewResourcesData.resurs.mera.nazvanie}
                                                   </p>
                                                 , <p><strong style={{fontStyle: 'italic'}} >Нетто </strong>  &nbsp;&nbsp; {viewResourcesData.resurs.massa_netto}</p>)}
                        </div>

                        { this.renderField('Техническое описание:', viewResourcesData.resurs.harakteristika) }
                        { this.renderField('Комментарии:',viewResourcesData.resurs.primechanie) }
                        <hr/>
                        <div className="price">
                            <span><strong>  Текущая цена (руб.): </strong> { viewResourcesData.nachalnaya_cena }</span>
                            <span style={{paddingLeft: 30}} ><strong>  Цена прошлого периода (руб.): </strong> { viewResourcesData.izmenennaya_cena }</span>
                        </div>
                        <p style={{paddingTop: 15}} > График изменения цены по периодам</p>
                        <p style={styleGraphic}> </p>
                        <p> По горизонтали - периоды </p>
                        <p> По вертикали - цены </p>

                    </Card>
                </Modal>}
            </div>
        )
    }

    showModal = e => this.setState({ visible: true })
    closeModal = () => { this.props.closeViweeResources() }
}

export default connect(state =>({
    loading: state.resources.loading,
    visibleModal: state.resources.visibleModalView,
    viewResourcesData: state.resources.viewResourcesData,
}) , { ...resources })(ViewResourceForm)