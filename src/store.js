import { r, w, localStored } from '/utils/state'

import Line from '/shared/Line'

import IconFreehand from 'iconoir/icons/design-nib.svg?raw'
import IconNoTime from 'iconoir/icons/timer-off.svg?raw'
import IconNoUI from 'iconoir/icons/eye-close.svg?raw'
import IconPaste from 'iconoir/icons/keyframes.svg?raw'
import IconPencil from 'iconoir/icons/edit-pencil.svg?raw'
import IconWireframeOff from 'iconoir/icons/eye-off.svg?raw'
import IconWireframeOn from 'iconoir/icons/eye-empty.svg?raw'

const Store = {
  INPUT_MODES: r([
    { icon: IconPencil, label: 'Dessin', value: 'draw' },
    { icon: IconPaste, label: 'Tampon', value: 'paste' }
  ]),

  LINE_WIDTHS: r({
    medium: { lineWidth: 10, perfectFreehand: { size: 15, thinning: 0.65, smoothing: 0.77, streamline: 0.6 } },
    large: { lineWidth: 20, perfectFreehand: { size: 30, thinning: 0.8, smoothing: 0.77, streamline: 0.6 } },
    small: { lineWidth: 5, perfectFreehand: { size: 7.5, thinning: 0.5, smoothing: 0.01, streamline: 0.6 } }
  }),

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

  DRAW_MODES: r([
    { value: 'smooth', icon: IconPencil },
    { value: 'freehand', icon: IconFreehand }
  ]),

  app: {
    proMode: r(new URLSearchParams(window.location.search).has('pro')),

    inputMode: w('draw'), // draw|paste
    fillMode: w('AA→AB'), // AB|AA→AB|AA→AB→BB|AA→BB
    viewMode: w('wireframe'), // wireframe|preview|no-ui
    drawMode: w('smooth'), // raw|smooth|freehand

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
    maxDuration: localStored('raf.maxDuration', 60 * 5),
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
