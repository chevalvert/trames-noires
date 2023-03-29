import { r, w } from '/utils/state'

const Store = {
  // Constants
  MAX_LINE_LENGTH: r(40),
  LINE_WIDTHS: r([
    { label: 'small', value: 5 },
    { label: 'medium', value: 10 },
    { label: 'large', value: 20 }
  ]),
  COLORS: r([
    // Thanks Pico8 !
    { label: 'white', value: '#FFF1E8' },
    { label: 'red', value: '#FF004D' },
    { label: 'orange', value: '#FFA300' },
    { label: 'yellow', value: '#FFEC27' },
    { label: 'green', value: '#00E436' },
    { label: 'blue', value: '#29ADFF' },
    { label: 'lavender', value: '#83769C' },
    { label: 'pink', value: '#FF77A8' },
    { label: 'light-peach', value: '#FFCCAA' }
  ]),

  // App state
  mode: w('draw'), // draw|paste
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
    maxDuration: r(120),
    isRunning: w(false),
    frameCount: w(0)
  }
}

window.Store = Store
export default Store
