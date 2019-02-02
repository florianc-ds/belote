import React from 'react';
import { Card } from './Card';
import * as constants from './constants.js';
import hourglass from './images/hourglass.png';
import gears from './images/gears.png';

export class Hand extends React.Component {
  renderCards(props) {
    props.rawValues.sort(function(a, b) {
      return (
        constants.PLAYING_CARDS.indexOf(a) - constants.PLAYING_CARDS.indexOf(b)
      );
    });
    return props.rawValues.map(function(v, i) {
      return (
        <Card
          key={v}
          rawValue={v}
          player={props.player}
          isPlayable={props.arePlayableCards[i]}
          playCard={props.playCard}
        />
      );
    });
  }

  hasPlayed() {}

  render() {
    let status = null;
    let image = null;
    if (this.props.isCurrentPlayer) {
      status = 'Playing...';
      image = gears;
    } else {
      status = 'Waiting...';
      image = hourglass;
    }
    return (
      <div className={this.props.player}>
        <div className="status">
          <img src={image} alt={status} width="25" height="25" />
          &nbsp; {status}
        </div>
        <div className="cards-hand">{this.renderCards(this.props)}</div>
      </div>
    );
  }
}
