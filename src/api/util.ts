import { errorToast } from 'src/api/toast'
import { ErrorHandler } from 'src/api/types/requestTypes'

export function rawToXY (sensor:number[], ts:number[]) {
  return sensor.map((v:number, idx:number) => ({ x: ts[idx], y: v }))
}

export const deepMerge = (target:any, source:any) => {
  for (const elem in source) {
    if (!target[elem]) {
      target[elem] = {}
    }
    if (source[elem] instanceof Object) {
      if (Array.isArray(source[elem])) {
        target[elem] = [...source[elem]]
      } else {
        target[elem] = deepMerge(target[elem], source[elem])
      }
    } else {
      target[elem] = source[elem]
    }
  }
  return target
}

export const deepCopy = (window.structuredClone) || ((v) => JSON.parse(JSON.stringify(v)))

export const errorHandler = ({ result, param, state }:ErrorHandler) => {
  if (result.status === 405) {
    errorToast(`Change ${param}:${state} not allowed for you`)
    return
  }
  if (!result?.meta) {
    errorToast(`Error send data ${param}:${state}`)
  }
}
