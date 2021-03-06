// defualt imports
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MDface from 'react-icons/lib/md/face'
import MDmenu from 'react-icons/lib/md/menu'
import MDback from 'react-icons/lib/md/arrow-back'
import urlhandeler from './imports/urlhandeler.js'

// component imports
import BigMenu, { menuHandeler } from './components/menu.js'
import LoginRegister, { LoginStatus } from './components/userhandeler.js'
import List from './components/list.js'
import Message from './components/message.js'
import Settings from './components/settings.js'

// style imports
import '../stylus/style.styl'

const log = console.log

class App extends Component {
  constructor(inputs) {
    super(inputs)
    this.state = {
      title: 'forum',
      show: '',
      list: 0,
      LoginStatus
    }
    this.urlHandeler = new urlhandeler({
      watch: true,
      changeState: toChagne => this.setState(toChagne),
      installEv: data => {
        this.state.show = data
      }
    }) 
  }
  viewList() {
    this.setState({
      show: 'list'
    })
    this.urlHandeler.changePath('/?list=' + this.state.list)
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
            <MDback onClick={e => this.viewList()} size={35} />
          }
          <h1>{this.state.title}</h1>
        </div>
        { (this.state.show == 'list') ? 
            <div className="listWrapper">
              <List 
                LoginStatus={this.state.LoginStatus}
                lastList={list => this.setState({list})}
              />
            </div>
          : ''
        }
        
        <BigMenu 
          LoginStatus={this.state.LoginStatus}
          showChange={newdata => {
            if (newdata == 'settings') {
              this.urlHandeler.changePath('/settings.php')
            }
            this.setState({show: newdata})}
          }
          onUserDataChange={newData => 
            this.setState({LoginStatus: Object.assign({}, this.state.LoginStatus, newData)})
          }
        />
        <LoginRegister 
          onUserDataChange={newData => 
            this.setState({LoginStatus: Object.assign({}, this.state.LoginStatus, newData)})
          }
        />
        <Message 
          LoginStatus={this.state.LoginStatus} 
          show={this.state.show == 'message'} 
          onShow={data => 
            (typeof data == 'object' || typeof data == 'undefined' || (typeof data == 'boolean' && data))
              ? this.setState({show: 'message'})
              : this.viewList()
          }
        />
        {(this.state.show == 'settings') ? 
          <Settings
            LoginStatus={this.state.LoginStatus}
            onUserDataChange={newData => 
              this.setState({LoginStatus: Object.assign({}, this.state.LoginStatus, {userData: newData})})
            }
          />
        : ''}
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));