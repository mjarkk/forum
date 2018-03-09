import React, { Component } from 'react'

const log = console.log

class List extends Component {
  constructor() {
    super()
    this.state = {
      subForums: [],
      messages: [],
      forumName: ''
    }
    fetch('./api/list.php?what=0') // fetch the list
      .then(res => res.json())
      .then(jsonData => {
        this.setState({
          subForums: jsonData.lists,
          messages: jsonData.messages,
          forumName: jsonData.title
        })
      })
      .catch(err => log(err))
  }
  render() {
    return (
      <div className="mainList">
        <div className="title">
          <h2>{this.state.forumName}</h2>
        </div>
        <div className="lists list">
          {(this.state.subForums[0]) ? <h3>Sub forums</h3> : ''}
        </div>
        <div className="messages list">
          {(this.state.messages[0]) ? <h3>Messages</h3> : ''}
          {this.state.messages.map((msg, id) => 
            <div key={id} className="listitem">
              <div className="itemTitle">{msg.title}</div>
              <div className="subdata">
                <div>Created by <span>{msg.username}</span></div>
                <div>Created: <span>{msg.created.split('-').map((el, i) => 
                  (i == 1) ? // check it the item is the time
                    el.split(':').slice(0,2).join(':') + // get the hours + minutes
                    el.slice(-2) : // add am or pm
                    el + ' ' // return the date with a space at the end
                )}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default List;