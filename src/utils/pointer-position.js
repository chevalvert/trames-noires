/* global TouchEvent */

export default e => {
  if (window.TouchEvent && (e instanceof TouchEvent)) {
    const touch = e.targetTouches[0]
    return touch ? [touch.clientX, touch.clientY] : [-1, -1]
  }

  return [e.clientX, e.clientY]
}
