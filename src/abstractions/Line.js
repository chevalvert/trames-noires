/* global Path2D */

import { getStroke } from 'perfect-freehand'
import smooth from 'chaikin-smooth'
import Store from '/store'

function pathData (points, { isStroke = false } = {}) {
  if (points.length <= 1) return ''
  return isStroke
    ? points.reduce((acc, [x0, y0], i, arr) => {
      if (i === arr.length - 1) return acc
      const [x1, y1] = arr[i + 1]
      return acc.concat(` ${x0},${y0} ${(x0 + x1) / 2},${(y0 + y1) / 2}`)
    }, ['M ', `${points[0][0]},${points[0][1]}`, ' Q']).concat('Z').join('')
    : ['M', points[0], 'L', points.slice(1)].join(' ')
}

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
    if (!this._pathData) this._pathData = pathData(this.points)
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

    const points = (() => {
      // Slice the points before smoothing to ensure correct time sync
      const points = this.points.slice(bounds[0], bounds[1])
      if (!points || !points.length) return []

      if (drawMode === 'smooth') return smooth(points)
      if (drawMode === 'freehand') {
        return getStroke(points, {
          ...style.perfectFreehand,
          simulatePressure: points[0][2] === undefined,
          last: points.length === this.points.length
        })
      }

      return points
    })()

    // Draw line
    if (drawMode === 'freehand' && points.length > 1) {
      context.fillStyle = context.strokeStyle
      context.fill(new Path2D(pathData(points, { isStroke: true })))
    } else {
      context.beginPath()
      for (let index = 0; index < points.length; index++) {
        const point = points[index]
        if (!point) continue
        context[index ? 'lineTo' : 'moveTo'](point[0], point[1])
      }
      context.stroke()
    }

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
