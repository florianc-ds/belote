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
      clicked: false,
      value: this.props.rawValue.substring(0, this.props.rawValue.length - 1),
      color: this.props.rawValue.substring(this.props.rawValue.length - 1)
    };
  }

  play() {
    if (!this.props.isPlayable) {
      alert('Card ' + this.props.rawValue + ' is not playable');
    } else {
      alert('OK');
    }
  }

  render() {
    let classNames = 'card ';
    classNames +=
      this.state.color === 's' || this.state.color === 'c' ? 'black' : 'red';
    return (
      <button className={classNames} onClick={() => this.play()}>
        {this.state.value + ' ' + constants.COLOR_TO_SYMBOL[this.state.color]}
      </button>
    );
  }
}

class Hand extends React.Component {
  renderCards() {
    const nbCards = this.props.hasPlayedThisTurn
      ? constants.NB_CARDS - this.props.round - 1
      : constants.NB_CARDS - this.props.round;
    return this.props.rawValues.filter((v, i) => i < nbCards).map(function(v) {
      return <Card key={v} rawValue={v} isPlayable={true} />; // TODO: make it parameter
    });
  }

  hasPlayed() {}

  render() {
    return (
      <div className={this.props.player}>
        <div className="status">
          {this.props.isCurrentPlayer ? 'Playing...' : 'Waiting...'}
        </div>
        <div className="cards-hand">{this.renderCards()}</div>
      </div>
    );
  }
}

class RoundCards extends React.Component {
  render() {
    return (
      <div className="board-game-center">
        <div className="west">
          <Card key={'7s'} rawValue={'7s'} isPlayable={false} />
        </div>
        <div className="east">
          <Card key={'7s'} rawValue={'7s'} isPlayable={false} />
        </div>
        <div className="north">
          <Card key={'7s'} rawValue={'7s'} isPlayable={false} />
        </div>
        <div className="south">
          <Card key={'7s'} rawValue={'7s'} isPlayable={false} />
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      turn: 0,
      dealtCards: constants.PLAYING_CARDS,
      gameFirstPlayer: 'west',
      turnFirstPlayer: 'west',
      currentPlayer: 'west',
      round: 0
    };
  }

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
            rawValues={this.state.dealtCards.slice(0, 8)}
            hasPlayedThisTurn={this.hasPlayedThisTurn('west')}
            isCurrentPlayer={'west' === this.state.currentPlayer}
            round={this.state.round}
          />
          <Hand
            player="east"
            rawValues={this.state.dealtCards.slice(8, 16)}
            hasPlayedThisTurn={this.hasPlayedThisTurn('east')}
            isCurrentPlayer={'east' === this.state.currentPlayer}
            round={this.state.round}
          />
          <Hand
            player="north"
            rawValues={this.state.dealtCards.slice(16, 24)}
            hasPlayedThisTurn={this.hasPlayedThisTurn('north')}
            isCurrentPlayer={'north' === this.state.currentPlayer}
            round={this.state.round}
          />
          <Hand
            player="south"
            rawValues={this.state.dealtCards.slice(24, 32)}
            hasPlayedThisTurn={this.hasPlayedThisTurn('south')}
            isCurrentPlayer={'south' === this.state.currentPlayer}
            round={this.state.round}
          />
          <RoundCards />
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
