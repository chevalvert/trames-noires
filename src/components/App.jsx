import './App.scss'
import { Component } from '/utils/jsx'
import { d } from '/utils/state'

import Store from '/store'

import Drawer from '/components/Drawer'
import Paster from '/components/Paster'
import Renderer from '/components/Renderer'
import Timeline from '/components/Timeline'
import Toolbar from '/components/Toolbar'

export default class App extends Component {
  template (props) {
    return (
      <main class='app' store-data-view-mode={Store.app.viewMode}>
        <Toolbar />
        <div class='app__main'>
          <Drawer store-disabled={d(Store.app.inputMode, m => m !== 'draw')} />
          <Paster store-disabled={d(Store.app.inputMode, m => m !== 'paste')} />
          <Renderer />
        </div>
        <Timeline />
      </main>
    )
  }
}
