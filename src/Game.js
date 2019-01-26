import React from 'react';
import {
  shuffleArray,
  extractColorFromCardRepr,
  extractValueFromCardRepr
} from './helpers';
import { Hand } from './Hand';
import { RoundCards } from './RoundCards';
import * as constants from './constants.js';

export class Game extends React.Component {
  constructor(props) {
    super(props);
    const shuffledCards = shuffleArray(Array.from(constants.PLAYING_CARDS));
    this.state = {
      round: 0,
      playersCards: {
        west: shuffledCards.slice(0, 8),
        east: shuffledCards.slice(8, 16),
        north: shuffledCards.slice(16, 24),
        south: shuffledCards.slice(24, 32)
      },
      gameHistory: { west: [], east: [], north: [], south: [] },
      roundCards: { west: null, east: '10h', north: 'Kd', south: 'Jc' },
      score: { 'east/west': 0, 'north/south': 0 },
      gameFirstPlayer: 'west',
      currentPlayer: 'west',
      trumpColor: 'h',
      roundColor: null,
      deactivated: false // parameter used to describe a frozen state where nothing is activable
    };
    this.playCard = this.playCard.bind(this);
    this.endRound = this.endRound.bind(this);
    this.settleWinner = this.settleWinner.bind(this);
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
    const nbPlayedCards = Object.values(this.state.roundCards).filter(
      v => v != null
    ).length;
    if (nbPlayedCards === 3) {
      // end the turn if last player
      setTimeout(this.endRound, 1000);
      this.setState({ deactivated: true });
    } else {
      if (nbPlayedCards === 0) {
        // first card to be played this turn
        this.setState({ roundColor: extractColorFromCardRepr(card) });
      }
      this.setState(prevState => ({
        currentPlayer: constants.NEXT_PLAYER[prevState.currentPlayer]
      }));
    }
  }

  settleWinner() {
    var winner = null;
    const trumpRanking = Object.keys(this.state.roundCards)
      .filter(
        (k, index) =>
          extractColorFromCardRepr(this.state.roundCards[k]) ===
          this.state.trumpColor
      )
      .sort(
        (a, b) =>
          constants.TRUMP_RANKING[
            extractValueFromCardRepr(this.state.roundCards[b])
          ] -
          constants.TRUMP_RANKING[
            extractValueFromCardRepr(this.state.roundCards[a])
          ]
      );
    if (trumpRanking.length > 0) {
      winner = trumpRanking[0];
    } else {
      const roundColorRanking = Object.keys(this.state.roundCards)
        .filter(
          (k, index) =>
            extractColorFromCardRepr(this.state.roundCards[k]) ===
            this.state.roundColor
        )
        .sort(
          (a, b) =>
            constants.PLAIN_RANKING[
              extractValueFromCardRepr(this.state.roundCards[b])
            ] -
            constants.PLAIN_RANKING[
              extractValueFromCardRepr(this.state.roundCards[a])
            ]
        );
      winner = roundColorRanking[0];
    }
    return winner;
  }

  endRound() {
    alert('END OF ROUND ' + this.state.round);
    const winner = this.settleWinner();
    this.setState(prevState => ({
      round: prevState.round + 1,
      roundCards: { west: null, east: null, north: null, south: null },
      roundColor: null,
      currentPlayer: winner,
      score: {
        'east/west': prevState.score['east/west'] + 10,
        'north/south': prevState.score['north/south'] + 20
      },
      deactivated: false
    }));
  }

  checkPlayability(card, player, state) {
    function checkPlayerHasColor(cards, color) {
      const colorCards = cards.filter(
        c => extractColorFromCardRepr(c) === color
      );
      return colorCards.length > 0;
    }
    function getCurrentlyHighestTrumpRankPlayed(roundCards, trumpColor) {
      return Object.values(roundCards)
        .filter(c => c != null)
        .filter(c => extractColorFromCardRepr(c) === trumpColor)
        .map(c => constants.TRUMP_RANKING[extractValueFromCardRepr(c)])
        .sort()
        .slice(-1)
        .pop();
    }
    function checkPlayerHasHigherTrump(cards, trumpColor, highestTrumpRank) {
      return (
        cards
          .filter(c => extractColorFromCardRepr(c) === trumpColor)
          .filter(
            c =>
              constants.TRUMP_RANKING[extractValueFromCardRepr(c)] >
              highestTrumpRank
          ).length > 0
      );
    }
    function checkPartnerPlayedCurrentlyHighestColorCard(
      player,
      roundCards,
      roundColor
    ) {
      return (
        roundCards[constants.PARTNER[player]] ===
        Object.values(roundCards)
          .filter(c => c != null)
          .filter(c => extractColorFromCardRepr(c) === roundColor)
          .sort(
            (a, b) =>
              constants.PLAIN_RANKING[extractValueFromCardRepr(b)] -
              constants.PLAIN_RANKING[extractValueFromCardRepr(a)]
          )[0]
      );
    }

    if (state.deactivated | (player !== state.currentPlayer)) {
      // not player turn
      return false;
    } else if (state.roundColor == null) {
      // first player
      return true;
    } else {
      // player turn but not first to play
      const playerHand = state.playersCards[player];
      const playerHasRoundColor = checkPlayerHasColor(
        playerHand,
        state.roundColor
      );
      const playerHasTrumpColor = checkPlayerHasColor(
        playerHand,
        state.trumpColor
      );
      if (state.roundColor === state.trumpColor) {
        if (playerHasTrumpColor) {
          // trump round and player has trumps
          const currentlyHighestTrumpRankPlayed = getCurrentlyHighestTrumpRankPlayed(
            state.roundCards,
            state.trumpColor
          );
          const playerHasHigherTrump = checkPlayerHasHigherTrump(
            playerHand,
            state.trumpColor,
            currentlyHighestTrumpRankPlayed
          );
          if (playerHasHigherTrump) {
            // trump round and player has trump cards, some higher than curently highest played
            return (
              (constants.TRUMP_RANKING[extractValueFromCardRepr(card)] >
                currentlyHighestTrumpRankPlayed) &
              (extractColorFromCardRepr(card) === state.trumpColor)
            );
          } else {
            // trump round and player has trump cards, all less than curently highest played
            return extractColorFromCardRepr(card) === state.trumpColor;
          }
        } else {
          // trump round and player has no trump
          return true;
        }
      } else {
        if (playerHasRoundColor) {
          // normal round and player has round color
          return extractColorFromCardRepr(card) === state.roundColor;
        } else if (playerHasTrumpColor) {
          const partnerPlayedCurrentlyHighestColorCard = checkPartnerPlayedCurrentlyHighestColorCard(
            player,
            state.roundCards,
            state.roundColor
          );
          if (partnerPlayedCurrentlyHighestColorCard) {
            // normal round, player has not the round color but has trump color, but partner is currently winning
            return true;
          } else {
            // normal round, player has not the round color but has trump color, and partner id not currently winning
            return extractColorFromCardRepr(card) === state.trumpColor;
          }
        } else {
          // normal round, player has not the round color neither trump color
          return true;
        }
      }
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
            isCurrentPlayer={'west' === this.state.currentPlayer}
            arePlayableCards={this.state.playersCards['west'].map(c =>
              this.checkPlayability(c, 'west', this.state)
            )}
            playCard={this.playCard}
          />
          <Hand
            player="east"
            rawValues={this.state.playersCards['east']}
            isCurrentPlayer={'east' === this.state.currentPlayer}
            arePlayableCards={this.state.playersCards['east'].map(c =>
              this.checkPlayability(c, 'east', this.state)
            )}
            playCard={this.playCard}
          />
          <Hand
            player="north"
            rawValues={this.state.playersCards['north']}
            isCurrentPlayer={'north' === this.state.currentPlayer}
            arePlayableCards={this.state.playersCards['north'].map(c =>
              this.checkPlayability(c, 'north', this.state)
            )}
            playCard={this.playCard}
          />
          <Hand
            player="south"
            rawValues={this.state.playersCards['south']}
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
          <p>
            Current Trump Color:{' '}
            {constants.COLOR_TO_SYMBOL[this.state.trumpColor]}
          </p>
        </div>
      </>
    );
  }
}
