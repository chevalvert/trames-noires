import './Splashscreen.scss'
import { r } from '/utils/state'
import { Component } from '/utils/jsx'

import Button from '/components/Button'
import Nut from '/favicons/icon.svg?raw'

export default class Splashscreen extends Component {
  beforeRender (props) {
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      isClickable: r(props.clickable !== false)
    }
  }

  template (props, state) {
    return (
      <section
        class='splashscreen'
        store-class-is-clickable={state.isClickable}
        event-click={this.handleClick}
      >
        <div class='splashscreen__content'>
          <div class='splashscreen__icon' innerHTML={Nut} />
          <Button label={props.text || 'Nouveau dessin'} />
        </div>
      </section>
    )
  }

  async handleClick () {
    if (!this.state.isClickable.get()) return

    if (document.body.requestFullscreen) {
      await document.body.requestFullscreen()
    }

    this.destroy()
  }
}
