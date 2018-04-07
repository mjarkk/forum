import React, { Component } from 'react'
import MDrefresh from 'react-icons/lib/md/refresh'
import {functions} from '../imports/functions.js'

const log = console.log

class UserInfo extends Component {
  constructor(inputs) {
    super(inputs)
    this.state = {
      username: inputs.username || '',
      id: inputs.id || undefined,
      userPost: [],
      error: false,
      comments: '',
      karma: '',
      premission: '',
      style: inputs.style || {}
    }

    // check if clicked outside element if so close the popup
    document.body.onclick = ev => 
      ![...ev.path]
        .map(e => 
          e.classList && e.classList.value
            ? e.classList.value 
            : '')
        .reduce((acc, el) => 
          acc || el.indexOf('userInfo_js') != -1
            ? true 
            : false
          , false)
        ? this.close()
        : functions.fake()
    
    this.close = () => inputs.onShouldClose() || functions.fake()
    this.fetchInfo()
  }
  fetchInfo() {
    let get = () => 
      functions.fetch('./api/userlist.php', 'json', (data) => {
        if (data.status) {
          let newData = data.data
          this.setState({
            username: newData.username,
            premission: newData.premission,
            comments: newData.comments
          })
        } else {
          this.setState({
            error: true
          })
        }
      }, {
        cache: 'no-cache',
        method: 'POST',
        body: {
          username: this.state.username,
          id: this.state.id
        }
      })
    if (this.state.error) {
      this.setState({error: false}, () => get())
    } else {
      get()
    }
  }
  returnRole(role) {
    let num = Number(role)
    return (num == 1)
      ? 'Gebruiker' 
      : (num == 2)
        ? 'Admin'
        : (num == 3)
          ? 'Server Beheerder'
          : 'Gebruiker'
  }
  render() {
    return (
      <div className="userInfo userInfo_js">
        {this.state.error ?
          <div className="infoHolder" style={this.state.style}>
            <div className="error">Kan gebruiker data niet ophalen</div>
            <button
              onClick={() => {
                this.fetchInfo()
              }}
            ><MDrefresh/></button>
          </div>
        : 
          <div className="infoHolder" style={this.state.style}>
            {(this.state.username) ? <h2>{this.state.username}</h2> : ''}
            {(this.state.premission) ? <p>Rol: <b>{ this.returnRole(this.state.premission) }</b></p> : ''}
            {(this.state.comments) ? <p>Comments: <b>{ this.state.comments }</b></p> : ''}
            {(this.state.karma) ? <p>Karma: <b>{ this.state.karma }</b></p> : ''}
          </div>
        }
      </div>
    )
  }
}

export default UserInfo;