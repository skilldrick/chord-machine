import React, {Component} from 'react';
import {render} from 'react-dom';
import chords from './chords';
import injectTapEventPlugin from 'react-tap-event-plugin';
import RaisedButton from 'material-ui/lib/raised-button';

class App extends Component {
  render() {
    return (
      <RaisedButton label={this.state.text} />
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



// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

render(<App />, document.getElementById('root'));
