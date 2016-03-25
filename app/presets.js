import {connect, node} from 'sine/util';
import {HarmonicSynth} from 'sine/synth';
import {createDistortion, createDelayFeedback, createReverb} from 'sine/fx';
import {createFilter} from 'sine/nodes';

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


module.exports = {fxPreset1};

