import React, {Component} from 'react'
import {Form, Select, TreeSelect} from 'antd'

class WorkspacesForm extends Component {
        state = {
            dataResourcesId: [],
        };

    renderSectionsTree(sections) {
        return (
            <Form.Item label='Разделы'>
                {this.props.form.getFieldDecorator('roditel')(
                    <TreeSelect
                        style={{width: '100%'}}
                        searchPlaceholder='Поиск'
                        treeNodeFilterProp='title'
                        dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
                        placeholder='Выберите раздел'
                        allowClear
                        showSearch
                        treeDefaultExpandAll
                        onSelect={()=>{}}
                    >
                        {
                            <TreeSelect.TreeNode
                                value={null}
                                key={0}
                                title='Корневой раздел'>
                            {this.renderNestedList(sections, null)}
                            </TreeSelect.TreeNode>
                        }
                    </TreeSelect>
                )}
            </Form.Item>
        )
    }


    renderNestedList(data, parentId) {
        const list = []
        data.forEach(item => {
            const {roditel, kod, nazvanie} = item
            if (roditel === parentId) {
                const childs = this.renderNestedList(data, kod)
                list.push(
                    childs && childs.length
                        ? <TreeSelect.TreeNode
                            id={kod}
                            value={`${kod}`}
                            key={kod}
                            title={nazvanie}>
                            {childs}
                            </TreeSelect.TreeNode>
                        :
                        <TreeSelect.TreeNode
                            id={kod}
                            value={`${kod}`}
                            key={kod}
                            title={nazvanie}
                        />
                )
            }
        })
        return list
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const {validateFields, resetFields} = this.props.form
        validateFields((err) => {
            if (!err) {
                resetFields()
            }
        })
    }

    selectedSectionId = (id) => {
        const {resourcesId, getDatas, resources} =  this.props
        resourcesId(id)
        getDatas(resources)
    }

    render() {
        const {sections, resources, closeForm} = this.props

        return (
            <Form style={{marginBottom: '15px'}} onSubmit={this.handleSubmit}>
                {this.renderSectionsTree(sections)}
                    <Form.Item label='Ресурсы' >
                        <Select
                            multiple
                            onDeselect={this.selectedSectionId}
                            onChange={this.selectedSectionId}
                            optionFilterProp="children"
                            placeholder='Выберите русурсы'
                        >
                            {resources.map( (el, ids) => {
                                return ( <Select.Option
                                        key={`${el.kod}_${ids}`}
                                        value={el.kod}
                                        >
                                        {el.name}
                                    </Select.Option>)
                            })}
                        </Select>
                    </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(WorkspacesForm)
