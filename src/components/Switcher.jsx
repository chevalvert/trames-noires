import './Switcher.scss'
import { Component } from '/utils/jsx'
import { w } from '/utils/state'

import classnames from 'classnames'
import Button from '/components/Button'
import noop from '/utils/noop'

export default class Switcher extends Component {
  beforeRender (props) {
    this.state = {
      value: w(((props.values || [])[0] || {}).value)
    }
  }

  template (props, state) {
    return (
      <div icon={classnames('switcher', props.class)}>
        {props.values.map((props, index) => (
          <Button
            {...props}
            ref={this.refArray('buttons')}
            event-click={() => this.handleChange(index + 1)}
          />
        ))}
      </div>
    )
  }

  afterMount () {
    this.handleChange(0, this.state.value.get())
  }

  handleChange (index) {
    index = index % this.props.values.length

    const prop = this.props.values[index]
    ;(this.props['event-change'] || noop)(prop.value)
    this.state.value.set(prop.value)

    for (let i = 0; i < this.refs.buttons.length; i++) {
      this.refs.buttons[i].state.isHidden.set(i !== index)
    }
  }
}
