import Store from '/store'

export function clear ({ force = false } = {}) {
  if (!force && !window.confirm('Tout effacer ?')) return
  Store.lines.set([])
  Store.drawMode.set('draw')
}

export function undo () {
  Store.lines.update(lines => lines.slice(0, lines.length - 1), true)
  if (!Store.lines.current.length) Store.drawMode.set('draw')
}

export default {
  clear,
  undo
}
