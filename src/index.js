import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as constants from './constants.js';

// WHAT ABOUT HIDDEN HANDS?
// WHAT ABOUT PLAYER TURN..?
// MOVE ON HOVER

// KEEP CARDS STATE WHEN REFRESHING PAGE (REDUX..?)

// SORT CARDS IN HAND

// REPLACE CURRENT CARDS WITH {'\u{1F0C2}'}, ... (cf https://en.wikipedia.org/wiki/Playing_cards_in_Unicode)

function settleWinningCard(cards, trumpColor) {}

function shuffleArray(array) {
  let i = array.length - 1;
  for (; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.rawValue.substring(0, this.props.rawValue.length - 1),
      color: this.props.rawValue.substring(this.props.rawValue.length - 1),
      isHovered: false
    };
    this.play = this.play.bind(this);
    this.handleHover = this.handleHover.bind(this);
  }

  handleHover() {
    this.setState({
      isHovered: !this.state.isHovered
    });
  }

  play() {
    if (!this.props.isPlayable) {
      alert('Card ' + this.props.rawValue + ' is not playable');
    } else {
      this.props.playCard(this.props.rawValue, this.props.player);
    }
  }

  render() {
    let classNames = 'card ';
    classNames +=
      this.state.color === 's' || this.state.color === 'c' ? 'black ' : 'red ';
    if (this.state.isHovered) {
      classNames += this.props.isPlayable ? 'playable ' : 'not-playable ';
    }
    return (
      <button
        className={classNames}
        onClick={this.play}
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleHover}
      >
        {this.state.value + ' ' + constants.COLOR_TO_SYMBOL[this.state.color]}
      </button>
    );
  }
}

class Hand extends React.Component {
  renderCards(props) {
    return this.props.rawValues.map(function(v, i) {
      return (
        <Card
          key={v}
          rawValue={v}
          isPlayable={props.arePlayableCards[i]}
          player={props.player}
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

class RoundCards extends React.Component {
  renderRoundCards() {
    const cards = this.props.cards;
    return Object.keys(cards)
      .filter((k, index) => cards[k] != null)
      .map(function(k, index) {
        return (
          <div className={k}>
            <Card key={cards[k]} rawValue={cards[k]} isPlayable={false} />
          </div>
        );
      });
  }
  render() {
    return <div className="board-game-center">{this.renderRoundCards()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      turn: 0,
      playersCards: {
        west: constants.PLAYING_CARDS.slice(0, 8),
        east: constants.PLAYING_CARDS.slice(8, 16),
        north: constants.PLAYING_CARDS.slice(16, 24),
        south: constants.PLAYING_CARDS.slice(24, 32)
      },
      gameHistory: { west: [], east: [], north: [], south: [] },
      roundCards: { west: null, east: '10h', north: 'Kd', south: 'Jc' },
      points: { 'east/west': 0, 'north/south': 0 },
      gameFirstPlayer: 'west',
      turnFirstPlayer: 'west',
      currentPlayer: 'west',
      round: 0
    };
    this.playCard = this.playCard.bind(this);
  }

  playCard(card, player) {
    // remove card from player hand
    this.setState(prevState => ({
      playersCards: {
        ...prevState.playersCards,
        [player]: prevState.playersCards[player].filter(key => key !== card)
      }
    }));
    // create card in roundCards
    this.setState(prevState => ({
      roundCards: {
        ...prevState.roundCards,
        [player]: card
      }
    }));
  }

  checkPlayability(card, player, state) {
    return player === state.currentPlayer;
  }

  endRound() {}

  hasPlayedThisTurn(player) {
    let p = this.state.turnFirstPlayer;
    while (p !== this.state.currentPlayer) {
      if (p === player) {
        return true;
      }
      p = constants.NEXT_PLAYER[p];
    }
    return false;
  }

  mockNextPlayer() {
    this.setState({
      currentPlayer: constants.NEXT_PLAYER[this.state.currentPlayer]
    });
    if (
      constants.NEXT_PLAYER[this.state.currentPlayer] ===
      this.state.turnFirstPlayer
    ) {
      this.setState({ round: this.state.round + 1 });
    }
  }

  componentDidMount() {
    document.title = 'Belote';
  }

  render() {
    return (
      <>
        <header> Welcome to Belote my friend </header>
        <div className="board-game">
          <Hand
            player="west"
            rawValues={this.state.playersCards['west']}
            hasPlayedThisTurn={this.hasPlayedThisTurn('west')}
            isCurrentPlayer={'west' === this.state.currentPlayer}
            arePlayableCards={this.state.playersCards['west'].map(c =>
              this.checkPlayability(c, 'west', this.state)
            )}
            playCard={this.playCard}
          />
          <Hand
            player="east"
            rawValues={this.state.playersCards['east']}
            hasPlayedThisTurn={this.hasPlayedThisTurn('east')}
            isCurrentPlayer={'east' === this.state.currentPlayer}
            arePlayableCards={this.state.playersCards['east'].map(c =>
              this.checkPlayability(c, 'east', this.state)
            )}
            playCard={this.playCard}
          />
          <Hand
            player="north"
            rawValues={this.state.playersCards['north']}
            hasPlayedThisTurn={this.hasPlayedThisTurn('north')}
            isCurrentPlayer={'north' === this.state.currentPlayer}
            arePlayableCards={this.state.playersCards['north'].map(c =>
              this.checkPlayability(c, 'north', this.state)
            )}
            playCard={this.playCard}
          />
          <Hand
            player="south"
            rawValues={this.state.playersCards['south']}
            hasPlayedThisTurn={this.hasPlayedThisTurn('south')}
            isCurrentPlayer={'south' === this.state.currentPlayer}
            arePlayableCards={this.state.playersCards['south'].map(c =>
              this.checkPlayability(c, 'south', this.state)
            )}
            playCard={this.playCard}
          />
          <RoundCards cards={this.state.roundCards} />
        </div>
        <div className="rules">
          <p>Heart -> &#x2665;</p>
          <p>Spade -> &#x2660;</p>
          <p>Club -> &#x2663;</p>
          <p>Diamond -> &#x2666;</p>
          <button
            onClick={() =>
              this.setState({
                dealtCards: shuffleArray(constants.PLAYING_CARDS),
                round: 0,
                turnFirstPlayer: 'west',
                currentPlayer: 'west'
              })
            }
          >
            DEAL
          </button>
          <button onClick={() => this.mockNextPlayer()}>NEXT</button>
        </div>
      </>
    );
  }
}
// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
