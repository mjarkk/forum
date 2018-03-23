import React, { Component } from 'react'
import snarkdown from 'snarkdown'
import MDcomment from 'react-icons/lib/md/comment'
import MDshare from 'react-icons/lib/md/share'

const log = console.log
let message

class Message extends Component {
  constructor(inputs) {
    super()
    this.state = {
      reaction: '',
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
      reactions: [],
      LoginStatus: inputs.LoginStatus
    }
    if (this.state.opened) {
      this.fetchMsg(this.state.id)
    }
    message = this
    this['onShow'] = inputs.onShow || (() => {})
  }
  componentWillReceiveProps(inputs) {
    if ((!this.state.opened || this.state.id !== inputs.msgID) && inputs.show) {
      this.fetchMsg(inputs.msgID)
    }
    this.setState({
      opened: inputs.show,
      id: inputs.msgID,
      LoginStatus: inputs.LoginStatus
    })
  }
  fetchMsg(id) {
    fetch('./api/message.php?id=' + id)
      .then(res => res.json())
      .then(jsonData => {
        if (jsonData.status) {
          // jsonData.created.msg
          this.setState({
            beginMsg: jsonData.created,
            reactions: jsonData.data
          })
        } else {
          // some error report 
        }
      })
      .catch(err => log(err))
  }
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
  render() {
    if (this.state.opened) {
      return (
        <div className="mainMessage">
          <div className="messageItem">
            <div className="side">
              <div className="proviel">{ this.state.beginMsg.username.slice(0,2) }</div>
            </div>
            <div className="acctualMessage">
              <div className="sideData">
                Created on: <span>{ this.state.beginMsg.created }</span>, by <span>{ this.state.beginMsg.username }</span>
              </div>
              <div className="msgTitle">{ this.state.beginMsg.title }</div>
              <div className="msg" dangerouslySetInnerHTML={{__html: snarkdown(this.escapeHtml(this.state.beginMsg.msg))}}></div>
              <div className="btns">
                <button><MDcomment size={25} /></button>
                <button><MDshare size={25} /></button>
              </div>
            </div>
          </div>
          { (this.state.LoginStatus.logedin) ? 
            <div className="comment">
              <h3>Comment</h3>
              <textarea value={ this.state.reaction } onChange={ (ev) => this.setState({reaction: ev.target.value}) } rows="4" cols="30" placeholder="Comment"></textarea>
              <div className="btns">
                <button 
                  disabled={!this.state.reaction}
                  onClick={() => {
                    // TODO: add reaction to DB
                    log(this.state.reaction)
                  }}
                  className="placeComment"
                >Plaats comment</button>
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
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
}

export default Message
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