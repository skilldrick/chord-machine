import React, {Component} from 'react';
import {render} from 'react-dom';
import ValueSlider from './ValueSlider';
import init from './init';
import injectTapEventPlugin from 'react-tap-event-plugin';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import {hotelCalifornia, wickedGame} from './chords';

class App extends Component {
  buttonStyle = {
    marginRight: "10px"
  };

  render() {
    return (
      <div>
        <RaisedButton
          style={this.buttonStyle}
          disabled={this.state.disabled || this.state.playing}
          label="Play"
          onMouseUp={this.play}
        />

        <RaisedButton
          style={this.buttonStyle}
          disabled={this.state.disabled || !this.state.playing}
          label="Stop"
          onMouseUp={this.stop}
        />

        <FlatButton
          style={this.buttonStyle}
          disabled={this.state.disabled || this.state.hotelCalifornia}
          label="Hotel California"
          onMouseUp={this.hotelCalifornia}
        />

        <FlatButton
          style={this.buttonStyle}
          disabled={this.state.disabled || this.state.wickedGame}
          label="Wicked Game"
          onMouseUp={this.wickedGame}
        />

        <ValueSlider
          title="BPM"
          disabled={this.state.disabled}
          initialValue={this.props.bpm}
          onChange={this.bpmChange}
        />

        <ValueSlider
          title="8ve -"
          disabled={this.state.disabled}
          initialValue={this.props.octavesDown}
          onChange={this.octavesDownChange}
          minValue={0}
          maxValue={3}
        />

        <ValueSlider
          title="8ve +"
          disabled={this.state.disabled}
          initialValue={this.props.octavesUp}
          onChange={this.octavesUpChange}
          minValue={0}
          maxValue={3}
        />

        <ValueSlider
          title="Notes"
          disabled={this.state.disabled}
          initialValue={this.props.notes}
          onChange={this.notesChange}
          minValue={1}
          maxValue={20}
        />
      </div>
    );
  }

  addHighlight = () => {
    this.setState({ highlight: true });
  }

  play = () => {
    this.state.clock.start();
    this.setState({ playing: true });
  }

  stop = () => {
    this.state.clock.stop();
    this.setState({ playing: false });
  }

  octavesDownChange = (value) => {
    this.state.chords.setOctavesDown(value);
  }

  octavesUpChange = (value) => {
    this.state.chords.setOctavesUp(value);
  }

  notesChange = (value) => {
    this.state.chords.setNotes(value);
  }

  bpmChange = (bpm) => {
    this.state.clock.setBpm(bpm);
  }

  wickedGame = () => {
    this.stop();
    this.state.chords.setChords(wickedGame);
    this.setState({ wickedGame: true, hotelCalifornia: false });
    setTimeout(this.play, 1000);
  }

  hotelCalifornia = () => {
    this.stop();
    this.state.chords.setChords(hotelCalifornia);
    this.setState({ wickedGame: false, hotelCalifornia: true });
    setTimeout(this.play, 1000);
  }

  componentDidMount() {
    init.clockPromise.then(([clock, chords]) => {
      this.setState({
        disabled: false,
        clock: clock,
        chords: chords
      });

      chords.setOctavesDown(this.props.octavesDown);
      chords.setOctavesUp(this.props.octavesUp);
      chords.setNotes(this.props.notes);
      clock.setBpm(this.props.bpm);
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      playing: false,
      hotelCalifornia: true
    };
  }

  static defaultProps = {
    bpm: 112,
    octavesDown: 0,
    octavesUp: 1,
    notes: 4
  };
}


// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

render(<App />, document.getElementById('root'));
