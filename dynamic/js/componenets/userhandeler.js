import React, { Component } from 'react'

const log = console.log

let LR = undefined // LR = login register

let state = {
  logedin: false,
  openlogin: (what) => {
    // what: boolean (tue = register, false = login, undefined = login)
    if (what) {
      log('register btn clicked')
    } else {
      log('general login btn clicked')
    }
  }
}

class LoginRegister extends Component {
  constructor(inputs) {
    super(inputs)
    this.state = state
    loginregister = this
  }
  componentWillReceiveProps(inputs) {
    
  }
  render() {
    return (
      <div className="LoginRegister">
        
      </div>
    )
  }
}

export default LoginRegister
export const LoginStatus = state