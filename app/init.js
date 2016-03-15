import {ctx} from 'audiolib/audio';
import {connect} from 'audiolib/util';
import {getAudioBuffer} from 'audiolib/ajax';
import impulseResponse from '../assets/conic_echo_long_hall_short.mp3';
import clock from 'audiolib/clock';
import {synth1, synth2, fxPreset1} from 'audiolib/presets';
import {Chords} from './chords';

const clockPromise = getAudioBuffer(impulseResponse).then(buffer => {
  const fxPreset = fxPreset1(buffer);
  const synth = synth2;
  connect(synth, fxPreset, ctx.destination);

  const chords = new Chords(synth);
  clock.addCallback(chords.playRandomChord.bind(chords));

  window.clock = clock;
  return [clock, chords, synth];
});

module.exports = {
  clockPromise
};
