import {getAudioBuffer} from 'audiolib/ajax';
import {synth1, fxPreset1} from 'audiolib/presets';
import {ctx} from 'audiolib/audio';
import {connect, detune, noteToFreq} from 'audiolib/util';
import impulseResponse from '../assets/conic_echo_long_hall_short.mp3';
import clock from 'audiolib/clock';


// Numbers of semitones from A
const G$0 = -1;
const Ab0 = -1;
const A0 = 0;
const Bb0 = 1;
const B0 = 2;
const C = 3;
const C$ = 4;
const Db = 4;
const D = 5;
const D$ = 6;
const Eb = 6;
const E = 7;
const F = 8;
const F$ = 9;
const Gb = 9;
const G = 10;
const G$ = 11;
const Ab = 11;
const A = 12;
const Bb = 13;
const B = 14;
const C2 = 15;

const chords = [
  [B0, D, F$, B],
  [A0, C$, E, A],
  [G$0, B0, E, G$],
  [G$0, B0, E, G$, B]
];

const getChord = (beat) => chords[Math.floor(beat / 4) % 4];

const playRandomNote = (notes, start, length) => {
  const randomIndex = Math.floor(Math.random() * notes.length);
  const freq = noteToFreq(notes[randomIndex] - 24);
  synth1.playFreq(detune(freq, 0.5), start, length, 2);
};

const playRandomNotes = (notes, start, length, count) => {
  const noteLength = length / count;
  for (let i = 0; i < count; i++) {
    playRandomNote(notes, start + i * noteLength, noteLength);
  }
};

const playRandomChord = (beat, now, timeUntilBeat, beatLength) => {
  const notes = 3; // number of simultaneous random notes to play
  const notesPerBeat = 2;
  for (let i = 0; i < notes; i++) {
    playRandomNotes(getChord(beat), now + timeUntilBeat, beatLength, notesPerBeat);
  }
}


const clockPromise = getAudioBuffer(impulseResponse).then(buffer => {
  const fxPreset = fxPreset1(buffer);
  connect(synth1, fxPreset, ctx.destination);

  clock.setBpm(112);
  clock.addCallback(playRandomChord);

  window.clock = clock;
  return clock;
});

module.exports = {
  clockPromise
};
