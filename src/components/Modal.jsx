import './Modal.scss'
import { Component } from '/utils/jsx'
import classnames from 'classnames'

import Button from '/components/Button'
import IconClose from 'iconoir/icons/cancel.svg?raw'
import noop from '/utils/noop'

export default class Modal extends Component {
  beforeRender () {
    this.destroy = this.destroy.bind(this)
  }

  template (props) {
    return (
      <div class='modal__wrapper' {...(props.bigText && { 'event-click': this.destroy })}>
        <section
          class={classnames('modal', props.class, { 'big-text': props.bigText })}
        >
          <header class='modal__header'>
            <h2 class='modal__title'>{props.title}</h2>
            <Button icon={IconClose} event-click={this.destroy} />
          </header>
          <div class='modal__content'>
            {props.children}
          </div>
        </section>
      </div>
    )
  }

  beforeDstroy () {
    if (this.destroyed) return
    ;(this.props['event-close'] || noop)()
  }
}
