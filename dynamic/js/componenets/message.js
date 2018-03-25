import React, { Component } from 'react'
import snarkdown from 'snarkdown'
import MDcomment from 'react-icons/lib/md/comment'
import MDshare from 'react-icons/lib/md/share'
import MDdelete from 'react-icons/lib/md/delete'
import {functions} from '../imports/functions.js'
import MDinput from '../componenets/md-input.js'
import Popup from '../componenets/popup.js'

const log = console.log
let message

// escape html
const escapeHtml = unsafe => 
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

// return a message
const ListItem = (props) => 
  <div className="messageItem">
    <div className="side">
      <div className="proviel">{ props.username.slice(0,2) }</div>
    </div>
    <div className="acctualMessage">
      <div className="sideData">
        Created on: <span>{ props.created }</span>, by <span>{ props.username }</span>
      </div>
      <div className="msgTitle">{ props.title }</div>
      <div className="msg" dangerouslySetInnerHTML={{__html: snarkdown(escapeHtml(props.msg))}}></div>
      <div className="btns">
        <button><MDcomment size={25} /></button>
        <button><MDshare size={25} /></button>
        {(props.LoginStatus.logedin && props.LoginStatus.userData.username == props.username && typeof props.id != 'undefined') ? 
          <button
            onClick={() => {
              functions.fetch('./api/message.php', 'json', data => {
                if (data.status) {
                  if (typeof props.arrayID != 'undefined') {
                    let toset = message.state.reactions
                    toset.splice(props.arrayID,1)
                    message.setState({
                      reactions: toset
                    })
                  }
                }
              }, {
                cache: 'no-cache',
                method: 'POST',
                body: {
                  messageId: props.id,
                  todo: 'remove'
                }
              })

            }}
          ><MDdelete size={25} /></button>
        : ''}
      </div>
    </div>
  </div>

class Message extends Component {
  constructor(inputs) {
    super()
    this.state = {
      waitingServe: false,
      reaction: '',
      startTitle: '',
      opened: inputs.show,
      id: inputs.msgID,
      beginMsg: {
        created: '',
        username: '',
        id : '',
        msg : '',
        premission : '',
        title : ''
      },
      popup: {
        url: '',
        title: '',
        open: false,
        msg: '',
        actions: false
      },
      reactions: [],
      LoginStatus: inputs.LoginStatus
    }
    if (this.state.opened) {
      this.fetchMsg(this.state.id)
    }
    message = this
    this.onShow = inputs.onShow || (() => {})
  }
  popupCallback(buttonID) {
    let button = message.state.popup.actions[buttonID]
    if(!button.clickMe) {
      let win = window.open(message.state.popup.url, '_blank')
      win.focus()
    }
  }
  componentDidUpdate (prevProps, prevState) {
    let aTags = [...document.querySelectorAll('.messageItem .acctualMessage a')]
    aTags.map(el => {
      if (/javascript\:|data\:|http\:/gi.exec(el.href)) {
        el.onclick = (ev) => {
          ev.preventDefault()
          let newPopup = this.state.popup
          newPopup.url = ev.target.href
          if (ev.target.href.toLowerCase().indexOf('http:') >= 0) {
            newPopup.title = 'Deze link is niet vijlig'
            newPopup.msg = 'Deze site heeft geen SSL certificaat waardoor het verkeer niet ge-encrypt is'
            newPopup.open = true
            newPopup.actions = [{
              text: 'Ga terug',
              clickMe: true
              },{
              text: 'Open',
              clickMe: false
            }]
          } else {
            newPopup.title = 'Deze link is niet vijlig'
            newPopup.msg = 'Deze link probeert toegang te krijgen tot je browser'
            newPopup.open = true
            newPopup.actions = [{
              text: 'Ga terug',
              clickMe: true
            }]
          }
          this.setState({
            popup: newPopup
          })
        }
      }
      return el
    })
  }
  componentWillReceiveProps(inputs) {
    let toSet = {
      opened: inputs.show,
      LoginStatus: inputs.LoginStatus
    }
    this.setState(toSet)
  }
  fetchMsg(id, callback) {
    const doCallback = () => typeof callback == 'function' ? callback() : false
    fetch('./api/message.php?id=' + id)
      .then(res => res.json())
      .then(jsonData => {
        if (jsonData.status) {
          // jsonData.created.msg
          this.setState({
            beginMsg: jsonData.created,
            reactions: jsonData.data
          }, () => doCallback())
        } else {
          doCallback()
          // some error report 
        }
      })
      .catch(err => {
        log(err)
        doCallback()
      })
  }
  render() {
    if (this.state.opened) {
      return (
        <div className="mainMessage">
          
          {(this.state.beginMsg.id != '-1') ? 
            <ListItem 
              username={this.state.beginMsg.username} 
              created={this.state.beginMsg.created} 
              title={this.state.beginMsg.title}
              msg={this.state.beginMsg.msg} 
              LoginStatus={this.state.LoginStatus}
              id={this.state.beginMsg.id}
            />
          : ''} 

          {this.state.reactions.map((el, id) => 
            <ListItem
              key={id}
              created={el.created}
              username={el.username}
              msg={el.msg}
              LoginStatus={this.state.LoginStatus}
              id={el.id}
              arrayID={id}
            />
          )}

          { (this.state.LoginStatus.logedin) ? 
            <div className={(this.state.beginMsg.id == '-1' ? 'newMessage ' : '') + 'comment'}>
              <h3>{(this.state.beginMsg.id == '-1') ? 'Nieuw bericht' : 'Comment'}</h3>
              {(this.state.beginMsg.id == '-1') ? 
                <MDinput 
                  label="title" 
                  type="text" 
                  onChange={(newTitle) => 
                    this.setState({
                      startTitle: newTitle
                    })
                  } 
                />
              :''}
              <textarea value={ this.state.reaction } onChange={ (ev) => this.setState({reaction: ev.target.value}) } rows="4" cols="30" placeholder="Comment"></textarea>
              {(this.state.beginMsg.id == '-1') ? <p>Pro tip: dit forum heeft support voor <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">Markdown</a></p> : ''}
              <div className="btns">
                <button 
                  disabled={!this.state.reaction || this.state.waitingServe || (this.state.beginMsg.id == '-1' && !this.state.startTitle)}
                  onClick={() => {
                    if (typeof this.state.beginMsg.id == 'string') {
                      let reactionToSend = this.state.reaction
                      this.setState({
                        waitingServe: true
                      }, () => {
                        functions.fetch('./api/message.php', 'json', (data) => {
                          if (data.status && this.state.beginMsg.id != '-1') {
                            // add the message to the list if it was added to the database
                            let now = new Date()
                            let hours = now.getHours()
                            let reactions = this.state.reactions
                            reactions.push({
                              created: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}-${hours > 12 ? hours - 12 : hours == 0 ? 12 : hours}:${now.getMinutes()}:${now.getSeconds()}${hours >= 12 ? 'pm' : 'am'}`,
                              id: data.id,
                              msg: reactionToSend,
                              username: this.state.LoginStatus.userData.username
                            })
                            this.setState({
                              reactions: reactions,
                              reaction: '',
                              waitingServe: false
                            })
                          } else if (data.status) {
                            this.fetchMsg(data.id, () => {
                              this.setState({
                                waitingServe: false,
                                reaction: '',
                                startTitle: ''
                              })
                            })
                          } else {
                            // some error report
                            this.setState({
                              waitingServe: false
                            })
                          }
                        }, {
                          cache: 'no-cache',
                          method: 'POST',
                          body: {
                            reaction: reactionToSend,
                            messageTitle: this.state.startTitle,
                            messageId: this.state.beginMsg.id,
                            todo: this.state.beginMsg.id == '-1' ? 'create' : 'add'
                          }
                        })
                      })
                    }
                  }}
                  className="placeComment"
                >Plaats {(this.state.beginMsg.id == '-1') ? 'bericht' : 'comment'}</button>
              </div>
            </div>
          : 
            <div className="comment-need-login">
              <p>Login / Register om een comment te plaatsen</p>
              <div className="btns">
                <button onClick={() => this.state.LoginStatus.openlogin(false)}>Login</button>
                <button onClick={() => this.state.LoginStatus.openlogin(true)}>Register</button>
              </div>
            </div>
          }
          <Popup 
            open={this.state.popup.open}
            title={this.state.popup.title}
            msg={this.state.popup.msg}
            callback={this.popupCallback}
            actions={this.state.popup.actions}
          />
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
}

export default Message
export const CreateMessage = () => {
  message.setState({
    opened: true,
    id: -1,
    title: '',
    msg: '',
    beginMsg: {
      created: '',
      username: '',
      id : '-1',
      msg : '',
      premission : '',
      title : ''
    }
  })
  message.onShow(message.state)
}
export const OpenMessage = (input) => {
  message.setState({
    opened: true,
    id: input.id,
    beginMsg: {
      created: input.created,
      username: input.username,
      id : input.id,
      msg : '',
      premission : input.premission,
      title : input.title,
    }
  })
  message.fetchMsg(input.id)
  message.onShow(message.state)
}