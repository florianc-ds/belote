import React from 'react';
import * as constants from './constants.js';

export class GameInfo extends React.Component {
  render() {
    const globalScore = Object.keys(this.props.globalScore)
      .map(team => team + ' => ' + this.props.globalScore[team])
      .join(', ');
    const trumpSymbol =
      this.props.trumpColor != null
        ? constants.COLOR_TO_SYMBOL[this.props.trumpColor]
        : '-';
    const contract = this.props.contract != null ? this.props.contract : '-';
    const contractTeam =
      this.props.contractTeam != null ? this.props.contractTeam : '-';
    return (
      <div className="game-info">
        <p>
          SCORE:
          {' ' + globalScore}
        </p>
        <p>
          Current Trump Color:
          {' ' + trumpSymbol}
        </p>
        <p>
          Current Contract:
          {' ' + contract + ' (' + contractTeam + ')'}
        </p>
        <div align="center">
          <button onClick={this.props.reset}>RESET</button>
        </div>
      </div>
    );
  }
}
