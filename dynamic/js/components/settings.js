import React, { Component } from 'react'
import functions from '../imports/functions.js'
import MDinput from '../components/md-input.js'
import UserInfo from '../components/userinfo.js'

const log = console.log

class Settings extends Component {
  constructor(inputs) {
    super(inputs)
    this.state = {
      LoginStatus: inputs.LoginStatus,
      sendingData: true,
      canChangeUser: this.getoptionsarr(inputs.LoginStatus),
      users: [],
      userIcon: './api/usericon.php',
      userIconStats: 'normal'
    }
    this.onUserDataChange = inputs.onUserDataChange || (() => {})
    this.getUsers()
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
  getUsers() {
    functions.fetch('./api/userlist.php', 'json', data => {
      if (data.status) {
        this.setState({users: data.data})
      }
    }, {
      cache: 'no-cache',
      method: 'POST'
    })
  }
  render() {
    if (this.state.LoginStatus.logedin) {
      return (
        <div className="settingsFull">
          <div className="settings">
            <h2>Settings</h2>
            <div className="section userSection">
              <h3>User settings</h3>
              <div className="provielPicture">
                <div 
                  className="actualProvielPicture" 
                  style={{
                    backgroundImage: `url(${this.state.userIcon})`, 
                    border: '8px solid ' + ((this.state.userIconStats == 'normal') 
                      ? '#ccc'
                      : '#f7c203')
                  }}
                  onClick={() => 
                    document.querySelector('.userProvielPicutureActions input').click()
                  }
                >
                  <div>Click om een nieuwe proviel foto te kiezen</div>
                </div>
                <div className="actions userProvielPicutureActions">
                  <input onChange={() => {
                    let input = document.querySelector('.userProvielPicutureActions input')
                    if (input.files && input.files[0]) {
                      functions.fetch('api/usericon.php', 'json', data => {
                        log(data)
                      }, {
                        cache: 'no-cache',
                        method: 'POST',
                        body: {
                          file: input.files[0]
                        }
                      })
                      let reader = new FileReader()
                      reader.onload = e => 
                      this.setState({
                        userIcon: e.target.result,
                        userIconStats: 'working'
                      })
                      reader.readAsDataURL(input.files[0])
                    }
                  }} type="file" accept=".jpg, .jpeg, .png"/>
                </div>
              </div>
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
                <div className="users">
                  <h3>Gebruikers</h3>
                  <div className="user topRow">
                    <div className="id item">ID</div>
                    <div className="username item">Username</div>
                    <div className="premission item">Premission</div>
                  </div>
                  {this.state.users.map((el, id) => 
                    <div 
                      key={id} 
                      className="user"
                      onClick={() => {
                        let toChange = this.state.users
                        toChange[id]['userInfoOpen'] = true
                        this.setState({
                          users: toChange
                        })
                      }}
                    >
                      <div className="id item">{el.ID}</div>
                      <div className="username item">{el.username}</div>
                      <div className="premission item">{el.premission}</div>
                      { (el.userInfoOpen) ? 
                        <UserInfo 
                          onShouldClose={status => {
                            if (typeof status == 'boolean' && status) {
                              this.getUsers()
                            }
                            let toChange = this.state.users
                            toChange[id]['userInfoOpen'] = false
                            this.setState({
                              users: toChange
                            })
                          }}
                          LoginStatus={this.state.LoginStatus}
                          username={el.username}
                          style={{
                            top: '-11px',
                            left: '-214px'
                          }}
                        />
                      : '' }
                    </div>
                  )}
                </div>
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