export function rawToXY (sensor, ts) {
  return sensor.map((v, idx) => ({ x: ts[idx], y: v }))
}
