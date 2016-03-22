import React, {Component} from 'react';
import {render} from 'react-dom';
import logo from 'sine/logo';

class Footer extends Component {
  render() {
    return (
      <a
        href="https://github.com/skilldrick/sine"
        class="logo"
        style={{
          display: "block",
          marginTop: "50px",
          position: "relative"
        }}
      >
        <p
          style={{
            fontFamily: "Roboto",
            verticalAlign: "middle",
            position: "absolute",
            color: "black",
            left: "60px"
          }}
        >
          Powered by Sine
        </p>
      </a>
    )
  }

  componentDidMount() {
    logo(document.getElementById("logo"), 50);
  }
}

module.exports = Footer;
