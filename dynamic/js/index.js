// js imports
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

// component imports
import List from './componenets/list.js'

// style imports
import style from '../stylus/style.styl'

const log = console.log

class App extends Component {
  constructor() {
    super()
    this.state = {
      title: 'test'
    }
  }
  render() {
    return (
      <div className="mainApp">
        <div className="header">
          <h1>{this.state.title}</h1>
          <div>
            
          </div>
        </div>
        <div>
          <List/>
        </div>
      </div>
      
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));