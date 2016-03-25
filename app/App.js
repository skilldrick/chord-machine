// react stuff
import React, {Component} from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

// material-ui components
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

// my components
import ValueSlider from './ValueSlider';
import SliderGroup from './SliderGroup';
import ChordSelector from './ChordSelector';
import SynthSelector from './SynthSelector';
import Footer from './Footer';

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

        <SliderGroup
          title="Chord settings"
          disabled={this.state.disabled}
          initialValue={this.props.chords}
          modelObject={this._chords}
          sliderProps={[
            {
              title: "Base 8ve",
              key: "baseOctave",
              description: "Controls the starting octave of the chords.",
              minValue: 1,
              maxValue: 6
            },
            {
              title: "8ve +",
              key: "octavesUp",
              description: "Play chords over multiple octaves.",
              minValue: 0,
              maxValue: 4
            },
            {
              title: "Detune",
              key: "detune",
              description: "Randomly detune each note by up to this many cents.",
              minValue: 0,
              maxValue: 100
            },
            {
              title: "Notes",
              key: "notes",
              description: "How many notes are played at once.",
              minValue: 1,
              maxValue: 20
            }
          ]}
        />

        <SliderGroup
          title="Harmonic Synth settings"
          disabled={this.state.disabled}
          initialValue={this.props.synth}
          modelObject={this.state.synth}
          sliderProps={[
            {
              title: "Odd:Even",
              key: "oddEven",
              description: "",
              minValue: 0,
              maxValue: 1,
              step: 0.1
            },
            {
              title: "Low:High",
              key: "lowHigh",
              description: "",
              minValue: 0,
              maxValue: 1,
              step: 0.1
            }
          ]}
        />

        <SliderGroup
          title="FM Synth settings"
          disabled={this.state.disabled}
          initialValue={this.props.synth}
          modelObject={this.state.synth}
          sliderProps={[
            {
              title: "Color",
              key: "color",
              description: "The frequency of the modulator as a factor of the base frequency.",
              minValue: 1,
              maxValue: 10
            },
            {
              title: "Intensity",
              key: "intensity",
              description: "The amplitude of the modulator.",
              minValue: 0,
              maxValue: 9999
            },
            {
              title: "FM Detune",
              key: "fmDetune",
              description: "The number of cents the modulator is detuned by.",
              minValue: 0,
              maxValue: 500
            },
          ]}
        />

        <SliderGroup
          title="ADSR"
          disabled={this.state.disabled}
          initialValue={this.props.synth.adsr}
          modelObject={this.state.synth.adsr}
          step={0.01}
          sliderProps={[
            {
              title: "Attack",
              key: "attack",
              description: "The attack time of the synth.",
              minValue: 0,
              maxValue: 0.5,
            },
            {
              title: "Decay",
              key: "decay",
              description: "The decay time of the synth.",
              minValue: 0,
              maxValue: 0.5,
            },
            {
              title: "Sustain",
              key: "sustain",
              description: "The level of the note after decay.",
              minValue: 0,
              maxValue: 1,
            },
            {
              title: "Release",
              key: "release",
              description: "The release time of the synth.",
              minValue: 0,
              maxValue: 1,
            }
          ]}
        />

        <Footer />
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
    const synth = this._synths[name];
    this._chords.synth = synth;
    this.setState({ synth });
  }

  constructor(props) {
    super(props);

    this.state = {
      disabled: true,
      playing: false,
      synth: {}
    };

    init.initPromise.then(([clock, chords, synths]) => {
      this._clock = clock;
      this._chords = chords;
      this._synths = synths;

      this.setState({
        disabled: false
      });

      // TODO: do this better.
      // Currently adsr is kept in sync across both synths because they share
      // the same adsr object :/
      Object.keys(this._synths).forEach((name) =>
        Object.assign(synths[name], this.props.synth)
      );

      //TODO: find a better way to keep synth up-to-date
      //and to update synth properties
      this.synthChange(this.props.synthName);

      Object.assign(this._chords, this.props.chords);

      this._clock.setBpm(this.props.bpm);
    });
  }

  static defaultProps = {
    bpm: 200,
    chords: {
      baseOctave: 3,
      octavesUp: 2,
      detune: 5,
      notes: 2,
    },
    synth: {
      color: 8,
      intensity: 2000,
      fmDetune: 0,
      //oddEven: 0.7, // can't do this because it overrides the method
      //lowHigh: 0.1,
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
