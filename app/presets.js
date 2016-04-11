import {connect, node} from 'sine/util';
import {HarmonicSynth} from 'sine/synth';
import {Distortion, FeedbackDelay, Reverb} from 'sine/fx';
import {createGain, createFilter} from 'sine/nodes';

// fxPreset1 requires a convolver buffer.
// This is passed in so the application has control of resource loading
const fxPreset1 = (convolverBuffer) => {
  const input = createGain();
  const output = createGain();
  const filter = createFilter(9000);
  const distortion = new Distortion(1.2);
  const reverb = new Reverb(0.5, convolverBuffer);

  const delay = new FeedbackDelay({
    delayTime: 1.333,
    feedback: 0.7,
    mix: 0.4,
    cutoff: 1000
  });

  connect(
    input,
    distortion,
    delay,
    reverb,
    filter,
    output
  );

  return node(input, output, {
    setReverbMix: reverb.setMix,
    setDistortionAmount: distortion.setDistortion,
    setDelayTime: delay.setDelayTime,
    setDelayMix: delay.setMix,
    setDelayFeedbackGain: delay.setFeedbackGain,
    setLowPassCutoff: (freq) => filter.frequency.value = freq
  });
};


module.exports = {fxPreset1};
