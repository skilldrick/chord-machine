import React, { Component } from 'react';
import Slider from 'material-ui/lib/slider';
import TextField from 'material-ui/lib/text-field';
import _ from 'lodash';

class ValueSlider extends Component {
  sliderStyle = {
    display: "inline-block",
    verticalAlign: "top",
    position: "relative",
    width: "150px",
    height: "30px"
  }

  labelStyle = {
    fontFamily: "Roboto",
    verticalAlign: "middle",
    display: "inline-block",
    minWidth: "110px",
    marginRight: "20px",
    paddingTop: "20px"
  }

  labelSpanStyle = {
    borderBottom: "1px dashed #999",
    cursor: "help"
  }

  inputStyle = {
    width: "50px",
    paddingTop: "5px",
    verticalAlign: "top",
    marginLeft: "20px"
  }

  render() {
    return (
      <div style={{height: "50px"}}>
        <div style={this.labelStyle} title={this.props.description}>
          <span style={this.labelSpanStyle}>
            {this.props.title}
          </span>
        </div>
        <Slider
          style={this.sliderStyle}
          disabled={this.props.disabled}
          defaultValue={this.state.value}
          value={this.state.value}
          max={this.props.maxValue}
          min={this.props.minValue}
          onChange={this.onSliderChange}
          step={this.props.step}
        />
        <TextField
          type="number"
          name={this.props.title}
          defaultValue={this.state.value}
          value={this.state.rawValue}
          max={this.props.maxValue}
          min={this.props.minValue}
          onChange={this.onTextFieldChange}
          onBlur={this.onTextFieldBlur}
          style={this.inputStyle}
          step={this.props.step}
        />
      </div>
    );
  }

  onSliderChange = (event, value) => {
    this.onChange(value);
  }

  onTextFieldChange = (event) => {
    this.onChange(event.target.value);
  }

  onChange = _.throttle((value) => {
    const validated = this.validate(value);
    this.props.onChange(validated);
    // If we set the TextField to the validated value, the user wouldn't be able
    // to type "60", because "6" would first be validated to "50" (when 50 is minValue).
    // On blur, value is set to actual value
    this.setState({ value: validated, rawValue: value });
  }, 100)

  validate(value) {
    return Math.max(Math.min(value, this.props.maxValue), this.props.minValue);
  }

  onTextFieldBlur = () => {
    this.setState({ rawValue: this.state.value });
  }

  constructor(props) {
    super(props);
    this.state = { value: this.props.initialValue };
  }

  static defaultProps = {
    minValue: 50,
    maxValue: 300,
    step: 1
  };
}

module.exports = ValueSlider;
