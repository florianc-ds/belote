import React from 'react';
import * as constants from './constants.js';

export class GameInfo extends React.Component {
  render() {
    const trumpSymbol =
      this.props.trumpColor != null
        ? constants.COLOR_TO_SYMBOL[this.props.trumpColor]
        : '-';
    const contract = this.props.contract != null ? this.props.contract : '-';
    return (
      <div className="game-info">
        <p>
          Current Trump Color:
          {' ' + trumpSymbol}
        </p>
        <p>
          Current Contract:
          {' ' + contract}
        </p>
        <div align="center">
          <button onClick={this.props.reset}>RESET</button>
        </div>
      </div>
    );
  }
}
