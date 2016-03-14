import {ctx} from 'audiolib/audio';
import {connect} from 'audiolib/util';
import {getAudioBuffer} from 'audiolib/ajax';
import impulseResponse from '../assets/conic_echo_long_hall_short.mp3';
import clock from 'audiolib/clock';
import {synth1, synth2, fxPreset1} from 'audiolib/presets';
import {Chords} from './chords';

const clockPromise = getAudioBuffer(impulseResponse).then(buffer => {
  const fxPreset = fxPreset1(buffer);
  connect(synth2, fxPreset, ctx.destination);

  clock.setBpm(112);

  const chords = new Chords(synth2);
  clock.addCallback(chords.playRandomChord.bind(chords));

  window.clock = clock;
  return [clock, chords];
});

module.exports = {
  clockPromise
};
