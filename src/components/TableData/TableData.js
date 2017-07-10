import React, { PureComponent }                                                      from 'react'
import { connect }                                                                   from 'react-redux'
import { Table,  Switch, Icon, Input, Checkbox, Popconfirm, Button, Dropdown, Menu } from 'antd';
import * as periodResources                                                          from '../../AC/periodResources'
import * as resources                                                                from '../../AC/resources'
import SearchFilter                                                                  from './SearchFilter'
import { isEmpty,isNil, negate , find, propEq, slice}                               from 'ramda'
import {columns} from './columns'
import './table.css'
import { priceFormat } from '../../utils'
import $ from 'jquery'

class TableData extends PureComponent {
        state = {
            filterDropdownVisible: false,
            filtered: false,
            searchText: '',
            selectedRowKeys: [],
            columnsGridFade: [],
            checked: true,
            eto_osnovnaya_cena:[],
            columnsGrid: [
                {
                    title: 'ТСН',
                    dataIndex: 'kod_tsn',
                    key: 'kod_tsn',
                    width: 50,
                    sortIndex: 1,
                    render: (text, record, index) => (<div className="handler-card">{text}</div>),
                    onCellClick: (record, event) => this.viweeResources(record.kodResursPeriod),
                    sorter: (a, b) => this.sorterDataTableForBool(a, b, 'kod_tsn')
                    // filterDropdown: (
                    //     <div className="custom-filter-dropdown">
                    //         <Input
                    //             ref={ele => this.searchInput = ele}
                    //             placeholder="Search name"
                    //             value={this.searchText}
                    //             onChange={this.onInputChange}
                    //             onPressEnter={this.onSearch}
                    //         />
                    //         <Button type="primary" onClick={this.onSearch}>Search</Button>
                    //     </div>
                    // ),
                    // filterIcon: <Icon type="smile-o" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
                    // filterDropdownVisible: this.state.filterDropdownVisible,
                    // onFilterDropdownVisibleChange: (visible) => {
                    //     this.setState({
                    //         filterDropdownVisible: visible,
                    //     }, () => this.searchInput.focus())}
                },
                {
                    title: 'Наименование ресурса',
                    dataIndex: 'nazvanie',
                    key: 'nazvanie',
                    width: 120,
                    sortIndex: 2,
                    render: (text, record, index) => (<div className="handler-card">{text}</div>),
                    onCellClick: (record, event) => this.viweeResources(record.kodResursPeriod)
                    ,
                    sorter: (a, b) => this.sorterDataTableForBool(a, b, 'nazvanie')
                },
                {
                    title: 'Цена в периоде (руб.)',
                    dataIndex: 'price',
                    key: 'price',
                    sortIndex: 3,
                    children: [
                        {
                            dataIndex: 'nachalnaya_cena',
                            key: 'nachalnaya_cena',
                            title: 'Прошлый',
                            width: 55,
                            sortIndex: 3,
                            render: (text, record, index) => (<div className="handler-card" style={{float:'right'}}>{priceFormat(text)}</div>),
                            onCellClick: (record, event) => this.viweeResources(record.kodResursPeriod),
                            sorter: (a, b) => this.sorterDataTableForBool(a, b, 'nachalnaya_cena')
                        },
                        {
                            dataIndex: 'izmenennaya_cena',
                            key: 'izmenennaya_cena',
                            title: 'Текущий',
                            width: 55,
                            sortIndex: 4,
                            onCellClick: (record, event) => {  this.setState({edit: true, resId: record.kod})},
                            render: (text, record, index) => !this.state.edit
                                ? this.renderDataPrice(text, index)
                                : this.renderInputPrice(record, index),
                            sorter: (a, b) =>  this.sorterDataTableForBool(a, b, 'izmenennaya_cena'),
                        },
                    ]
                },
                {
                    title: 'Отклонение',
                    dataIndex: 'delta',
                    key: 'delta',
                    width: 60,
                    sortIndex: 4,
                    render: (text, record, index) => this.renderDelta( text, record.nachalnaya_cena, record.izmenennaya_cena),
                    sorter: (a, b) => this.sorterDataTableForBool(a, b, 'delta')
                },
                {
                    title: 'Отклонение основной цены',
                    dataIndex: 'otklonenie_ot_osnovnoi_ceni',
                    key: 'otklonenie_ot_osnovnoi_ceni',
                    sortIndex: 5,
                    width: 60,
                    render: (text, record, index) => this.renderDeviation(record.otklonenie_ot_osnovnoi_ceni),
                    sorter: (a, b) =>  this.sorterDataTableForBool(a, b, 'otklonenie_ot_osnovnoi_ceni')
                },
                {
                    title: 'ТР',
                    dataIndex: 's_transportnymi_rashodami',
                    key: 's_transportnymi_rashodami',
                    render: (status, record, index) => (
                        <Checkbox
                            disabled={this.props.activePeriod.status.kod === 3}
                            checked={record.s_transportnymi_rashodami}
                            onChange={flag => this.props.resourcesUpdate(record.kod, flag.target.checked, 's_transportnymi_rashodami' )}
                        />),
                    width: 40,
                    sortIndex: 6,
                    sorter: (a, b) =>  this.sorterDataTableForBool(a, b, 's_transportnymi_rashodami'),
                    filters: [  { text: 'С транспортными расходами', value: 'true' }, { text: 'Без транспортныч расходов', value: 'false' }  ],
                    onFilter: (value, record) => value.indexOf(''+record.s_transportnymi_rashodami) == 0,
                },
                {
                    title: 'Организации',
                    dataIndex: 'organization',
                    key: 'organization',
                    sortIndex: 7,
                    width: 100,
                    sorter: (a, b) => this.sorterDataTableForBool(a, b, 'organization')
                },
                {
                    title: 'Основная цена',
                    dataIndex: 'eto_osnovnaya_cena',
                    key: 'eto_osnovnaya_cena',
                    sortIndex: 8,
                    width: 45,
                    render: (text, record, index) => (<Checkbox
                        disabled={this.props.activePeriod.status.kod === 3}
                        checked={record.eto_osnovnaya_cena}
                        onChange={flag => {
                            this.props.resourcesUpdate(record.kod, flag.target.checked, 'eto_osnovnaya_cena' )}
                        }
                    />),
                    sorter: (a, b) => this.sorterDataTableForBool(a, b, 'eto_osnovnaya_cena'),
                    filters: [  { text: 'Да', value: 'true' },  { text: 'Нет', value: 'false' }  ],
                    onFilter: (value, record) => value.indexOf(''+record.eto_osnovnaya_cena) == 0,
                },
                {
                    title: 'Проверено',
                    dataIndex: 'proverka',
                    key: 'proverka',
                    sortIndex: 9,
                    width: 60,
                    render: (text, record, index) => {
                        return <Switch
                            disabled={this.props.activePeriod.status.kod === 3}
                            defaultChecked={record.proverka}
                            checkedChildren="Да"
                            unCheckedChildren="Нет"
                            onChange={(flag) => this.props.resourcesUpdate(record.kod, flag, 'proverka' )}
                    />},
                    filters: [
                        { text: 'Проверено', value: 'true' },
                        { text: 'Не проверено', value: 'false' }
                    ],
                    onFilter: (value, record) => value.indexOf(''+record.proverka) == 0,
                    sorter: (a, b) => this.sorterDataTableForBool(a, b, 'proverka'),
                },
                {
                    title: 'Замечания',
                    dataIndex: 'remark',
                    key: 'remark',
                    sortIndex: 10,
                    children: [
                        ,
                        {
                            dataIndex: 'vozvrat_sotrudniku',
                            key: 'vozvrat_sotrudniku',
                            title: 'Начальник',
                            sortIndex: 10,
                            width: 70,
                            render: (text, record, index) => (
                                <Switch className='red-switch'
                                        defaultChecked={record.vozvrat_sotrudniku}
                                        checkedChildren="Есть"
                                        unCheckedChildren="Нет"
                                        onChange={(flag) => this.props.resourcesUpdate(record.kod, flag, 'vozvrat_sotrudniku' )}
                                        disabled={this.props.activePeriod.status.kod === 3 || this.props.userInterfaces.interface.vozvrat_sotrudniku}
                                />),
                            sorter: (a, b) =>  this.sorterDataTableForBool(a, b, 'vozvrat_sotrudniku'),
                            filters: [
                                { text: 'Есть замечания', value: 'true' },
                                { text: 'Не замечаний', value: 'false' }
                            ],
                            onFilter: (value, record) => value.indexOf(''+record.vozvrat_sotrudniku) == 0
                        },
                        {
                            dataIndex: 'vozvrat_rukovoditelju',
                            key: 'vozvrat_rukovoditelju',
                            title: 'Рук-ль',
                            sortIndex: 10,
                            width: 55,
                            render: (text, record, index) => (
                                <Switch className='red-switch'
                                        defaultChecked={record.vozvrat_rukovoditelju}
                                        checkedChildren="Есть"
                                        unCheckedChildren="Нет"
                                        onChange={(flag) => this.props.resourcesUpdate(record.kod, flag, 'vozvrat_rukovoditelju' )}
                                        disabled={this.props.activePeriod.status.kod === 3 || this.props.userInterfaces.interface.vozvrat_rukovoditelju}
                                />),
                            sorter: (a, b) => this.sorterDataTableForBool(a, b, 'vozvrat_rukovoditelju'),
                            filters: [
                                { text: 'Есть замечания', value: 'true' },
                                { text: 'Не замечаний', value: 'false' }
                            ],
                            onFilter: (value, record) => value.indexOf(''+record.vozvrat_rukovoditelju) == 0
                        }
                    ]
                },
                {
                    title: 'Сотрудник',
                    dataIndex: 'sotrudnik',
                    key: 'sotrudnik',
                    sortIndex: 11,
                    width: 80,
                    sorter: (a, b) =>  this.sorterDataTableForBool(a, b, 'sotrudnik'),
                },
                {
                    title: 'Удал.',
                    dataIndex: 'udalena',
                    key: 'udalena',
                    sortIndex: 12,
                    width: 30,
                    render: (text, record, index) => (
                        <Popconfirm placement="left"
                                    okText="Да"
                                    cancelText="Нет"
                                    title="Вы действительно хотите удалить цену поставщика ?"
                                    onConfirm={() => this.props.resourcesUpdate(record.kod, true, 'udalena' )}>
                            <Button className="btn-hidden-wrap" disabled={this.props.activePeriod.status.kod === 3}>
                                <Icon className="delete-resources-table" type="delete" />
                            </Button>
                        </Popconfirm>
                    )
                },
                // {
                //   title: 'Ред.',
                //   dataIndex: 'edit',
                //   key: null,
                //   sortIndex: 13,
                //   width: 30,
                //   render: (text, record, index) => (
                //             <Button className="btn-hidden-wrap" onClick={() => {this.props.openUpdateResources(record.key)}} disabled={this.props.activePeriod.status.kod === 3}>
                //                 <Icon className="edit-resources-table" type="edit" />
                //             </Button>)
                // }
            ]
        };

    viweeResources = (id) => {
        this.changerowClassName(id)
        this.props.openViweeResources(id)
    }

    sorterDataTableForBool = (a ,b, props) => {
        { switch (true) {
                case a[props] < b[props]: return -1
                case a[props] > b[props]: return 1
                default: return 0;
            }
        }
    }

    renderColumn = column => {
        const { columnsGrid, columnsGridFade } = this.state
        const { checked, defaultValue } = column.target
        if(checked){
            const foundColumnFade = find(propEq('dataIndex', defaultValue[0]))(columnsGridFade);
            return this.setState({columnsGrid: [...columnsGrid,foundColumnFade].sort((a, b) =>  a.sortIndex - b.sortIndex)})
        }
        const foundColumn = find(propEq('dataIndex', defaultValue[0]))(columnsGrid);
        return this.setState({  columnsGrid:  columnsGrid.filter( col => col.key != defaultValue[0]) , columnsGridFade: [...columnsGridFade, foundColumn] })
    }

    handleVisibleChange = flag => this.setState({ visible: flag })

    renderFoterList = () => {
        const menuColumns =  (
            <Menu>
                { this.identifyRoleUser(columns).map( (item, i) =>
                    <Menu.Item key={item.dataIndex}>
                        <Checkbox key={item.dataIndex}
                                  onChange={(col)=>this.renderColumn(col)}
                                  options={item.dataIndex} defaultChecked={true}
                                  defaultValue={[item.dataIndex]} >
                            {item.title}
                        </Checkbox>
                    </Menu.Item>)
                }
            </Menu>)

    return <div>
                 <Dropdown overlay={menuColumns} onVisibleChange={this.handleVisibleChange} visible={this.state.visible}>
                    <Button>Столбцы <Icon type="down" /></Button>
                 </Dropdown>
                <SearchFilter />
           </div>
    }

    /** Расчет отклоенения */
    renderDelta( delta, previousValue, nextValue) {
         const {extremeValue} = this.props
         if (delta === ''){ return null }
            const controlTypeDelta = isNil(delta) ? 0.1 : delta;
            const controlDelta = (Math.sign(controlTypeDelta) == 1 ? controlTypeDelta : negate(controlTypeDelta))
            const controlArrow = nextValue > previousValue ? "arrow-up" :"arrow-down";
            if( extremeValue[0].znachenie <= controlDelta ){
                return (<span style={{margin: '0 21%'}}>
                            {controlDelta == 'Infinity' ? null : <span style={{color: 'red'}}>{`${controlDelta}${'%'}`} <Icon type={controlArrow} /></span> }
                        </span>)
            }
            if( extremeValue[0].znachenie >= controlDelta ) {
                return <span style={{margin: '0 21%'}}>
                            {controlDelta == 'Infinity' ? null : <span style={{color: '#49a9ee'}}>{`${controlDelta}${'%'}`} <Icon type={controlArrow} /></span>}
                       </span>
            }
            if(controlDelta == 0) {return controlDelta}
        }

    /** Расчет отклоенения от основной цены */
    renderDeviation = (val) => {
         return Math.sign(val) == 1 ? <div style={{color: '#49a9ee',margin: '0 30%'}} >{`${val} %`}</div> : <div style={{color: 'red', margin: '0 30%'}} >{`${negate(val)} %`}</div>
    }

    changerowClassName = record => this.props.resourcesId === record.kod ? 'highlight' : ''

    renderDataPrice = (text, index) =>  <div className="render-price" key={index} >{priceFormat(text)}</div>

    renderInputPrice = (price, index) => {
        if(this.state.resId === price.kod && this.props.activePeriod.status.kod !== 3){
           return <div className="render-input-price">
                 <Input
                     ref="priceInput"
                     autoFocus
                     onFocus={(event) => this.handleFocus(event)}
                     onBlur={()=>{ this.setState({ resId: undefined }) }}
                     key={index}
                     onPressEnter={(el) =>{
                       this.props.resourcesUpdate(this.state.resId, el.target.value * 100, 'izmenennaya_cena' )
                       this.setState({resId: price.kod})} }
                     defaultValue={price.izmenennaya_cena === 0 ? '' : price.izmenennaya_cena }
                     onKeyDown={(event) => this.handleArrowKeys(event)}
                 />
                  </div>
        }
        return this.renderDataPrice(price.izmenennaya_cena, index)
    }

    onSelectChange = (selectedRowKeys) => this.setState({ selectedRowKeys });
    
    handleFocus = (event) => {
      event.persist()
      // Still not focused here from autofocus, need to do this through
      // setTimeout to select the text in input
      setTimeout(function() { event.target.select() }, 50)
    }
    
    handleArrowKeys = (event) => {
        const currentTR = $(event.target).parentsUntil('.ant-table-tbody')[2]
        switch (event.key) {
            case ('ArrowUp'): {
                let target = $(currentTR).prev().children()
                    .filter(function (item) { 
                      return $(this).children().is('div.render-price') 
                    })
                $(target).click()
                break;
            }
            case ('ArrowDown'): {
                let target = $(currentTR).next().children()
                    .filter(function (item) { 
                      return $(this).children().is('div.render-price') 
                    })
                $(target).click()
                break;
            }
            default:
                break;
        }
    }

    identifyRoleUser = (columns) => {
        // const { role } = this.props.userInterfaces
        // if (role === 'leader') {
        //   return columns
        // } else if (role === 'chief') {
        //   return columns.filter(col => (col.dataIndex !== 'edit'))
        // }
        // return columns.filter(col => (col.dataIndex !== 'edit' && col.dataIndex !== 'sotrudnik'))
        const { role } = this.props.userInterfaces
        return role === 'user' ? columns.filter(col => (col.dataIndex !== 'sotrudnik')) : columns
    }

    render() {
        const { selectedRowKeys } = this.state;
        /** TO DO -- может понадобиться*/
        //rowSelection={ rowSelection }
        const rowSelection = {
            // onSelect: (record, selected) => console.log('record',record, selected),
            // onSelectAll: (selected, selectedRows) => console.log('selected, selectedRows, changeRows',selected, selectedRows),
            selectedRowKeys,
            onChange: this.onSelectChange,
            selections: [{
                key: 'odd',
                text: 'Выбрать половину',
                onSelect: (changableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                        if (index % 2 !== 0) { return false; }
                        return true;
                    });
                    this.setState({ selectedRowKeys: newSelectedRowKeys });
                },
            }],
            onSelection: this.onSelection,
        };

        const { rows, userInterfaces , resourcesId } = this.props
        const { columnsGrid } = this.state
        const dataSource = rows.map((item) => {
            const obj = {};
            Object.keys(item).forEach((key) => {
                obj[key] = key === 'key' ? item[key] : item[key];
            });
            return obj;
        });

        const pagination = {
            total: rows.length,
            showTotal: total => `Всего ресурсов: ${total}`,
            showSizeChanger: true,
            pageSizeOptions: ['100', '200', '400'],
            showQuickJumper: true,
            defaultPageSize: 100
        }

        /** TO DO убрал футер -- возможно временно*/
        // footer={ () => this.renderFoterList() }

        return (
                <Table
                    ref={(table) => this.table = table}
                    size="middle"
                    bordered
                    dataSource={dataSource}
                    columns={this.identifyRoleUser(columnsGrid)}
                    rowKey="kod"
                    //onRowClick={ (row) => row }
                    rowClassName={ this.changerowClassName }
                    pagination={ pagination }
                    scroll={{ y: window.innerHeight - 310, x: 1100}}
                 />
        )
    }
}

export default connect(state => ({
    activePeriod: state.periods.periodSelected,
    loading: state.periodResources.loading,
    rows: isEmpty(state.periodResources.searchValue) ? state.periodResources.data : state.periodResources.data.filter( resources => state.periodResources.searchData.includes(resources.kodResursPeriod.value)),
    enableAdd: state.interfaceAction.enableAdd,
    userSelected: state.periodResources.userSelected,
    extremeValue: state.periodResources.extremeValue,
    resourcesId:  state.resources.resourcesId,
    done: state.periodResources.done
}),{ ...periodResources, ...resources })(TableData)



