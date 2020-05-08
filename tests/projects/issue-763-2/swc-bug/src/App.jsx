import React, { Component } from 'react';
import Contacts from './websites';

class App extends Component {
  state = {
    websites: []
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        websites: [
          { type_id: 1, value: 'website1' },
          { type_id: 2, value: 'website2' }
        ]
      })
    }, 1000)
  }
  render() {
    return (
      <div>
        <Contacts websites={this.state.websites} />
      </div>
    )
  }
}

export default App