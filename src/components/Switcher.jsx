import './Switcher.scss'
import { Component } from '/utils/jsx'
import { w } from '/utils/state'

import classnames from 'classnames'
import Button from '/components/Button'
import noop from '/utils/noop'

export default class Switcher extends Component {
  beforeRender (props) {
    this.update = this.update.bind(this)
    this.state = {
      value: props['store-value'] || w(((props.values || [])[0] || {}).value)
    }
  }

  template (props, state) {
    return (
      <div class={classnames('switcher', props.class)}>
        {props.values.map((props, index) => (
          <Button
            {...props}
            ref={this.refArray('buttons')}
            event-click={() => this.handleChange(this.props.values[(index + 1) % this.props.values.length])}
          />
        ))}
      </div>
    )
  }

  afterMount () {
    this.state.value.subscribe(this.update)
    this.update()
  }

  update () {
    const index = this.props.values.findIndex(({ value }) => value === this.state.value.current)

    for (let i = 0; i < this.refs.buttons.length; i++) {
      this.refs.buttons[i].state.isHidden.set(i !== index)
    }
  }

  handleChange (props) {
    ;(this.props['event-change'] || noop)(props.value)
    this.state.value.set(props.value)
  }
}
