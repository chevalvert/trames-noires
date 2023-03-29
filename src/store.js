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

  // App state
  drawMode: w('draw'), // draw|paste
  wireframe: w(true),
  fillMode: w('AA→AB'), // AB|AA→AB|AA→AB→BB|AA→BB
  style: w({
    lineWidth: 10,
    strokeStyle: 'white',
    lineJoin: 'round',
    lineCap: 'round'
  }),
  lines: w([]),

  // Controllers
  raf: {
    fps: r(60),
    maxDuration: r(60 * 2),
    isRunning: w(false),
    frameCount: w(0)
  }
}

window.Store = Store
export default Store
