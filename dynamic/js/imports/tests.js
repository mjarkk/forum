const log = console.log

let addScript = () => {
  let toAdd = document.createElement('script')
  toAdd.setAttribute('src',testFile)
  document.head.appendChild(toAdd)
}

if (testFile) {
fetch('http://localhost:9343/script.js')
  .then(res => res.json())
  .then(data => {
    if (data.status) {addScript()}
  })
  .catch(err => {
    log('tests file not running, run `yarn test` and reload the page when the reload hint pops up')
  })
}