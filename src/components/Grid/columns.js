import React                       from 'react'
import { connect }                 from 'react-redux'
import { Select, Icon, Switch }    from 'antd';
import {negate, isNil}             from 'ramda'
import * as resources              from '../../AC/resources'
import {transportationCostsUpdate} from '../../AC/periodResources'

/** Форматтер для меню статусов */
const selectedStatus = connect(state =>({
    resourcesFoolStatus: state.resources.resourcesFoolStatus
}) , { ...resources })( React.createClass({
    getInitialState() {
        return {
            value: this.props.value.status,
            kod: this.props.value.resursKod,
        };
    },
    render() {
    const {value, chengeStatusResources, resourcesFoolStatus} = this.props
    return(
        <div className="select_in_grid">
            <Select
                style={{ width: 120 }}
                placeholder="Статус ресурса"
                optionFilterProp="children"
                onChange={ (val) => {
                    chengeStatusResources( value.resursKod, resourcesFoolStatus.filter( status => status.nazvanie == val)[0])
                    value.status = val
                    this.setState({value: val})
                    this.forceUpdate()
                }}
                value={this.state.value}
            >
                {resourcesFoolStatus.map( status => {return <Select.Option key={status.kod} value={status.nazvanie} >{status.nazvanie}</Select.Option>})}
            </Select>
        </div>
    )}
}))

/** Форматтер для выводв сотрудников */
const node = React.createClass({
    render() {
        return (  <span style={{color: '#49a9ee'}}> {this.props.value}  </span>); }
});

/** Форматтер для вывода delta */
const extrem = React.createClass({
    render() {
        const {value} = this.props
        if (value === ''){ return null }
        const {delta, extremeVal, nextValue, previousValue } = value
        const controlTypeDelta = isNil(delta) ? 0.1 : delta;
        const controlDelta = Math.sign(controlTypeDelta) == 1 ? controlTypeDelta : negate(controlTypeDelta);
        const controlArrow = nextValue > previousValue ? "arrow-up" :"arrow-down";

        if( extremeVal <= controlDelta ){
            return <span>
                        <span style={{color: 'red'}}> {`${controlDelta}${'%'}`} </span>
                        <Icon type={controlArrow} />
                    </span>
            }

        if( extremeVal >= controlDelta ) {
            return <span>
                        <span style={{color: '#49a9ee'}}>{`${controlDelta}${'%'}`}</span>
                        <Icon type={controlArrow} />
                   </span>
            }

        if(controlDelta == 0) {return controlDelta}
    }
});

/** Форматтер для выводв иконки просмотра */
const view =  connect(state =>({
}) , { ...resources })(React.createClass({
    render() {
        const {value, openViweeResources } = this.props
        return (
            <Icon
                key={value}
                style={{color: '#49a9ee'}}
                className="editable-cell-icon-check"
                type='search'
                onClick={() => openViweeResources(value)}
            />
        );
    }
}))

/** Форматтер для выводв иконки редактирования */
const edit =  connect(state =>({
}) , { ...resources })(React.createClass({
    render() {
        const {value, openUpdateResources } = this.props
        return (
            <Icon
                key={value.kod}
                style={{color: '#49a9ee'}}
                className="editable-cell-icon-check"
                type='edit'
                onClick={() => openUpdateResources(value)}
            />
        );
    }
}))

/** Форматтер для выводв иконки удаления */
const deleted = connect(state =>({
}) , { ...resources })( React.createClass({
    render() {
        const {value, openDeleteResources } = this.props
        return (
            <Icon
                key={this.props.value.kod}
                style={{color: 'red'}}
                className="editable-cell-icon-check"
                type='delete'
                onClick={() => openDeleteResources(value)}
            />
        );
    }
}))

const transportationCosts =  connect(state =>({
}) , { transportationCostsUpdate })( React.createClass({
    render() {
        const { value, transportationCostsUpdate } = this.props
        return (
            <Switch defaultChecked={value.transportation} checkedChildren="Да" unCheckedChildren="Нет" onChange={(flag) => transportationCostsUpdate(value.resursKod, flag)} />
        );
    }
}))

export const columns =  [
    {
        key: 'kod_tsn',
        name: 'ТСН',
        resizable: true,
        editable: false,
        sortable: true,
        filterable: true,
        sortIndex: 1
    },
    {
        key: 'nazvanie',
        name: 'Наименование ресурса',
        resizable: true,
        editable: false,
        sortable: false,
        filterable: true,
        sortIndex: 2
    },
    {
        key: 'nachalnaya_cena',
        name: 'Цена за прошлый период',
        resizable: true,
        editable: false,
        sortable: true,
        filterable: true,
        sortIndex: 4
    },
    {
        key: 'izmenennaya_cena',
        name: 'Цена за текущий период',
        resizable: true,
        editable: true,
        sortable: true,
        filterable: true,
        sortIndex: 5
    },
    {
        key: 'delta',
        name: 'Отклонение',
        resizable: true,
        editable: false,
        sortable: false,
        formatter: extrem,
        filterable: true,
        sortIndex: 6,
        width: 75
    },
    {
        key: 's_transportnymi_rashodami',
        name: 'Транc. расходы',
        resizable: true,
        editable: false,
        sortable: true,
        editor: transportationCosts,
        formatter: transportationCosts,
        filterable: true,
        sortIndex: 12
    },

    {
        key: 'primechanie',
        name: 'Примечание',
        resizable: true,
        editable: false,
        sortable: true,
        formatter: node,
        filterable: true,
        sortIndex: 14

    },
    {
        key: 'proizvoditel',
        name: 'Производитель',
        resizable: true,
        editable: false,
        sortable: true,
        formatter: node,
        filterable: true,
        sortIndex: 14

    },
    {
        key: 'organization',
        name: 'Организации',
        resizable: true,
        editable: false,
        sortable: true,
        formatter: node,
        filterable: true,
        sortIndex: 15

    }
]



