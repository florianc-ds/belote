import React from 'react';
import { Redirect } from 'react-router-dom';
import * as constants from './constants.js';

export class GameInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readyToRestart: false
    };
    this.restart = this.restart.bind(this);
  }

  restart() {
    this.setState({ readyToRestart: true });
  }

  render() {
    const readyToRestart = this.state.readyToRestart;
    if (readyToRestart === true) {
      return <Redirect to="/" />;
    }
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
          <button onClick={this.restart}>RESTART</button>
        </div>
      </div>
    );
  }
}
