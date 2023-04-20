import './Input.scss'
import { Component } from '/utils/jsx'
import { r, w } from '/utils/state'

import classnames from 'classnames'

export default class Input extends Component {
  beforeRender (props) {
    this.update = this.update.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.state = {
      label: props['store-label'] || r(props.label),
      value: props['store-value'] || w(props.value),
      autofocus: props['store-autofocus'] || r(props.autofocus),
      placeholder: props['store-placeholder'] || r(props.placeholder),
      min: props['store-min'] || r(props.min),
      max: props['store-max'] || r(props.max),
      step: props['store-step'] || r(props.step),
      isWaiting: props['store-is-waiting'] || w(false),
      isDisabled: props['store-disabled'] || w(props.disabled),
      isHidden: props['store-hidden'] || w(props.hidden)

    }
  }

  template (props, state) {
    return (
      <div
        class={classnames('input', props.class)}
        store-disabled={state.isDisabled}
        store-hidden={state.isHidden}
        style={props.style}
        event-click={e => {
          this.refs.input.select()
          this.refs.input.focus()
        }}
      >
        {props.label && <label innerHTML={props.label} />}
        <input
          ref={this.ref('input')}
          event-input={this.update}
          event-change={this.handleChange}
          type={props.type}
          size={props.size}
          store-value={state.value}
          store-autofocus={state.autofocus}
          store-placeholder={state.placeholder}
          store-min={state.min}
          store-max={state.max}
          store-step={state.step}
        />
        {props.after && <div class='input__before' innerHTML={props.after} />}
      </div>
    )
  }

  afterMount () {
    this.state.value.subscribe(this.update)
    this.update()
  }

  update () {
    if (this.props.size === 'auto') {
      const length = (String(this.refs.input.value) || '').length || (this.props.placeholder || '').length || 1
      this.refs.input.style.width = length + 'ch'
    }
  }

  handleChange () {
    if (this.props.min !== undefined && this.refs.input.value < this.props.min) {
      this.refs.input.value = this.props.min
    }

    if (this.props.max !== undefined && this.refs.input.value > this.props.max) {
      this.refs.input.value = this.props.max
    }

    this.state.value.set(this.refs.input.value)
  }
}
