import React from 'react';
import { Card } from './Card';
import * as constants from './constants.js';
import hourglass from './images/hourglass.png';
import gears from './images/gears.png';
import { BiddingBoard } from './BiddingBoard';

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
