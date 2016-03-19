import React, {Component} from 'react';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';

class SynthSelector extends Component {
  render() {
    return (
      <RadioButtonGroup
        name='synthSelect'
        defaultSelected={this.props.defaultSelected}
        onChange={this.onChange}
      >
        {this.props.options.map(([keyValue, name]) =>
          <RadioButton key={keyValue} value={keyValue} label={name} />
        )}
      </RadioButtonGroup>
    );
  }

  onChange = (event, value) => {
    this.props.onChange(value);
  }
}

module.exports = SynthSelector;
