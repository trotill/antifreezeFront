export const groupContainerStep = 92
export const rangeDefault = {
  voltage: { min: 0, max: 300 },
  power: { min: 0, max: 2000 },
  current: { min: 0, max: 10 },
  temp: { min: -30, max: 40 },
  humidity: { min: 0, max: 100 }
}
export const PREFIX = import.meta.env.VITE_DOMAIN_PREFIX ?? ''
