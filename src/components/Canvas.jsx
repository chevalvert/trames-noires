import './Canvas.scss'
import { Component } from '/utils/jsx'
import { r } from '/utils/state'
import debounce from 'debounce'

export default class Canvas extends Component {
  beforeRender (props) {
    this.handleResize = this.handleResize.bind(this)
    this.state = {
      dpr: r(props.dpr || window.devicePixelRatio || 1)
    }
  }

  template () {
    return <canvas class='canvas' ref={this.ref('canvas')} />
  }

  afterMount () {
    this.context = this.refs.canvas.getContext('2d')
    this.handleResize()
    window.addEventListener('resize', debounce(this.handleResize, 100))
  }

  clear () {
    this.context.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height)
  }

  handleResize () {
    const dpr = this.state.dpr.get()
    const { width, height } = this.refs.canvas.getBoundingClientRect()
    this.refs.canvas.width = width * dpr
    this.refs.canvas.height = height * dpr
    this.context.scale(dpr, dpr)
  }
}
