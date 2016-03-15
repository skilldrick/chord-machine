import React, {Component} from 'react';
import {render} from 'react-dom';
import ValueSlider from './ValueSlider';
import init from './init';
import injectTapEventPlugin from 'react-tap-event-plugin';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import {hotelCalifornia, wickedGame} from './chords';

class App extends Component {
  buttonStyle = {
    marginRight: "10px"
  };

  render() {
    return (
      <div>
        <RaisedButton
          style={this.buttonStyle}
          disabled={this.state.disabled || this.state.playing}
          label="Play"
          onMouseUp={this.play}
        />

        <RaisedButton
          style={this.buttonStyle}
          disabled={this.state.disabled || !this.state.playing}
          label="Stop"
          onMouseUp={this.stop}
        />

        <FlatButton
          style={this.buttonStyle}
          disabled={this.state.disabled || this.state.hotelCalifornia}
          label="Hotel California"
          onMouseUp={this.hotelCalifornia}
        />

        <FlatButton
          style={this.buttonStyle}
          disabled={this.state.disabled || this.state.wickedGame}
          label="Wicked Game"
          onMouseUp={this.wickedGame}
        />

        <ValueSlider
          title="BPM"
          disabled={this.state.disabled}
          initialValue={this.props.bpm}
          onChange={(value) => this.state.clock.setBpm(value)}
        />

        <ValueSlider
          title="8ve -"
          disabled={this.state.disabled}
          initialValue={this.props.octavesDown}
          onChange={(value) => this.state.chords.setOctavesDown(value)}
          minValue={0}
          maxValue={3}
        />

        <ValueSlider
          title="8ve +"
          disabled={this.state.disabled}
          initialValue={this.props.octavesUp}
          onChange={(value) => this.state.chords.setOctavesUp(value)}
          minValue={0}
          maxValue={3}
        />

        <ValueSlider
          title="Notes"
          disabled={this.state.disabled}
          initialValue={this.props.notes}
          onChange={(value) => this.state.chords.setNotes(value)}
          minValue={1}
          maxValue={20}
        />

        <ValueSlider
          title="Attack"
          disabled={this.state.disabled}
          initialValue={this.props.attack}
          onChange={(value) => this.state.synth.adsr.attack = value}
          minValue={0.01}
          maxValue={0.5}
          step={0.01}
        />

        <ValueSlider
          title="Decay"
          disabled={this.state.disabled}
          initialValue={this.props.decay}
          onChange={(value) => this.state.synth.adsr.decay = value}
          minValue={0.01}
          maxValue={0.5}
          step={0.01}
        />

        <ValueSlider
          title="Sustain"
          disabled={this.state.disabled}
          initialValue={this.props.sustain}
          onChange={(value) => this.state.synth.adsr.sustain = value}
          minValue={0}
          maxValue={1}
          step={0.01}
        />

        <ValueSlider
          title="Release"
          disabled={this.state.disabled}
          initialValue={this.props.release}
          onChange={(value) => this.state.synth.adsr.release = value}
          minValue={0.01}
          maxValue={0.5}
          step={0.01}
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

  wickedGame = () => {
    this.stop();
    this.state.chords.setChords(wickedGame);
    this.setState({ wickedGame: true, hotelCalifornia: false });
    setTimeout(this.play, 1000);
  }

  hotelCalifornia = () => {
    this.stop();
    this.state.chords.setChords(hotelCalifornia);
    this.setState({ wickedGame: false, hotelCalifornia: true });
    setTimeout(this.play, 1000);
  }

  componentDidMount() {
    init.clockPromise.then(([clock, chords, synth]) => {
      this.setState({
        disabled: false,
        clock: clock,
        chords: chords,
        synth: synth
      });

      chords.setOctavesDown(this.props.octavesDown);
      chords.setOctavesUp(this.props.octavesUp);
      chords.setNotes(this.props.notes);
      clock.setBpm(this.props.bpm);
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      playing: false,
      hotelCalifornia: true
    };
  }

  static defaultProps = {
    bpm: 112,
    octavesDown: 0,
    octavesUp: 1,
    notes: 4,
    // adsr info is currently duplicated between here and presets.js
    attack: 0.1,
    decay: 0.3,
    sustain: 0.9,
    release: 0.1
  };
}


// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

render(<App />, document.getElementById('root'));
