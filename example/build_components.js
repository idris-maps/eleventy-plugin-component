const fs = require('fs')
const util = require('util')
const path = require('path')
const exec = require('child_process').exec

const DIR = path.resolve(__dirname, 'src', '_components')

// Helpers

const readdir = util.promisify(fs.readdir)
const run = util.promisify(exec)
const capitalize = d => d.charAt(0).toUpperCase() + d.slice(1)
const toCamelCase = d => d.split('-').map(capitalize).join('')
const loop = (i, onEach, arr, cb) =>
  i === arr.length
    ? cb()
    : onEach(arr[i]).then(() => loop(i + 1, onEach, arr, cb))
const runAll = (onEach, arr) =>
  new Promise(resolve => loop(0, onEach, arr, resolve))

// Build script

const cmd = component => [
  `npx esbuild src/_components/${component}/index.js`,
  '--format=iife',
  `--global-name=${toCamelCase(component)}`,
  `--outfile=_site/js/${component}.js`,
  '--minify',
  '--bundle',
].join(' ')

const bundle = async component => {
  const { stdout, stderr } = await run(cmd(component))
  if (stdout) { console.log(stdout) }
  if (stderr) { console.log(stderr) }
  return
}

// Read the components folder and bundle each script

const main = async () => {
  const components = await readdir(DIR)
  await runAll(bundle, components)
}

main()