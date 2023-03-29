import './Splashscreen.scss'
import { Component } from '/utils/jsx'

import Button from '/components/Button'
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
          <Button label='Nouveau dessin' />
        </div>
      </section>
    )
  }

  async handleClick () {
    await document.body.requestFullscreen()
    this.destroy()
  }
}
