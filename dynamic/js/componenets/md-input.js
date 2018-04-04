import React, { Component } from 'react'

const log = console.log

class MLinput extends Component {
  constructor(inputs) {
    super(inputs)
    this.state = Object.assign(
    {}, {
      focus: false,
      id: this.randomString(30),
      inputdata: inputs.defualt || '',
      focust: false
    }, inputs)
  }
  randomString(length) {
    if (!length) {
      length = 10
    }
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    for (var i = 0; i < length; i++) { 
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }
  render() {
    return (
      <div className="ml-input-holder">
        {(this.state.label) ?
          <label 
            className={(this.state.inputdata || this.state.focust) ? 'focus' : ''}
            htmlFor={this.state.id}
          >{this.state.label}</label> 
        : ''}
        <input 
          value={ this.state.inputdata } 
          onChange={ (ev) => {
            this.setState({inputdata: ev.target.value}, () => {
              if(typeof this.state.onChange == 'function') {
                this.state.onChange(this.state.inputdata)
              }
            })
          }} 
          onFocus={(ev) => {
            this.setState({
              focust: true
            })
          }}
          onBlur={(ev) => {
            this.setState({
              focust: false
            })
          }}
          id={this.state.id} 
          type={(this.state.type) ? this.state.type : 'text'} 
        />
      </div>
    )
  }
}

export default MLinput;