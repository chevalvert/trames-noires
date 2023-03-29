import '/index.jsx'
import '/test/test.scss'

import Store from '/store'
import Line from '/abstractions/Line'
import Raf from '/controllers/Raf'

Raf.start()
Store.lines.set([
  new Line({
    points: [[271, 782], [271, 760], [276, 697], [305, 589], [346, 485], [399, 403], [453, 345], [492, 327], [527, 329], [548, 358], [551, 414], [545, 478], [535, 517], [528, 537], [522, 551], [521, 554], [534, 535], [567, 491], [605, 448], [645, 420], [680, 406], [704, 412], [717, 443], [717, 498], [705, 567], [681, 640], [653, 707], [625, 761], [597, 808]],
    style: {
      strokeStyle: 'white',
      lineWidth: 10,
      lineJoin: 'round',
      lineCap: 'round'
    }
  })
])
