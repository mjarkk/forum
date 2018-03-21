import React, { Component } from 'react'
import MLinput from '../componenets/ml-input.js'
import MLclose from 'react-icons/lib/md/close'

import { functions } from '../imports/functions.js'

const log = console.log

let LR = undefined // LR = login register

let state = {
  logedin: false,
  showLoginRegister: false,
  onTab: 'login',
  login: {
    password: '',
    username: ''
  },
  openlogin: (what) => {
    LR.setState({
      showLoginRegister: true,
      onTab: what ? 'register' : 'login'
    })
  }
}

class LoginRegister extends Component {
  constructor(inputs) {
    super(inputs)
    this.state = state
    LR = this
  }
  componentWillReceiveProps(inputs) {
    
  }
  render() {
    if (this.state.showLoginRegister) {
      return (
        <div className="LoginRegister">
            <div className="LRholder">
              <div className="LRtitle">
                <h1>{ this.state.onTab[0].toUpperCase() }{ this.state.onTab.slice(1, this.state.onTab.length) }</h1>
                <div className="changeTab">
                  <button disabled={this.state.onTab == 'login'}  onClick={() => this.setState({onTab: 'login'})}>Login</button>
                  <button disabled={this.state.onTab == 'register'} onClick={() => this.setState({onTab: 'register'})}>Register</button>
                </div>
                { (this.state.onTab == 'login') ?
                  <div className="fillin login">
                    <MLinput 
                      label="username" 
                      type="text" 
                      onChange={(data) => 
                        this.setState({
                          login: Object.assign({}, this.state.login, {username: data})
                        })
                      } 
                    />
                    <MLinput 
                      label="password" 
                      type="password" 
                      onChange={(data) =>
                        this.setState({
                          login: Object.assign({}, this.state.login, {password: data})
                        })
                      }
                    />
                    <div className="status">
                      <button 
                        disabled={!this.state.login.username || !this.state.login.password}
                        onClick={() => {
                          functions.fetch('./api/login.php', 'json', (data) => {
                            log(data)
                          })
                        }}
                      >Login</button>
                    </div>
                  </div>
                : 
                  <div className="fillin register">
                    
                  </div>
                }
              </div>
            </div>
        </div>
      ) 
    } else {
      return (<div></div>)
    }
    
  }
}

export default LoginRegister
export const LoginStatus = state