import { createGain } from 'sine/nodes';
import { ctx, getCurrentTime } from 'sine/audio';
import { connect } from 'sine/util';
import getAudioBuffer from 'sine/ajax';
import impulseResponse from '../assets/conic_echo_long_hall_short.mp3';
import clock from 'sine/clock';
import { FmSynth, EasyHarmonicSynth } from 'sine/synth';
import { synth1, synth2, fxPreset1 } from './presets';
import { Chords } from './chords';

const initPromise = getAudioBuffer(impulseResponse).then(buffer => {
  const fx = fxPreset1(buffer);
  window.fx = fx;
  const fmGain = createGain(0.1);
  const synthGain = createGain(0.3);
  const synths = {
    fmSynth: new FmSynth(),
    harmonicSynth: new EasyHarmonicSynth()
  };

  connect(synths.fmSynth, fmGain, fx);
  connect(synths.harmonicSynth, synthGain, fx);
  connect(fx, ctx.destination);

  const chords = new Chords(synths.harmonicSynth);
  clock.onBeat(chords.playRandomChord.bind(chords));

  return [clock, chords, synths, fx];
});

module.exports = {
  initPromise
};
