import React, { Component } from 'react'
import MDinput from '../components/md-input.js'
import { functions } from '../imports/functions.js'

const log = console.log

let LR = undefined // LR = login register

let state = {
  logedin: window.userData.status,
  userData: window.userData.inf,
  showLoginRegister: false,
  onTab: 'login',
  login: {
    password: '',
    username: ''
  },
  register: {
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
    if (typeof inputs.onUserDataChange == 'function') {
      this.onUserDataChange = inputs.onUserDataChange
    } else {
      this.onUserDataChange = () => {}
    }
  }
  componentWillReceiveProps(inputs) {
    
  }
  render() {
    if (this.state.showLoginRegister) {
      return (
        <div className="LoginRegister">
            <div className="LRholder">
              <div className="LRtitle">
                <h1>{ this.state.onTab[0].toUpperCase() }{ this.state.onTab.slice(1, this.state.onTab.length) + ' ' }
                  { (this.state.onTab == 'login') ? 
                    <button disabled={this.state.onTab == 'register'} onClick={() => this.setState({onTab: 'register'})}>Register</button>
                  : 
                    <button disabled={this.state.onTab == 'login'}  onClick={() => this.setState({onTab: 'login'})}>Login</button>
                  }
                </h1>
                <div className="fillin login">
                  <MDinput 
                    label="username" 
                    type="text" 
                    onChange={(data) => 
                      this.setState({
                        login: Object.assign({}, this.state.login, {username: data})
                      })
                    } 
                  />
                  <MDinput 
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
                        functions.fetch(this.state.onTab == 'login' ? './api/login.php' : './api/register.php', 'json', (data) => {
                          if(data.status) {
                            let toSet = {
                              userData: data.data,
                              logedin: true,
                              showLoginRegister: false
                            }
                            this.setState(toSet, () => {
                              state = this.state
                              this.onUserDataChange(toSet)
                            })
                          }
                        }, {
                          cache: 'no-cache',
                          method: 'POST',
                          body: this.state.login
                        })
                      }}
                    >{(this.state.onTab == 'login') ? 'Login' : 'Register'}</button>
                  </div>
                </div>
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