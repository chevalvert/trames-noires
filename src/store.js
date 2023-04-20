import { r, w, localStored } from '/utils/state'

import Line from '/abstractions/Line'

import IconWireframeOn from 'iconoir/icons/eye-empty.svg?raw'
import IconWireframeOff from 'iconoir/icons/eye-off.svg?raw'
import IconNoUI from 'iconoir/icons/eye-close.svg?raw'
import IconNoTime from 'iconoir/icons/timer-off.svg?raw'

const Store = {
  AA_AB_FILL_MODE_LENGTH: r(3),

  LINE_WIDTHS: r([
    { value: 10, name: 'medium' },
    { value: 20, name: 'large' },
    { value: 5, name: 'small' }
  ]),

  COLORS: r([
    // Thanks Pico8 !
    { value: '#FFF1E8' },
    { value: '#FF004D' },
    { value: '#FFA300' },
    { value: '#FFEC27' },
    { value: '#00E436' },
    { value: '#29ADFF' },
    { value: '#83769C' },
    { value: '#FF77A8' },
    { value: '#FFCCAA' }
  ]),

  FILL_MODES: r([
    { value: 'AA→AB' },
    { value: 'AA→BB' },
    { value: 'AA→AB→BB' },
    { value: 'AB', icon: IconNoTime }
  ]),

  VIEW_MODES: r([
    { value: 'wireframe', icon: IconWireframeOn },
    { value: 'preview', icon: IconWireframeOff },
    { value: 'no-ui', icon: IconNoUI }
  ]),

  app: {
    proMode: r(window.location.pathname === '/pro'),
    drawMode: w('draw'), // draw|paste
    fillMode: w('AA→AB'), // AB|AA→AB|AA→AB→BB|AA→BB
    viewMode: w('wireframe'), // wireframe|preview|no-ui

    lines: localStored('app.lines', [], {
      encode: lines => JSON.stringify(lines.map(line => line.toJSON())),
      decode: lines => JSON.parse(lines || '[]').map(line => new Line(line))
    }),

    style: w({
      lineWidth: 10,
      strokeStyle: 'white',
      lineJoin: 'round',
      lineCap: 'round'
    })
  },

  raf: {
    fps: r(60),
    maxDuration: w(60 * 5),
    isRunning: w(false),
    frameCount: w(0)
  },

  api: {
    url: r(import.meta.env.VITE_API_URL),
    pollingInterval: r(1000),
    pollingMaxAttempts: r(30),
    version: w(null)
  }
}

window.Store = Store
export default Store
