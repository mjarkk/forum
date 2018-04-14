import React, { Component } from 'react'
import snarkdown from 'snarkdown'
import MDcomment from 'react-icons/lib/md/comment'
import MDshare from 'react-icons/lib/md/share'
import MDdelete from 'react-icons/lib/md/delete'
import MDinput from '../components/md-input.js'
import functions from '../imports/functions.js'
import urlHandeler from '../imports/urlhandeler.js'
import Popup from '../components/popup.js'
import UserInfo from '../components/userinfo.js'

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
      <div 
        className="proviel" 
        onClick={() => props.userDetialsHandeler(true)}
        style={{
          backgroundImage: `url(api/usericon.php?username=${props.username})`
        }}
      >
        {(props.userDetials) ? 
          <UserInfo 
            onShouldClose={() => props.userDetialsHandeler(false)}
            username={props.username}
            style={{
              top: '-25px',
              left: '-14px'
            }}
          />
        : ''}
        <span>{ props.username.slice(0,2) }</span>
      </div>
    </div>
    <div className="acctualMessage">
      <div className="sideData">
        Created on: <span>{ props.created }</span>, by <span>{ props.username }</span>
      </div>
      <div className="msgTitle">{ props.title }</div>
      <div className="msg" style={{wordBreak: (Math.max(...(props.msg.replace('/n',' ').split(' ').map(s => s.length))) < 50) ? 'normal' : 'break-all'}} dangerouslySetInnerHTML={{__html: snarkdown(escapeHtml(props.msg))}}></div>
      <div className="btns">
        {/* <button><MDcomment size={25} /></button> */}
        { navigator.share ? 
          <button
            onClick={() => {
              let title = message.state.beginMsg.title
              let url = location.href
              let text = document.createElement('div')
              text.innerHTML = snarkdown(escapeHtml(props.msg))
              text = text.innerText
              if (navigator.share) {
                navigator.share({
                  title: title,
                  text: text,
                  url: url
                })
              }
            }}
          ><MDshare size={25} /></button>
        : ''}
        {(props.LoginStatus.logedin && (props.LoginStatus.userData.username == props.username || Number(props.LoginStatus.userData.premission) == 3) && typeof props.id != 'undefined') ? 
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
                  } else {
                    message.onShow(false)
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
    super(inputs)
    let id = this.getMsgID()
    let fromLS = JSON.parse(localStorage.getItem('lastList'))
    this.state = {
      fromListID: (fromLS && (typeof fromLS.fromListID == 'number' || typeof fromLS.fromListID == 'string')) ? fromLS.fromListID : 0,
      fromListName: (fromLS && (typeof fromLS.fromListName == 'number' || typeof fromLS.fromListName == 'string')) ? fromLS.fromListName :  'home',
      waitingServe: false,
      reaction: '',
      startTitle: '',
      opened: inputs.show,
      id: id,
      beginMsg: {
        created: '',
        username: '',
        id : (id == -1) ? '-1' : '',
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
    this.urlhandeler = new urlHandeler({
      watch: false
    })
    if (this.state.opened && this.state.id != -1) {
      this.fetchMsg(this.state.id, () => this.CheckUpdate())
    }
    message = this
    this.onShow = inputs.onShow || (() => {})
  }
  getMsgID() {
    if (location.search && location.search.length > 3) {
      let test = location.search.split('&')
      test[0] = test[0].replace('?', '')
      let id = test.reduce((acc, el) => (el.startsWith('id=') ? Number(el.replace('id=', '')) : acc), 0)
      return (!!id) ? id.toString() : -1
    } else {
      return(-1)
    }
  }
  popupCallback(buttonID) {
    message.setState({
      popup: Object.assign({}, message.state.popup, {
        open: false
      })
    })
    let button = message.state.popup.actions[buttonID]
    if(!button.clickMe) {
      let win = window.open(message.state.popup.url, '_blank')
      win.focus()
    }
  }
  componentDidUpdate (prevProps, prevState) {
    // get all `a` tags in all messages and convert them to a normal array
    let aTags = [...document.querySelectorAll('.messageItem .acctualMessage a')] 
    aTags.map(el => {
      if (/javascript\:|data\:|http\:/gi.exec(el.href)) {
        el.onclick = (ev) => {
          ev.preventDefault()
          let newPopup = this.state.popup
          newPopup.url = (ev.target && ev.target.href) ? ev.target.href : 'http://'
          Array(...(ev.path || (ev.composedPath && ev.composedPath()))).reverse().map(el => {
            if (el.href) {
              newPopup.url = el.href
            }
          })
          if (newPopup.url.toLowerCase().indexOf('http:') >= 0) {
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
  CheckUpdate() {
    if (this.state.opened && (this.state.id == -1 || this.state.id == '-1' || this.state.beginMsg.username)) {
      setTimeout(() => 
        functions.fetch('./api/message.php?id=' + this.state.beginMsg.id, 'json', data => {
          if (data.status && data.data.length != this.state.reactions.length) {
            this.setState({
              reactions: data.data
            }, () => 
              this.CheckUpdate()
            )
          } else {
            this.CheckUpdate()
          }
        }, {
          cache: 'no-cache'
        })
      , 3000)
    } else {
      // if it's not open check after 7 seconds again
      setTimeout(() => this.CheckUpdate(), 7000)
    }
  }
  fetchMsg(id, callback) {
    const doCallback = 
      (typeof callback == 'function') 
        ? callback 
        : functions.fake
    functions.fetch('./api/message.php?id=' + id, 'json', (data) => {
      if (data.status) {
        if (JSON.stringify(data.created)[0] == '{') {
          this.setState({
            beginMsg: data.created,
            reactions: data.data
          }, () => doCallback())
        } else {
          doCallback()
        }
      } else {
        doCallback()
      }
    }, {
      cache: 'no-cache'
    })
  }
  render() {
    if (this.state.opened && (this.state.id == -1 || this.state.id == '-1' || this.state.beginMsg.username )) {
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
              userDetials={this.state.beginMsg.userDetials}
              userDetialsHandeler={status => {
                this.setState({
                  beginMsg: Object.assign({}, this.state.beginMsg, {userDetials: status})
                })
              }}
            />
          : ''} 

          {(this.state.beginMsg.id != '-1') ? 
            this.state.reactions.map((el, id) => 
              <ListItem
                key={id}
                created={el.created}
                username={el.username}
                msg={el.msg}
                LoginStatus={this.state.LoginStatus}
                id={el.id}
                arrayID={id}
                userDetials={el.userDetials}
                userDetialsHandeler={status => {
                  let toChange = this.state.reactions
                  toChange[id]['userDetials'] = status
                  this.setState({
                    reactions: toChange
                  })
                }}
              />
            )
          : ''} 

          { (this.state.LoginStatus.logedin) ? 
            <div className={(this.state.beginMsg.id == '-1' ? 'newMessage ' : '') + 'comment'}>
              <h3>{(this.state.beginMsg.id == '-1') ? 'Nieuw bericht' : 'Comment'}</h3>
              {(this.state.beginMsg.id == '-1') ? 
                <p>Maak een bericht in lijst: <b>{this.state.fromListName}</b></p>
              : ''}
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
                              }, () => {
                                this.urlhandeler.changePath('/message.php?id=' + data.id)
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
                            todo: this.state.beginMsg.id == '-1' ? 'create' : 'add',
                            fromList: this.state.fromListID
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
export const CreateMessage = (listID, listName) => {
  message.setState({
    fromListID: listID,
    fromListName: listName,
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
  message.onShow(true)
  localStorage.setItem('lastList', JSON.stringify({
    fromListID: listID, 
    fromListName: listName
  }))
  return true
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
  message.onShow(true)
}