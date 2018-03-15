// js imports
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MDface from 'react-icons/lib/md/face'
import MDmenu from 'react-icons/lib/md/menu'

// component imports
import List from './componenets/list.js'
import BigMenu, { menuHandeler } from './componenets/menu.js'
import Message from './componenets/message.js'

// style imports
import '../stylus/style.styl'

const log = console.log

class App extends Component {
  constructor() {
    super()
    this.state = {
      title: 'forum'
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
        <div className="listWrapper">
          <List />
        </div>
        <BigMenu />
        <Message show={false} msgID={1}/>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));