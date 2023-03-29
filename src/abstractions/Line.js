import smooth from 'chaikin-smooth'

export default class Line {
  constructor ({
    points = [],
    firstFrame = 0,
    style = {}
  } = {}) {
    this.points = points
    this.firstFrame = firstFrame
    this.style = style
  }

  get isEmpty () {
    return !this.points || !this.points.length
  }

  push (point) {
    this.points.push(point)
  }

  render (context, frame = Number.POSITIVE_INFINITY, { smoothed = true, style = this.style } = {}) {
    if (this.isEmpty) return
    if (frame < this.firstFrame) return

    context.save()
    context.beginPath()

    // Apply style
    for (const [prop, value] of Object.entries(style)) {
      if (prop === 'lineDash') context.setLineDash(value)
      context[prop] = value
    }

    // ??? time fill modes
    // Slice the points before smoothing to ensure correct time sync
    const points = smoothed
      ? smooth(this.points.slice(0, frame - this.firstFrame))
      : this.points.slice(0, frame - this.firstFrame)

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
      firstFrame: this.firstFrame,
      style: this.style
    }
  }
}
