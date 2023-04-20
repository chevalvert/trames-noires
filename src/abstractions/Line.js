import { getStroke } from 'perfect-freehand'
import smooth from 'chaikin-smooth'
import Store from '/store'

export default class Line {
  constructor ({
    points = [],
    drawMode = 'raw', // raw|smooth|freehand
    fillMode = 'AA→AB',
    firstFrame = 0,
    style = {}
  } = {}) {
    this.points = points
    this.drawMode = drawMode
    this.fillMode = fillMode
    this.firstFrame = firstFrame
    this.style = style
  }

  get isEmpty () {
    return !this.points || !this.points.length
  }

  get pathData () {
    if (!this._pathData) {
      this._pathData = ['M', this.points[0], 'L', this.points.slice(1)].join(' ')
    }
    return this._pathData
  }

  push (point) {
    this.points.push(point)
  }

  render (context, {
    frame = Number.POSITIVE_INFINITY,
    drawMode = this.drawMode,
    fillMode = this.fillMode,
    style = this.style
  } = {}) {
    if (this.isEmpty) return
    if (frame < this.firstFrame && fillMode !== 'AB') return

    context.save()
    context.beginPath()

    // Apply style
    for (const [prop, value] of Object.entries(style)) {
      if (prop === 'lineDash') context.setLineDash(value)
      context[prop] = value
    }

    // Handle various time fill modes
    const bounds = []
    switch (fillMode) {
      case 'AB':
        bounds[0] = 0
        bounds[1] = this.points.length
        break

      case 'AA→AB':
        bounds[0] = 0
        bounds[1] = frame - this.firstFrame
        break

      case 'AA→BB':
        bounds[0] = Math.max(0, frame - this.firstFrame - Store.AA_AB_FILL_MODE_LENGTH.get())
        bounds[1] = frame - this.firstFrame
        break

      case 'AA→AB→BB':
        bounds[0] = Math.max(0, frame - this.firstFrame - this.points.length / 2)
        bounds[1] = frame - this.firstFrame
        break
    }

    // Slice the points before smoothing to ensure correct time sync
    const points = (() => {
      const points = this.points.slice(bounds[0], bounds[1])
      if (!points || !points.length) return []

      if (drawMode === 'smooth') return smooth(points)
      if (drawMode === 'freehand') {
        // Smooth only when no pressure data
        const pts = points[0][2] !== undefined ? points : smooth(points)
        return getStroke(pts, {
          size: style.lineWidth * 1.5,
          thinning: 0.5,
          smoothing: 0.01,
          streamline: 0.6
        })
      }
      return points
    })()

    // Draw line
    for (let index = 0; index < points.length; index++) {
      const point = points[index]
      if (!point) continue
      context[index ? 'lineTo' : 'moveTo'](point[0], point[1])
    }

    if (drawMode === 'freehand') {
      context.fillStyle = context.strokeStyle
      context.fill()
    } else context.stroke()

    context.restore()
  }

  toJSON () {
    return {
      points: this.points,
      drawMode: this.drawMode,
      fillMode: this.fillMode,
      firstFrame: this.firstFrame,
      style: this.style
    }
  }
}
