import React, {Component} from 'react';
import {render} from 'react-dom';
import chords from './chords';

class App extends Component {
  render() {
    return (
      <div>
        {this.state.text}
      </div>
    );
  }

  componentDidMount() {
    let i = 0;

    setInterval(() => {
      i++;
      this.setState({ text: "hello " + i });
    }, 1000);
  }

  constructor(props) {
    super(props);
    this.state = { text: "hi" };
  }
}




render(<App />, document.getElementById('root'));
