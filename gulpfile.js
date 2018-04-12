// this file contains the build progress
const gulp = require('gulp')
const fs = require('fs-extra')
const Undertaker = require('undertaker')
const colors = require('colors')
const archiver = require('archiver')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const log = console.log
let taker = new Undertaker()

let report = (name, err, cb) => {
  if (err) {
    log(colors.red('got error with: ') + colors.red.bold(name))
    console.error(err)
    process.exit()
  } else {
    log(colors.green('\u2713 ' + name))
    cb()
  }
}

let clearBuildFolder = 'clear build folder'
taker.task(clearBuildFolder, cb => {
  try {
    let toRemove = [
      'index.php',
      'message.php',
      'settings.php',
      'js'
    ]
    toRemove.map(el => fs.removeSync('./build/' + el))
    report(clearBuildFolder, false, cb)
  } catch (err) {
    report(clearBuildFolder, err, (() => {}))
  }
})

let createBuild = 'run webpack to create a clean build'
taker.task(createBuild, cb => {
  async function run () {
    const { stdout, stderr } = await exec('webpack --display=minimal --config \"webpack.config.js\"')
    report(createBuild, (stdout.indexOf('DUNE') != -1) ? ('ERROR: ' + stderr) : false, cb)
  }
  run()
})

let createFolder = 'make sure release folder exsists'
taker.task(createFolder, cb => 
  fs.ensureDir('./release/', err => 
    report(createFolder, err, cb)
  )
)

let copy = 'copy files'
taker.task(copy, cb => 
  fs.copy('./build/', './release/', err => 
    report(copy, err, cb)
  )
)

let rmJunk = 'removing junk and all kinds of other files'
taker.task(rmJunk, cb => 
  fs.remove('./release/api/.env', err => 
    report(rmJunk, err, cb)
  )
)

let createEnv = 'creating original env.php file'
taker.task(createEnv, cb =>
  fs.outputFile('./release/api/env.php', `
    <?php
    $env = array(
      'SQLusername' => '','SQLpassword' => '','SQLserver' => '','SQLdatabaseName' => ''
    );
  `, err => 
    report(createEnv, err, cb)
  )
)

// Todo: Add: https://github.com/archiverjs/node-archiver

gulp.task('default', taker.series(
  clearBuildFolder,
  createBuild,
  createFolder, 
  copy,
  rmJunk,
  createEnv
))