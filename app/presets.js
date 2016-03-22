import {connect, node} from 'sine/util';
import {HarmonicSynth} from 'sine/synth';
import {createDistortion, createDelayFeedback, createReverb} from 'sine/fx';
import {createFilter} from 'sine/nodes';

const synth1 = new HarmonicSynth(0.3, {
  attack: 0.1,
  decay: 0.3,
  sustain: 0.9,
  release: 0.3
}, [0.6, 0.5, 0.1, 0.3, 0.1, 0.3]);

// fxPreset1 requires a convolver buffer.
// This is passed in so the application has control of resource loading
const fxPreset1 = (convolverBuffer) => {
  const filter = createFilter(3000);
  const distortion = createDistortion(1.2);
  const reverb = createReverb(0.5, convolverBuffer);

  const delay = createDelayFeedback({
    delayTime: 1.333,
    feedback: 0.4,
    dryMix: 1,
    wetMix: 0.7,
    cutoff: 1000
  });

  connect(
    delay,
    distortion,
    reverb,
    filter
  );

  return node(delay, filter);
};

const synth2 = new HarmonicSynth({
  attack: 0.1,
  decay: 0.3,
  sustain: 0.9,
  release: 0.1
}, [1, 1, 0.3, 0.6, 0.3, 0.3, 0.2, 0.2, 0.1, 0.1]);


module.exports = {synth1, synth2, fxPreset1};

