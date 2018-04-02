const log = console.log

let get = (url, callback, postdata) => {
  fetch(`http://localhost:9343/${url}`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cache': 'no-cache'
    },
    credentials: 'same-origin',
    body: JSON.stringify(postdata)
  })
  .then(res => res.json())
  .then(data => callback(data))
  .catch (error => callback({status: false}))
}

log('tests file injected yay...')

// if a user is logedin log him out
if (document.cookie.indexOf('sessionBackup=') >= 0) {
  fetch('./api/logout.php', {
    credentials: 'same-origin'
  })
  .then(res => res.json())
  .then(data => {
    location.reload()
  })
} else {
  get('scriptInject', data => {

  }, {
    url: location.origin + location.pathname
  })
}