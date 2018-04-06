import {functions} from '../imports/functions.js'
import {CreateMessage, OpenMessage} from '../components/message.js'

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
      let href = location.href
      if (!href.includes('#')) {
        this.GoTo(href)
      }
    })
  }
  getFileName(path) {
    let fullPath = path.split('/')
    let file = fullPath[fullPath.length - 1]
    return file
  }
  getPrams(file) {
    let parts = file.split('&')
    parts[0] = parts[0].slice(parts[0].indexOf('?') + 1, parts[0].lenght)
    if (parts[0].indexOf('.php') != -1) {
      parts = parts.splice(0, 1)
    }
    return parts.map(el => {return {
      name: el.slice(0, el.indexOf('=')),
      val: el.slice(el.indexOf('=') + 1, el.length)
    }})
  }
  GoTo(to) {
    let file = this.getFileName(to)
    let prams = this.getPrams(file)
    let id = prams.reduce((acc,el) => (el.name == 'id') ? el : acc, undefined)
    if (file.startsWith('message.php')) {
      (id && id.val) 
        ? OpenMessage({
          id: id.val,
          username: '',
          created: '',
          premission: '1'
        }) 
        : CreateMessage()
    } else if (file.startsWith('settings.php')) {
      this.changeState({
        show: 'settings'
      })
    } else if (file.startsWith('index.php') || file == '' || file.startsWith('?')) {
      this.changeState({
        show: 'list'
      })
    }
  }
  changePath(newpath) {
    newpath = this.basepath.slice(0,-1) + (newpath[0] == '/' ? newpath : `/${newpath}`)
    location.hash = newpath.replace(/\//g,'')
    history.replaceState(null, null, newpath)
  }
}

export default urlHandeler