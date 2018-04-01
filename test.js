import test from 'ava'
import cors from 'cors'

const log = console.log

const express = require('express')
const app = express()

app.use(cors())

app.listen(9343, () => 
  log('dev server running on: 9343')
)

test.cb('Waiting for first connection', t => {
  t.plan(1)
  log('Waiting for first connection')
  log('HINT: open or reload the forum on the home page and make sure to build the forum in development mode')
  app.get('/script.js', (req,res) => {
    res.json({
      status: true
    })
    t.pass()
    t.end()
  })
})

test.cb('waiting for sucsessfull script injection', t => {
  t.plan(1)
  app.post('/scriptInject', (req,res) => {
    res.json({
      status: true
    })
    t.pass()
    t.end()
  })
})

// test('test', t => {
//   t.pass()
// })