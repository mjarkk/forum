import React, { Component } from 'react'
import Setup from '../components/setup.js'
import {functions} from '../imports/functions.js'
import MDinput from '../components/md-input.js'
import MDdelete from 'react-icons/lib/md/delete'
import {OpenMessage, CreateMessage} from '../components/message.js'
import urlhandeler from '../imports/urlhandeler.js'

const log = console.log

class List extends Component {
  constructor(inputs) {
    super(inputs)
    this.state = {
      subForums: [],
      messages: [],
      forumName: '',
      LoginStatus: inputs.LoginStatus,
      showSetup: false,
      list: inputs.list,
      createList: false,
      createListName: '',
      createListWorking: false
    }
    this.fetchList(inputs.list || 0)
    this.urlHandeler = new urlhandeler({
      watch: false
    }) 
  }
  shouldComponentUpdate /* lol yes :D */ (inputs) {
    if (inputs.LoginStatus.logedin != this.state.LoginStatus.logedin) {
      this.setState({
        LoginStatus: inputs.LoginStatus
      })
    }
    if (inputs.list != this.state.list && typeof inputs.list == 'number') {
      this.fetchList(inputs.list)
    }
    return true
  }
  fetchList(listNumber) {
    if (!isNaN(+listNumber) && typeof +listNumber == 'number') {
      functions.fetch(
        './api/list.php?what=' + listNumber,
        'json',
        (data) => {
          if (data.status && typeof data.data.SQL == 'undefined' && typeof data.data.DB == 'undefined' && typeof data.data.ENV == 'undefined') {
            let jsonData = data.data
            this.setState({
              subForums: jsonData.lists,
              messages: jsonData.messages,
              forumName: jsonData.title
            })
          } else {
            let status = data.report
            if(status && !status.DB && !status.ENV && !status.SQL) {
              this.setState({
                showSetup: true
              })
            } else {
              // the database works 50%
              // give error to screen or check if this just issn't a forum list without posts or sub lists
            }
          }
        }
      )
    } else {
      log('the list to fetch is not a falid input:',listNumber)
    }
  }
  render() {
    return (
      <div className="mainList">
        <div className="title">
          <h2>{this.state.forumName}</h2>
        </div>
        {(this.state.LoginStatus.logedin) ? 
          <div className="buttons">
            <button
              onClick={() => {
                CreateMessage()
                this.urlHandeler.changePath('/message.php')
              }}
            >Nieuw bericht</button>
            { (Number(this.state.LoginStatus.userData.premission) == 2 || Number(this.state.LoginStatus.userData.premission) == 3) ?
              <button
                onClick={() => {
                  this.setState({
                    createList: true
                  })
                }}
              >Nieuwe lijst</button>
            : '' }  
          </div> 
        : ''}
        {(this.state.subForums[0]) ? 
          <div className="lists list">
            <h3>Sub lijsten</h3>
            {this.state.subForums.map((el, id) => 
              <div key={id} className="listitem">
                <div className="itemTitle" onClick={() => {
                  log(el)
                }}>{el.name}</div>
                { (Number(this.state.LoginStatus.userData.premission) == 3) ?
                  <div className="options">
                    <MDdelete className="remove icon" size={25}/>
                  </div>
                : '' }
              </div>
            )}
          </div>
        : ''}
        <div className="messages list">
          {(this.state.messages[0]) ? <h3>Messages</h3> : ''}
          {this.state.messages.reverse().map((msg, id) => 
            <div key={id} className="listitem" onClick={() => {
              OpenMessage(msg)
              this.urlHandeler.changePath('/message.php?id=' + (msg.id || '-1'))
            }}>
              <div className="itemTitle">{msg.title}</div>
              <div className="subdata">
                <div>Created by <span>{msg.username}</span></div>
                <div>Created: <span>{ functions.dateToString(msg.created) }</span></div>
              </div>
            </div>
          )}
        </div>
        { (this.state.createList) ? 
          <div className="newList">
            <div className="newListInside">
              <h2>Creëer een nieuwe lijst</h2>
              <div className="inputs">
                <MDinput
                  label="Lijst naam"
                  onChange={data => this.setState({
                    createListName: data
                  })}
                />
              </div>
              <div className="buttons">
                <button
                  disabled={this.state.createListWorking}
                  onClick={() => {
                    this.setState({
                      createList: false
                    })
                  }}
                >Terug</button>
                <button
                  disabled={!this.state.createListName || this.state.createListWorking}
                  onClick={() => {
                    this.setState({
                      createListWorking: true
                    }, () => {
                      functions.fetch('./api/list.php', 'json', (data) => {
                        if (data.status) {
                          this.fetchList(this.state.list)
                          this.setState({
                            createList: false,
                            createListWorking: false,
                            createListName: ''
                          })
                        } else {
                          this.setState({
                            createListWorking: false
                          })
                        }
                      }, {
                        cache: 'no-cache',
                        method: 'POST',
                        body: {
                          listname: this.state.createListName
                        }
                      })
                    })
                  }}
                >Lijst aan maken</button>
              </div>
            </div>
          </div>
        : ''}
        <Setup 
          show={this.state.showSetup}
          callback={(show) => {
            this.setState({
              showSetup: show
            })
          }}
        />
      </div>
    )
  }
}

export default List;