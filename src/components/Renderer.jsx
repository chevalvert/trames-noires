import './Renderer.scss'
import { Component } from '/utils/jsx'
import { w } from '/utils/state'

import Store from '/store'
import Canvas from '/components/Canvas'

export default class Renderer extends Component {
  beforeRender () {
    this.updateGhost = this.updateGhost.bind(this)
    this.updateCanvas = this.updateCanvas.bind(this)

    this.state = {
      ghostPathData: w('')
    }
  }

  template (props, state) {
    return (
      <section class='renderer'>
        <svg>
          <path class='ghost' store-d={state.ghostPathData} />
        </svg>
        <Canvas ref={this.ref('canvas')} />
      </section>
    )
  }

  afterRender () {
    Store.app.lines.subscribe(this.updateGhost)
    Store.app.lines.subscribe(this.updateCanvas)
    Store.app.viewMode.subscribe(this.updateCanvas)
    Store.raf.frameCount.subscribe(this.updateCanvas)
  }

  afterMount () {
    this.updateGhost()
    this.updateCanvas()
  }

  updateGhost () {
    const lines = Store.app.lines.get()
    if (!lines || !lines.length) {
      this.state.ghostPathData.set('')
      return
    }

    for (const line of lines) {
      // Skip already ghosted lines
      if (line.hasGhost) continue

      // Skip AB lines
      if (line.fillMode === 'AB') continue

      // Skip very short lines
      if (line.points.length <= 5) continue

      this.state.ghostPathData.current += line.pathData + ' '
      line.hasGhost = true
    }

    this.state.ghostPathData.trigger()
  }

  updateCanvas () {
    this.refs.canvas.clear()

    const frame = Store.raf.frameCount.get()
    const { context } = this.refs.canvas

    for (const line of Store.app.lines.get()) {
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
