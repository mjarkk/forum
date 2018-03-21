const log = console.log

export const functions = {
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
  fetch: (url, input2, input3) => {
    // a wrapper around fetch that caches responses and a handels a lot of other things
    // functions.fetch(url[, type], callback)
    // url: the url to fetch `string` = (valid url)
    // type: data type to resonse `string` = ("json" or "text")
    // callback: send the callback data `function`

    if (!url) {
      // if the url is not set return undefined
      return false
    }

    let callback = () => {}
    let type = 'text'

    // set the type and callback from the inputs
    if (typeof input2 == 'function') {
      callback = input2
    } else if (input2 == 'string') {
      type = (input2 == 'text' || input2 == 'json') ? input2 : type
    }
    if (typeof input3 == 'function') {
      callback = input3
    }

    fetch(url)
      .then(res => {
        if (type == 'text') {
          return res.text()
        } else {
          return res.json()
        }
      })
      .then(data => {
        callback({
          status: true,
          data: data
        })
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
  }
}