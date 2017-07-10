import React, {PureComponent}                   from 'react'
import {connect}                            from 'react-redux'
import {Spin, Icon, Tabs, Layout, Button, Progress}   from 'antd'
import {Resizable, ResizableBox}            from 'react-resizable'
import SearchFilter                         from './TableData/SearchFilter'
import Treev2                               from './Sections/Treev2'
import Treev3                               from './Sections/Treev3'
import Grid                                 from './Grid'
import Admin                                from './Admin'
import TableData                            from './TableData/TableData'
import ListActionsAnResources               from './ResourceForm/ListActionsAnResources'
import ResourceForm                         from './ResourceForm/ResourceForm'
import Error                                from './Error/Error'
import UpdateResourceForm                   from './ResourceForm/UpdateResourceForm'
import DeleteResourceForm                   from './ResourceForm/DeleteResourceForm'
import PeriodSelect                         from './PeriodSelect/PeriodSelect'
import PeriodsForm                          from './PeriodsForm/PeriodsForm'
import Reports                              from './Reports/Reports'
import Users                                from './Users/Users'
import Employees                            from './Users/Employees'
import InformationCard                      from './InformationCard/InformationCard'
import {SectionControls, SectionsTree}      from './Sections'
import ActionWrapper                        from './ActionWrapper/ActionWrapper'
import {selectedTabs}                       from '../AC/interfaceAction'
import {redirect, extiModule}               from '../config/redirect'
import * as Moduls                          from '../constants/api'

const TabPane = Tabs.TabPane;
const { Footer } = Layout;
class App extends PureComponent {
    state = {
        blur: false
    }

    render() {
        const treeHeight = window.innerHeight - 200
        const pageWidth = window.innerWidth  < 1024
        const logo = 'url("static/img/icon_mon_2.svg")'
        const userInterfaces = redirect().userInterfaces
        const {loading} = this.props
        const styleSpin = { width:window.innerWidth, height:window.innerHeight, maxHeight:window.innerHeight, background: 'rgba(255, 255, 255, 0.5)', zIndex: '999' , position: 'absolute'}
        const serviceTop ={width: pageWidth? '17.5%' :"13%"}
        const serviceName ={backgroundImage: logo,paddingLeft: pageWidth? '40px': '60px' }
        const serv = {maxWidth: pageWidth? '55%' :"66%", marginLeft: pageWidth ? '0px' : '-21px', display: 'flex'}
        const resourceForm = {width: '17%', paddingLeft: '5px', position: 'absolute', top: 38, right: 0}

        return (
                <ActionWrapper token={redirect().token} role={redirect().role} >
                    {loading ? <Spin spinning={ loading } tip="Загрузка данных справочника..."  style={styleSpin}> </Spin> : null}
                    {redirect().flag ? '' :
                        <div>
                        <div className="service"  >
                            <div className="service-top">
                                    <div style={serviceTop}>
                                        <h3 className="service-name" style={serviceName}>АИС &laquo;Норматив&raquo;
                                            <small>Мониторинг</small>
                                        </h3>
                                    </div>
                                <div className="serv" style={serv} >
                                    <Tabs defaultActiveKey="periods"
                                          tabPosition="top"
                                          tabBarStyle={{maxWidth: 800}}
                                          onChange={ e => this.props.selectedTabs(e)}>
                                         <TabPane tab={<span><Icon type="appstore-o"/> Периоды </span>} key="periods">
                                            <div className="button-row">
                                                <PeriodSelect userInterfaces={userInterfaces} />
                                                {userInterfaces.interface.periods ? <PeriodsForm  userInterfaces={userInterfaces} btnText="Управление периодами" btnType="primary"/>: null }
                                                {userInterfaces.interface.unist ? <Admin/>: null }
                                                {/*<Button type="primary" onClick={ () => this.setState({blur: !this.state.blur})} >Bluur</Button>*/}
                                            </div>
                                        </TabPane>
                                        {userInterfaces.interface.section ?
                                            <TabPane tab={<span><Icon type="bars"/> Разделы </span>} key="section">
                                                <div className="button-row">
                                                    <SectionControls />
                                                </div>
                                            </TabPane>
                                        : null }
                                        {userInterfaces.interface.resources ?
                                        <TabPane tab={<span><Icon type="tool"/> Ресурсы </span>} key="resources">
                                            <div className="button-row">
                                                <ListActionsAnResources/>
                                            </div>
                                        </TabPane>
                                         : null }
                                        {userInterfaces.interface.reports ?
                                             <TabPane tab={<span><Icon type="solution"/> Отчеты / Пользователи  </span>}
                                                     key="reports">
                                                 { this.props.interfaceAction === 'reports' ? <div className="button-row">
                                                    <Reports />
                                                     <Employees/>
                                                </div> : null}
                                            </TabPane>
                                        : null }
                                    </Tabs>
                                </div>
                                <div className="info">
                                    <InformationCard userInterfaces={userInterfaces} />
                                </div>
                            </div>
                            <div className="service-body">
                                <ResizableBox width={215} height={-50} axis="x" minConstraints={[0]}>
                                    <div className="tree-box" style={{height: treeHeight + 55, overflow: 'auto'}}>
                                        {<SectionsTree userInterfaces={userInterfaces.interface} style={{height: treeHeight}}/>}
                                    </div>
                                </ResizableBox>
                                <div className="service-right" style={{ height: treeHeight , position: 'relative'}}>
                                    <div style={{width: '83%'}}>
                                        <SearchFilter />
                                        <TableData userInterfaces={userInterfaces}/>
                                    </div>
                                    <div style={resourceForm}>
                                        <ResourceForm />
                                    </div>
                                </div>
                            </div>
                        </div>
                            <Footer>
                                < div className="navigation-services">
                                    <a className="img-auth" href={Moduls.AUTHORIZATION} onClick={() => extiModule()} rel="noopener noreferrer" title="Авторизация"> </a>
                                    <a className="img-organization"  href={Moduls.ORG} target="_blank" rel="noopener noreferrer" title="Справочник организаций"> </a>
                                    <a className="img-mon active" href={Moduls.MON} target="_blank" rel="noopener noreferrer" title="Мониторинг"></a>
                                    <a className="img-machine" href={Moduls.MACHINE} target="_blank" rel="noopener noreferrer" title="Машины и механизмы"> </a>
                                    <a href="http://ursip.ru/" target="_blank">
                                        <img className="img-ursip" src="static/img/ursip-logo.svg" alt="Ursip"/>
                                    </a>
                                </div>
                            </Footer>
                        <UpdateResourceForm/>
                        <DeleteResourceForm/>
                        <Error/>
                        </div>
                    }
                </ActionWrapper>
        )
    }
}

export default connect(state => ({
    visibleModal: state.resources.visibleModalView,
    loading: state.periodResources.loading,
    data: state.periodResources.data,
    interfaceAction: state.interfaceAction.selectedTabs
}), {selectedTabs})(App)

// {!this.state.blur ? null : <div style={{ width:window.innerWidth, height:window.innerHeight , background: 'rgba(255, 255, 255, 0.5)', zIndex: '999' , position: 'absolute'}} >
//         <p> Выполнеине операции ...</p>
//         <Progress className='propgressss' percent={75} format={percent => `${percent} Days`} />
//     </div>}