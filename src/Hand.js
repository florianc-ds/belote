import React from 'react';
import { Card } from './Card';
import * as constants from './constants.js';

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
    return (
      <div className={this.props.player}>
        <div className="status">
          {this.props.isCurrentPlayer ? 'Playing...' : 'Waiting...'}
        </div>
        <div className="cards-hand">{this.renderCards(this.props)}</div>
      </div>
    );
  }
}
