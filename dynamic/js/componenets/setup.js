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
      blockinput: false,
      SQLerror: ''
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
                <p>We hebben een database nodig om berichten, gebruikers, instellingen en alle andere soorten data te kunnen opslaan</p>
                <button onClick={() => {
                  this.setState({
                    part: 1
                  })
                }}>Volgende</button>
              </div>
            : (this.state.part == 1) ?
              <div className="part part2">
                <h2>Sql info</h2>
                <p>Voordat je verder gaat zorg ervoor dat je een database hebt aangemaakt met een naam naar jou keuze</p>
                { this.state.SQLerror ? <p className="errorText">{this.state.SQLerror}</p> : ''}
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
                <button 
                  disabled={!this.state.SQLusername || !this.state.SQLserver || !this.state.SQLdatabaseName}
                  onClick={() => {
                    this.setState({
                      blockinput: true
                    })
                    functions.fetch('./api/checksetup.php', 'json', data => {
                      log(data)
                      if (data.status) {
                        this.setState({
                          part: 2,
                          blockinput: false
                        })
                      } else {
                        this.setState({
                          blockinput: false,
                          SQLerror: `${data.why}, ${data.long}`
                        })
                      }
                    }, {
                      ache: 'no-cache',
                      method: 'POST',
                      body: {
                        username: this.state.SQLusername,
                        password: this.state.SQLpassword,
                        server: this.state.SQLserver,
                        databasename: this.state.SQLdatabaseName
                      }
                    })
                  }}
                >Check & volgende</button>
              </div>
            : 
              <div className="part part3">
                <h2>De database is correct</h2>
                <p>Alle data is goed ingevult klik op Setup Database om de database in te richten en basis data toe te voeggen</p>
                <div className="accoundInf">
                  <h3>Jou accound</h3>
                  <p>Username: <span>{this.state.SQLusername}</span></p>
                  <p>Password: <span>{this.state.SQLpassword}</span></p>
                </div>
                <button onClick={() => {
                  this.setState({
                    blockinput: true
                  })
                  functions.fetch('./api/setup.php', 'json', data => {
                    log(data)
                    if (data.status) {
                      this.setState({
                        // part: 3,
                        blockinput: false
                      }, () => {
                        // this.callback(false)
                      })
                    } else {
                      this.setState({
                        blockinput: false
                      })
                    }
                  }, {
                    ache: 'no-cache',
                    method: 'POST',
                    body: {
                      username: this.state.SQLusername,
                      password: this.state.SQLpassword,
                      server: this.state.SQLserver,
                      databasename: this.state.SQLdatabaseName
                    }
                  })
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