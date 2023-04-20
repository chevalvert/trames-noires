import './Renderer.scss'
import { Component } from '/utils/jsx'

import Store from '/store'
import Canvas from '/components/Canvas'

export default class Renderer extends Component {
  beforeRender () {
    this.handleTick = this.handleTick.bind(this)
  }

  template (props, state) {
    return (
      <section class='renderer'>
        <Canvas ref={this.ref('canvas')} />
      </section>
    )
  }

  afterRender () {
    Store.app.lines.subscribe(this.handleTick)
    Store.app.viewMode.subscribe(this.handleTick)
    Store.raf.frameCount.subscribe(this.handleTick)
  }

  afterMount () {
    this.handleTick()
  }

  handleTick () {
    this.refs.canvas.clear()

    const frame = Store.raf.frameCount.get()
    const viewMode = Store.app.viewMode.get()
    const { context } = this.refs.canvas

    for (const line of Store.app.lines.get()) {
      // Draw dashed ghost
      if (viewMode === 'wireframe' && line.fillMode !== 'AB') {
        line.render(context, {
          fillMode: 'AB',
          style: {
            lineWidth: 2,
            strokeStyle: 'rgba(255 255 255 / 50%)',
            lineDash: [10, 10]
          }
        })
      }

      // Draw current line
      line.render(context, { frame, smoothed: true })

      // Draw debug in test env
      if (import.meta.env.MODE === 'test') {
        line.render(context, {
          frame,
          smoothed: false,
          style: { strokeStyle: 'red' }
        })
      }
    }
  }
}
