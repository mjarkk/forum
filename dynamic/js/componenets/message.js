import React, { Component } from 'react'
import snarkdown from 'snarkdown'
import MDcomment from 'react-icons/lib/md/comment'
import MDshare from 'react-icons/lib/md/share'

const log = console.log

let message = undefined

class Message extends Component {
  constructor() {
    super()
    this.state = {
      opened: true,
      id: 1,
      beginMsg: {
        created: '',
        username: '',
        id : '',
        msg : '',
        premission : '',
        title : '',
        username : ''
      },
      reactions: []
    }
    if (this.state.opened) {
      this.fetchMsg(this.state.id)
    }
    message = this
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
          log(this.state)
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
      </div>
    )
  }
}

export default Message;