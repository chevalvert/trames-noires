import './Toolbar.scss'
import { d } from '/utils/state'
import { Component } from '/utils/jsx'

import Store from '/store'
import Button from '/components/Button'
import Switcher from '/components/Switcher'

import Actions from '/controllers/Actions'

import IconCircle from 'iconoir/icons/circle.svg?raw'
import IconClear from 'iconoir/icons/trash.svg?raw'
import IconDraw from 'iconoir/icons/edit-pencil.svg?raw'
import IconPaste from 'iconoir/icons/keyframes.svg?raw'
import IconUndo from 'iconoir/icons/undo.svg?raw'
import IconFillMode from 'iconoir/icons/timer.svg?raw'

export default class Toolbar extends Component {
  beforeRender () {
    this.state = {
      hasNoLines: d(Store.app.lines, lines => !lines.length)
    }
  }

  template (props, state) {
    return (
      <section class='toolbar'>
        <fieldset>
          <Switcher
            store-value={Store.app.drawMode}
            values={[
              { icon: IconDraw, label: 'Dessin', value: 'draw', 'store-disabled': state.hasNoLines },
              { icon: IconPaste, label: 'Tampon', value: 'paste' }
            ]}
          />

          <fieldset class='group'>
            <Switcher
              values={Store.LINE_WIDTHS.get().map(({ name, value }) => ({
                value,
                icon: IconCircle,
                class: `disc disc-${name}`
              }))}
              event-change={value => {
                Store.app.style.update(style => ({ ...style, lineWidth: value }), true)
              }}
            />

            <Switcher
              values={Store.COLORS.get().map(({ label, value }) => ({
                value,
                icon: IconCircle,
                class: 'disc',
                style: `--color: ${value}`
              }))}
              event-change={value => {
                Store.app.style.update(style => ({ ...style, strokeStyle: value }), true)
              }}
            />
          </fieldset>

          <Switcher
            values={Store.FILL_MODES.get().map(({ value }) => ({
              value,
              icon: IconFillMode,
              // TODO use animated icon instead of using label
              label: value.replace(/(→)/g, '&thinsp;$1&thinsp;')
            }))}
            event-change={value => Store.app.fillMode.set(value)}
          />
        </fieldset>

        <fieldset>
          <Switcher
            class='view-mode'
            values={Store.VIEW_MODES.get()}
            store-value={Store.app.viewMode}
          />

          <fieldset class='group'>
            <Button
              icon={IconUndo}
              store-disabled={state.hasNoLines}
              event-click={Actions.undo}
            />
            <Button
              icon={IconClear}
              store-disabled={d(Store.app.lines, lines => !lines.length)}
              event-click={Actions.clear}
            />
          </fieldset>
        </fieldset>
      </section>
    )
  }
}
