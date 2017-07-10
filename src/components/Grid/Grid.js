import React, { Component }                               from 'react'
import ReactDataGrid                                      from 'react-data-grid'
import { Draggable, ToolsPanel, Toolbar, Data }           from 'react-data-grid-addons'
import { message, Button, Dropdown, Menu, Icon, Checkbox} from 'antd'
import { connect }                                        from 'react-redux'
import * as periodResources                               from '../../AC/periodResources'
import {columns}                                          from './columns'
import SearchFilter                                       from '../TableData/SearchFilter'
import { isEmpty,find, path ,keys, propEq, equals }               from 'ramda'

class Table extends Component {
  state = {
    columnsGrid: columns,
    columnsHeader: columns.map( el =>  el.key),
    selectedIndexes: [],
    expandedRows: {},
    groupBy: [],
    sortColumn: 'id',
    sortDirection: 'DESC',
    filters: {},
    resourcesKod: [],
    updateComponent: false,
    visible: false,
  }

    shouldComponentUpdate= (nextProps, nextState) => {
        return equals(nextProps.rows == this.props.rows)
    }

    getRows = () =>  Data.Selectors.getRows(this.props)

    getRow = (index) =>   this.getRows()[index]

    onRowsSelected = row => {
        this.setState({
            selectedIndexes: this.state.selectedIndexes.concat(row.map(r => r.rowIdx)),
            resourcesKod: this.state.resourcesKod.concat(row.map(r => r.row.kod))
        })
    }

    onRowsDeselected = rows => {
    const rowIndexes = rows.map(r => r.rowIdx)
    const kodResources = rows.map(r => r.row.kod)
    this.setState({
        selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1 ),
        resourcesKod: this.state.resourcesKod.filter( k => kodResources.indexOf(k) === -1)
        })
    }

    handleGridSort = (sortColumn, sortDirection) => {
        const comparer = (a, b) => {
            if (sortDirection === 'ASC') {
                return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
            } else if (sortDirection === 'DESC') {
                return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
            }
        };
        this.props.rows.sort(comparer)
        this.setState({ sortColumn, sortDirection  })
    }

    handleGridRowsUpdated = row => {
        const { cellKey, fromRow, fromRowId, updated } = row
        switch (cellKey) {
            case 'new':
                updated[cellKey] = updated[cellKey].replace(/,/g, '.').trim()
                //only decimal digits
                return /^[+-]?\d+(\.\d+)?$/.test(updated[cellKey])
                    ?  this.updateRow(fromRow, updated)
                    : message.error('Для ввода разрешены только числа')
            default:
                return this.updateRow(fromRow, updated)
        }

    }

    updateRow(rowId, updated) {
        const { rows } = this.props
        const priceChangeResource = rows.filter( res => rows[rowId].kodResursPeriod === res.kodResursPeriod)[0]
        // const index = rows.findIndex(row => row.id != rowId)
        // const current = { ...rows[rowId], ...updated}
        const targetField = { kodResursPeriod: rows[rowId].kodResursPeriod, updateFild : updated }

       if( path([keys(updated)[0]],priceChangeResource) != path([keys(updated)[0]],updated)) { /** проверят на ввод новых данных*/
            this.props.getResourcesUpdate(targetField)
            this.props.dataResourcesUpdate(targetField)
            this.props.resourcesUpdate(targetField)
            this.setState({ rows })
       }
       return path([keys(updated)[0]], priceChangeResource )
    }

    renderEmptyRow = () => {
        const css = {
            textAlign: 'center',
            position: 'absolute',
            width: '90%',
            top: '50%',
            display: this.props.loading ? 'none' : 'block',
        }
        return (
            <div style={css}>
              Записей нет
            </div>
        )
    }

    onRowExpandToggle = ({ columnGroupName, name, shouldExpand }) => {
        const expandedRows = { ...this.state.expandedRows }
        expandedRows[columnGroupName] = { ...expandedRows[columnGroupName] }
        expandedRows[columnGroupName][name] = {isExpanded: shouldExpand}
        this.setState({ expandedRows })
    }

    onColumnGroupAdded = colName => {
        const columnGroups = this.state.groupBy.slice(0)
        if (columnGroups.indexOf(colName) === -1) {
            columnGroups.push(colName)
        }
        this.setState({groupBy: columnGroups})
    }

    onColumnGroupDeleted = name => {
        this.setState({
            groupBy: this.state.groupBy.filter(group => group !== name)
        })
    }

    saveUsersInResource = () => {
        const { resourcesKod } = this.state
        const resKodLen = resourcesKod.length;
        for (let kod = 0; kod < resKodLen; kod++) {
            kod < resKodLen ? this.setState({ updateComponent: true}) : this.setState({ updateComponent: false})
            this.props.updateUserInResource(resourcesKod[kod], this.props.userSelected.kod)
            resKodLen === kod + 1 ? this.setState({ selectedIndexes:[], resourcesKod:[] }) : this.setState({...this.state})
            // if(resKodLen != 1) { kod+1 == resKodLen ? location.reload() : null}
        }
        this.props.cancelAddUser()
    }

    renderColumn = column => {
        const { columnsGrid } = this.state
        const {checked, defaultValue } = column.target
        const foundColumn = find(propEq('key', defaultValue[0]))(columns);
        if(checked){
           const listColumn =[]
            listColumn.push(...columnsGrid)
            listColumn.push(foundColumn)
            return this.setState({columnsGrid: listColumn.sort((a, b) =>  a.sortIndex - b.sortIndex)})
        }
        return this.setState({  columnsGrid:  columnsGrid.filter( col => col.key != defaultValue[0])  })
    }

    handleVisibleChange = flag => {
        this.setState({ visible: flag })
    }

    /** TO DO для задачи с фильтрацией*/
    // handleFilterChange = (filter) => {
    //     let newFilters = Object.assign({}, this.state.filters);
    //     console.log('filter', filter)
    //     console.log('newFilters', newFilters)
    //     if (filter.filterTerm) {
    //         newFilters[filter.column.key] = filter;
    //     } else {
    //         delete newFilters[filter.column.key];
    //     }
    //
    //     this.setState({ filters: newFilters });
    // }
    //
    // onClearFilters = () => {
    //     this.setState({ filters: {} });
    // }

    render() {
    const { columnsGrid, resourcesKod } = this.state
    const { loading, enableAdd, userSelected={}, rows=[] } = this.props
    const {familiya, imya, otchestvo} = userSelected
    const treeWidth = window.innerWidth - 190
    const menuColumns = (<Menu>
          {columns.map( item =>
              <Menu.Item key={item.key}>
                     <Checkbox key={item.key} onChange={(col)=>this.renderColumn(col)} options={item.key} defaultChecked={true} defaultValue={[item.key]} >{item.name}</Checkbox>
              </Menu.Item>
                )
          }
      </Menu>)

      return (
        <div className="front-table" style={{width:treeWidth }} >
            { enableAdd ?
                <div className="save-add-user" >
                    <Button type="primary" onClick={this.saveUsersInResource}>
                        Сохранить
                    </Button>&emsp;
                    <div className="information-line">
                        {`${familiya} ${imya[0]}. ${otchestvo[0]}. ${'назначить к '} ${this.state.selectedIndexes.length } ${'ресурсам'}`}
                    </div>&emsp;
                    <Button type="primary" onClick={this.props.cancelAddUser}>
                        Отмена
                    </Button>
                 </div>
            : null }

            <ReactDataGrid
                ref="grid"
                enableCellSelect={true}
                enableDragAndDrop={true}
                columns={columnsGrid}
                rowGetter={this.getRow}
                onGridSort={this.handleGridSort}
                rowsCount={this.getRows().length}
                minHeight={window.innerHeight - 171}
                emptyRowsView={this.renderEmptyRow}
                onGridRowsUpdated={this.handleGridRowsUpdated}
                onRowExpandToggle={this.onRowExpandToggle}
                onRowTap={this.saveUsersInResource}

                rowSelection= {{
                    showCheckbox: true,
                    enableShiftSelect: false,
                    onRowsSelected: this.onRowsSelected,
                    onRowsDeselected: this.onRowsDeselected,
                    selectBy: {
                    indexes: this.state.selectedIndexes
                }
                }}
            />
            <div className="footer-bar" >
                <Dropdown overlay={menuColumns} onVisibleChange={this.handleVisibleChange} visible={this.state.visible}>
                    <Button>Столбцы <Icon type="down" /></Button>
                </Dropdown>
                <span style={{marginLeft: 10}} >Количество ресурсов в периоде {this.props.rows.length}</span>
                <span> <SearchFilter /></span>

            </div>
        </div>
      )
  }
}

export default connect(state => ({
  activePeriod:  state.periods.periodSelected,
  periods: state.periods.allPeriods,
  loading: state.periodResources.loading,
  rows: isEmpty(state.periodResources.searchValue) ? state.periodResources.data : state.periodResources.searchData,
  sections: state.sections,
  enableAdd: state.interfaceAction.enableAdd,
  userSelected: state.periodResources.userSelected
}),{ ...periodResources })(Table)


// toolbar={<Toolbar enableFilter={true}/>}
// onAddFilter={this.handleFilterChange}
// onClearFilters={this.onClearFilters}