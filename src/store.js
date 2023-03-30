import { r, w } from '/utils/state'

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
    { value: 'AB' }
  ]),

  app: {
    drawMode: w('draw'), // draw|paste
    fillMode: w('AA→AB'), // AB|AA→AB|AA→AB→BB|AA→BB
    wireframe: w(true),

    lines: w([]),
    style: w({
      lineWidth: 10,
      strokeStyle: 'white',
      lineJoin: 'round',
      lineCap: 'round'
    })
  },

  raf: {
    fps: r(60),
    maxDuration: r(60 * 5),
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
