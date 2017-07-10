export const MON_API_HOST = location.hostname === 'localhost' ? 'http://vm-ais-normativ.ursip.ru/ws-mon/v1/' :  location.protocol + '//' + location.host + '/ws-mon/v1/' // Микросервис "Мониторинг"
export const ORG_API_HOST = location.hostname === 'localhost' ? 'http://vm-ais-normativ.ursip.ru/ws-org/v1/' :  location.protocol + '//' + location.host + '/ws-org/v1/' // Микросервис "Организации"
export const AUTHORIZATION_API_URL = location.hostname === 'localhost' ? 'http://vm-auth.ursip.ru/ws-auth/v1/' :  location.protocol + '//' + location.host + '/ws-auth/v1/' // Микросервис "Авторизации"

/** Link to modules */
export const MON = location.hostname === 'localhost' ? 'http://vm-ais-normativ.ursip.ru/monitoring/' :  location.protocol + '//' + location.host + '/monitoring/' // Микросервис "Мониторинг"
export const ORG = location.hostname === 'localhost' ? 'http://vm-ais-normativ.ursip.ru/org/' :  location.protocol + '//' + location.host + '/org/' // Микросервис "Организации"
export const AUTHORIZATION = location.hostname === 'localhost' ? 'http://vm-auth.ursip.ru/auth/' :  location.protocol + '//' + location.host + '/auth/' // Микросервис "Авторизации"
export const MACHINE = location.hostname === 'localhost' ? 'http://vm-ais-normativ.ursip.ru/machine/' :  location.protocol + '//' + location.host + '/machine/' // Микросервис "Машины и механизмы"


