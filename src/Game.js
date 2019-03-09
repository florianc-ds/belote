import React from 'react';
import {
  shuffleArray,
  extractColorFromCardRepr,
  extractValueFromCardRepr
} from './helpers';
import { Hand } from './Hand';
import { RoundCards } from './RoundCards';
import { AuctionState } from './AuctionState';
import * as constants from './constants.js';

export class Game extends React.Component {
  constructor(props) {
    super(props);
    const shuffledCards = shuffleArray(Array.from(constants.PLAYING_CARDS));
    this.state = {
      mode: constants.AUCTION_MODE,
      round: 0,
      playersCards: {
        west: shuffledCards.slice(0, 8),
        east: shuffledCards.slice(8, 16),
        north: shuffledCards.slice(16, 24),
        south: shuffledCards.slice(24, 32)
      },
      playersBids: {
        west: { value: null, color: null },
        east: { value: null, color: null },
        north: { value: null, color: null },
        south: { value: null, color: null }
      },
      auctionPassedTurnInRow: 0,
      gameHistory: { west: [], east: [], north: [], south: [] },
      roundCards: { west: null, east: null, north: null, south: null },
      score: { 'east/west': 0, 'north/south': 0 },
      gameFirstPlayer: 'west',
      currentPlayer: 'west',
      contract: null,
      trumpColor: null,
      roundColor: null,
      deactivated: false // parameter used to describe a frozen state where nothing is activable
    };
    this.playCard = this.playCard.bind(this);
    this.placeBid = this.placeBid.bind(this);
    this.passAuction = this.passAuction.bind(this);
    this.endRound = this.endRound.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  placeBid(value, color, player) {
    console.log(player + ' placed a bid of ' + value + ' on ' + color);
    this.setState(prevState => ({
      auctionPassedTurnInRow: 0,
      currentPlayer: constants.NEXT_PLAYER[prevState.currentPlayer],
      playersBids: {
        ...prevState.playersBids,
        [player]: { value: value, color: color }
      }
    }));
  }

  passAuction() {
    if (this.state.auctionPassedTurnInRow === 2) {
      const validBids = Object.values(this.state.playersBids).filter(
        bid => bid['value'] != null
      );
      if (validBids.length > 0) {
        // 3 passed in a row and at least one player spoke
        const bestBid = validBids.sort((a, b) => a['value'] - b['value'])[0];
        this.setState(prevState => ({
          trumpColor: bestBid['color'],
          contract: bestBid['value'],
          mode: constants.PLAY_MODE,
          currentPlayer: prevState.gameFirstPlayer
        }));
      } else {
        // 3 passed and none spoke
        alert('NO ONE WANTS TO PLAY WITH ME...');
      }
    } else {
      this.setState(prevState => ({
        auctionPassedTurnInRow: prevState.auctionPassedTurnInRow + 1,
        currentPlayer: constants.NEXT_PLAYER[prevState.currentPlayer]
      }));
    }
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
    // place a copy of card in history
    this.state.gameHistory[player].push(card);
    // various actions according to position of player in turn
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

  settleWinner(roundCards, roundColor, trumpColor) {
    var winner = null;
    const trumpRanking = Object.keys(roundCards)
      .filter(
        (k, index) => extractColorFromCardRepr(roundCards[k]) === trumpColor
      )
      .sort(
        (a, b) =>
          constants.TRUMP_RANKING[extractValueFromCardRepr(roundCards[b])] -
          constants.TRUMP_RANKING[extractValueFromCardRepr(roundCards[a])]
      );
    if (trumpRanking.length > 0) {
      winner = trumpRanking[0];
    } else {
      const roundColorRanking = Object.keys(roundCards)
        .filter(
          (k, index) => extractColorFromCardRepr(roundCards[k]) === roundColor
        )
        .sort(
          (a, b) =>
            constants.PLAIN_RANKING[extractValueFromCardRepr(roundCards[b])] -
            constants.PLAIN_RANKING[extractValueFromCardRepr(roundCards[a])]
        );
      winner = roundColorRanking[0];
    }
    return winner;
  }

  countRoundScore(roundCards, trumpColor, round) {
    let score = Object.values(roundCards)
      .map(
        c =>
          extractColorFromCardRepr(c) === trumpColor
            ? constants.TRUMP_POINTS[extractValueFromCardRepr(c)]
            : constants.PLAIN_POINTS[extractValueFromCardRepr(c)]
      )
      .reduce((a, b) => a + b);
    // last round counts for 10 more points
    if (round === 7) {
      score = score + 10;
    }
    return score;
  }

  endRound() {
    console.log('END OF ROUND ' + this.state.round);
    const winner = this.settleWinner(
      this.state.roundCards,
      this.state.roundColor,
      this.state.trumpColor
    );
    const winningTeam = ['east', 'west'].includes(winner)
      ? 'east/west'
      : 'north/south';
    const roundScore = this.countRoundScore(
      this.state.roundCards,
      this.state.trumpColor,
      this.state.round
    );
    this.setState(prevState => ({
      roundCards: { west: null, east: null, north: null, south: null },
      roundColor: null,
      score: {
        ...prevState.score,
        [winningTeam]: prevState.score[winningTeam] + roundScore
      },
      deactivated: false
    }));
    if (this.state.round < 7) {
      this.setState(prevState => ({
        round: prevState.round + 1,
        currentPlayer: winner
      }));
    } else {
      this.endGame();
    }
  }

  endGame() {
    console.log('END OF GAME');
    const shuffledCards = shuffleArray(Array.from(constants.PLAYING_CARDS));
    this.setState(prevState => ({
      mode: constants.AUCTION_MODE,
      round: 0,
      gameHistory: { west: [], east: [], north: [], south: [] },
      playersCards: {
        west: shuffledCards.slice(0, 8),
        east: shuffledCards.slice(8, 16),
        north: shuffledCards.slice(16, 24),
        south: shuffledCards.slice(24, 32)
      },
      playersBids: {
        west: { value: null, color: null },
        east: { value: null, color: null },
        north: { value: null, color: null },
        south: { value: null, color: null }
      },
      auctionPassedTurnInRow: 0,
      contract: null,
      trumpColor: null,
      gameFirstPlayer: constants.NEXT_PLAYER[prevState.gameFirstPlayer],
      currentPlayer: constants.NEXT_PLAYER[prevState.gameFirstPlayer]
    }));
    alert(
      'East + West ==> ' +
        this.state.score['east/west'] +
        '\nNorth + South ==> ' +
        this.state.score['north/south']
    );
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
    function checkPartnerIsCurrentlyLeading(
      player,
      roundCards,
      roundColor,
      trumpColor
    ) {
      const trumpPlayed =
        Object.values(roundCards)
          .filter(c => c != null)
          .filter(c => extractColorFromCardRepr(c) === trumpColor).length > 0;
      if (trumpPlayed) {
        // partner is leading only if he has played the currently highest trump card
        return (
          roundCards[constants.PARTNER[player]] ===
          Object.values(roundCards)
            .filter(c => c != null)
            .filter(c => extractColorFromCardRepr(c) === trumpColor)
            .sort(
              (a, b) =>
                constants.TRUMP_RANKING[extractValueFromCardRepr(b)] -
                constants.TRUMP_RANKING[extractValueFromCardRepr(a)]
            )[0]
        );
      } else {
        // partner is leading only if he has played the currently highest color card
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
          const partnerIsCurrentlyLeading = checkPartnerIsCurrentlyLeading(
            player,
            state.roundCards,
            state.roundColor,
            state.trumpColor
          );
          if (partnerIsCurrentlyLeading) {
            // normal round, player has not the round color but has trump color, but partner is currently winning
            return true;
          } else {
            // normal round, player has not the round color but has trump color, and partner is not currently winning
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
              // normal round, player has to play trump, and can play higher than currently highest
              return (
                (constants.TRUMP_RANKING[extractValueFromCardRepr(card)] >
                  currentlyHighestTrumpRankPlayed) &
                (extractColorFromCardRepr(card) === state.trumpColor)
              );
            } else {
              // normal round, player has to play trump, and cannot play higher than currently highest
              return extractColorFromCardRepr(card) === state.trumpColor;
            }
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
    const boardGameCenterComponent =
      this.state.mode === constants.AUCTION_MODE ? (
        <AuctionState playersBids={this.state.playersBids} />
      ) : (
        <RoundCards cards={this.state.roundCards} />
      );
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
            placeBid={this.placeBid}
            passAuction={this.passAuction}
            playersBids={this.state.playersBids}
            playCard={this.playCard}
            mode={this.state.mode}
          />
          <Hand
            player="east"
            rawValues={this.state.playersCards['east']}
            isCurrentPlayer={'east' === this.state.currentPlayer}
            arePlayableCards={this.state.playersCards['east'].map(c =>
              this.checkPlayability(c, 'east', this.state)
            )}
            placeBid={this.placeBid}
            passAuction={this.passAuction}
            playersBids={this.state.playersBids}
            playCard={this.playCard}
            mode={this.state.mode}
          />
          <Hand
            player="north"
            rawValues={this.state.playersCards['north']}
            isCurrentPlayer={'north' === this.state.currentPlayer}
            arePlayableCards={this.state.playersCards['north'].map(c =>
              this.checkPlayability(c, 'north', this.state)
            )}
            placeBid={this.placeBid}
            passAuction={this.passAuction}
            playersBids={this.state.playersBids}
            playCard={this.playCard}
            mode={this.state.mode}
          />
          <Hand
            player="south"
            rawValues={this.state.playersCards['south']}
            isCurrentPlayer={'south' === this.state.currentPlayer}
            arePlayableCards={this.state.playersCards['south'].map(c =>
              this.checkPlayability(c, 'south', this.state)
            )}
            placeBid={this.placeBid}
            passAuction={this.passAuction}
            playersBids={this.state.playersBids}
            playCard={this.playCard}
            mode={this.state.mode}
          />
          {boardGameCenterComponent}
        </div>
        <div className="rules">
          <p>Heart -> &#x2665;</p>
          <p>Spade -> &#x2660;</p>
          <p>Club -> &#x2663;</p>
          <p>Diamond -> &#x2666;</p>
          <p>
            Current Trump Color:
            {' ' + constants.COLOR_TO_SYMBOL[this.state.trumpColor]}
          </p>
          <p>
            Current Contract:
            {' ' + this.state.contract}
          </p>
        </div>
      </>
    );
  }
}
