/* global __VERSION__ */

import '/index.scss'
import { render } from '/utils/jsx'

import App from '/components/App'
import Splashscreen from '/components/Splashscreen'

import '/controllers/Hotkeys'
import Api from '/controllers/Api'
import Actions from '/controllers/Actions'

console.log(`${__VERSION__}-${import.meta.env.MODE}`)
const uid = new URLSearchParams(window.location.search).get('uid')

;(async () => {
  Api.polling.start()

  if (uid) {
    const { components } = render(<Splashscreen text='Chargement…' clickable={false} />)
    await Actions.load(uid)
    components[0].destroy()
  } else {
    if (import.meta.env.PROD) render(<Splashscreen />)
  }

  render(<App />)
})()
