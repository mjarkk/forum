import React, { Component } from 'react'
import {functions} from '../imports/functions.js'
import MDinput from '../componenets/md-input.js'

const log = console.log

class Settings extends Component {
  constructor(inputs) {
    super(inputs)
    this.state = {
      LoginStatus: inputs.LoginStatus,
      sendingData: true,
      canChangeUser: this.getoptionsarr(inputs.LoginStatus)
    }
    this.onUserDataChange = inputs.onUserDataChange || (() => {})
  }
  getoptionsarr(LoginStatus) {
    return (LoginStatus.logedin ? [
      {
        name: 'Username', 
        shortName: 'username',
        err: '',
        type: 'input',
        input: LoginStatus.userData.username
      },{
        name: 'New password',
        shortName: 'password',
        err: '',
        type: 'input',
        input: ''
      }
    ] : [])
  }
  componentDidUpdate(inputs) {
    return true
  }
  render() {
    if (this.state.LoginStatus.logedin) {
      return (
        <div className="settingsFull">
          <div className="settings">
            <h2>Settings</h2>
            <div className="section userSection">
              <h3>User settings</h3>
              {this.state.canChangeUser.map((el, id) =>
                <div className="row" key={id}>
                  <div className="error">{el.err}</div>
                  <div className="name">{el.name}</div>
                  { (el.type == 'input') ?
                    <MDinput 
                      label={el.name}
                      defualt={el.input}
                      type={(el.shortName == 'password') ? 'password' : 'text'}
                      onChange={newdata => {
                        let newData = this.state.canChangeUser
                        newData[id].input = newdata
                        this.setState({
                          canChangeUser: newData
                        })
                      }}
                    />
                  : '' }
                </div>
              )}
              <button
                disabled={!this.state.sendingData}
                onClick={() => {
                  let tosend = JSON.stringify(this.state.canChangeUser)
                  this.setState({
                    canChangeUser: this.state.canChangeUser.map(el => Object.assign({}, el, {err: ''}))
                  })
                  functions.fetch('./api/updatesettings.php', 'json', data => {
                    if (data.status) {
                      if (data.userdata.status) {
                        this.onUserDataChange(data.userdata.data)
                      }
                    } else if (data.errors) {
                      let errors = data.errors.map(el => el.short)
                      this.setState({
                        canChangeUser: this.state.canChangeUser.map(el => {
                          let check = errors.indexOf(el.shortName)
                          return Object.assign({}, el, {err: (check != -1) ? data.errors[check].text : ''})
                        })
                      })
                    }
                  }, {
                    cache: 'no-cache',
                    method: 'POST',
                    body: {
                      newData: tosend
                    }
                  })
                }}
              >Update</button>
            </div>
            {this.state.LoginStatus.userData.premission == '3' ? 
              <div className="section adminSection">

              </div>
            : ''}
          </div>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

export default Settings;