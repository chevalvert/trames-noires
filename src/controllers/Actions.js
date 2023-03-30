import Store from '/store'
import Line from '/abstractions/Line'
import Api from '/controllers/Api'
import Raf from '/controllers/Raf'

export function clear ({ force = false } = {}) {
  if (!force && !window.confirm('Tout effacer ?')) return
  Store.app.lines.set([])
  Store.app.drawMode.set('draw')
}

export function undo () {
  Store.app.lines.update(lines => lines.slice(0, lines.length - 1), true)
  if (!Store.app.lines.current.length) Store.app.drawMode.set('draw')
}

export async function save () {
  const lines = Store.app.lines.current.map(line => line.toJSON())
  const { uid } = await Api.export(lines)
  // TODO modal
  console.log(uid)
}

export async function load (uid) {
  if (!Store.api.version.get()) await new Promise(resolve => Store.api.version.subscribeOnce(resolve))
  const lines = await Api.import(uid)
  // TODO handle 404
  Store.app.lines.set(lines.map(line => new Line(line)))
  Raf.start()
}

export default {
  clear,
  undo,
  save,
  load
}
