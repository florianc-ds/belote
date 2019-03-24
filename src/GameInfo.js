import React from 'react';
import * as constants from './constants.js';

export class GameInfo extends React.Component {
  render() {
    return (
      <div className="rules">
        <p>
          Current Trump Color:
          {' ' + constants.COLOR_TO_SYMBOL[this.props.trumpColor]}
        </p>
        <p>
          Current Contract:
          {' ' + this.props.contract}
        </p>
        <button onClick={this.props.reset}>RESET</button>
      </div>
    );
  }
}
