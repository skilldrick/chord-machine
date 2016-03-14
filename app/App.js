import React, {Component} from 'react';
import {render} from 'react-dom';
import ValueSlider from './ValueSlider';
import chords from './chords';
import injectTapEventPlugin from 'react-tap-event-plugin';
import RaisedButton from 'material-ui/lib/raised-button';

class App extends Component {
  render() {
    return (
      <div>
        <RaisedButton style={{marginRight: "10px"}} disabled={this.state.disabled || this.state.playing} label="Play" onMouseUp={this.play} />
        <RaisedButton disabled={this.state.disabled || !this.state.playing} label="Stop" onMouseUp={this.stop} />
        <ValueSlider
          title="BPM"
          disabled={this.state.disabled}
          value={this.props.bpm}
          onChange={this.bpmChange}
        />
      </div>

    );
  }

  addHighlight = () => {
    this.setState({ highlight: true });
  }


  play = () => {
    this.state.clock.start();
    this.setState({ playing: true });
  }

  stop = () => {
    this.state.clock.stop();
    this.setState({ playing: false });
  }

  bpmChange = (bpm) => {
    this.state.clock.setBpm(bpm);
    console.log(bpm);
  }

  componentDidMount() {
    chords.clockPromise.then((clock) => {
      this.setState({ disabled: false });
      this.setState({ clock: clock });
    });
  }

  constructor(props) {
    super(props);
    this.state = { disabled: true, playing: false };
  }
}




// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

render(<App bpm={112} />, document.getElementById('root'));
