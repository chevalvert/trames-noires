#!/usr/bin/env node

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const fs = require('fs-extra')
const fetch = require('node-fetch')
const { createCanvas } = require('canvas')
const { spawn } = require('node:child_process')
const ffmpegBin = require('ffmpeg-static')

const Line = require('../shared/Line')
const boundingBox = require('./geom/bounding-box')
const contain = require('./geom/contain')

const argv = require('minimist')(process.argv.slice(2), {
  string: ['framerate', 'width', 'height'],
  boolean: ['keep', 'help', 'version'],
  alias: { help: 'h', version: 'v' },
  default: {
    framerate: 60,
    width: 1920,
    height: 1080,
    padding: 0,
    keep: false
  }
})

if (argv.version) {
  console.log(require('../package.json').version)
  process.exit(0)
}

const UID = argv._[0]

if (argv.help || !UID) {
  console.log(fs.readFileSync(path.join(__dirname, 'USAGE'), 'utf-8'))
  process.exit(0)
}

const width = +argv.width
const height = +argv.height
const padding = +argv.padding
const duration = 60 * 5 // TODO embed in json animations
const cwd = path.join(process.cwd(), UID)

;(async () => {
  let code = 0
  try {
    console.log(`[FETCH] ${UID}`)
    const response = await fetch(process.env.VITE_API_URL + '/api/json/' + UID)
    if (response.status !== 200) throw new Error(`API Responded with status code ${response.status}`)
    const lines = await response.json()

    console.log(`[RENDER] ${UID}`)
    await fs.ensureDir(cwd)
    await renderFrames(lines, cwd)

    console.log(`[FFMPEG] ${UID}`)
    await video(cwd, { frameRate: argv.framerate, frameThumbnail: duration / 2 })
  } catch (error) {
    console.error(error)
    code = 1
  } finally {
    if (!argv.keep) await fs.remove(cwd)
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
    console.log(`[RENDER] ${UID} ${frame}/${duration}`)
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
async function video (cwd, {
  filename,
  frameRate = 60,
  frameThumbnail = 0
} = {}) {
  return new Promise((resolve, reject) => {
    const output = filename || (cwd + '.mp4')
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
