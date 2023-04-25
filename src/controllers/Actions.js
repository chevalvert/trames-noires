import { customAlphabet } from 'nanoid'

import Line from '/shared/Line'

import Store from '/store'
import Api from '/controllers/Api'
import Modal from '/controllers/Modal'
import Raf from '/controllers/Raf'

const nanoid = customAlphabet('0123456789ABCDEF', 6)

export async function clear ({ force = false } = {}) {
  if (!force && !(await Modal.confirm('Tout effacer ?'))) return
  Store.app.lines.set([])
  Store.app.inputMode.set('draw')
}

export function undo () {
  Store.app.lines.update(lines => lines.slice(0, lines.length - 1), true)
  if (!Store.app.lines.current.length) Store.app.inputMode.set('draw')
}

export async function save () {
  const lines = Store.app.lines.current.map(line => line.toJSON())
  try {
    const { uid } = await Api.export(lines, nanoid())
    const url = new URL(window.location)
    url.searchParams.append('uid', uid)
    Modal.bigText(uid, { url })
  } catch (error) {
    Modal.error(error)
  }
}

export async function load (uid) {
  if (!Store.api.version.get()) await new Promise(resolve => Store.api.version.subscribeOnce(resolve))
  try {
    const lines = await Api.import(uid)
    Store.app.lines.set(lines.map(Line.build))
    Raf.start()
  } catch (error) {
    if (error.status && error.status === 404) Modal.say('Impossible de trouver l’animation demandée', { title: 'Erreur' })
    else Modal.error(error)
  }
}

export default {
  clear,
  undo,
  save,
  load
}
