// this file contains the setup

import React, { Component } from 'react'
import MDinput from '../componenets/md-input.js'
import { functions } from '../imports/functions.js'

const log = console.log

class Setup extends Component {
  constructor(inputs) {
    super(inputs)
    this.state = Object.assign({},{
      show: false,
      part: 0,
      SQLpassword: '',
      SQLusername: '',
      SQLserver: '',
      SQLdatabaseName: '',
      blockinput: false
    }, inputs)
    this.callback = inputs.callback || (() => {})
  }
  componentWillReceiveProps(inputs) {
    if (this.state.show != inputs.show) {
      this.setState({
        show: inputs.show
      })
    }
  }
  render() {
    if (this.state.show) {
      return (
        <div className="forumSetup">
          <div className="container">
            <div className="progress">
              <div style={{width: `${Math.round(100 / 3 * this.state.part)}%`}}></div>
            </div>
            {this.state.blockinput ? 
              <div className="overlay">
                <div></div>
              </div>
            : ''}

            {(this.state.part == 0) ? 
              <div className="part part1">
                <h1>Setup</h1>
                <p>We hebben een database nodig om berichten, gebruikers instellingen te kunnen opslaan</p>
                <button onClick={() => {
                  this.setState({
                    part: 1
                  })
                }}>Volgende</button>
              </div>
            : (this.state.part == 1) ?
              <div className="part part2">
                <h2>Sql info</h2>
                <MDinput 
                  label="sql password" 
                  type="text" 
                  onChange={(data) => this.setState({
                    SQLpassword: data
                  })} 
                />
                <MDinput 
                  label="sql username" 
                  type="text" 
                  onChange={(data) => this.setState({
                    SQLusername: data
                  })} 
                />
                <MDinput 
                  label="sql server" 
                  type="text" 
                  onChange={(data) => this.setState({
                    SQLserver: data
                  })} 
                />
                <MDinput 
                  label="sql database naam" 
                  type="text" 
                  onChange={(data) => this.setState({
                    SQLdatabaseName: data
                  })} 
                />
                <button onClick={() => {
                  this.setState({
                    part: 2
                  })
                }}>Check & volgende</button>
              </div>
            : 
              <div className="part part3">
                <h2>De database is correct</h2>
                <p>Alle data is goed ingevult klik op Setup Database om de database in te richten en basis data toe te voeggen</p>
                <div>
                  <h3>Jou accound</h3>
                  <p>Username: <span>{this.state.SQLusername}</span></p>
                  <p>Password: <span>{this.state.SQLpassword}</span></p>
                </div>
                <button onClick={() => {
                  this.setState({
                    part: 3
                  })
                  this.callback(false)
                }}>Setup Database</button>
              </div>
            }
          </div>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
}

export default Setup