import smooth from 'chaikin-smooth'
import Store from '/store'

export default class Line {
  constructor ({
    points = [],
    fillMode = 'AA→AB',
    firstFrame = 0,
    style = {}
  } = {}) {
    this.points = points
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
    smoothed = true,
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
    const points = smoothed
      ? smooth(this.points.slice(bounds[0], bounds[1]))
      : this.points.slice(bounds[0], bounds[1])

    // Draw line
    for (let index = 0; index < points.length; index++) {
      const point = points[index]
      if (!point) continue
      context[index ? 'lineTo' : 'moveTo'](point[0], point[1])
    }

    context.stroke()
    context.restore()
  }

  toJSON () {
    return {
      points: this.points,
      fillMode: this.fillMode,
      firstFrame: this.firstFrame,
      style: this.style
    }
  }
}
