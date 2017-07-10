import React, {Component} from 'react'
import WorkspacesForm from './WorkspacesForm'
import {Form, Icon, Button, Select, Card, Spin, Table} from 'antd'

const FormItem = Form.Item
const FormInit = Form.create()
let uuid = 0

class DynamicFormItem extends Component {
    state = {
        bordered: false,
    }

    /**
     * Удаление item workspaces
     */
    removeWorkspaces = (k) => {
        const {form} = this.props
        const keys = form.getFieldValue('keys')
        if (keys.length === 0) {
            return
        }
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        })
    }

    /**
     * Добавляем item workspaces
     */
    addWorkspaces = () => {
        uuid++
        const {form, createWorkspaces} = this.props
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(uuid)
        createWorkspaces(uuid)
        form.setFieldsValue({
            keys: nextKeys,
        })
    }

    /**
     * Данные созданных workspaces
     */
    tableDataSource = () => {
        const {workspaces} = this.props
        const dataSource = []
        const actionsDel = <Button type="dashed" icon="delete" disabled> </Button>
        const actionsUpdate = <Button type="dashed" icon="setting" disabled> </Button>
        const actionsStatistic = <Button type="dashed" icon="pie-chart" disabled> </Button>
        workspaces.map(el => {
            return ( dataSource.push(
                {
                    key: el.id,
                    name: el.kod_sotrudnika,
                    resources: el.kolichestvo_resursov,
                    actions: [actionsUpdate, actionsDel, actionsStatistic]
                }))
        })
        return dataSource
    }

    /**
     * Хедер таблицы workspaces
     */
    headerDataSource = () => {
        const columns = [{
            title: 'Имя сотрудника',
            dataIndex: 'name',
            key: 'dataIndex'
        }, {
            title: 'Количество ресурсов',
            dataIndex: 'resources',
            key: 'resources'
        }, {
            title: 'Действия',
            dataIndex: 'actions',
            key: 'actions'
        }];
        return columns
    }

    render() {
        const {sections, resources, users = [], userId, resourcesId, getDatas, userKod = 'undefined', showLoadrWoek, loading}  = this.props
        const {getFieldDecorator, getFieldValue} = this.props.form
        getFieldDecorator('keys', {initialValue: []})
        const keys = getFieldValue('keys')
        const formItems = keys.map((k) => {
            return (
                <FormItem required={false} key={k} id={'' + k}>
                    <WorkspacesForm
                        id={keys}
                        key={k}
                        closeForm={this.closeForm}
                        sections={sections}
                        resources={resources}
                        users={users}
                        resourcesId={resourcesId}
                        getDatas={getDatas}
                        showLoadrWoek={showLoadrWoek}
                    />
                    <div className='button-minus'>
                        <Button
                            type="dashed"
                            disabled={keys.length === 0}
                            onClick={() => this.removeWorkspaces(k)}
                        >
                            <Icon
                                type="minus"
                            />
                            Удалить раздел
                        </Button>
                    </div>
                </FormItem>
            )
        })

        return (
            <Form>
                <Form.Item label='Сотрудник'>
                    <Select onSelect={userId} optionFilterProp="children" placeholder='Выберите сотрудника'>
                        {users.map((e, id) => {
                            return ( <Select.Option
                                key={`${e.kod}_${id}`}
                                value={e.kod}
                            >
                                {e.name}
                            </Select.Option>)
                        })}
                    </Select>
                </Form.Item>

                {formItems}

                { userKod != 'undefined' ?
                    <div className='button-plus'>
                        <Button
                            type="dashed"
                            onClick={this.addWorkspaces}
                            style={{width: '60%'}}
                            disabled={keys.length != 0}
                        >
                            <Icon type="plus"/>
                            Добавить раздел
                        </Button>
                    </div>
                    : null}

                {userKod != 'undefined' ?
                    <FormItem >
                        <div className='button-submit-end'>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large">
                                Сохранить
                            </Button>
                        </div>
                    </FormItem>
                    : null}
                <Spin spinning={loading} tip="Загрузка данных...">
                    <p style={{marginTop: 20}}>Имена ключи, пока нет модуля авторизации</p>
                    <Table
                        {...this.state}
                        pagination={false}
                        dataSource={this.tableDataSource()}
                        columns={this.headerDataSource()}
                    />
                </Spin>
            </Form>
        )
    }
}

export default FormInit(DynamicFormItem)