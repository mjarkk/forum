import 'whatwg-fetch'

const log = console.log

let doc = {
  dateToString: (msg) =>
    msg.split('-').map((el, i) => 
      (i == 1) ? // check it the item is the time
        el.split(':').slice(0,2).join(':') + // get the hours + minutes
        el.slice(-2) : // add am or pm
        el + ' ' // return the date with a space at the end
    ),
  dateToNum: (input) =>
    // TODO: return a date as number
    false,
  fetch: (url, input2, input3, input4) => {
    // a wrapper around fetch that caches responses and a handels a lot of other things
    // functions.fetch(url[, type], callback[, metaData])

    // url: the url to fetch `string` = (valid url)
    // type: data type to resonse `string` = ("json" or "text")
    // callback: send the callback data `function`

    // functions.fetch('/url/.json', 'json', (data) => {
    // 
    // }, {
    //   cache: 'no-cache',
    //   method: 'POST',
    //   body: {
    //   
    //   }
    // })

    if (!url) {
      // if the url is not set return undefined
      return false
    }

    let callback = () => {}
    let type = 'text'
    let meta = {
      credentials: 'same-origin'
    }

    // set the type and callback from the inputs
    if (typeof input2 == 'function') {
      callback = input2
    } else if (typeof input2 == 'string') {
      type = (input2 == 'text' || input2 == 'json') ? input2 : type
    }
    if (typeof input3 == 'function') {
      callback = input3
    } else if (typeof input3 == 'object') {
      meta = Object.assign({}, meta, input3)
    }
    if (typeof input4 == 'object') {
      meta = Object.assign({}, meta, input4)
    }

    if (typeof meta.body == 'object') {
      let fakeFormData = new FormData()
      for (let i in meta.body) {
        if (meta.body.hasOwnProperty(i)) {
          fakeFormData.append(i, meta.body[i])
        }
      } 
      meta.body = fakeFormData
    }

    fetch(url, meta)
      .then(res => 
        (type == 'text') 
          ? res.text()
          : res.json()
      )
      .then(data => {
        if (typeof data.status == 'boolean') {
          callback(data)
        } else {
          callback({
            status: true,
            data: data
          })
        }
      })
      .catch(err => {
        log('fetch got error')
        log(err)
        // TODO: add support for getting things from the cache
        callback({
          status: false,
          why: err
        })
      })
  },
  fake: () => {
    // a fake function use to make a callback functions happy
  }
}

export default doc