import React, { Component } from 'react';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

class ChordSelector extends Component {
  render() {
    return (
      <SelectField
        style={{display: 'block'}}
        value={this.state.value}
        onChange={this.onChange}
      >
        {this.props.options.map(([keyValue, name]) =>
          <MenuItem key={keyValue} value={keyValue} primaryText={name}/>
        )}
      </SelectField>
    );
  }

  onChange = (el, index, value) => {
    this.setState({ value: value });
    this.props.onChange(value);
  }

  constructor(props) {
    super(props);
    this.state = { value: this.props.initialValue };
  }
}

module.exports = ChordSelector;
