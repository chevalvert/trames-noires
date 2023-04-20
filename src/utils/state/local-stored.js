/* global __NAME__, __VERSION__, localStorage */

import writable from '/utils/state/writable'

const NS = `${__NAME__}@${__VERSION__}/${window.location.pathname}__`

function localStored (key, initialValue, {
  encode = JSON.stringify,
  decode = JSON.parse,
  silent = false
} = {}) {
  const signal = writable(initialValue)

  const ns = NS + key
  const value = localStorage.getItem(ns)

  if (value !== null) {
    try {
      if (silent) signal.current = decode(value)
      else signal.set(decode(value))
    } catch (error) {
      console.warn(`Error while trying to decode ${key} in local storage`)
      console.error(error)
    }
  } else {
    localStorage.setItem(ns, encode(signal.current))
  }

  signal.subscribe(value => localStorage.setItem(ns, encode(value)))
  return signal
}

export default localStored
