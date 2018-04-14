import test from 'ava'
import cors from 'cors'
import mysql from 'mysql'
import fs from 'fs-extra'
import crypto from 'crypto'
import puppeteer from 'puppeteer'
import bodyParser from 'body-parser'

const log = console.log

const express = require('express')
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.listen(9343, () => 
  log('dev server running on: 9343')
)

test.cb('waiting for sucsessfull script injection', t => {
  t.plan(1)
  t.pass()
  t.end()
})