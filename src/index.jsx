/* global __VERSION__ */

import '/index.scss'
import { render } from '/utils/jsx'

import App from '/components/App'

console.log(`${__VERSION__}-${import.meta.env.MODE}`)
render(<App />)
