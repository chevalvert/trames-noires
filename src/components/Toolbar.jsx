import './Toolbar.scss'
import { d, not } from '/utils/state'
import { Component } from '/utils/jsx'

import Store from '/store'
import Button from '/components/Button'
import Switcher from '/components/Switcher'

import Actions from '/controllers/Actions'

import IconCircle from 'iconoir/icons/circle.svg?raw'
import IconClear from 'iconoir/icons/trash.svg?raw'
import IconDraw from 'iconoir/icons/edit-pencil.svg?raw'
import IconRepeat from 'iconoir/icons/keyframes.svg?raw'
import IconUndo from 'iconoir/icons/undo.svg?raw'
import IconWireframeOn from 'iconoir/icons/eye-off.svg?raw'
import IconWireframeOff from 'iconoir/icons/eye-empty.svg?raw'
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
          <fieldset>
            <Button
              icon={IconDraw}
              label='Dessin'
              class='button--draw-mode'
              store-hidden={d(Store.app.drawMode, m => m !== 'draw')}
              store-disabled={state.hasNoLines}
              event-click={() => Store.app.drawMode.set('paste')}
            />
            <Button
              icon={IconRepeat}
              label='Tampon'
              class='button--draw-mode'
              store-hidden={d(Store.app.drawMode, m => m !== 'paste')}
              event-click={() => Store.app.drawMode.set('draw')}
            />
          </fieldset>

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

          <Switcher
            values={Store.FILL_MODES.get().map(({ value }) => ({
              value,
              icon: IconFillMode,
              label: value.replace(/(→)/g, '&thinsp;$1&thinsp;')
            }))}
            event-change={value => Store.app.fillMode.set(value)}
          />
        </fieldset>

        <fieldset>
          <Button
            icon={IconWireframeOff}
            store-hidden={not(Store.app.wireframe)}
            event-click={() => Store.app.wireframe.set(false)}
          />
          <Button
            icon={IconWireframeOn}
            store-hidden={Store.app.wireframe}
            event-click={() => Store.app.wireframe.set(true)}
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
