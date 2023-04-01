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

  push (point) {
    this.points.push(point)
  }

  render (context, {
    frame = Number.POSITIVE_INFINITY,
    drawMode = this.drawMode,
    fillMode = this.fillMode,
    style = this.style,
    preferSprite = true
  } = {}) {
    if (this.isEmpty) return
    if (frame < this.firstFrame && fillMode !== 'AB') return

    context.save()

    // Try to use a sprite on AB lines
    if (fillMode === 'AB' && preferSprite) {
      if (!this.sprite) {
        this.sprite = this.toSprite(context, { drawMode, fillMode, style })
      }
      context.drawImage(this.sprite, 0, 0)
      context.restore()
      return
    }

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
      if (drawMode === 'smooth') return smooth(points)
      if (drawMode === 'freehand') {
        return getStroke(smooth(points), {
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

  toSprite (context, options) {
    const canvas = document.createElement('canvas')
    canvas.width = context.canvas.width
    canvas.height = context.canvas.height

    this.render(canvas.getContext('2d'), { ...options, preferSprite: false })
    return canvas
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
