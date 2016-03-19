import nodes from 'audiolib/nodes';
import {ctx, getCurrentTime} from 'audiolib/audio';
import {connect} from 'audiolib/util';
import {getAudioBuffer} from 'audiolib/ajax';
import impulseResponse from '../assets/conic_echo_long_hall_short.mp3';
import clock from 'audiolib/clock';
import {FmSynth} from 'audiolib/synth';
import {synth1, synth2, fxPreset1} from './presets';
import {Chords} from './chords';

const clockPromise = getAudioBuffer(impulseResponse).then(buffer => {
  const fxPreset = fxPreset1(buffer);
  const fmGain = nodes.createGain(0.15);
  const synthGain = nodes.createGain(0.4);
  const synths = {
    fmSynth: new FmSynth(),
    harmonicSynth: synth2
  };

  connect(synths.fmSynth, fmGain, fxPreset, ctx.destination)
  connect(synths.harmonicSynth, synthGain, fxPreset, ctx.destination)

  const chords = new Chords(synths.harmonicSynth);
  clock.addCallback(chords.playRandomChord.bind(chords));

  window.clock = clock;
  return [clock, chords, synths];
});

module.exports = {
  clockPromise
};
