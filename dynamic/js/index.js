// js imports
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MDface from 'react-icons/lib/md/face'
import MDmenu from 'react-icons/lib/md/menu'
import MDback from 'react-icons/lib/md/arrow-back'

// component imports
import BigMenu, { menuHandeler } from './componenets/menu.js'
import LoginRegister, { LoginStatus } from './componenets/userhandeler.js'
import List from './componenets/list.js'
import Message from './componenets/message.js'
import Settings from './componenets/settings.js'

// style imports
import '../stylus/style.styl'

// import tests
import tests from './imports/tests.js'

const log = console.log

class App extends Component {
  constructor(inputs) {
    super(inputs)
    this.state = {
      title: 'forum',
      show: 'list',
      list: 0,
      LoginStatus
    }
  }
  render() {
    return (
      <div className="mainApp">
        <div className="header">
          { (this.state.show == 'list') ?
            <MDmenu onClick={e => {
              menuHandeler(true)
            }} size={35} />
          : 
            <MDback onClick={e => {
              this.setState({
                show: 'list'
              })
            }} size={35} />
          }
          <h1>{this.state.title}</h1>
        </div>
        { (this.state.show == 'list') ? 
            <div className="listWrapper">
              <List 
                LoginStatus={this.state.LoginStatus} 
                list={this.state.list}
              />
            </div>
          : ''
        }
        
        <BigMenu 
          LoginStatus={this.state.LoginStatus}
          showChange={newdata => this.setState({show: newdata})}
          onUserDataChange={newData => {
            this.setState({LoginStatus: Object.assign({}, this.state.LoginStatus, newData)})
          }}
        />
        <LoginRegister 
          onUserDataChange={newData => {
            this.setState({LoginStatus: Object.assign({}, this.state.LoginStatus, newData)})
          }}
        />
        <Message 
          LoginStatus={this.state.LoginStatus} 
          show={this.state.show == 'message'} 
          onShow={(data) => {
            this.setState({
              show: 'message'
            })
          }}
        />
        {(this.state.show == 'settings') ? 
          <Settings
            LoginStatus={this.state.LoginStatus}
            onUserDataChange={() => {
              this.setState(Object.assign({}, this.state.LoginStatus, newData))
            }}
          />
        : ''}
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));