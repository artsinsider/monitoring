import React, { Component }             from 'react'
import { connect }                      from 'react-redux'
import { Button, Menu, Dropdown, Icon } from 'antd';
import { loadReportsMonitoring }        from '../../AC/reports'
const SubMenu = Menu.SubMenu

const styles = {
    container: {
      display: 'inline',
      width: '350px'
    },
    menuRoot: {
      width: '460px'
    },
    menuChild: {
      width: '100px',
      color:'#4d4d4d'
    },
    icon: {
      color:'#49A9EE'
    }
}

class Reports extends Component {
    state = {
        reportLoading: false,
        loading: false,
        iconLoading: false,
        delayLoading: false,
        reportsTypes:[
            { kod: 0 , type: 'RESULT_PERIOD_CALC_METHOD_MON', des: 'Отчет по списку отпускных цен в зависимости от выбранного метода вычислений' },
            { kod: 1 , type: 'RESULT_NOT_FALL_CORRIDOR' , des: 'Отчет по списку отпускных цен, которые не попали в установленный коридор'},
            { kod: 2 , type: 'RESULT_PERIOD_MON' , des: 'Отчет по списку отпускных цен за период'},
            { kod: 3 , type: 'FOUR_PERIODS_MON' , des: 'Отчет по списку отпускных цен поставщиков за 4 периода'}
        ] ,
    }

    handleMenuClick = (e)=> {
        debugger;
        const { periodsActiv } = this.props
        const clickedItem = e.key.split('.')
        const key = clickedItem[0]
        const fileType = clickedItem[1]
        const reportType = this.state.reportsTypes.filter( type => { return key == type.kod } )
        this.props.loadReportsMonitoring(reportType[0].type, periodsActiv.kod, fileType ,periodsActiv.nazvanie, reportType[0].des)
    }

    render() {
        const { reportLoading = false} = this.props
        const menu = (
            <Menu style={styles.menuRoot} onClick={this.handleMenuClick}>
                {this.state.reportsTypes.map((reports, i) =>
                    <SubMenu key={reports.kod} title={`${reports.des}`}>
                      <Menu.Item style={styles.menuChild} key={reports.kod+'.EXCEL'}>
                          <Icon style={styles.icon} type="file-excel" /> &emsp;{`Excel`}
                      </Menu.Item>
                      <Menu.Item style={styles.menuChild} key={reports.kod+'.PDF'}>
                          <Icon style={styles.icon} type="file-pdf" /> &emsp;{`PDF`}
                      </Menu.Item>
                  </SubMenu>) }
            </Menu>
        );

        return (
            <div style={styles.container}>
                <Dropdown overlay={menu}>
                    <Button type="primary" loading={reportLoading} onClick={() => {}}>
                        Выберите тип отчета <Icon type="down" />
                    </Button>
                </Dropdown>
            </div>
        )
    }
}

export default connect(state => ({
    reportLoading: state.reports.reportLoading,
    periods: state.periods.allPeriods,
    periodsActiv: state.periods.periodSelected,
    currentPeriod: state.periods.currentPeriod
}), { loadReportsMonitoring })(Reports)


