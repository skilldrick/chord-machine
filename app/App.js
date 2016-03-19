import React, {Component} from 'react';
import {render} from 'react-dom';
import ValueSlider from './ValueSlider';
import init from './init';
import injectTapEventPlugin from 'react-tap-event-plugin';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import {sequences} from './chords';

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

        <RaisedButton
          style={this.buttonStyle}
          disabled={this.state.disabled || !this.state.playing}
          label="Pause"
          onMouseUp={this.pause}
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
          title="8ve +"
          disabled={this.state.disabled}
          initialValue={this.props.chords.octavesUp}
          onChange={(value) => this.state.chords.octavesUp = value}
          minValue={0}
          maxValue={4}
        />

        <ValueSlider
          title="Notes"
          disabled={this.state.disabled}
          initialValue={this.props.chords.notes}
          onChange={(value) => this.state.chords.notes = value}
          minValue={1}
          maxValue={20}
        />

        <ValueSlider
          title="Color"
          disabled={this.state.disabled}
          initialValue={this.props.synth.color}
          onChange={(value) => this.state.synth.color = value}
          minValue={1}
          maxValue={10}
          step={1}
        />

        <ValueSlider
          title="Intensity"
          disabled={this.state.disabled}
          initialValue={this.props.synth.intensity}
          onChange={(value) => this.state.synth.intensity = value}
          minValue={0}
          maxValue={9999}
        />


        <ValueSlider
          title="Attack"
          disabled={this.state.disabled}
          initialValue={this.props.synth.adsr.attack}
          onChange={(value) => this.state.synth.adsr.attack = value}
          minValue={0}
          maxValue={0.5}
          step={0.01}
        />

        <ValueSlider
          title="Decay"
          disabled={this.state.disabled}
          initialValue={this.props.synth.adsr.decay}
          onChange={(value) => this.state.synth.adsr.decay = value}
          minValue={0}
          maxValue={0.5}
          step={0.01}
        />

        <ValueSlider
          title="Sustain"
          disabled={this.state.disabled}
          initialValue={this.props.synth.adsr.sustain}
          onChange={(value) => this.state.synth.adsr.sustain = value}
          minValue={0}
          maxValue={1}
          step={0.01}
        />

        <ValueSlider
          title="Release"
          disabled={this.state.disabled}
          initialValue={this.props.synth.adsr.release}
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

  pause = () => {
    this.state.clock.pause();
    this.setState({ playing: false });
  }

  wickedGame = () => {
    this.state.chords.chordSequence = sequences.wickedGame;
    this.setState({ wickedGame: true, hotelCalifornia: false });
  }

  hotelCalifornia = () => {
    this.state.chords.chordSequence = sequences.hotelCalifornia;
    this.setState({ wickedGame: false, hotelCalifornia: true });
  }

  componentDidMount() {
    init.clockPromise.then(([clock, chords, synth]) => {
      this.setState({
        disabled: false,
        clock: clock,
        chords: chords,
        synth: synth
      });

      Object.assign(synth, this.props.synth);
      Object.assign(chords, this.props.chords);

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
    bpm: 200,
    chords: {
      octavesDown: 0,
      octavesUp: 3,
      notes: 2,
    },
    synth: {
      color: 8,
      intensity: 2000,
      adsr: {
        attack: 0.01,
        decay: 0.05,
        sustain: 0.6,
        release: 0.2
      }
    },
  };
}


// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

render(<App />, document.getElementById('root'));
