import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { LocaleProvider } from 'antd'
import ruRU from 'antd/lib/locale-provider/ru_RU'
import App from './components/App'
import store from './store'

import 'antd/dist/antd.min.css'
import './index.css'

const Root = () => (
  <Provider store={store}>
    <LocaleProvider locale={ruRU}>
      <App/>
    </LocaleProvider>
  </Provider>
)

render(<Root />, document.getElementById('monitoring'))
