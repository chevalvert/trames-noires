import './Splashscreen.scss'
import { r, n, d } from '/utils/state'
import { Component } from '/utils/jsx'

import Store from '/store'
import Button from '/components/Button'
import Nut from '/favicons/icon.svg?raw'

import IconNew from 'iconoir/icons/edit-pencil.svg?raw'
import IconRestore from 'iconoir/icons/refresh.svg?raw'

export default class Splashscreen extends Component {
  beforeRender (props) {
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      hasNoLines: d(Store.app.lines, lines => !lines.length)
    }
  }

  template (props, state) {
    return (
      <section
        class='splashscreen'
      >
        <div class='splashscreen__content'>
          <div class='splashscreen__icon' innerHTML={Nut} />

          {(props.loading
            ? <Button label='Chargement…' store-is-waiting={r(true)} />
            : <fieldset store-class-group={n(state.hasNoLines)}>
              <Button
                label='Nouveau dessin'
                icon={IconNew}
                event-click={e => {
                  Store.app.lines.set([])
                  this.handleClick(e)
                }}
              />
              <Button
                icon={IconRestore}
                store-hidden={state.hasNoLines}
                event-click={this.handleClick}
              />
            </fieldset>
          )}
        </div>
      </section>
    )
  }

  async handleClick (e) {
    if (!e.shiftKey && document.body.requestFullscreen) {
      await document.body.requestFullscreen()
    }

    this.destroy()
  }
}
