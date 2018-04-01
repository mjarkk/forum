const log = console.log

let get = (url, callback, postdata) => {
  fetch(`http://localhost:9343/${url}`, {
    method: 'post',
    body: JSON.stringify(postdata || {})
  })
  .then(res => res.json())
  .then(data => callback(data))
  .catch (error => callback({status: false}))
}

log('tests file injected yay...')

get('scriptInject', data => {

})