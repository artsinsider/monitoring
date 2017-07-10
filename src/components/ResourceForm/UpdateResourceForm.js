import React, { Component }                       from 'react'
import { connect }                                from 'react-redux'
import { Form, Modal, Input, Select, TreeSelect } from 'antd'
import { isEmpty, equals }                         from 'ramda'
import * as resources                             from '../../AC/resources'
import { loadSectionsByParentId } from '../../AC/sections'

const Item = Form.Item
class UpdateResourceForm extends Component {
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

    selectedResourcesType = () => {
        const { resourcesData, resourceTypes } = this.props
        if(isEmpty(resourcesData)) { return null }
        return typeof resourcesData.tip_resursa === "string"?
            resourceTypes.filter(type =>  type.nazvanie == resourcesData.tip_resursa)[0].kod + ''
            :
            resourceTypes.filter(type =>  type.kod == resourcesData.tip_resursa.kod)[0].kod + ''
    }

    selectedMeasureType = () => {
        const { resourcesData, measure } = this.props
        if(isEmpty(resourcesData)) { return null }
        return typeof resourcesData.mera === "string"?
            measure.filter(mera =>  mera.nazvanie == resourcesData.mera)[0].kod + ''
            :
            measure.filter(mera =>  mera.kod == resourcesData.mera.kod)[0].kod + ''
    }

    selectedSection = () => {
        const { resourcesData } = this.props
        // TBD: Fix the placeholder section, now they load async => this can't work
        // const {resourcesData,sections } = this.props
        // if(isEmpty(resourcesData)) { return null }
        // return typeof resourcesData.razdel === "string"?
        //     sections.filter(section =>  section.nazvanie == resourcesData.razdel)[0].kod + ''
        //     :
        //     sections.filter(sec =>  sec.kod == resourcesData.razdel.kod)[0]['kod']+ '';
        return resourcesData.razdel.nazvanie
    }
    onLoadData = (treeNode) => {
        //TBD: Rewrite to check, if sections.key isLeaf is null or false.
        // If false => load stuff
        // If true => reject
        const { sections } = this.props
        const key = treeNode.props.eventKey;
        return new Promise((resolve, reject) => {
            const isAlreadyLoaded = sections.filter(item => (item.roditel === +key))
            if (isEmpty(isAlreadyLoaded)) {
                this.props.loadSectionsByParentId(key)
                resolve();
            } else {
                reject()
            }
        });
    }



    renderParentField(sections) {
        return (
            <Form.Item label="Укажите раздел">
                {this.props.form.getFieldDecorator('razdel',{
                        rules: [{ required: true, message: 'Введите наименование ресурса' }],
                        initialValue: this.selectedSection() })
                (
                    <TreeSelect
                        style={{ width: '100%' }}
                        loadData={this.onLoadData}
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

    selectNode = (node) => {
        const { sections } = this.props
        const selectedNode =  sections.filter( section => section.kod == node)[0]
        this.setState({ inputs: {...this.state.inputs, razdel: selectedNode}})
    }

    render() {
        const {resourceTypes=[], organization, sections, measure=[], visibleModal, resourcesData } = this.props
        const { getFieldDecorator } = this.props.form
        const alternativeMethod = equals(resourcesData, this.state.inputs)
        const modalProps = {
            title: 'Редактирование ресурса',
            visible: visibleModal,
            onOk:  alternativeMethod ? this.closeModal : this.handleSubmit ,
            onCancel: this.closeModal,
            okText: 'Сохранить',
            confirmLoading: false,
            maskClosable: false,
            cancelText: 'Отмена',
            width: 700
        }

        return (
            <div className="service-btn">
                {!visibleModal ? null: <Modal key="update" { ...modalProps } style={{ top: 40}}>
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
                                initialValue: resourcesData.kod_tsn
                            })(<Input onChange={e => this.setState({ inputs: {...this.state.inputs, kod_tsn: e.target.value } })}/>)}
                        </Item>
                        <Item label='Наименование' hasFeedBack>
                            {getFieldDecorator('nazvanie', {
                                rules: [{
                                    required: true,
                                    message: 'Введите наименование ресурса'
                                }],
                                initialValue:  resourcesData.nazvanie
                            })(<Input  onChange={e => this.setState({ inputs: {...this.state.inputs, nazvanie: e.target.value}})} />)}
                        </Item>
                        <Item label='Полное Наименование'>
                            {getFieldDecorator('polnoe_nazvanie', { initialValue: isEmpty(resourcesData) ? null : resourcesData.polnoe_nazvanie})(
                                <Input onChange={e => this.setState({ inputs: {...this.state.inputs, polnoe_nazvanie: e.target.value}})} />)}
                        </Item>
                        <div className='form-flex'>
                            <div className='form-column'>

                                <Item label='Вес нетто'>
                                    {getFieldDecorator('massa_netto',{ initialValue: isEmpty(resourcesData) ? null : resourcesData.massa_netto})(
                                        <Input onChange={e => this.setState({ inputs: {...this.state.inputs, massa_netto: +e.target.value}})}/>)
                                    }
                                </Item>

                                <Item label='Вес брутто'>
                                    {getFieldDecorator('massa_gross' ,{ initialValue: isEmpty(resourcesData) ? null : resourcesData.massa_gross})(
                                        <Input onChange={e => this.setState({ inputs: {...this.state.inputs, massa_gross: +e.target.value}})}/>)
                                    }
                                </Item>

                                <Item label='Тип Ресурса' >
                                    {getFieldDecorator('tip_resursa',{
                                        rules: [{
                                            required: true,
                                            message: 'Укажите тип ресурса'
                                        }],
                                        initialValue: this.selectedResourcesType()
                                    })
                                    (<Select placeholder='Поиск'
                                                onFocus={this.handleOnLoadMeasures}
                                                onChange={e => this.setState({ inputs: {...this.state.inputs, tip_resursa: resourceTypes.filter( el => el.kod == e)[0] }})}
                                        >
                                            {resourceTypes.map( type => <Select.Option key={type.kod} value={'' + type.kod}>{type.nazvanie}</Select.Option>)}
                                        </Select> )}
                                </Item>
                            </div>
                            <div className='form-column'>

                                 <Item label='Код ОКП'>
                                    {getFieldDecorator('kod_okp' ,{ initialValue: isEmpty(resourcesData) ? null : resourcesData.kod_okp})(
                                        <Input onChange={e => this.setState({ inputs: {...this.state.inputs, kod_okp: e.target.value}})}/>)}
                                </Item>

                                <Item label='Код ОКПД 2'>
                                    {getFieldDecorator('kod_okpd2' ,{ initialValue: isEmpty(resourcesData) ? null : resourcesData.kod_okpd2})(
                                        <Input onChange={e => this.setState({ inputs: {...this.state.inputs, kod_okpd2: e.target.value}})}/>)}
                                </Item>

                                <Item label='Единицы измерения' >
                                    {getFieldDecorator('mera',{
                                        rules: [{
                                            required: true,
                                            message: 'Укажите единицу измерения'
                                        }],
                                        initialValue: this.selectedMeasureType()
                                    })
                                    (
                                        <Select placeholder='Выбрать единицу измерения'
                                                onFocus={this.handleOnLoadMeasures}
                                                onChange={e => this.setState({ inputs: {...this.state.inputs, mera: measure.filter( el => el.kod == e)[0]  }})}
                                        >
                                            {measure.map( m => <Select.Option key={m.kod} value={'' + m.kod}>{m.nazvanie}</Select.Option>)}
                                        </Select>)}
                                </Item>
                            </div>
                        </div>  
                        <Item style={{marginBottom: 25}} >
                            {this.renderParentField(sections)}
                        </Item>
                        <Item label='Техническое описание'>
                            {getFieldDecorator('harakteristika',{ initialValue: isEmpty(resourcesData) ? null : resourcesData.harakteristika})(
                                <Input type='textarea' rows={3} onChange={e => this.setState({ inputs: {...this.state.inputs, harakteristika: e.target.value}})}/>
                            )}
                        </Item>
                        <Item label='Примечание'>
                            {getFieldDecorator('primechanie',{ initialValue: isEmpty(resourcesData) ? null : resourcesData.primechanie})(
                                <Input type='textarea' rows={3} onChange={e => this.setState({ inputs: {...this.state.inputs, primechanie: e.target.value}})}/>
                            )}
                        </Item>
                    </Form>
                </Modal>}
            </div>
        )
    }

    showModal = e => this.setState({ visible: true })
    
    closeModal = () => {
        this.props.form.resetFields()
        this.props.closeUpdateResources()
    }

    handleOnLoadMeasures = () => {
        // console.log(true)
        return false
    }

    handleOnLoadOrganisations = () => {
        // console.log(true)
        return false
    }

    handleSubmit = () => {
        const { form } = this.props
        const { validateFields, setFields } = form

        validateFields((err, values) => {
            setFields({
                // тут будет проверка полей
            })
            if (!err){
                this.props.updateResources(this.state.inputs)
                this.setState({ inputs: {} })
                this.props.closeUpdateResources()
            }
        })


    }
}
const formInit = Form.create()

export default connect(state =>({
    resourceTypes: state.resourceTypes.resourceTypes,
    resourcesFoolStatus: state.resources.resourcesFoolStatus,
    resourcesStatusAction: state.resources.resourcesStatusAction,
    organization: state.periodResources.organization,
    sections: state.sections.get('entities').toArray(),
    measure: state.resourceTypes.measure,
    newResources: state.resources.newResources,
    loading: state.resources.loading,
    visibleModal: state.resources.visibleModal,
    resourcesData: state.resources.resourcesData.resurs,
}) , { ...resources, loadSectionsByParentId })(formInit(UpdateResourceForm))

/** to do , оставлено до следующих изменений*/
// <Item label='Наименование поставщика'>
//     {getFieldDecorator('organizaciya',{
//     rules: [{
//         required: true,
//         message: 'Укажите поставщика'
//     }]
//     //, initialValue: isEmpty(resourcesData) ? null : typeof resourcesData.organizaciya === 'object' ? resourcesData.organizaciya :organization.filter(org =>  org.kod == resourcesData.organizaciya)[0].kod + ''
// })(
//     <Select placeholder='Поиск'
//             onFocus={this.handleOnLoadOrganisations}
//             onChange={e => this.setState({ inputs: {...this.state.inputs, organizaciya: +e}})}
//     >
//         {organization.map( org => <Select.Option key={org.kod} value={'' + org.kod}>{org.nazvanie}</Select.Option>)}
//     </Select>
// )}
// </Item>