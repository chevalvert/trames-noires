import './Splashscreen.scss'
import { Component } from '/utils/jsx'

import Nut from '/favicons/icon.svg?raw'

export default class Splashscreen extends Component {
  beforeRender () {
    this.handleClick = this.handleClick.bind(this)
  }

  template (props) {
    return (
      <section class='splashscreen' event-click={this.handleClick}>
        <div class='splashscreen__content'>
          <div class='splashscreen__icon' innerHTML={Nut} />
          <div class='splashscreen__text'>
            cliquer pour commencer
          </div>
        </div>
      </section>
    )
  }

  async handleClick () {
    await document.body.requestFullscreen()
    this.base.remove()
  }
}
