// Compute the bounding box of an array of Line
module.exports = function (lines) {
  let xmin = Number.POSITIVE_INFINITY
  let ymin = Number.POSITIVE_INFINITY
  let xmax = Number.NEGATIVE_INFINITY
  let ymax = Number.NEGATIVE_INFINITY

  for (const line of lines) {
    for (const point of line.points) {
      const x = point[0] + (line.offset[0] || 0)
      const y = point[1] + (line.offset[1] || 0)

      if (x < xmin) xmin = x
      if (y < ymin) ymin = y
      if (x > xmax) xmax = x
      if (y > ymax) ymax = y
    }
  }

  const width = xmax - xmin
  const height = ymax - ymin
  return { xmin, ymin, xmax, ymax, width, height, ratio: width / height }
}
