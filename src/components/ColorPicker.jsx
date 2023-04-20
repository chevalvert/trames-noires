import './ColorPicker.scss'
import { Component } from '/utils/jsx'
import { w } from '/utils/state'
import noop from '/utils/noop'

import classnames from 'classnames'

import Button from '/components/Button'
import IconCircle from 'iconoir/icons/circle.svg?raw'

export default class ColorPicker extends Component {
  beforeRender (props) {
    this.handleValue = this.handleValue.bind(this)

    this.state = {
      value: props['store-value'] || w(props.value),
      isDisabled: props['store-disabled'] || w(props.disabled),
      isHidden: props['store-hidden'] || w(props.hidden)
    }
  }

  template (props, state) {
    return (
      <div class={classnames('color-picker', props.class)}>
        <input
          type='color'
          ref={this.ref('input')}
          store-value={state.value}
          event-input={e => this.state.value.set(e.target.value)}
        />
        <Button
          icon={IconCircle}
          store-disabled={state.isDisabled}
          store-hidden={state.isHidden}
          event-click={e => this.refs.input.click()}
        />
      </div>
    )
  }

  afterMount () {
    this.state.value.subscribe(this.handleValue)
    this.handleValue()
  }

  handleValue () {
    const color = this.state.value.get()
    if (color) this.base.style.setProperty('--color', color)
    else this.base.style.removeProperty('--color')

    ;(this.props['event-change'] || noop)(color)
  }
}
