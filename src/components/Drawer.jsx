import './Drawer.scss'
import { Component } from '/utils/jsx'
import { w } from '/utils/state'

import Store from '/store'
import Line from '/abstractions/Line'
import Canvas from '/components/Canvas'
import Raf from '/controllers/Raf'
import pointer from '/utils/pointer-position'

export default class Drawer extends Component {
  beforeRender (props) {
    this.update = this.update.bind(this)
    this.handleTick = this.handleTick.bind(this)
    this.handlePenDown = this.handlePenDown.bind(this)
    this.handlePenMove = this.handlePenMove.bind(this)
    this.handlePenUp = this.handlePenUp.bind(this)

    this.state = {
      isDisabled: props['store-disabled'] || w(props.disabled),

      penDown: w(false),
      penPosition: w([-1, -1]),
      line: w(null)
    }
  }

  template (props, state) {
    return (
      <section
        class='drawer'
        store-class-has-pen-down={state.penDown}
        store-class-is-disabled={state.isDisabled}
        event-touchstart={this.handlePenDown}
        event-mousedown={this.handlePenDown}
        event-touchend={this.handlePenUp}
        event-mouseup={this.handlePenUp}
      >
        <Canvas ref={this.ref('canvas')} />
      </section>
    )
  }

  afterRender () {
    document.body.addEventListener('mouseleave', this.handlePenUp)
    document.body.addEventListener('touchmove', e => window.requestAnimationFrame(() => this.handlePenMove(e)))
    document.body.addEventListener('mousemove', e => window.requestAnimationFrame(() => this.handlePenMove(e)))

    this.state.line.subscribe(this.update)
    Store.raf.frameCount.subscribe(this.handleTick)
  }

  update () {
    this.refs.canvas.clear()

    const line = this.state.line.get()
    if (!line) return

    line.render(this.refs.canvas.context, {
      frame: Store.raf.frameCount.get(),
      fillMode: 'AB',
      preferSprite: false
    })
  }

  handlePenDown (e) {
    this.state.penDown.set(true)
    this.state.penPosition.set(pointer(e))

    const line = new Line({
      firstFrame: Store.raf.frameCount.get(),
      fillMode: Store.app.fillMode.get(),
      style: Store.app.style.get()
    })

    this.state.line.set(line)
  }

  handlePenMove (e) {
    if (!this.state.penDown.get()) return

    // Manually tick in AB mode to avoid triggering the whole animation logic
    if (Store.app.fillMode.get() !== 'AB') Raf.start()
    else {
      Raf.stop()
      window.requestAnimationFrame(this.handleTick)
    }

    this.state.penPosition.set(pointer(e))
  }

  handleTick () {
    if (!this.state.penDown.get()) return

    const line = this.state.line.get()
    if (!line) return

    // Force pen up when overflowing timeline
    if (line.firstFrame + line.points.length >= Store.raf.maxDuration.get()) {
      this.handlePenUp()
      return
    }

    this.state.line.update(line => {
      line.push(this.state.penPosition.get())
      return line
    }, true)
  }

  handlePenUp (e) {
    this.state.penDown.set(false)

    const line = this.state.line.get()
    this.state.line.set(null)

    if (!line || line.isEmpty) return

    // Transfer line to Store
    Store.app.lines.update(lines => {
      lines.push(line)
      return lines
    }, true)
  }
}
