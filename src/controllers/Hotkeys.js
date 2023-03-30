import Hotkeys from 'Hotkeys-js'

import Store from '/store'
import Raf from '/controllers/Raf'
import Actions from '/controllers/Actions'

export default [
  {
    key: 'space',
    description: 'Jouer ou stopper l’animation',
    callback: Raf.toggle
  },
  {
    key: 'left',
    description: 'Reculer d’une image',
    callback: () => {
      Raf.stop()
      Store.raf.frameCount.update(fc => Math.max(0, fc - 1))
    }
  },
  {
    key: 'shift+left',
    description: 'Reculer de 10 images',
    callback: () => {
      Raf.stop()
      Store.raf.frameCount.update(fc => Math.max(0, fc - 10))
    }
  },
  {
    key: 'right',
    description: 'Avancer d’une image',
    callback: () => {
      Raf.stop()
      Store.raf.frameCount.update(fc => Math.min(fc + 1, Store.raf.maxDuration.get()))
    }
  },
  {
    key: 'shift+right',
    description: 'Avancer de 10 images',
    callback: () => {
      Raf.stop()
      Store.raf.frameCount.update(fc => Math.min(fc + 10, Store.raf.maxDuration.get()))
    }
  },
  {
    key: 'cmd+z',
    description: 'Effacer le dernier dessin',
    callback: Actions.undo
  },
  {
    key: 'cmd+x',
    description: 'Tout effacer',
    callback: Actions.clear
  },
  {
    key: 'w',
    description: 'Afficher/masquer les dessins à venir',
    callback: () => Store.app.wireframe.update(w => !w)
  }
].map(register)

export function register (hotkey) {
  hotkey.callback && (!hotkey.disabled) && Hotkeys(hotkey.key, event => {
    if (hotkey.filter && hotkey.filter(event)) return

    event.preventDefault()
    event.stopPropagation()

    hotkey.callback(event)
  })

  return hotkey
}
