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

// check if we can use chrome headless
let envTestFile = './.env'
if (fs.existsSync(envTestFile)) {
  const testEnvData = fs.readJsonSync(envTestFile)
}


// make sure sql works write
let envFile = './build/api/.env'
if (fs.existsSync(envFile)) {
  let sql = undefined
  const envData = fs.readJsonSync(envFile)
  sql = mysql.createConnection({
    host: envData.SQLserver,
    user: envData.SQLusername,
    password: envData.SQLpassword,
    database: envData.SQLdatabaseName
  })

  // connecting to db
  test.serial.before.cb(t => {
    t.plan(1)
    sql.connect(err => {
      if (err) {
        t.fail(err)
      } else {
        t.pass('Connected to sql and database')
      }
      t.end()
    })
  })

  // make sure minimal 1 user exsist that is root
  test.serial.before(t => {
    if (
      typeof envData.SQLserver == 'string'
      && typeof envData.SQLusername == 'string'
      && typeof envData.SQLpassword == 'string'
      && typeof envData.SQLdatabaseName == 'string'
    ) {
      t.pass()
    } else {
      t.fail('make sure to include `SQLserver`, `SQLusername`, `SQLpassword` and `SQLdatabaseName`')
    }
  })
  test.serial.before.cb(t => {
    t.plan(1)
    sql.query('SELECT * FROM users', (err, result, fields) => {
      if (err) {
        t.fail(err)
        t.end()
      } else {
        let users = result.map(el => el.username)
        if (
          result[0] 
          && result[0].password 
          && result[0].username 
          && result[0].premission 
          && result[0].ID
          && users.indexOf(envData.SQLusername) >= 0
        ) {
          t.pass()
          t.end()
        } else {
          t.fail('first user in database is wrong')
          t.end()
        }
      }
    })
  })
  // update user data when password is not defualt or equal to SQLpassword
  test.serial.before.cb(t => {
    t.plan(1)
    sql.query('SELECT * FROM users', (err, result, fields) => {
      if (err) {
        t.fail(err)
        t.end()
      } else {
        let userid = result.map(el => el.username).indexOf(envData.SQLusername)
        if (userid >= 0) {
          let envHash = crypto.pbkdf2Sync(envData.SQLpassword || 'forumPassword', result[userid].salt, 500, 100, 'sha256').toString('hex')
          if (envHash == result[userid].password) {
            t.pass()
            t.end()
          } else {
            sql.query(`UPDATE users SET password = ${envHash} WHERE ID = ${userid}`, (err, res) => {
              if (err) {
                t.fail(err)
              } else {
                t.pass()
              }
              t.end()
            })
          }
        } else {
          // TODO: add admin user
          let salt = crypto.randomBytes(20).toString('hex')
          let envHash = crypto.pbkdf2Sync(envData.SQLpassword || 'forumPassword', salt, 500, 100, 'sha256').toString('hex')
          sql.query(`
            INSERT INTO \`users\` 
            (\`password\`, \`salt\`, \`username\`, \`premission\`)
            VALUES 
            ("${envData.password}", "${salt}", "${envData.SQLusername}", "3")
          `, (err, res) => {
            if (err) {
              t.fail(err)
            } else {
              t.pass()
            }
            t.end()
          })
        }
      }
    })
  })
} else {
  test.serial.before(t => {
    t.fail('.env file doesn\'t exist')
  })
}

// scripts 
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
    if ((typeof testEnvData == 'undefined' || (typeof testEnvData != 'undefined' && typeof testEnvData.weblocation == 'undefined')) && req.body.url) {
      fs.outputJsonSync(envTestFile, {weblocation: req.body.url})
    }
    res.json({
      status: true
    })
    t.pass()
    t.end()
  })
})