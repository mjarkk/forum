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

let start = name => {
  process.stdout.write(' ⌛' + colors.yellow(name) + '\r')
}

let report = (name, err, cb) => {
  if (err) {
    log(colors.red('\ngot error with: ') + colors.red.bold(name))
    console.error(err)
    process.exit()
  } else {
    process.stdout.write(' ✓ ' + colors.green(name) + ' \r \n')
    cb()
  }
}

let clearBuildFolder = 'clear build folder'
taker.task(clearBuildFolder, cb => {
  start(clearBuildFolder)
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
taker.task(createBuild, async cb => {
  start(createBuild)
  const { stdout, stderr } = await exec('webpack --display=minimal --config \"webpack.config.js\"')
  report(createBuild, (stdout.indexOf('DUNE') != -1) ? ('ERROR: ' + stderr) : false, cb)
})

let createFolder = 'make sure release folder exsists'
taker.task(createFolder, cb => {
  start(createFolder)
  fs.ensureDir('./release/', err => 
    report(createFolder, err, cb)
  )
})

let copy = 'copy files'
taker.task(copy, cb => {
  start(copy)
  fs.copy('./build/', './release/', err => 
    report(copy, err, cb)
  )
})

let rmJunk = 'removing junk and all kinds of other files'
taker.task(rmJunk, cb => {
  start(rmJunk)
  fs.remove('./release/api/.env', err => 
    report(rmJunk, err, cb)
  )
})

let createEnv = 'creating original env.php file'
taker.task(createEnv, cb => {
  start(createEnv)
  fs.outputFile('./release/api/env.php', `
    <?php
    $env = array(
      'SQLusername' => '','SQLpassword' => '','SQLserver' => '','SQLdatabaseName' => ''
    );
  `, err => 
    report(createEnv, err, cb)
  )
})

let createZip = 'creating zip from folder content'
taker.task(createZip, cb => {
  start(createZip)
  fs.removeSync(__dirname + '/release.zip')
  let output = fs.createWriteStream(__dirname + '/release.zip')
  let archive = archiver('zip', {zlib: { level: 9 }})
  output.on('close', () => {
    report(createZip, false, cb)
  })
  output.on('end', () => {
    report(createZip, true, cb)
  })
  archive.on('warning', err => {
    report(createZip, err, cb)
  })
  archive.on('error', err => {
    report(createZip, err, cb)
  })
  archive.pipe(output)
  archive.file('release/index.php', { name: 'index.php' })
  archive.file('release/message.php', { name: 'message.php' })
  archive.file('release/settings.php', { name: 'settings.php' })
  archive.directory('release/api/', 'api')
  archive.directory('release/icons/', 'icons')
  archive.directory('release/js/', 'js')
  archive.finalize()
})

let cleanUp = 'cleanup release files'
taker.task(cleanUp, cb => {
  start(cleanUp)
  fs.remove('./release', err => 
    report(cleanUp, err, cb)
  )
})

let dune = 'dune'
taker.task(dune, cb => {
  log('\n')
  log('Sucsessfull created ' + 'release.zip'.bold.green + ' file ')
  log('\n')
  cb()
})

gulp.task('default', taker.series(
  clearBuildFolder,
  createBuild,
  createFolder, 
  copy,
  rmJunk,
  createEnv,
  createZip,
  cleanUp,
  dune
))