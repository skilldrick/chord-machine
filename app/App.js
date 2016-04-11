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
          initialValue={this.props.chordSequence}
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
          description="Beats per minute."
          disabled={this.state.disabled}
          initialValue={this.props.bpm}
          onChange={(value) => this.bpmChange(value)}
        />

        <SliderGroup
          title="Chord settings"
          disabled={this.state.disabled}
          modelObject={this.props.chordsSettings}
          onChange={ (settings) => this.chordsSettingsChange(settings) }
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
            },
            {
              title: "Notes per Bar",
              key: "notesPerBar",
              description: "How many notes are played per bar.",
              minValue: 1,
              maxValue: 16
            },
            {
              title: "Bars per chord",
              key: "barsPerChord",
              description: "How many bars are played for each chord.",
              minValue: 1,
              maxValue: 8
            },
          ]}
        />

        <SliderGroup
          title="Harmonic Synth settings"
          disabled={this.state.disabled}
          hidden={this.state.synthName != 'harmonicSynth'}
          modelObject={this.props.harmonicSynthSettings}
          onChange={ (settings) => this.harmonicSynthSettingsChange(settings) }
          sliderProps={[
            {
              title: "Odd:Even",
              key: "oddEven",
              description: "Odd vs even harmonics.",
              minValue: 0,
              maxValue: 1,
              step: 0.1
            },
            {
              title: "Low:High",
              key: "lowHigh",
              description: "Low vs high harmonics.",
              minValue: 0,
              maxValue: 1,
              step: 0.1
            }
          ]}
        />

        <SliderGroup
          title="FM Synth settings"
          disabled={this.state.disabled}
          hidden={this.state.synthName != 'fmSynth'}
          modelObject={this.props.fmSynthSettings}
          onChange={ (settings) => this.fmSynthSettingsChange(settings) }
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
          modelObject={this.props.adsrSettings}
          onChange={ (settings) => this.adsrSettingsChange(settings) }
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


        <SliderGroup
          title="FX"
          disabled={this.state.disabled}
          modelObject={this.props.fxSettings}
          onChange={ (settings) => this.fxSettingsChange(settings) }
          step={0.1}
          sliderProps={[
            {
              title: "Distortion",
              key: "distortionAmount",
              description: "The amount of distortion applied. 1 is neutral.",
              minValue: 0,
              maxValue: 4,
            },
            {
              title: "Delay Time",
              key: "delayTime",
              description: "The length of the delay.",
              minValue: 0.1,
              maxValue: 2,
            },
            {
              title: "Delay Mix",
              key: "delayMix",
              description: "The mix of clean to delay.",
              minValue: 0,
              maxValue: 1,
            },
            {
              title: "Delay Feedback",
              key: "delayFeedbackGain",
              description: "The amount of signal to feedback.",
              minValue: 0,
              maxValue: 1,
            },
            {
              title: "Reverb Mix",
              key: "reverbMix",
              description: "The mix of clean to reverb.",
              minValue: 0,
              maxValue: 1,
            },
            {
              title: "Low-pass cutoff",
              key: "lowPassCutoff",
              description: "The cutoff frequency of the lowpass filter.",
              minValue: 20,
              maxValue: 9999,
              step: 1
            },
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

  // Helper method for applying settings changes
  applySettingsWithSetters = (target, settings) => {
    Object.keys(settings).forEach((key) => {
      const setterName = 'set' + key[0].toUpperCase() + key.slice(1);
      if (typeof target[setterName] == 'function') {
        target[setterName](settings[key]);
      } else {
        throw new Error("Target has no setter method named " + setterName);
      }
    });
  }

  applySettingsWithProperties = (target, settings) => Object.assign(target, settings);

  bpmChange = (value) => {
    this._clock.setBpm(value);
  }

  chordsChange = (key) => {
    this._chords.chordSequence = sequences[key];
  }

  synthChange = (name) => {
    this.setState({ synthName: name });
    this._chords.synth = this._synths[name];
  }

  chordsSettingsChange = (settings) => {
    Object.assign(this._chords, settings);
  }

  fmSynthSettingsChange = (settings) => {
    Object.assign(this._synths.fmSynth, settings);
  }

  harmonicSynthSettingsChange = (settings) => {
    this.applySettingsWithSetters(this._synths.harmonicSynth, settings);
  }

  adsrSettingsChange = (settings) => {
    const synths = this._synths;
    // adsr changes apply to all synths
    Object.keys(synths).forEach((key) => {
      console.log(synths[key]);
      Object.assign(synths[key].adsr, settings)
    }
    );
  }

  fxSettingsChange = (settings) => {
    this.applySettingsWithSetters(this._fx, settings);
  }

  constructor(props) {
    super(props);

    this.state = {
      disabled: true,
      playing: false,
    };

    init.initPromise.then(([clock, chords, synths, fx]) => {
      this._clock = clock;
      this._chords = chords;
      this._synths = synths;
      this._fx = fx;

      this.setState({
        disabled: false,
        synthName: this.props.synthName
      });

      // Initialize objects based on defaultProps
      this.chordsChange(this.props.chordSequence);
      this.chordsSettingsChange(this.props.chordsSettings);
      this.harmonicSynthSettingsChange(this.props.harmonicSynthSettings);
      this.fmSynthSettingsChange(this.props.fmSynthSettings);
      this.adsrSettingsChange(this.props.adsrSettings);
      this.fxSettingsChange(this.props.fxSettings);
      this.bpmChange(this.props.bpm);
    });
  }

  static defaultProps = {
    bpm: 148,
    chordsSettings: {
      baseOctave: 3,
      octavesUp: 2,
      detune: 5,
      notes: 4,
      notesPerBar: 8,
      barsPerChord: 2
    },
    harmonicSynthSettings: {
      oddEven: 0.6,
      lowHigh: 0.2
    },
    fmSynthSettings: {
      color: 8,
      intensity: 2000,
      fmDetune: 0
    },
    adsrSettings: {
      attack: 0.01,
      decay: 0.05,
      sustain: 0.6,
      release: 0.2
    },
    fxSettings: {
      distortionAmount: 1.5,
      delayTime: 0.6,
      delayMix: 0.6,
      delayFeedbackGain: 0.6,
      reverbMix: 0.5,
      lowPassCutoff: 3000
    },
    chordSequence: 'hotelCalifornia',
    synthName: 'harmonicSynth'
  };
}

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

render(<App />, document.getElementById('root'));
