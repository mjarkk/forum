import React, { Component } from 'react'
import MDsettings from 'react-icons/lib/md/settings'

import { LoginStatus } from '../componenets/userhandeler.js'

const log = console.log

let menu = undefined

class BigMenu extends Component {
  constructor() {
    super()
    this.state = {
      openend: false,
      display: false,
      proviel: {
        name: 'user',
        comments: 0,
        karma: 0
      },
      LoginStatus
    }
    menu = this
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
              <h2>{ this.state.proviel.name }</h2>
              <p>Comments: <span>{this.state.proviel.comments }</span></p>
              <p>Karma: <span>{this.state.proviel.karma}</span></p>
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
              <div className="link">  
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