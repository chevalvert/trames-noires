// Compute the bounding box of an array of polylines
module.exports = function (polylines) {
  let xmin = Number.POSITIVE_INFINITY
  let ymin = Number.POSITIVE_INFINITY
  let xmax = Number.NEGATIVE_INFINITY
  let ymax = Number.NEGATIVE_INFINITY

  for (const polyline of polylines) {
    for (const point of polyline.points) {
      if (point[0] < xmin) xmin = point[0]
      if (point[1] < ymin) ymin = point[1]
      if (point[0] > xmax) xmax = point[0]
      if (point[1] > ymax) ymax = point[1]
    }
  }

  const width = xmax - xmin
  const height = ymax - ymin
  return { xmin, ymin, xmax, ymax, width, height, ratio: width / height }
}
