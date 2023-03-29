// TODO export JSON to GCS and return uid
// TODO import from GCS uid

import './Toolbar.scss'
import { d, not } from '/utils/state'
import { Component } from '/utils/jsx'

import Store from '/store'
import Button from '/components/Button'
import Switcher from '/components/Switcher'

import IconCircle from 'iconoir/icons/circle.svg?raw'
import IconClear from 'iconoir/icons/trash.svg?raw'
import IconDraw from 'iconoir/icons/edit-pencil.svg?raw'
import IconRepeat from 'iconoir/icons/keyframes.svg?raw'
import IconUndo from 'iconoir/icons/undo.svg?raw'
import IconWireframeOn from 'iconoir/icons/eye-off.svg?raw'
import IconWireframeOff from 'iconoir/icons/eye-empty.svg?raw'
import IconFillMode from 'iconoir/icons/bounce-right.svg?raw'

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
              store-hidden={d(Store.drawMode, m => m !== 'draw')}
              event-click={() => Store.drawMode.set('paste')}
              label='Dessin'
              store-disabled={state.hasNoLines}
            />
            <Button
              icon={IconRepeat}
              store-hidden={d(Store.drawMode, m => m !== 'paste')}
              label='Tampon'
              event-click={() => Store.drawMode.set('draw')}
            />
          </fieldset>

          <Switcher
            values={Store.LINE_WIDTHS.get().map(({ name, value }) => ({
              value,
              icon: IconCircle,
              class: `disc disc-${name}`
            }))}
            event-change={value => {
              Store.style.update(style => ({ ...style, lineWidth: value }), true)
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
              Store.style.update(style => ({ ...style, strokeStyle: value }), true)
            }}
          />

          <Switcher
            values={Store.FILL_MODES.get().map(({ value }) => ({
              value,
              icon: IconFillMode,
              label: value.replace(/(→)/g, '&thinsp;$1&thinsp;')
            }))}
            event-change={value => Store.fillMode.set(value)}
          />
        </fieldset>

        <fieldset>
          <Button
            icon={IconWireframeOff}
            store-hidden={not(Store.wireframe)}
            event-click={() => Store.wireframe.set(!Store.wireframe.current)}
          />
          <Button
            icon={IconWireframeOn}
            store-hidden={Store.wireframe}
            event-click={() => Store.wireframe.set(!Store.wireframe.current)}
          />

          <fieldset class='group'>
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
        </fieldset>
      </section>
    )
  }

  handleUndo () {
    Store.lines.update(lines => lines.slice(0, lines.length - 1), true)
  }
}
