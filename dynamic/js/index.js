// js imports
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MDface from 'react-icons/lib/md/face'
import MDmenu from 'react-icons/lib/md/menu'

// component imports
import List from './componenets/list.js'
import BigMenu, { menuHandeler } from './componenets/menu.js'
import Message from './componenets/message.js'
import LoginRegister, { LoginStatus } from './componenets/userhandeler.js'

// style imports
import '../stylus/style.styl'

const log = console.log

class App extends Component {
  constructor() {
    super()
    this.state = {
      title: 'forum',
      show: 'list',
      LoginStatus
    }
  }
  render() {
    return (
      <div className="mainApp">
        <div className="header">
          <MDmenu onClick={(e) => {
            menuHandeler(true)
          }} size={35} /><h1>{this.state.title}</h1>
        </div>
        { (this.state.show == 'list') ? 
            <div className="listWrapper">
              <List />
            </div>
          : ''
        }
        
        <BigMenu LoginStatus={this.state.LoginStatus} />
        <LoginRegister onUserDataChange={(newData) => {
          let toSet = this.state
          toSet.LoginStatus = Object.assign({}, toSet.LoginStatus, newData)
          this.setState(toSet)
        }} />
        <Message LoginStatus={this.state.LoginStatus} show={this.state.show == 'message'} onShow={(data) => {
          // this function will be run when the post need to be shown
          this.setState({
            show: 'message'
          })
        }} msgID={1}/>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));