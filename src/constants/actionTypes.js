// Константы для разделов
export const LOAD_ALL_SECTIONS = 'LOAD_ALL_SECTIONS'
export const FILTER_SECTIONS = 'FILTER_SECTIONS'
export const SET_ACTIVE_SECTION = 'SET_ACTIVE_SECTION'
export const CREATE_SECTION = 'CREATE_SECTION'
export const UPDATE_SECTION = 'UPDATE_SECTION'
export const DELETE_SECTION = 'DELETE_SECTION'
export const LOAD_SECTIONS_BY_PARENTID = 'LOAD_SECTIONS_BY_PARENTID'

//Рабочие области
export const LOAD_ALL_WORKSPACES = 'LOAD_ALL_WORKSPACES'
export const CREATE_WORKSPACE = 'CREATE_WORKSPACE'
export const UPDATE_WORKSPACE = 'UPDATE_WORKSPACE'
export const DELETE_WORKSPACE = 'DELETE_WORKSPACE'

//Единицы измрения
export const LOAD_ALL_UNITS = 'LOAD_ALL_UNITS'
export const CREATE_UNIT = 'CREATE_UNIT'
export const UPDATE_UNIT = 'UPDATE_UNIT'
export const DELETE_UNIT = 'DELETE_UNIT'

//Статусы
export const LOAD_ALL_STATES = 'LOAD_ALL_STATES'
export const CREATE_STATE = 'CREATE_STATE'
export const UPDATE_STATE = 'UPDATE_STATE'
export const DELETE_STATE = 'DELETE_STATE'

//Статусы действий
export const LOAD_ALL_ACTION_STATES = 'LOAD_ALL_ACTION_STATES'
export const CREATE_ACTION_STATE = 'CREATE_ACTION_STATE'
export const UPDATE_ACTION_STATE = 'UPDATE_ACTION_STATE'
export const DELETE_ACTION_STATE = 'DELETE_ACTION_STATE'

//Типы ресурсов
export const LOAD_ALL_RESOURCE_TYPES = 'LOAD_ALL_RESOURCE_TYPES'

//Разновидности мер
export const LOAD_MEASURE = 'LOAD_MEASURE'

// получаем ресурс на редактирование
export const GET_RESOURCES_UPDATE = 'GET_RESOURCES_UPDATE'
export const SEND_RESOURCES = 'SEND_RESOURCES'

// получвем данные для редактирования
export const DATA_RESOURCES_UPDATE = 'DATA_RESOURCES_UPDATE'

// заргрузить все периоды
export const LOAD_PERIODS_FAIL = 'LOAD_PERIODS_FAIL'
export const LOAD_PERIODS = 'LOAD_PERIODS_FAIL'

// изменить текущий периоды
export const CHANGE_CURRENT_PERIOD = 'CHANGE_CURRENT_PERIOD'

// загрузить все статусы периодов
export const LOAD_ALL_PERIOD_STATUSES = 'LOAD_ALL_PERIOD_STATUSES'

// добавить новый периодов
export const ADD_NEW_PERIOD = 'ADD_NEW_PERIOD'

// изменить периодов
export const CHANGE_PERIOD = 'CHANGE_PERIOD'

//Статусы для ajax запросов
export const START = '_START'
export const SUCCESS = '_SUCCESS'
export const FAIL = '_FAIL'

//Ресурсы по разделам
export const LOAD_SECTIONS_RESOURCES = 'LOAD_SECTIONS_RESOURCES'

export const LOAD_ALL_SECTIONS_BY_ID = 'LOAD_ALL_SECTIONS_BY_ID'
export const LOAD_SECTIONS_BY_USER_ID = 'LOAD_SECTIONS_BY_USER_ID'

// Ресурсы по выбранному периоду
export const LOAD_PERIOD_RESOURCES_BY_ID = 'LOAD_PERIOD_RESOURCES_BY_ID'

// Создание цены на поставщика
export const CREATE_VENDOR_PRICE = 'CREATE_VENDOR_PRICE'

// Статусы ресурса
export const  LOAD_STATUS_RESOURCES = 'LOAD_STATUS_RESOURCES'

// Рабочие области
export const CREATE_WORKSPACES = 'CREATE_WORKSPACES'
export const GET_USER_ID = 'GET_USER_ID'
export const GET_RESOURCES_ID = 'GET_RESOURCES_ID'
export const GET_DATA_WORKSPACES= 'GET_DATA_WORKSPACES'

// Поиск данных в таблице
export const SEARCH_WHOLE_TABLE= 'SEARCH_WHOLE_TABLE'
export const RESET_SEARCH= 'RESET_SEARCH'

// Получаем порог значения для формы администрирования
export const LOAD_EXTREME_VALUE = "LOAD_EXTREME_VALUE"
export const UPDATE_EXTREME_VALUE = "UPDATE_EXTREME_VALUE"

// Загрузка списка пользователей
export const LOAD_ALL_USERS = "LOAD_ALL_USERS"
export const GET_COUNT_RESOURCES_USER = "GET_COUNT_RESOURCES_USER"

// Разрешить добавление пользователей ресурсу
export const ADD_USER_TO_RESOURCE = 'ADD_USER_TO_RESOURCE'
export const ADD_USER_TO_RESOURCE_CANCEL = 'ADD_USER_TO_RESOURCE_CANCEL'

// ЗАгружаем список организация
export const LOAD_ALL_ORGANIZATION = 'LOAD_ALL_ORGANIZATION'
export const UPLOAD_RESOURCES_SUCCESS = 'UPLOAD_RESOURCES_SUCCESS'
export const UPLOAD_RESOURCES_FAIL = 'UPLOAD_RESOURCES_FAIL'

// выгрузка отчетов
export const LOAD_REPORT_MONITORING = 'LOAD_REPORT_MONITORING'
export const CALCULATION_METHOD = 'CALCULATION_METHOD'
export const CHANGE_CALCULATION_METHOD = 'CHANGE_CALCULATION_METHOD'
export const LOAD_TIPRESURSOV_SUCCESS = 'LOAD_TIPRESURSOV_SUCCESS'
export const LOAD_TIPRESURSOV = 'LOAD_TIPRESURSOV'
export const LOAD_NEW_USER = 'LOAD_NEW_USER'
export const REFRESH_TOKEN = 'REFRESH_TOKEN'
export const ADD_SECTION = 'ADD_SECTION'
export const EMPLOYEE_ADD_SECTIOONS = 'EMPLOYEE_ADD_SECTIOONS'

/** Загрузка данных по ресурс-периоду для пользователя (role - user) */
export const LOAD_ALL_PERIOD_RESOURCES_FIRST = 'LOAD_ALL_PERIOD_RESOURCES_FIRST'
export const LOAD_ALL_PERIOD_RESOURCES_SECOND = 'LOAD_ALL_PERIOD_RESOURCES_SECOND'
export const LOAD_ALL_PERIOD_RESOURCES = 'LOAD_ALL_PERIOD_RESOURCES'

/** Загрузка данных по ресурс-периоду из раздела для пользователя (role - user) */
export const LOAD_SECTIONS_RESOURCES_FOR_USER_START = 'LOAD_SECTIONS_RESOURCES_FOR_USER_START'
export const LOAD_SECTIONS_RESOURCES_FOR_USER_FIRST = 'LOAD_SECTIONS_RESOURCES_FOR_USER_FIRST'
export const LOAD_SECTIONS_RESOURCES_FOR_USER_SECOND = 'LOAD_SECTIONS_RESOURCES_FOR_USER_SECOND'
export const LOAD_SECTIONS_RESOURCES_FOR_USER_FAIL = 'LOAD_SECTIONS_RESOURCES_FOR_USER_FAIL'