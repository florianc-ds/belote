import React from 'react';
import * as constants from './constants.js';

export class AuctionState extends React.Component {
  renderAuctionState() {
    const playersBids = this.props.playersBids;
    const bidders = Object.keys(playersBids).filter(
      player => playersBids[player]['value'] != null
    );
    if (bidders.length > 0) {
      const bestBidder = bidders.sort(
        (a, b) => playersBids[b]['value'] - playersBids[a]['value']
      )[0];
      const realColor = ['s', 'c'].includes(playersBids[bestBidder]['color'])
        ? 'black'
        : 'red';
      return (
        <div>
          <p>{bestBidder}</p>
          <p>
            {playersBids[bestBidder]['value'] + ' '}
            <span className={realColor}>
              {constants.COLOR_TO_SYMBOL[playersBids[bestBidder]['color']]}
            </span>
          </p>
        </div>
      );
    } else {
      return <p>NO BET YET</p>;
    }
  }

  render() {
    return (
      <div className="board-game-center">
        <div className="auction-state">{this.renderAuctionState()}</div>
      </div>
    );
  }
}
