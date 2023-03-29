import './Paster.scss'
import { Component } from '/utils/jsx'
import { w } from '/utils/state'

import Store from '/store'
import Line from '/abstractions/Line'
import Raf from '/controllers/Raf'
import pointer from '/utils/pointer-position'
import lastOf from '/utils/array-last'

export default class Drawer extends Component {
  beforeRender (props) {
    this.handleClick = this.handleClick.bind(this)

    this.state = {
      isDisabled: props['store-disabled'] || w(props.disabled)
    }
  }

  template (props, state) {
    return (
      <section
        class='paster'
        store-class-is-disabled={state.isDisabled}
        event-click={this.handleClick}
      />
    )
  }

  handleClick (e) {
    const lastLine = lastOf(Store.lines.get())
    if (!lastLine) return

    const [nx, ny] = pointer(e)
    const dx = lastLine.points[0][0] - nx
    const dy = lastLine.points[0][1] - ny

    // TODO[optim] directly point to the cloned line and use an offset property
    const line = new Line({
      points: lastLine.points.map(([x, y]) => [x - dx, y - dy]),
      firstFrame: Store.raf.frameCount.get(),
      style: Object.assign({}, lastLine.style, Store.style.current),
      fillMode: Store.fillMode.get()
    })

    Raf.start()

    // Transfer line to Store
    Store.lines.update(lines => {
      lines.push(line)
      return lines
    }, true)
  }
}
