import {interfaceSettings} from './InterfaceSettings'
import {isNil}             from 'ramda'

export function redirect() {
    /** TO DO для локаольной разработки */
    if(location.hostname == 'localhost') {
        const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzb21vdiIsImlzcyI6InJ1LnVyc2lwIiwiaWF0IjoxNDk1NDc0MzkzLCJleHAiOjE0OTU0ODMzOTN9.7cMGUJg2qQNJ_tVBSCX2a5xFOHq-mhifgKfyrRapcrwdNoOK5GpmKodLP-_PllnCCOOzDYGcXg7Fhz7XUbPsog"
        return {flag :false, token: token ,userInterfaces: interfaceSettings.dolotov}
    }

    if (isNil(localStorage.getItem('token'))) {
        localStorage.setItem('decidedURL', location.pathname)
        window.location.href = location.hostname === 'localhost' ? 'http://vm-auth.ursip.ru/auth/' :  location.protocol + '//' + location.host + '/auth/'
        return {flag :true, token: ''}
    }
    const userRole =  interfaceSettings[localStorage.getItem('login')]
    return {flag :false, token: localStorage.getItem('token'), role: userRole.role , userInterfaces: interfaceSettings[localStorage.getItem('login')]}
}

export function extiModule() {
    localStorage.clear();
    localStorage.setItem('decidedURL', location.pathname)
}