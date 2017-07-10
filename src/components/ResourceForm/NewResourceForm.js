import React, { Component }                               from 'react'
import { Form, Modal, Button, Input, Select, TreeSelect } from 'antd'

const Item = Form.Item

class NewResourceForm extends Component {
    state = {
        visible: false,
        inputs: {
            kod: null,
            nazvanie:null,
            polnoe_nazvanie: null,
            kod_tsn: null,
            kod_okp: null,
            kod_okpd2: null,
            massa_netto: null,
            massa_gross: null,
            harakteristika: null,
            primechanie: null ,
            organizaciya: null,
            sotrudnik: null,
            udalena: false,
            razdel: null,
            tip_resursa: null,
            mera: null,
            status: this.props.resourcesFoolStatus[0],
            status_deistviya: null
        }
    }

    renderParentField(sections) {
        return (
            <Form.Item label="Укажите раздел">
                {this.props.form.getFieldDecorator('razdel' , {
                    rules: [{
                        required: true,
                        message: 'Укажите раздел'
                    }]
                })(
                    <TreeSelect
                        style={{ width: '100%' }}
                        onSearch={e => console.log(e)}
                        searchPlaceholder="Поиск"
                        treeNodeFilterProp="title"
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="Выберите раздел"
                        allowClear
                        showSearch
                        onSelect={this.selectNode}
                    >
                        {this.renderNestedList(sections, null)}
                    </TreeSelect>
                )}
            </Form.Item>
        )
    }

    renderNestedList(data, parentId) {
        const list = []
        data.forEach(item => {
            const { roditel, kod, nazvanie } = item
            if (roditel === parentId) {
                const childs = this.renderNestedList(data, kod)
                list.push(
                    childs && childs.length
                        ? <TreeSelect.TreeNode value={''+kod} key={kod} title={nazvanie}>{childs}</TreeSelect.TreeNode>
                        : <TreeSelect.TreeNode value={''+kod} key={kod} title={nazvanie} />
                )
            }
        })
        return list
    }

    selectNode =(node) => {
        const { sections } = this.props
        const selectedNode =  sections.filter( section => section.kod == node)[0]
        this.setState({ inputs: {...this.state.inputs, razdel: selectedNode}})
    }

    checkAvailability = (flag) => {
        const { findTsn } = this.props
        const { getFieldValue } = this.props.form
        if(flag) { return }
        const keys = getFieldValue('kod_tsn');
        findTsn(keys)
    }

    render() {
        const {resourceTypes, organization, sections, measure, findTsn, tsnFind} = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form

        const modalProps = {
            title: 'Создание ресурса',
            visible: this.state.visible,
            onOk: this.handleSubmit,
            onCancel: this.closeModal,
            okText: 'Сохранить',
            confirmLoading: false,
            maskClosable: false,
            cancelText: 'Отмена',
            width: 700
        }

        const buttonProps = {
            type: this.props.btnType,
            icon: this.props.btnIcon,
            onClick: this.showModal,
            disabled: this.props.btnDisabled
        }

        return (
            <span className="service-btn">
                <Button { ...buttonProps }>{this.props.btnText}</Button>
                <Modal { ...modalProps }  style={{ top: 40 }}>
                    <Form layout='horizontal'>
                        <Item label='Шифр ТСН' hasFeedBack>
                            {getFieldDecorator('kod_tsn', {
                                rules: [{
                                    required: true,
                                    message: 'Введите шифр ТСН'
                                },
                                {validator(rule, value, callback, source, options) {
                                    const errors = []
                                    callback(errors)
                                }}],
                            })(<div>
                                <Input onFocus={ () => this.checkAvailability(true) } onBlur={ () => this.checkAvailability(false) } onChange={e => this.setState({ inputs: {...this.state.inputs, kod_tsn: e.target.value } })}/>
                                    {tsnFind ?<p style={{color: 'red'}}>Ресурс с указанным номером ТСН уже существует</p> : null }  </div>
                                )}
                        </Item>
                        <Item label='Наименование' hasFeedBack>
                            {getFieldDecorator('nazvanie', {
                                rules: [{
                                    required: true,
                                    message: 'Введите наименование ресурса'
                                }]
                            })(<Input onChange={e => this.setState({ inputs: {...this.state.inputs, nazvanie: e.target.value}})} />   )}
                        </Item>
                        <Item label='Полное Наименование'>
                            {getFieldDecorator('polnoe_nazvanie')(<Input  onChange={e => this.setState({ inputs: {...this.state.inputs, polnoe_nazvanie: e.target.value}})} />)}
                        </Item>
                        <div className='form-flex'>
                            <div className='form-column'>

                                <Item label='Вес нетто'>
                                    {getFieldDecorator('massa_netto')(<Input onChange={e => this.setState({ inputs: {...this.state.inputs, massa_netto: +e.target.value}})}/>)}
                                </Item>

                                <Item label='Вес брутто'>
                                    {getFieldDecorator('massa_gross')(<Input onChange={e => this.setState({ inputs: {...this.state.inputs, massa_gross: +e.target.value}})}/>)}
                                </Item>

                                <Item label='Тип Ресурса' >
                                    {getFieldDecorator('tip_resursa', {
                                        rules: [{
                                            required: true,
                                            message: 'Укажите тип ресурса'
                                        }]
                                    })(
                                        <Select placeholder='Поиск'
                                                onFocus={this.handleOnLoadMeasures}
                                                onChange={e => this.setState({ inputs: {...this.state.inputs, tip_resursa: resourceTypes.filter( el => el.kod == e)[0] }})}
                                        >
                                            {resourceTypes.map( type => <Select.Option key={type.kod} value={'' + type.kod}>{type.nazvanie}</Select.Option>)}
                                        </Select>
                                    )}
                                </Item>
                            </div>
                            <div className='form-column'>

                                 <Item label='Код ОКПД'>
                                    {getFieldDecorator('kod_okp')(<Input onChange={e => this.setState({ inputs: {...this.state.inputs, kod_okp: e.target.value}})}/>)}
                                </Item>

                                <Item label='Код ОКПД 2'>
                                    {getFieldDecorator('kod_okpd2')(<Input onChange={e => this.setState({ inputs: {...this.state.inputs, kod_okpd2: e.target.value}})}/>)}
                                </Item>

                                <Item label='Единицы измерения' >
                                    {getFieldDecorator('mera', {
                                        rules: [{
                                            required: true,
                                            message: 'Укажите единицу измерения'
                                        }]
                                    })(
                                        <Select placeholder='Выбрать единицу измерения'
                                                onFocus={this.handleOnLoadMeasures}
                                                onChange={e => this.setState({ inputs: {...this.state.inputs, mera: measure.filter( el => el.kod == e)[0]  }})}
                                        >
                                            {measure.map( m => <Select.Option key={m.kod} value={'' + m.kod}>{m.nazvanie}</Select.Option>)}
                                        </Select>
                                    )}
                                </Item>
                            </div>
                        </div>  
                        <Item style={{marginBottom: 25}} >
                            {this.renderParentField(sections)}
                        </Item>

                        <Item label='Техническое описание'>
                            {getFieldDecorator('harakteristika')(
                                <Input type='textarea' rows={3} onChange={e => this.setState({ inputs: {...this.state.inputs, harakteristika: e.target.value}})}/>
                            )}
                        </Item>
                        <Item label='Примечание'>
                            {getFieldDecorator('primechanie')(
                                <Input type='textarea' rows={3} onChange={e => this.setState({ inputs: {...this.state.inputs, primechanie: e.target.value}})}/>
                            )}
                        </Item>
                    </Form>
                </Modal>
            </span>
        )
    }

    showModal = e => this.setState({ visible: true })
    
    closeModal = e => {
        this.props.form.resetFields()
        this.setState({ visible: false })
    }

    handleOnLoadMeasures = () => {
        // console.log(true)
        return false
    }

    handleOnLoadOrganisations = () => {
        return false
    }


    handleSubmit = () => {
        const { validateFields, setFields, getFieldsValue } = this.props.form
        const { tsnFind } = this.props
          
        validateFields((err, values) => {
            setFields({
                // тут будет проверка полей
            })
            if (!err && !tsnFind ) {
                this.props.createResources(this.state.inputs)
                this.closeModal()
            }
        })
    }
}
const formInit = Form.create()
export default formInit(NewResourceForm)

/** В объекте ресурса больше нет поставщика*/

// <Item label='Наименование поставщика'>
//     {getFieldDecorator('organizaciya', {
//     rules: [{
//         required: true,
//         message: 'Укажите поставщика'
//     }]
// })(
//     <Select placeholder='Поиск'
//             onFocus={this.handleOnLoadOrganisations}
//             onChange={e => this.setState({ inputs: {...this.state.inputs, organizaciya: +e}})}
//     >
//         {organization.map( org => <Select.Option key={org.kod} value={'' + org.kod}>{org.nazvanie}</Select.Option>)}
//     </Select>
// )}
// </Item>