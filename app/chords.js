import { noteToFreq } from 'sine/util';
import fx from 'sine/fx';

// Numbers of semitones from A
const E0 = -5;
const F0 = -4;
const F$0 = -3;
const G0 = -2;
const G$0 = -1;
const Ab = -1;
const A = 0;
const A$ = 1;
const Bb = 1;
const B = 2;
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
const Ab2 = 11;
const A2 = 12;
const A$2 = 13;
const Bb2 = 13;
const B2 = 14;
const C2 = 15;
const C$2 = 16;
const D2 = 17;

const wickedGame = [
  [B, D, F$],
  [A, C$, E],
  [G$0, B, E],
  [G$0, B, E]
];

const hotelCalifornia = [
  [B, D, F$],
  [F$0, A$, C$],
  [A, C$, E],
  [E, G$, B],
  [G, B, D],
  [D, F$, A2],
  [E, G, B2],
  [F$0, A$, C$],
];

const folia = [
  [B, D, F$],
  [F$0, A$, C$],
  [B, D, F$],
  [A, C$, E],
  [D, F$, A2],
  [A, C$, E],
  [B, D, F$],
  [F$0, A$, C$],
];

const pachelbel = [
  [C, E, G],
  [G0, B, D],
  [A, C, E],
  [E0, G0, B],
  [F, A, C],
  [C, E, G],
  [F, A, C],
  [G0, B, D],
];


class Chords {
  randomDetune() {
    return Math.random() * this.detune - this.detune / 2;
  }

  getChord(bar) {
    return this.chordSequence[bar % this.chordSequence.length];
  }

  playFreq(freq, start, length) {
    this.synth.playFreq(freq, start, length, this.randomDetune());
  }

  getNoteFromChord(chord, index) {
    return chord[index] - 60;
  }

  playRandomNote(chord, start, length) {
    const randomOctave = Math.floor(
      Math.random() * (this.octavesUp + 1)
    ) + this.baseOctave;

    const randomNote = this.getNoteFromChord(chord, Math.floor(Math.random() * chord.length));

    const freq = noteToFreq(randomNote + randomOctave * 12);
    this.playFreq(freq, start, length);
  }

  playRandomNotes(chord, start, length, howMany) {
    for (let i = 0; i < howMany; i++) {
      this.playRandomNote(chord, start, length);
    }
  }

  playRandomChord(beat, when, beatLength) {
    const beatWithinBar = beat % this.beatsPerBar; // which beat of the bar?
    const bar = Math.floor(beat / (this.beatsPerBar * this.barsPerChord)); // which bar are we in?
    const noteLengthInBeats = this.beatsPerBar / this.notesPerBar; // length of note in beats
    const noteLength = noteLengthInBeats * beatLength; // length of notes in seconds

    // Loop through the number of notes per bar and for each
    // check to see if it's in the current beat
    for (let noteWithinBar = 0; noteWithinBar < this.notesPerBar; noteWithinBar++) {
      const noteWithinBarInBeats = noteWithinBar * noteLengthInBeats;

      if (noteWithinBarInBeats >= beatWithinBar && noteWithinBarInBeats < beatWithinBar + 1) {
        const noteOffset = noteWithinBarInBeats - beatWithinBar;
        this.playRandomNotes(this.getChord(bar), when(noteOffset), noteLength, this.notes);
      }
    }
  }

  constructor(synth) {
    // These all get reset in App.js
    this.synth = synth;
    this.chordSequence = hotelCalifornia;
    this.notes = 0;
    this.beatsPerBar = 4;
    this.notesPerBar = 0;
    this.barsPerChord = 0;
    this.octavesUp = 0;
    this.baseOctave = 0;
    this.detune = 0;
  }
}

module.exports = {
  Chords,
  sequences: {
    hotelCalifornia,
    wickedGame,
    folia,
    pachelbel
  }
};
