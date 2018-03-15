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
      reactions: []
    }
    if (this.state.opened) {
      this.fetchMsg(this.state.id)
    }
    message = this
  }
  componentWillReceiveProps(inputs) {
    if ((!this.state.opened || this.state.id !== inputs.msgID) && inputs.show) {
      this.fetchMsg(inputs.msgID)
    }
    this.setState({
      opened: inputs.show,
      id: inputs.msgID
    })
  }
  openMsg(input) {

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
          <div className="comment">
            <h3>Comment</h3>
            <textarea rows="4" cols="30" placeholder="Comment"></textarea>
          </div>
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
}