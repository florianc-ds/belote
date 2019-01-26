import React from 'react';
import { Card } from './Card';
export class RoundCards extends React.Component {
  renderRoundCards() {
    const cards = this.props.cards;
    return Object.keys(cards)
      .filter((k, index) => cards[k] != null)
      .map(function(k, index) {
        return (
          <div key={k} className={k}>
            <Card key={cards[k]} rawValue={cards[k]} isPlayable={false} />
          </div>
        );
      });
  }
  render() {
    return <div className="board-game-center">{this.renderRoundCards()}</div>;
  }
}
