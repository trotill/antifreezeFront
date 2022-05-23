export function rawToXY (sensor, ts) {
  return sensor.map((v, idx) => ({ x: ts[idx], y: v }))
}

export const deepMerge = (target, source) => {
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
