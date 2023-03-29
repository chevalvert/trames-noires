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
    const dpr = this.state.dpr.get()
    this.handleResize()
    this.context = this.refs.canvas.getContext('2d')
    this.context.scale(dpr, dpr)

    window.addEventListener('resize', debounce(this.handleResize, 200))
  }

  clear () {
    this.context.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height)
  }

  // TODO handle screen resize
  handleResize () {
    const pwidth = this.refs.canvas.width
    const pheight = this.refs.canvas.height

    // Update size
    const dpr = this.state.dpr.get()
    const { width, height } = this.refs.canvas.getBoundingClientRect()
    this.refs.canvas.width = width * dpr
    this.refs.canvas.height = height * dpr

    // WIP Center exising
    const dw = pwidth - this.refs.canvas.width
    const dh = pheight - this.refs.canvas.height
    if (this.context) {
      this.log([dw, dh])
      this.context.translate(dw, dh)
    }
  }
}
