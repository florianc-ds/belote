import React from 'react';
import { Card } from './Card';
import * as constants from './constants.js';
import hourglass from './images/hourglass.png';
import gears from './images/gears.png';
import { BiddingBoard } from './BiddingBoard';
import { extractColorFromCardRepr, extractValueFromCardRepr } from './helpers';

export class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.sortCards = this.sortCards.bind(this);
  }

  sortCards(rawValue1, rawValue2, trumpColor) {
    const color1 = extractColorFromCardRepr(rawValue1);
    const value1 = extractValueFromCardRepr(rawValue1);
    const color2 = extractColorFromCardRepr(rawValue2);
    const value2 = extractValueFromCardRepr(rawValue2);
    if (color1 !== color2) {
      return (
        constants.COLOR_DISPLAY_ORDER.indexOf(color1) -
        constants.COLOR_DISPLAY_ORDER.indexOf(color2)
      );
    } else {
      const points_ranking =
        color1 === trumpColor
          ? Object.assign({}, constants.TRUMP_POINTS)
          : Object.assign({}, constants.PLAIN_POINTS);
      if (points_ranking[value1] !== points_ranking[value2]) {
        return points_ranking[value1] - points_ranking[value2];
      } else {
        return value1 - value2; // Hack for 7, 8 (and plain 9)
      }
    }
  }

  renderCards(props) {
    props.rawValues.sort((a, b) => this.sortCards(a, b, props.trumpColor));
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

  renderStatus() {
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
      <div className="status">
        <img src={image} alt={status} width="25" height="25" />
        &nbsp; {status}
      </div>
    );
  }

  renderBiddingBoard(props) {
    return (
      <BiddingBoard
        player={props.player}
        isCurrentPlayer={props.isCurrentPlayer}
        placeBid={props.placeBid}
        passAuction={props.passAuction}
        playersBids={props.playersBids}
      />
    );
  }

  render() {
    let playerInfo = null;
    if (this.props.mode === constants.AUCTION_MODE) {
      playerInfo = this.renderBiddingBoard(this.props);
    } else {
      playerInfo = this.renderStatus();
    }
    return (
      <div className={this.props.player}>
        {playerInfo}
        <div className="cards-hand">{this.renderCards(this.props)}</div>
      </div>
    );
  }
}
