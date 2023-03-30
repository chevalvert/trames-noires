import '/index.jsx'
import '/test/test.scss'

import Store from '/store'
import Line from '/abstractions/Line'
import Raf from '/controllers/Raf'

Raf.start()
Store.app.lines.set([
  new Line({
    points: [[183, 488], [183, 476], [185, 455], [191, 433], [198, 408], [207, 383], [215, 366], [225, 348], [240, 331], [258, 317], [280, 303], [303, 289], [322, 280], [343, 271], [368, 261], [386, 257], [407, 254], [437, 253], [462, 253], [490, 254], [517, 260], [537, 265], [572, 277], [587, 284], [604, 293], [623, 304], [641, 316], [662, 333], [674, 346], [686, 359], [696, 371], [704, 381], [712, 390], [718, 398], [722, 403], [725, 410], [728, 415], [729, 423], [730, 427], [730, 432], [730, 436], [729, 438], [728, 440]],
    fillMode: 'AA→AB',
    firstFrame: 0,
    style: {
      lineWidth: 10,
      strokeStyle: '#FFF1E8',
      lineJoin: 'round',
      lineCap: 'round'
    }
  }),
  new Line({
    points: [[188, 507], [193, 507], [198, 507], [202, 507], [209, 506], [215, 506], [222, 506], [228, 505], [235, 505], [242, 505], [250, 505], [257, 504], [264, 504], [271, 504], [280, 503], [284, 503], [290, 502], [297, 502], [303, 501], [308, 501], [313, 500], [318, 500], [324, 499], [330, 498], [338, 497], [347, 495], [356, 493], [367, 492], [378, 490], [389, 488], [402, 487], [416, 486], [430, 484], [440, 484], [454, 482], [469, 480], [486, 478], [510, 476], [528, 475], [550, 473], [570, 471], [589, 469], [607, 467], [622, 466], [636, 466], [646, 465], [656, 465], [662, 465], [668, 465], [674, 465], [679, 464], [685, 464], [690, 464], [696, 464], [703, 464], [711, 464], [720, 464], [727, 464], [733, 464], [735, 464]],
    fillMode: 'AA→BB',
    firstFrame: 0,
    style: {
      lineWidth: 10,
      strokeStyle: '#FFF1E8',
      lineJoin: 'round',
      lineCap: 'round'
    }
  }),
  new Line({
    points: [[185, 542], [185, 542], [185, 542], [185, 542], [185, 542], [185, 542], [185, 542], [185, 542], [185, 542], [186, 542], [195, 542], [210, 542], [242, 542], [272, 542], [310, 542], [340, 542], [364, 542], [386, 542], [405, 542], [419, 543], [433, 544], [449, 545], [464, 545], [480, 546], [496, 546], [513, 547], [525, 547], [537, 547], [547, 547], [559, 547], [571, 547], [581, 547], [590, 546], [599, 545], [607, 545], [615, 544], [623, 544], [630, 543], [638, 542], [646, 542], [652, 541], [659, 541], [665, 540], [670, 539], [676, 538], [680, 536], [685, 535], [689, 534], [694, 532], [699, 531], [703, 530], [707, 529], [711, 528], [713, 527], [715, 526], [716, 526], [717, 525]],
    fillMode: 'AA→AB→BB',
    firstFrame: 12,
    style: {
      lineWidth: 10,
      strokeStyle: '#FFF1E8',
      lineJoin: 'round',
      lineCap: 'round'
    }
  }),
  new Line({
    points: [[179, 591], [179, 591], [179, 591], [179, 591], [179, 591], [179, 591], [179, 591], [179, 591], [179, 591], [179, 591], [179, 591], [183, 591], [185, 591], [190, 591], [202, 591], [212, 591], [227, 591], [242, 591], [257, 591], [273, 591], [287, 591], [300, 591], [310, 591], [322, 591], [335, 591], [349, 591], [364, 591], [379, 591], [395, 591], [409, 591], [424, 591], [439, 590], [456, 588], [474, 587], [490, 586], [505, 585], [518, 585], [529, 585], [538, 585], [547, 585], [555, 585], [560, 585], [567, 585], [573, 584], [578, 584], [584, 583], [592, 583], [597, 583], [606, 583], [615, 583], [623, 584], [632, 585], [640, 586], [646, 586], [651, 586], [655, 586], [660, 586], [666, 586], [672, 586], [679, 586], [685, 586], [691, 586], [695, 586], [699, 586], [703, 586], [706, 586], [709, 585], [713, 584], [717, 584], [721, 583], [726, 583], [728, 582], [730, 582], [732, 582], [734, 582], [736, 581], [737, 581], [738, 581], [738, 581], [739, 581], [739, 581], [739, 581], [739, 581], [739, 581], [739, 581]],
    fillMode: 'AB',
    firstFrame: 4,
    style: {
      lineWidth: 10,
      strokeStyle: '#FFF1E8',
      lineJoin: 'round',
      lineCap: 'round'
    }
  })
])
