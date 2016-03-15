import {detune, noteToFreq} from 'audiolib/util';

// Numbers of semitones from A
const G$0 = -1;
const Ab0 = -1;
const A0 = 0;
const A$0 = 1;
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
const A$ = 13;
const Bb = 13;
const B = 14;
const C2 = 15;
const C$2 = 16;

const wickedGame = [
  [B0, D, F$],
  [A0, C$, E],
  [G$0, B0, E],
  [G$0, B0, E]
];

const hotelCalifornia = [
  [B0, D, F$],
  [F$, A$, C$],
  [A, C$, E],
  [E, G$, B],
  [G, B, D],
  [D, F$, A],
  [E, G, B],
  [F$, A$, C$2],
];

class Chords {
  getChord(beat) {
    return this.chordSequence[Math.floor(beat / 4) % this.chordSequence.length];
  }

  playFreq(freq, start, length) {
    this.synth.playFreq(freq, start, length);
  }

  getNoteFromChord(chord, index) {
    return chord[index] - 24;
  }

  playRandomNote(chord, start, length) {
    const randomOctave = Math.floor(
      Math.random() * (this.octavesDown + this.octavesUp + 1)
    ) - this.octavesDown;

    const randomNote = this.getNoteFromChord(chord, Math.floor(Math.random() * chord.length));

    const freq = noteToFreq(randomNote + randomOctave * 12);
    this.playFreq(detune(freq, 0.2), start, length);
  }

  playRandomNotes(chord, start, length, count) {
    const noteLength = length / count;
    for (let i = 0; i < count; i++) {
      this.playRandomNote(chord, start + i * noteLength, noteLength);
    }
  }

  playRandomChord(beat, now, timeUntilBeat, beatLength) {
    const notesPerBeat = 2;
    for (let i = 0; i < this.notes; i++) {
      this.playRandomNotes(this.getChord(beat), now + timeUntilBeat, beatLength, notesPerBeat);
    }
  }

  setChords(chordSequence) {
    this.chordSequence = chordSequence;
  }

  setOctavesUp(octavesUp) {
    this.octavesUp = octavesUp;
  }

  setOctavesDown(octavesDown) {
    this.octavesDown = octavesDown;
  }

  // number of simultaneous random notes to play
  setNotes(notes) {
    this.notes = notes;
  }

  constructor(synth) {
    this.synth = synth;
    this.setChords(hotelCalifornia);
  }
}

module.exports = {
  Chords,
  hotelCalifornia,
  wickedGame
};
