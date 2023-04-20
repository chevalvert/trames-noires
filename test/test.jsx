import '/index.jsx'
import '/test/test.scss'

import Store from '/store'
import Raf from '/controllers/Raf'

Raf.start()
Store.app.lines.set([])
