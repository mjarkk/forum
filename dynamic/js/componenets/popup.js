import React, { Component } from 'react'

const log = console.log

class Popup extends Component {
  constructor(inputs) {
    super(inputs)
    this.state = {
      open: inputs.open,
      title: inputs.title || '', // text
      msg: inputs.msg || '',
      actions: inputs.actions || [{
        text: 'Oke',
        clickMe: true
      }]
    }
    this.callback = inputs.callback || (() => {})
  }
  componentWillReceiveProps(inputs) {
    this.setState(inputs)
  }
  render() {
    if (this.state.open) {
      return (
        <div className="popupHolder">
          <div className="popup">
            <h3>{this.state.title}</h3>
            <p>{this.state.msg}</p>
            <div className="actions">
              {this.state.actions.map((el, id) => 
                <button
                  key={id}
                  className={el.clickMe ? 'primary' : 'secondary'}
                  onClick={() => {
                    this.setState({
                      open: false
                    })
                    this.callback(id)
                  }}
                >
                  {el.text}
                </button>
              )}
            </div>
          </div>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
}

export default Popup