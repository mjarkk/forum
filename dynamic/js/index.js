import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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
      <h1>{this.state.title}</h1>
    )
  }
}

// export default App;

ReactDOM.render(<App/>, document.getElementById('root'));