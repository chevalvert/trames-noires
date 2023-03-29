import './Button.scss'
import { Component } from '/utils/jsx'
import { r, w } from '/utils/state'
import noop from '/utils/noop'

import classnames from 'classnames'

export default class Button extends Component {
  beforeRender (props) {
    this.animate = this.animate.bind(this)
    this.handleClick = this.handleClick.bind(this)

    this.state = {
      label: props['store-label'] || r(props.label),
      isWaiting: props['store-is-waiting'] || w(false),
      isDisabled: props['store-disabled'] || w(props.disabled),
      isHidden: props['store-hidden'] || w(props.hidden)
    }
  }

  template (props, state) {
    return (
      <button
        class={classnames('button', props.class)}
        store-class-is-waiting={state.isWaiting}
        store-disabled={state.isDisabled}
        store-hidden={state.isHidden}
        event-click={this.handleClick}
        event-mouseenter={props['event-mouseenter'] || noop}
        event-mouseleave={props['event-mouseleave'] || noop}
        title={props.title}
        style={props.style}
        type={props.type}
      >
        {props.icon && (
          <div
            class='button__icon'
            ref={this.ref('icon')}
            innerHTML={props.icon}
          />
        )}
        <div class='button__text' store-innerHTML={state.label} />
      </button>
    )
  }

  afterRender () {
    this.state.isHidden.subscribe(this.animate)
  }

  animate () {
    // Trigger animation on icon if any
    if (this && this.refs && this.refs.icon) {
      this.refs.icon.style.animation = 'none'
      void this.refs.icon.offsetHeight // eslint-disable-line no-void
      this.refs.icon.style.animation = null
    }
  }

  async handleClick (e) {
    if (this.state.isWaiting.get()) return e.preventDefault()

    this.state.isWaiting.set(true)
    await (this.props['event-click'] || noop)(e)

    // Testing for mounted before doing anything, because the event-click may
    // cause this component to be destroyed
    if (!this.mounted) return
    this.state.isWaiting.set(false)

    this.animate()
  }
}
