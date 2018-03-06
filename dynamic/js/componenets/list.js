import React, { Component } from 'react'

class List extends Component {
  constructor() {
    super()
    this.state = {
      title: 'test'
    }
  }
  render() {
    return (
      <div className="mainList">
        list item
      </div>
    )
  }
}

export default List;