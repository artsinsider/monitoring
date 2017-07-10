import React               from 'react'
import {connect}           from 'react-redux'
import { Card}             from 'antd'
import { isNil, isEmpty }  from 'ramda'
import './information.css'

function InformationCard (props) {
    const renderField = (label, field) => field ? <div> <span>{ label }</span>  { field }  </div> : null
    const { dataPeriod = {} } = props
    const colorPeriod = {color: '#746959'}
    const userInfoTitile ={color: '#108ee9'}

    return (
        <div className="information-card">
            <Card className="card"  bordered={ true } >
                { renderField(<strong style={colorPeriod}> Период: &nbsp;&nbsp;</strong> , `${isEmpty(dataPeriod) ? '' : dataPeriod.nazvanie}`) }
                { renderField(<strong style={colorPeriod}> Статус периода:&nbsp;&nbsp;</strong>,
                    <div style={{color: isEmpty(dataPeriod) ? '#fff' :  dataPeriod.status.kod === 1 ? '#49a9ee' : dataPeriod.status.kod === 3 ? 'red' : '#746959', display: 'inline-block', marginBottom: 0}} >
                        &nbsp;{isEmpty(dataPeriod) ? '' : dataPeriod.status.nazvanie}
                    </div>) }
                { renderField(<strong style={{color: colorPeriod}}> Тип ресурса:&nbsp;&nbsp;</strong> ,isEmpty(dataPeriod) ? '' : dataPeriod.tip_resursov.nazvanie)}
            </Card>
            <Card className="card"  bordered={ true } >
                { renderField(<strong style={userInfoTitile}>Пользователь: &nbsp;&nbsp;</strong> , isNil(props.user) ? 'no name' : `${props.user.familiya} ${props.user.imya[0]}. ${props.user.otchestvo[0]}.`) }
                { renderField(<strong style={userInfoTitile}>Должность: &nbsp;&nbsp;</strong>,props.userInterfaces.post) }
            </Card>
        </div>
    )
}

export default connect(state => ({
    user: state.user.userData,
    dataPeriod: state.periods.periodSelected
}))(InformationCard)