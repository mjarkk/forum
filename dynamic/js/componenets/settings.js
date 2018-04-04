import React, { Component } from 'react'
import {functions} from '../imports/functions.js'
import MDinput from '../componenets/md-input.js'

const log = console.log

class Settings extends Component {
  constructor(inputs) {
    super(inputs)
    this.state = {
      LoginStatus: inputs.LoginStatus,
      canChangeUser: inputs.LoginStatus.logedin ? [
        {name: 'username', input: inputs.LoginStatus.userData.username}
      ] : []
    }
  }
  componentDidUpdate(inputs) {
    
  }
  render() {
    if (this.state.LoginStatus.logedin) {
      return (
        <div className="settingsFull">
          <div className="settings">
            <h2>Settings</h2>
            <div className="section userSection">
              {this.state.canChangeUser.map((el, id) => 
                <div className="row" key={id}>
                  <div className="name">{el.name}</div>
                  <MDinput 
                    label={el.name}
                    defualt={el.input}
                    onChange={newdata => el.input}
                  />
                </div>
              )}
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