// Return a scale at which a bbox is contained in the given dimensions
module.exports = function (bbox, [width, height, padding = 0]) {
  let targetWidth, targetHeight
  const ratio = width / height
  if (ratio > bbox.ratio) {
    targetHeight = height - padding * 2
    targetWidth = targetHeight * bbox.ratio
  } else {
    targetWidth = width - padding * 2
    targetHeight = targetWidth / bbox.ratio
  }
  return Math.min(targetHeight / bbox.height, targetWidth / bbox.width)
}
