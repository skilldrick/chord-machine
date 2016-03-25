import {createGain} from 'sine/nodes';
import {ctx, getCurrentTime} from 'sine/audio';
import {connect} from 'sine/util';
import getAudioBuffer from 'sine/ajax';
import impulseResponse from '../assets/conic_echo_long_hall_short.mp3';
import clock from 'sine/clock';
import {FmSynth, HarmonicSynth} from 'sine/synth';
import {synth1, synth2, fxPreset1} from './presets';
import {Chords} from './chords';

class EasyHarmonicSynth extends HarmonicSynth {
  constructor(adsr) {
    super(adsr, []);
    this._oddEven = 0;
    this._lowHigh = 0;
    this.resetCoefficients();
  }

  oddEven = (value) => {
    this._oddEven = value;
    this.resetCoefficients();
  };

  lowHigh = (value) => {
    this._lowHigh = value;
    this.resetCoefficients();
  };

  resetCoefficients() {
    this.coefficientsOrType = this.calculateCoefficients();
    console.log(this.coefficientsOrType);
  }

  calculateCoefficients() {
    const coefficientCount = 10;
    const dominantCoefficient = Math.floor(this._lowHigh * (coefficientCount - 1));

    // Set odd and even coefficient level based on odd:even ratio
    const setOddEven = (el, i) => {
      // odd coefficients are even indexes, because coefficients start at 1
      return (i % 2 == 0) ? 1 - this._oddEven : this._oddEven;
    };

    const similarity = (a, b) => 1 / (Math.abs(a - b) + 1);

    // Set coefficient gain based on similarity to dominant coefficient
    const setGain = (el, i) => {
      const gain = similarity(i, dominantCoefficient);
      return el * gain;
    };

    const coefficients = Array.from(new Array(coefficientCount));

    return coefficients.map(setOddEven).map(setGain);
  }
}


const initPromise = getAudioBuffer(impulseResponse).then(buffer => {
  const fxPreset = fxPreset1(buffer);
  const fmGain = createGain(0.1);
  const synthGain = createGain(0.3);
  const synths = {
    fmSynth: new FmSynth(),
    harmonicSynth: new EasyHarmonicSynth()
  };

  connect(synths.fmSynth, fmGain, fxPreset);
  connect(synths.harmonicSynth, synthGain, fxPreset);
  connect(fxPreset, ctx.destination);

  const chords = new Chords(synths.harmonicSynth);
  clock.addCallback(chords.playRandomChord.bind(chords));

  return [clock, chords, synths];
});

module.exports = {
  initPromise
};
