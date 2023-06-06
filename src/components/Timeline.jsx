import './Timeline.scss'
import { d, not } from '/utils/state'
import { Component } from '/utils/jsx'

import Store from '/store'
import Button from '/components/Button'
import Input from '/components/Input'

import Actions from '/controllers/Actions'
import Raf from '/controllers/Raf'

import IconExport from 'iconoir/icons/save-floppy-disk.svg?raw'
import IconDownload from 'iconoir/icons/page.svg?raw'
import IconPlay from 'iconoir/icons/play.svg?raw'
import IconPause from 'iconoir/icons/pause.svg?raw'

export default class Timeline extends Component {
  beforeRender () {
    this.update = this.update.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  template (props, state) {
    return (
      <section class='timeline'>
        <fieldset class='group'>
          <Button
            icon={IconPause}
            store-hidden={not(Store.raf.isRunning)}
            event-click={Raf.stop}
          />
          <Button
            icon={IconPlay}
            store-hidden={Store.raf.isRunning}
            event-click={Raf.start}
          />
          <input
            type='range'
            ref={this.ref('input')}
            event-input={this.handleChange}
            event-focus={e => e.target.blur()}
            step='1'
            store-value={Store.raf.frameCount}
            store-max={Store.raf.maxDuration}
          />

          {Store.app.proMode.get() && [
            <Input
              type='number'
              size='auto'
              store-value={Store.raf.frameCount}
              after='/'
              min={0}
              style='gap: var(--gutter-internal)'
              store-max={Store.raf.maxDuration}
            />,
            <Input
              type='number'
              size='auto'
              style='border-left: 0; padding-left: 0'
              store-value={Store.raf.maxDuration}
              min={Store.raf.fps.get()}
              after='&nbsp;frames'
              max={10_000}
            />
          ]}
        </fieldset>

        <fieldset class='group'>
          <Button
            icon={IconDownload}
            event-click={Actions.download}
            store-hidden={not(Store.app.proMode)}
            store-disabled={d(Store.app.lines, lines => !lines.length)}
          />

          <Button
            icon={IconExport}
            event-click={Actions.save}
            store-disabled={d([Store.api.version, Store.app.lines], () => {
              return !(Store.app.lines.current.length && Store.api.version.current)
            })}
          />
        </fieldset>
      </section>
    )
  }

  afterRender () {
    Store.raf.frameCount.subscribe(this.update)
  }

  update () {
    const frame = Store.raf.frameCount.get()
    this.refs.input.value = frame
  }

  handleChange (e) {
    Raf.stop()
    Store.raf.frameCount.set(+e.target.value)
  }
}
