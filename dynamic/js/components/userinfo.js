import React, { Component } from 'react'
import MDrefresh from 'react-icons/lib/md/refresh'
import MDdelete from 'react-icons/lib/md/delete'
import MDinput from '../components/md-input.js'
import functions from '../imports/functions.js'

const log = console.log

class UserInfo extends Component {
  constructor(inputs) {
    super(inputs)
    this.state = {
      LoginStatus: inputs.LoginStatus || {logedin: false},
      username: inputs.username || '',
      id: inputs.id || undefined,
      userPost: [],
      userComments: [],
      error: false,
      comments: '',
      karma: '',
      premission: '',
      premissionError: false,
      style: inputs.style || {}
    }

    // check if clicked outside element if so close the popup
    document.body.onclick = ev => 
      ![...(ev.path || (ev.composedPath && ev.composedPath()))]
        .map(e => 
          e.classList && e.classList.value
            ? e.classList.value 
            : '')
        .reduce((acc, el) => 
          acc || el.indexOf('userInfo_js') != -1
          , false)
        ? this.close()
        : functions.fake()
    
    this.close = extra => inputs.onShouldClose(extra) || functions.fake()
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
            comments: newData.comments,
            userComments: newData.userposts
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
            {(this.state.LoginStatus.logedin && Number(this.state.LoginStatus.userData.premission) == 3 ) ?
              <div className="actions">
                <h3>Acties</h3>
                <div className="toChange">
                <p>Verander premissie <b>1 of 3</b></p>
                  <input 
                    className={
                      (Number(this.state.premission) == 3 || Number(this.state.premission) == 2 || Number(this.state.premission) == 1) 
                        ? 'pass' 
                        : 'wrong'
                    } 
                    onClick={ev => {
                      let el = ev.target || ev.srcElement
                      el.select()
                    }}
                    type="number" 
                    value={Number(this.state.premission)}
                    onChange={ ev => {
                      let el = ev.target || ev.srcElement
                      let newVal = Number(ev.target.value)
                      let pass = (newVal && (newVal == 1 || newVal == 2 || newVal == 3))
                      this.setState({
                        premissionError: !pass,
                        premission: (pass) ? newVal : this.state.premission
                      }, () => 
                        el.select()
                      )
                      if (pass) {
                        functions.fetch('api/changeuser.php', 'json', data => {
                          log(data)
                        }, {
                          cache: 'no-cache',
                          method: 'POST',
                          body: {
                            what: 'premissions',
                            username: this.state.username,
                            premission: newVal
                          }
                        })
                      }
                    }} 
                  />
                </div>
                <div className="toChange">
                  <p>Verwijder gebruiker</p>
                  <button
                    onClick={() => {
                      functions.fetch('api/changeuser.php', 'json', (data) => {
                        if (data.status) {
                          this.close(true)
                        }
                      }, {
                        cache: 'no-cache',
                        method: 'POST',
                        body: {
                          what: 'remove',
                          username: this.state.username
                        }
                      })
                    }}
                  ><MDdelete/></button>
                </div>
              </div>
            : ''}
            {this.state.username ? <h2>{this.state.username}</h2> : ''}
            {this.state.username ? <div className="provielPicture">
              <div 
                className="actualImage"
                style={{
                  backgroundImage: `url(api/usericon.php?username=${this.state.username})`
                }}
              >
              
              </div>
            </div> : ''}
            {this.state.premission ? <p>Rol: <b>{ this.returnRole(this.state.premission) }</b></p> : ''}
            {this.state.comments ? <p>Comments: <b>{ this.state.comments }</b></p> : ''}
            {this.state.karma ? <p>Karma: <b>{ this.state.karma }</b></p> : ''}
            {this.state.userComments.length > 0 ? <h4>Berichten</h4> : ''}
            {this.state.userComments.map((el, id) => 
              <div key={id} className={(el.start == 'true' ? 'startp ' : 'notstartp ') + 'userPost'}>
                { ((el.start == 'true') 
                    ? el.title
                    : el.message)
                  .substring(0, 18)
                }
              </div>
            )}
          </div>
        }
      </div>
    )
  }
}

export default UserInfo;