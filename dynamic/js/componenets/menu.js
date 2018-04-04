import React, { Component } from 'react'
import MDsettings from 'react-icons/lib/md/settings'
import {functions} from '../imports/functions.js'

const log = console.log

let menu = undefined

class BigMenu extends Component {
  constructor(inputs) {
    super()
    this.state = {
      openend: false,
      display: false,
      LoginStatus: inputs.LoginStatus
    }
    this.showChange = inputs.showChange || (() => {})
    this.onUserDataChange = inputs.onUserDataChange || (() => {})
    menu = this
  }
  componentWillReceiveProps(inputs) {
    this.setState({
      LoginStatus: inputs.LoginStatus
    })
  }
  open() {
    this.setState({
      display: true
    })
    setTimeout(() => {
      this.setState({
        opened: true
      })
    }, 1)
  }
  close(ev) {
    if (ev.target.className == 'bigMenu') {
      this.setState({
        opened: false
      })
      setTimeout(() => {
        this.setState({
          display: false
        })
      }, 300)
    }
  }
  render() {
    return (
      <div
        style={{
          display: (this.state.display) ? 'inline-block' : 'none',
          backgroundColor: (this.state.opened) ? 'rgba(0%, 0%, 0%, 0.25)' : 'rgba(0%, 0%, 0%, 0)'
        }}
        className="bigMenu" 
        onClick={e => this.close(e)}
      >
        <div className="actualBigMenu" style={{transform: (this.state.opened) ? 'translateX(-0%)' : 'translateX(-100%)'}}>
          { (this.state.LoginStatus.logedin) ?
            <div className="proviel">
              <h2>{ this.state.LoginStatus.userData.username }</h2>
              <p>Comments: <span>{ this.state.LoginStatus.userData.comments }</span></p>
              <p>Karma: <span>{ 0 }</span></p>
              <button 
                onClick={() => {
                  functions.fetch('./api/logout.php', 'json', data => {
                    if (data.status) {
                      this.onUserDataChange({
                        logedin: false
                      })
                    }
                  }, {
                    cache: 'no-cache',
                    method: 'POST'
                  })
                }}
              >Logout</button>
            </div>
          : 
            <div className="proviel">
              <div className="needLogin">
                <button onClick={() => this.state.LoginStatus.openlogin(false)}>Login</button>
                <button onClick={() => this.state.LoginStatus.openlogin(true)}>Register</button>
              </div>
            </div>
          }
          <div className="listLinks">
            { (this.state.LoginStatus.logedin) ? 
              <div 
                onClick={() => this.showChange('settings')}
                className="link"
              >  
                <MDsettings />
                <p>Settings</p>
              </div>
            : '' }
          </div>
        </div>
      </div>
    )
  }
}

export default BigMenu

export const menuHandeler = (setTo) => {
  if (setTo) {
    menu.open()
  } else {
    menu.close()
  }
}