import './Toolbar.scss'
import { d } from '/utils/state'
import { Component } from '/utils/jsx'

import Store from '/store'
import Button from '/components/Button'
import Switcher from '/components/Switcher'

import IconCircle from 'iconoir/icons/circle.svg?raw'
import IconClear from 'iconoir/icons/trash.svg?raw'
import IconDraw from 'iconoir/icons/edit-pencil.svg?raw'
import IconRepeat from 'iconoir/icons/keyframes-couple.svg?raw'
import IconUndo from 'iconoir/icons/undo.svg?raw'

export default class Toolbar extends Component {
  beforeRender () {
    this.handleUndo = this.handleUndo.bind(this)

    this.state = {
      hasNoLines: d(Store.lines, lines => !lines.length)
    }
  }

  template (props, state) {
    return (
      <section class='toolbar'>
        <fieldset>
          <fieldset>
            <Button
              icon={IconDraw}
              store-hidden={d(Store.mode, m => m !== 'draw')}
              event-click={() => Store.mode.set('paste')}
            />
            <Button
              icon={IconRepeat}
              store-hidden={d(Store.mode, m => m !== 'paste')}
              event-click={() => Store.mode.set('draw')}
            />
          </fieldset>

          <Switcher
            values={Store.LINE_WIDTHS.get().map(({ label, value }) => (
              { icon: IconCircle, class: `disc disc-${label}`, value }
            ))}
            event-change={value => {
              Store.style.update(style => ({ ...style, lineWidth: value }), true)
            }}
          />

          <Switcher
            values={Store.COLORS.get().map(({ label, value }) => (
              { icon: IconCircle, class: 'disc', style: `--color: ${value}`, value }
            ))}
            event-change={value => {
              Store.style.update(style => ({ ...style, strokeStyle: value }), true)
            }}
          />
        </fieldset>

        <fieldset>
          <Button
            icon={IconUndo}
            store-disabled={state.hasNoLines}
            event-click={this.handleUndo}
          />
          <Button
            icon={IconClear}
            store-disabled={d(Store.lines, lines => !lines.length)}
            event-click={() => {
              if (window.confirm('Tout effacer ?')) Store.lines.set([])
            }}
          />
        </fieldset>
      </section>
    )
  }

  handleUndo () {
    Store.lines.update(lines => lines.slice(0, lines.length - 1), true)
  }
}
