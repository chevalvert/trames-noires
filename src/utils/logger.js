import noop from '/utils/noop'

export default function logger (prefix, color, background, mute) {
  if (mute) return { log: noop, warn: noop, error: noop }

  const pre = []
  prefix = prefix.toUpperCase()

  pre.push(`%c ${prefix} `)
  let style = 'font-weight:bold;'
  if (color) style += `color:${color};`
  if (background) style += `background-color:${background}`
  pre.push(style)

  return {
    log: console.log.bind(console, ...pre),
    warn: console.warn.bind(console, ...pre),
    error: console.error.bind(console, ...pre)
  }
}
