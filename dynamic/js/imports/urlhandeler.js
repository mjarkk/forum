import {functions} from '../imports/functions.js'

const log = console.log

class urlHandeler {
  constructor(inputs) {
    this.changeState = inputs.changeState || (() => {})
    let fullPath = location.pathname.split('/')
    let file = fullPath[fullPath.length - 1]
    if (typeof inputs.installEv == 'function') {
      if (file.startsWith('message.php')) {
        inputs.installEv('message')
      } else if (file.startsWith('settings.php')) {
        inputs.installEv('settings')
      } else {
        inputs.installEv('list')
      }
    }

    this.basepath = fullPath.splice(0,fullPath.length - (file == '' || file.indexOf('.php') != -1 ? 1 : 0)).join('/')
    this.basepath = this.basepath + (this.basepath[this.basepath.length - 1] == '/' ? '' : '/')

    window.addEventListener('popstate', (ev) => {
      let newPath = location.pathname
      if (!location.href.includes('#')) {
        this.GoTo(newPath)
      }
    })
  }
  GoTo(to) {
    log('go to:', to)
  }
  changePath(newpath) {
    newpath = this.basepath.slice(0,-1) + (newpath[0] == '/' ? newpath : `/${newpath}`)
    location.hash = newpath.replace(/\//g,'')
    history.replaceState(null, null, newpath)
  }
}

export default urlHandeler