import './App.scss'
import { Component } from '/utils/jsx'
import { d } from '/utils/state'

import Store from '/store'

import Drawer from '/components/Drawer'
import Paster from '/components/Paster'
import Renderer from '/components/Renderer'
import Timeline from '/components/Timeline'
import Toolbar from '/components/Toolbar'
import Splashscreen from '/components/Splashscreen'

export default class App extends Component {
  template (props) {
    return (
      <main class='app'>
        <Splashscreen />
        <Toolbar />
        <div class='app__main'>
          <Drawer store-disabled={d(Store.drawMode, m => m !== 'draw')} />
          <Paster store-disabled={d(Store.drawMode, m => m !== 'paste')} />
          <Renderer />
        </div>
        <Timeline />
      </main>
    )
  }
}
