import React, { Component }                                            from 'react'
import { connect }                                                     from 'react-redux'
import { Row, Col, Card, Layout, Modal, Form, Select, Button, Input }  from 'antd'
import { equals }                                                      from 'ramda'
import * as resources                                                  from '../../AC/periodResources'
const Item = Form.Item
const { Sider,Content } = Layout;

class ResourceForm extends Component {
    state = {
        disable: true,
        visible: false,
        inputs: {},
        resourcesData: null
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.viewResourcesData == nextProps.viewResourcesData) {
            return
        }
        if(!equals(this.props.viewResourcesData ,nextProps.viewResourcesData)){
            this.setState({resourcesData: {
                period: nextProps.viewResourcesData.period,
                resurs: nextProps.viewResourcesData.resurs,
                kod: null,
                nachalnaya_cena: null,
                izmenennaya_cena: null,
                s_transportnymi_rashodami: false,
                organizaciya: null,
                proizvoditel: null,
                udalena: false,
                otklonenie_ot_osnovnoi_ceni: null,
                eto_osnovnaya_cena: false,
                osnovnaya_cena: null,
                vozvrat_sotrudniku: false,
                vozvrat_rukovoditelju: false,
                proverka: false
                }
            })
            return true
        }
        return false
    }

    showModal = () => this.setState({ visible: true })

    closeModal = () => {
        // this.props.form.resetFields()
        this.setState({ visible: false })
    }

    handleSubmit = () => {
        const { validateFields, setFields } = this.props.form

        validateFields((err, values) => {
            setFields({
                // тут будет проверка полей
            })
            if (!err) {
                this.props.createVendorPrice(this.state.resourcesData)
                this.props.form.resetFields()
                this.setState({resourcesData: {}})
                this.closeModal()
            }
        })
    }

    renderField = (label, field) => field ? <div> <span>{ label }</span>  <Content>{ field } </Content> </div> : null

    render() {
        const {visibleModal, viewResourcesData, organization} = this.props
        const { getFieldDecorator } = this.props.form

        const modalProps = {
            title: 'Добавление цены поставщика',
            visible: this.state.visible,
            onOk: this.handleSubmit,
            onCancel: this.closeModal,
            okText: 'Добавить',
            confirmLoading: false,
            maskClosable: false,
            cancelText: 'Отмена',
            width: 700
        }

        return (
            <div className="service-btn">
                { !visibleModal ? null:
                    <div>

                        <Card className="resources-card" bordered={ true } title={ viewResourcesData.resurs.nazvanie } >
                            { this.renderField(<strong>Тип ресурса:</strong> , viewResourcesData.resurs.tip_resursa.nazvanie) }
                            { this.renderField(<strong>Шифр:</strong>, viewResourcesData.resurs.kod_tsn) }
                            { this.renderField(<strong>Наименование:</strong>, viewResourcesData.resurs.nazvanie) }
                            { this.renderField(<strong>Полное наименование:</strong>, viewResourcesData.resurs.polnoe_nazvanie ) }
                            { this.renderField( <p> <strong>ОКП</strong> &nbsp;&nbsp; {viewResourcesData.resurs.kod_okp}</p>
                                               ,<p> <strong>ОКПД2</strong> &nbsp;&nbsp; {viewResourcesData.resurs.kod_okpd2}</p>)}

                            { this.renderField( <p> <strong>Брутто</strong> &nbsp;&nbsp; {viewResourcesData.resurs.massa_gross}</p>
                                               ,<p> <strong>Нетто</strong> &nbsp;&nbsp; {viewResourcesData.resurs.massa_netto}</p>)}

                            { this.renderField(<strong>Ед. измерения ТСН:</strong>, <p>{viewResourcesData.resurs.mera.nazvanie}</p>)}
                            { this.renderField(<strong>Техническое описание:</strong>, viewResourcesData.resurs.harakteristika) }
                            { this.renderField(<strong>Примечание:</strong>,viewResourcesData.resurs.primechanie ) }
                            { this.renderField(<strong>Производитель:</strong>,viewResourcesData.proizvoditel) }
                            <hr/>
                            <div className="price">
                                <p><strong>Текущая цена (руб.): </strong> { viewResourcesData.nachalnaya_cena/100 }</p>
                                <p><strong>Цена прошлого периода (руб.): </strong> { viewResourcesData.izmenennaya_cena/100 }</p>
                            </div>
                            <Button style={{marginTop: 20}} icon="plus" type="primary" onClick={this.showModal}> Добавить цену поставщика</Button>
                        </Card>

                        <Modal { ...modalProps }  style={{ top: 40 }}>
                            <Form layout='horizontal'>
                                <div className="price">
                                    { this.renderField(<strong >Тип ресурса:</strong>, viewResourcesData.resurs.tip_resursa.nazvanie) }
                                    { this.renderField(<strong >Наименование:</strong>, viewResourcesData.resurs.nazvanie) }
                                </div>
                                <Row gutter={40}>
                                    <Col span={16} >
                                        <Item label='Поставщик'>
                                            {getFieldDecorator('organizaciya', {
                                                rules: [{
                                                    required: true,
                                                    message: 'Укажите поставщика'
                                                }]
                                            })(  <Select onChange={e => this.setState({ resourcesData: {...this.state.resourcesData, organizaciya: +e}})}>
                                                {organization.map( org => <Select.Option key={org.kod} value={'' + org.kod}>{org.nazvanie}</Select.Option>)}
                                            </Select>  )}
                                        </Item>
                                    </Col>
                                    <Col span={8} >
                                        <Item label='Отпускная цена (руб.)'>
                                            {getFieldDecorator('izmenennaya_cena', {
                                                rules: [{
                                                    required: true,
                                                    message: 'Введите отпускную цену (руб.):'
                                                }]
                                            })( <Input rows={3} onChange={e => this.setState({ resourcesData: {...this.state.resourcesData, izmenennaya_cena: +e.target.value*100}})}/>   )}
                                        </Item>
                                    </Col>
                                </Row>
                                <Item label='Производитель'>
                                    <Input onChange={e => this.setState({ resourcesData: {...this.state.resourcesData, proizvoditel: e.target.value}})} />
                                </Item>
                            </Form>
                        </Modal>
                    </div>}
            </div>
        )
    }
}

const formInit = Form.create()
export default connect(state =>({
    loading: state.resources.loading,
    visibleModal: state.resources.visibleModalView,
    viewResourcesData: state.resources.viewResourcesData,
    organization: state.periodResources.organization,
}) , { ...resources })(formInit(ResourceForm))




// const styleGraphic = {
//     width: 610,
//     height: 295,
//     margin: '0 auto',
//     backgroundImage: 'url("static/img/grapfic.jpg")'
// }

//
// <p style={{paddingTop: 15}} > График изменения цены по периодам</p>
// <p style={styleGraphic}> </p>
//     <p> По горизонтали - периоды </p>
// <p> По вертикали - цены </p>

// <Layout style={{margin: '5px 0',background: 'none', flex: '0 0 130px'}}>
// <Sider style={{background: 'none'}}>
// <strong style={{margin: '5px 0'}} >{ label }</strong>
// </Sider>
// <Layout style={{background: 'none'}}>
//     <Content>{ field } </Content>
//     <Content>{ field2 } </Content>
// </Layout>
// </Layout>

// <Icon style={sytleCloseIcon} onClick={ this.props.closeViweeResources } type="close" />