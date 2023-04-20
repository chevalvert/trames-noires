import './Toolbar.scss'
import { d } from '/utils/state'
import { Component } from '/utils/jsx'

import Store from '/store'
import Button from '/components/Button'
import ColorPicker from '/components/ColorPicker'
import Switcher from '/components/Switcher'

import Actions from '/controllers/Actions'

import IconCircle from 'iconoir/icons/circle.svg?raw'
import IconClear from 'iconoir/icons/trash.svg?raw'
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
            store-disabled={state.hasNoLines}
            store-value={Store.app.inputMode}
            values={Store.INPUT_MODES.get()}
          />

          <fieldset class='group'>
            {Store.app.proMode.get() && (
              <Switcher
                store-value={Store.app.drawMode}
                values={Store.DRAW_MODES.get()}
              />
            )}

            <Switcher
              values={Object.entries(Store.LINE_WIDTHS.get()).map(([name, value]) => ({
                value,
                icon: IconCircle,
                class: `disc disc-${name}`
              }))}
              event-change={value => {
                Store.app.style.update(style => ({ ...style, ...value }), true)
              }}
            />

            {(
              Store.app.proMode.get()
                ? <ColorPicker
                    event-change={value => {
                      Store.app.style.update(style => ({ ...style, strokeStyle: value }), true)
                    }}
                  />
                : <Switcher
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
            )}

          </fieldset>

          <Switcher
            values={Store.FILL_MODES.get().map(({ value, icon }) => ({
              value,
              icon: icon || IconFillMode,
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
