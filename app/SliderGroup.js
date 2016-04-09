import React, {Component} from 'react';
import {render} from 'react-dom';
import _ from 'lodash';

import ValueSlider from './ValueSlider';

class SliderGroup extends Component {
  h3Style = {
    fontFamily: "Roboto",
    marginBottom: 0
  }

  render() {
    if (this.props.hidden) {
      return <div />;
    } else {
      return (
        <div>
          <h3 style={this.h3Style}>{this.props.title}</h3>
          {this.props.sliderProps.map((slider) =>
            (
              <ValueSlider
                title={slider.title}
                description={slider.description}
                key={slider.key}
                disabled={this.props.disabled}
                initialValue={this.modelObject[slider.key]}
                onChange={ (value) => this.onChange(slider.key, value) }
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

  onChange = (key, value) => {
    this.modelObject[key] = value;
    this.props.onChange(this.modelObject);
  }

  constructor(props) {
    super(props);
    this.modelObject = Object.assign({}, props.modelObject);
  }
}

module.exports = SliderGroup;
