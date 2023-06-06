import './Paster.scss'
import { Component } from '/utils/jsx'
import { w } from '/utils/state'

import Store from '/store'
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
    const lastLine = lastOf(Store.app.lines.get())
    if (!lastLine) return

    const [nx, ny] = pointer(e)
    const line = lastLine.clone({
      offset: [
        -(lastLine.points[0][0] - nx),
        -(lastLine.points[0][1] - ny)
      ],
      firstFrame: Store.raf.frameCount.get(),
      style: Object.assign({}, lastLine.style, Store.app.style.current),
      drawMode: Store.app.drawMode.get(),
      fillMode: Store.app.fillMode.get()
    })

    if (!e.shiftKey && Store.app.fillMode.get() !== 'AB') Raf.start()

    // Transfer line to Store
    Store.app.lines.update(lines => {
      lines.push(line)
      return lines
    }, true)
  }
}
