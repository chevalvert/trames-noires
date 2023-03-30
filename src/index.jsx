/* global __VERSION__ */

import '/index.scss'
import { render } from '/utils/jsx'

import App from '/components/App'
import '/controllers/Hotkeys'

console.log(`${__VERSION__}-${import.meta.env.MODE}`)
render(<App />)
