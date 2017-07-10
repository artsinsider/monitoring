import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger}  from 'redux-logger'
import apiMiddleware from '../middlewares/api'
import rootReducer from '../reducers'

//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // TODO: убрать в продакшене
const logger = createLogger();
export default createStore(
  rootReducer,
  {},
    applyMiddleware(
      logger,
      thunkMiddleware,
      apiMiddleware
    )
  )
