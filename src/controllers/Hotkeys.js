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
    key: 'cmd+z',
    description: 'Effacer le dernier dessin',
    callback: Actions.undo
  },
  {
    key: 'cmd+r',
    description: 'Tout effacer',
    callback: Actions.clear
  },
  {
    key: 'w',
    description: 'Afficher/masquer les dessins à venir',
    callback: () => Store.wireframe.update(w => !w)
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
