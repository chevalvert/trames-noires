import { raf, fpsLimiter } from '@internet/raf'
import Store from '/store'

const update = () => {
  Store.raf.frameCount.update(frameCount => {
    return ++frameCount % Store.raf.maxDuration.get()
  })
}

const tick = fpsLimiter(Store.raf.fps.current, update)

export function start () {
  Store.raf.isRunning.set(true)
  raf.add(tick)
}

export function stop () {
  Store.raf.isRunning.set(false)
  raf.remove(tick)
}

export default { start, stop }
