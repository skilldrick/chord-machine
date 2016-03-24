import React, {Component} from 'react';
import {render} from 'react-dom';

import ValueSlider from './ValueSlider';

class SliderGroup extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        {this.props.sliderProps.map((slider) =>
          (
            <ValueSlider
              title={slider.title}
              description={slider.description}
              key={slider.key}
              disabled={this.props.disabled}
              initialValue={this.props.initialValue[slider.key]}
              onChange={ (value) => this.props.modelObject[slider.key] = value }
              minValue={slider.minValue}
              maxValue={slider.maxValue}
              step={slider.step || this.props.step}
            />
          )
        )}
      </div>
      )
    }
}

module.exports = SliderGroup;
