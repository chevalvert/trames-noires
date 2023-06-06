#!/usr/bin/env node

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const fs = require('fs-extra')
const fetch = require('node-fetch')
const { dirSync } = require('tmp')
const { createCanvas } = require('canvas')
const { spawn } = require('node:child_process')
const ffmpegBin = require('ffmpeg-static')

const Line = require('../shared/Line')
const boundingBox = require('./geom/bounding-box')
const contain = require('./geom/contain')

const argv = require('minimist')(process.argv.slice(2), {
  string: ['duration', 'framerate', 'width', 'height', 'output'],
  boolean: ['help', 'version'],
  alias: { help: 'h', version: 'v', output: 'o' },
  default: {
    duration: 60 * 5,
    framerate: 60,
    width: 1920,
    height: 1080,
    padding: 0
  }
})

if (argv.version) {
  console.log(require('../package.json').version)
  process.exit(0)
}

const UID = path.parse(String(argv._[0])).name

if (argv.help || !UID) {
  console.log(fs.readFileSync(path.join(__dirname, 'USAGE'), 'utf-8'))
  process.exit(0)
}

const width = +argv.width
const height = +argv.height
const padding = +argv.padding
const duration = +argv.duration // TODO default to duration in embed in json animations

const tmp = dirSync({ unsafeCleanup: true })
const output = argv.output
  ? path.resolve(process.cwd(), argv.output)
  : path.resolve(process.cwd(), UID + '.mp4')

;(async () => {
  let code = 0
  try {
    // Positional arg can be a local file or a GCS UID
    const lines = await (async () => {
      const file = path.resolve(process.cwd(), String(argv._[0]))
      if (await fs.exists(file)) {
        console.log(`[PARSE] ${UID}`)
        return fs.readJson(file)
      } else {
        console.log(`[FETCH] ${UID}`)
        const response = await fetch(process.env.VITE_API_URL + '/api/json/' + UID)
        if (response.status !== 200) throw new Error(`API Responded with status code ${response.status}`)
        return response.json()
      }
    })()

    await renderFrames(
      typeof lines === 'string' ? JSON.parse(lines) : lines, // FIXME
      tmp.name
    )

    console.log('[FFMPEG] Rendering…')
    await video(output, {
      cwd: tmp.name,
      frameRate: argv.framerate,
      frameThumbnail: duration / 2
    })

    console.log('\n' + output)
  } catch (error) {
    console.error(error)
    code = 1
  } finally {
    tmp.removeCallback()
    process.exit(code)
  }
})()

async function renderFrames (json, cwd) {
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  // Decode json
  const lines = json.map(Line.build)

  // Compute center
  const bbox = boundingBox(lines)
  const scale = contain(bbox, [width, height, padding])

  for (let frame = 0; frame < duration; frame++) {
    console.log(`[RENDER] ${frame}/${duration}`)
    const output = fs.createWriteStream(path.join(cwd, String(frame).padStart(9, '0') + '.png'))

    context.fillRect(0, 0, canvas.width, canvas.height)

    context.save()
    context.scale(scale, scale)
    context.translate(
      -bbox.xmin + ((width / scale) - bbox.width) / 2,
      -bbox.ymin + ((height / scale) - bbox.height) / 2
    )

    for (const line of lines) line.render(context, { frame })
    context.restore()

    canvas.createPNGStream().pipe(output)
    await new Promise(resolve => output.on('finish', resolve))
  }
}

// Concatenate all png files in a directory into a mp4 file
// Returns a Promise resolved once the ffmpeg process is completed
async function video (output, {
  cwd,
  filename,
  frameRate = 60,
  frameThumbnail = 0
} = {}) {
  return new Promise((resolve, reject) => {
    const thumbnail = String(frameThumbnail).padStart(9, '0') + '.png'

    // Spawn ffmpeg process
    const ffmpeg = spawn(ffmpegBin, [
      '-y',
      '-framerate', frameRate,

      // Define input streams
      '-i', '%09d.png',
      '-i', thumbnail,
      // Remap input streams
      '-map', '1', '-map', '0',
      // Encode video stream
      '-codec:v:1', 'libx264', '-pix_fmt', 'yuv420p',
      // Attach thumbnail
      '-codec:v:0', 'copy', '-disposition:0', 'attached_pic',

      // Set logging options
      '-loglevel', 'error',
      '-progress', 'pipe:1',

      output
    ], { cwd })

    let error = null
    ffmpeg.stderr.on('data', data => { error = data.toString() })

    // Resolve/reject when subprocess closes
    ffmpeg.on('close', code => {
      if (code) reject(new Error(`ffmpeg exited with code ${code}.\n${error}`))
      else resolve(path.join(cwd, output))
    })
  })
}
