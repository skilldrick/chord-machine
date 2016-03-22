// react stuff
import React, {Component} from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

// material-ui components
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

// my components
import ValueSlider from './ValueSlider';
import ChordSelector from './ChordSelector';
import SynthSelector from './SynthSelector';

// audio stuff
import init from './init';
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

        <ChordSelector
          options={[
            ['hotelCalifornia', 'Hotel California'],
            ['wickedGame', 'Wicked Game'],
            ['folia', 'Folia'],
            ['pachelbel', "Pachelbel's Canon"]
          ]}
          initialValue="hotelCalifornia"
          onChange={this.chordsChange}
        />

        <SynthSelector
          options={[
            ['harmonicSynth', 'Harmonic Synth'],
            ['fmSynth', 'FM Synth']
          ]}
          defaultSelected={this.props.synthName}
          onChange={this.synthChange}
        />

        <ValueSlider
          title="BPM"
          disabled={this.state.disabled}
          initialValue={this.props.bpm}
          onChange={(value) => this._clock.setBpm(value)}
        />

        <ValueSlider
          title="Base 8ve"
          disabled={this.state.disabled}
          initialValue={this.props.chords.baseOctave}
          onChange={(value) => this._chords.baseOctave = value}
          minValue={0}
          maxValue={6}
        />

        <ValueSlider
          title="8ve +"
          disabled={this.state.disabled}
          initialValue={this.props.chords.octavesUp}
          onChange={(value) => this._chords.octavesUp = value}
          minValue={0}
          maxValue={4}
        />

        <ValueSlider
          title="Notes"
          disabled={this.state.disabled}
          initialValue={this.props.chords.notes}
          onChange={(value) => this._chords.notes = value}
          minValue={1}
          maxValue={20}
        />

        <ValueSlider
          title="Color"
          disabled={this.state.disabled}
          initialValue={this.props.synth.color}
          onChange={(value) => this._chords.synth.color = value}
          minValue={1}
          maxValue={10}
          step={1}
        />

        <ValueSlider
          title="Intensity"
          disabled={this.state.disabled}
          initialValue={this.props.synth.intensity}
          onChange={(value) => this._chords.synth.intensity = value}
          minValue={0}
          maxValue={9999}
        />

        <ValueSlider
          title="Attack"
          disabled={this.state.disabled}
          initialValue={this.props.synth.adsr.attack}
          onChange={(value) => this._chords.synth.adsr.attack = value}
          minValue={0}
          maxValue={0.5}
          step={0.01}
        />

        <ValueSlider
          title="Decay"
          disabled={this.state.disabled}
          initialValue={this.props.synth.adsr.decay}
          onChange={(value) => this._chords.synth.adsr.decay = value}
          minValue={0}
          maxValue={0.5}
          step={0.01}
        />

        <ValueSlider
          title="Sustain"
          disabled={this.state.disabled}
          initialValue={this.props.synth.adsr.sustain}
          onChange={(value) => this._chords.synth.adsr.sustain = value}
          minValue={0}
          maxValue={1}
          step={0.01}
        />

        <ValueSlider
          title="Release"
          disabled={this.state.disabled}
          initialValue={this.props.synth.adsr.release}
          onChange={(value) => this._chords.synth.adsr.release = value}
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
    this._clock.start();
    this.setState({ playing: true });
  }

  stop = () => {
    this._clock.stop();
    this.setState({ playing: false });
  }

  pause = () => {
    this._clock.pause();
    this.setState({ playing: false });
  }

  chordsChange = (key) => {
    this._chords.chordSequence = sequences[key];
  }

  synthChange = (name) => {
    this._chords.synth = this._synths[name];
  }

  componentDidMount() {
    init.clockPromise.then(([clock, chords, synths]) => {
      this._clock = clock;
      this._chords = chords;
      this._synths = synths;

      this.setState({
        disabled: false
      });

      // TODO: do this better
      Object.keys(this._synths).forEach((name) =>
        Object.assign(synths[name], this.props.synth)
      );

      //TODO: find a better way to keep synth up-to-date
      //and to update synth properties
      this._chords.synth = synths[this.props.synthName];

      Object.assign(this._chords, this.props.chords);

      this._clock.setBpm(this.props.bpm);
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
      baseOctave: 3,
      octavesUp: 2,
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
    synthName: 'harmonicSynth'

  };
}

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

render(<App />, document.getElementById('root'));
