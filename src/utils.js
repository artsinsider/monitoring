import { OrderedMap, Map, fromJS } from 'immutable'

//Преобразование массива в иммутабельную мапу
export const arrayToMap = (primaryKey, arr, Model) =>
  arr.reduce((acc, el) =>
    acc.set(el[primaryKey], Model ? new Model(el) : fromJS(el)), new Map({}))

export const arrayToOrderedMap = (primaryKey, arr, Model) =>
  arr.reduce((acc, el) =>
    acc.set(el[primaryKey], Model ? new Model(el) : fromJS(el)), new OrderedMap({}))


//Выполнение callback через ms милисекунд c прерыванием предыдущего коллбэка
export const delay = (() => {
  let timer
  return (callback, ms = 300) => {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()

// Форматирование цены в таблице
// ex: 1259 => 1 259.00
export const priceFormat = (number) => {
  // let arr = number.split('.')
  // let result = `${Number(arr[0]).toLocaleString()}.${arr[1]}`
  return number
}
