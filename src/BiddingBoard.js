import React from 'react';
import * as constants from './constants.js';

export class BiddingBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: props.playersBids[props.player]['color'],
      value: props.playersBids[props.player]['value']
    };
    this.placeBid = props.placeBid.bind(this);
    this.passAuction = props.passAuction.bind(this);
    this.submitBid = this.submitBid.bind(this);
  }

  updateValue(newValue) {
    this.setState({ value: parseInt(newValue) });
  }

  updateColor(newColor) {
    this.setState({ color: newColor });
  }

  submitBid(event) {
    let bidValue = this.state.value;
    if (bidValue == null) {
      bidValue = this.deduceMinimalBid(this.props.playersBids);
      this.setState({ value: parseInt(bidValue) });
    }
    this.placeBid(bidValue, this.state.color, this.props.player);
    event.preventDefault();
  }

  deduceMinimalBid(playersBids) {
    const validBids = Object.values(playersBids).filter(
      bid => bid['value'] != null
    );
    let minimalBidValue = 80;
    if (validBids.length > 0) {
      minimalBidValue =
        validBids.sort((a, b) => b['value'] - a['value'])[0]['value'] + 10;
    }
    return minimalBidValue;
  }

  renderPassButton(playerTurn) {
    if (playerTurn) {
      return <button onClick={this.passAuction}>Pass</button>;
    }
  }

  render() {
    const minimalBidValue = this.deduceMinimalBid(this.props.playersBids);
    let bidValue;
    if (this.props.isCurrentPlayer) {
      bidValue = Math.max(minimalBidValue, this.state.value);
    } else {
      bidValue = this.state.value == null ? '' : this.state.value;
    }
    return (
      <div className="bidding-board">
        <form onSubmit={this.submitBid}>
          <input
            disabled={!this.props.isCurrentPlayer}
            type="number"
            value={bidValue}
            min={minimalBidValue}
            step={10}
            onChange={event => this.updateValue(event.target.value)}
          />
          <select
            disabled={!this.props.isCurrentPlayer}
            defaultValue={this.state.color == null ? 'empty' : this.state.color}
            onChange={event => this.updateColor(event.target.value)}
          >
            <option disabled value="empty" />
            <option value="h">{constants.COLOR_TO_SYMBOL['h']} Heart</option>
            <option value="s">{constants.COLOR_TO_SYMBOL['s']} Spade </option>
            <option value="d">{constants.COLOR_TO_SYMBOL['d']} Diamond</option>
            <option value="c">{constants.COLOR_TO_SYMBOL['c']} Club</option>
          </select>
          <input
            type="submit"
            value="Submit"
            disabled={!this.props.isCurrentPlayer}
          />
        </form>
        {this.renderPassButton(this.props.isCurrentPlayer)}
      </div>
    );
  }
}
