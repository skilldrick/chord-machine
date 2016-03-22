import {createGain} from 'sine/nodes';
import {ctx, getCurrentTime} from 'sine/audio';
import {connect} from 'sine/util';
import getAudioBuffer from 'sine/ajax';
import impulseResponse from '../assets/conic_echo_long_hall_short.mp3';
import clock from 'sine/clock';
import {FmSynth} from 'sine/synth';
import {synth1, synth2, fxPreset1} from './presets';
import {Chords} from './chords';

const clockPromise = getAudioBuffer(impulseResponse).then(buffer => {
  const fxPreset = fxPreset1(buffer);
  const fmGain = createGain(0.15);
  const synthGain = createGain(0.4);
  const synths = {
    fmSynth: new FmSynth(),
    harmonicSynth: synth2
  };

  connect(synths.fmSynth, fmGain, fxPreset);
  connect(synths.harmonicSynth, synthGain, fxPreset);
  connect(fxPreset, ctx.destination);

  const chords = new Chords(synths.harmonicSynth);
  clock.addCallback(chords.playRandomChord.bind(chords));

  window.clock = clock;
  return [clock, chords, synths];
});

module.exports = {
  clockPromise
};
