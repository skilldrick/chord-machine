import React, {Component} from 'react';
import {render} from 'react-dom';
import chords from './chords';
import injectTapEventPlugin from 'react-tap-event-plugin';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import Slider from 'material-ui/lib/slider';
import TextField from 'material-ui/lib/text-field';
import _ from 'lodash';


class App extends Component {
  render() {
    return (
      <div>
        <RaisedButton style={{marginRight: "10px"}} disabled={this.state.disabled || this.state.playing} label="Play" onMouseUp={this.play} />
        <RaisedButton disabled={this.state.disabled || !this.state.playing} label="Stop" onMouseUp={this.stop} />
        <BpmSlider disabled={this.state.disabled} bpm={this.props.bpm} onChange={this.bpmChange} />
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

class BpmSlider extends Component {
  render() {
    return (
      <div>
        <Slider
          style={
            {
              display: "inline-block",
              height: "24px",
              verticalAlign: "top",
              lineHeight: "24px",
              position: "relative",
              width: "300px"
            }
          }
          disabled={this.props.disabled}
          defaultValue={this.state.bpm}
          value={this.state.bpm}
          max={this.props.maxValue}
          min={this.props.minValue}
          onChange={this.onSliderChange}
          step={1}
        />
        <TextField
          type="number"
          defaultValue={this.state.bpm}
          value={this.state.inputBpm}
          max={this.props.maxValue}
          min={this.props.minValue}
          onChange={this.onTextFieldChange}
          onBlur={this.onTextFieldBlur}
          style={
            {
              marginLeft: "20px",
              width: "50px",
              verticalAlign: "top",
            }
          }
        />
      </div>
    );
  }

  onSliderChange = (event, value) => {
    this.onChange(value);
  }

  onTextFieldChange = (event) => {
    this.onChange(event.target.value);
  }

  onChange = _.throttle((value) => {
    const validated = this.validate(value);
    this.props.onChange(validated);
    // If we set the TextField to the validated BPM, the user wouldn't be able
    // to type "60", because "6" would first be validated to "50".
    // On blur, value is set to actual BPM
    this.setState({ bpm: validated, inputBpm: value });
  }, 100)

  validate(value) {
    return Math.max(Math.min(value, this.props.maxValue), this.props.minValue);
  }

  onTextFieldBlur = () => {
    this.setState({ inputBpm: this.state.bpm });
  }

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = { bpm: this.props.bpm };
  }

  static defaultProps = {
    minValue: 50,
    maxValue: 300
  };
}



// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

render(<App bpm={112} />, document.getElementById('root'));
