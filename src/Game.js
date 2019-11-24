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
import { GameInfo } from './GameInfo';

const initialPartialState = {
  mode: constants.AUCTION_MODE,
  round: 0,
  playersBids: {
    west: { value: null, color: null },
    east: { value: null, color: null },
    north: { value: null, color: null },
    south: { value: null, color: null }
  },
  auctionPassedTurnInRow: -1,
  gameHistory: { west: [], east: [], north: [], south: [] },
  roundCards: { west: null, east: null, north: null, south: null },
  belotePlayers: { K: null, Q: null },
  gameScore: { 'east/west': 0, 'north/south': 0 },
  globalScore: { 'east/west': 0, 'north/south': 0 },
  gameFirstPlayer: 'west',
  roundsFirstPlayer: [],
  currentPlayer: 'west',
  contract: null,
  contractTeam: null,
  trumpColor: null,
  roundColor: null,
  deactivated: false // parameter used to describe a frozen state where nothing is activable
};

export class Game extends React.Component {
  constructor(props) {
    super(props);
    const shuffledCards = shuffleArray(Array.from(constants.PLAYING_CARDS));
    this.state = {
      ...initialPartialState,
      playersCards: {
        west: shuffledCards.slice(0, 8),
        east: shuffledCards.slice(8, 16),
        north: shuffledCards.slice(16, 24),
        south: shuffledCards.slice(24, 32)
      }
    };
    this.playCard = this.playCard.bind(this);
    this.playCardAutomatically = this.playCardAutomatically.bind(this);
    this.placeBid = this.placeBid.bind(this);
    this.passAuction = this.passAuction.bind(this);
    this.endRound = this.endRound.bind(this);
    this.endGame = this.endGame.bind(this);
    this.reset = this.reset.bind(this);
    // // Robot bettors here
    // if (
    //   (this.state.mode === constants.AUCTION_MODE) &
    //   (this.state.auctionPassedTurnInRow === -1)
    // ) {
    //   // we only want to trigger automatic bet when we really create the Component (not when we refresh the page)
    //   const nextPlayer = this.state.gameFirstPlayer;
    //   if (this.props.location.state.agents[nextPlayer] !== constants.REAL_PLAYER) {
    //     this.passOrBetAutomatically(
    //       nextPlayer,
    //       constants.AGENT_TO_API[this.props.location.state.agents[nextPlayer]]
    //     );
    //   }
    // }
  }

  reset() {
    const shuffledCards = shuffleArray(Array.from(constants.PLAYING_CARDS));
    const initialState = {
      ...initialPartialState,
      playersCards: {
        west: shuffledCards.slice(0, 8),
        east: shuffledCards.slice(8, 16),
        north: shuffledCards.slice(16, 24),
        south: shuffledCards.slice(24, 32)
      }
    };
    this.setState(initialState);
    // Robot bettors here
    const nextPlayer = initialPartialState['gameFirstPlayer'];
    if (
      this.props.location.state.agents[nextPlayer] !== constants.REAL_PLAYER
    ) {
      this.passOrBetAutomatically(
        nextPlayer,
        constants.AGENT_TO_API[this.props.location.state.agents[nextPlayer]]
      );
    }
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
    // Robot bettors here
    const nextPlayer = constants.NEXT_PLAYER[player];
    if (
      this.props.location.state.agents[nextPlayer] !== constants.REAL_PLAYER
    ) {
      this.passOrBetAutomatically(
        nextPlayer,
        constants.AGENT_TO_API[this.props.location.state.agents[nextPlayer]]
      );
    }
  }

  passAuction() {
    if (this.state.auctionPassedTurnInRow === 2) {
      const validPlayersBids = Object.keys(this.state.playersBids)
        .map(p => [p, this.state.playersBids[p]])
        .filter(playerBid => playerBid[1]['value'] != null);
      if (validPlayersBids.length > 0) {
        // 3 passed in a row and at least one player spoke
        const bestPlayerBid = validPlayersBids.sort(
          (a, b) => b[1]['value'] - a[1]['value']
        )[0];
        this.setState(prevState => ({
          trumpColor: bestPlayerBid[1]['color'],
          contract: bestPlayerBid[1]['value'],
          contractTeam: 'east/west'.includes(bestPlayerBid[0])
            ? 'east/west'
            : 'north/south',
          mode: constants.PLAY_MODE,
          roundsFirstPlayer: [
            ...prevState.roundsFirstPlayer,
            prevState.gameFirstPlayer
          ],
          currentPlayer: prevState.gameFirstPlayer
        }));
        // Robot players here
        const nextPlayer = this.state.gameFirstPlayer;
        if (
          this.props.location.state.agents[nextPlayer] !== constants.REAL_PLAYER
        ) {
          this.playCardAutomatically(
            nextPlayer,
            constants.AGENT_TO_API[this.props.location.state.agents[nextPlayer]]
          );
        }
      } else {
        // 3 passed and none spoke
        console.log('No one spoke, dealing again');
        const shuffledCards = shuffleArray(Array.from(constants.PLAYING_CARDS));
        this.setState(prevState => ({
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
          auctionPassedTurnInRow: -1,
          contract: null,
          contractTeam: null,
          gameFirstPlayer: constants.NEXT_PLAYER[prevState.gameFirstPlayer],
          currentPlayer: constants.NEXT_PLAYER[prevState.gameFirstPlayer]
        }));
      }
    } else {
      const currentPassingPlayer = this.state.currentPlayer;
      this.setState(prevState => ({
        auctionPassedTurnInRow: prevState.auctionPassedTurnInRow + 1,
        currentPlayer: constants.NEXT_PLAYER[prevState.currentPlayer]
      }));
      // Robot bettors here
      const nextPlayer = constants.NEXT_PLAYER[currentPassingPlayer];
      if (
        this.props.location.state.agents[nextPlayer] !== constants.REAL_PLAYER
      ) {
        this.passOrBetAutomatically(
          nextPlayer,
          constants.AGENT_TO_API[this.props.location.state.agents[nextPlayer]]
        );
      }
    }
  }

  passOrBetAutomatically(player, API) {
    this.setState({ deactivated: true }, function() {
      setTimeout(() => {
        this.setState({ deactivated: false }, async () => {
          const response = await fetch(API + '/bet_or_pass', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              player: player,
              playerCards: this.state.playersCards[player],
              playersBids: this.state.playersBids,
              auctionPassedTurnInRow: this.state.auctionPassedTurnInRow,
              globalScore: this.state.globalScore,
              gameFirstPlayer: this.state.gameFirstPlayer
            })
          });
          const data = await response.json();
          const action = data['action'];
          if (action === 'pass') {
            this.passAuction();
          } else if (action === 'bet') {
            const value = data['value'];
            const color = data['color'];
            this.placeBid(value, color, player);
          }
        });
      }, constants.AUTOBID_TIMEOUT);
    });
  }

  playCard(card, player) {
    // determine position of player in round
    const nbPlayedCards = Object.values(this.state.roundCards).filter(
      v => v != null
    ).length;
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
    if (nbPlayedCards === 3) {
      // end the turn if last player
      setTimeout(this.endRound, constants.END_ROUND_TIMEOUT);
      this.setState({ deactivated: true });
    } else {
      if (nbPlayedCards === 0) {
        // first card to be played this turn
        this.setState({ roundColor: extractColorFromCardRepr(card) });
      }
      this.setState(prevState => ({
        currentPlayer: constants.NEXT_PLAYER[prevState.currentPlayer]
      }));
      // Robot players here
      const nextPlayer = constants.NEXT_PLAYER[player];
      if (
        this.props.location.state.agents[nextPlayer] !== constants.REAL_PLAYER
      ) {
        this.playCardAutomatically(
          nextPlayer,
          constants.AGENT_TO_API[this.props.location.state.agents[nextPlayer]]
        );
      }
    }
  }

  playCardAutomatically(player, API) {
    this.setState({ deactivated: true }, function() {
      setTimeout(() => {
        this.setState({ deactivated: false }, async () => {
          const response = await fetch(API + '/play', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              player: player,
              trumpColor: this.state.trumpColor,
              playerCards: this.state.playersCards[player],
              cardsPlayability: this.state.playersCards[player].map(c =>
                this.checkPlayability(c, player, this.state)
              ),
              round: this.state.round,
              roundCards: this.state.roundCards,
              roundColor: this.state.roundColor,
              gameHistory: this.state.gameHistory,
              roundsFirstPlayer: this.state.roundsFirstPlayer,
              contract: this.state.contract,
              contractTeam: this.state.contractTeam,
              globalScore: this.state.globalScore
            })
          });
          const data = await response.json();
          const nextCard = data['card'];
          this.playCard(nextCard, player);
        });
      }, constants.AUTOPLAY_TIMEOUT);
    });
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
      .map(c =>
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

  getBeloteCardsPlayedDuringRound(roundCards, trumpColor) {
    return Object.keys(roundCards)
      .filter(p => roundCards[p] != null)
      .filter(p => extractColorFromCardRepr(roundCards[p]) === trumpColor)
      .filter(p => ['Q', 'K'].includes(extractValueFromCardRepr(roundCards[p])))
      .reduce((obj, p) => {
        obj[extractValueFromCardRepr(roundCards[p])] = p;
        return obj;
      }, {});
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
    // Check for belote
    const beloteCardsPlayedDuringRound = this.getBeloteCardsPlayedDuringRound(
      this.state.roundCards,
      this.state.trumpColor
    );
    if (Object.keys(beloteCardsPlayedDuringRound).length > 0) {
      this.setState(prevState => ({
        belotePlayers: {
          Q: Object.keys(beloteCardsPlayedDuringRound).includes('Q')
            ? beloteCardsPlayedDuringRound['Q']
            : prevState.belotePlayers['Q'],
          K: Object.keys(beloteCardsPlayedDuringRound).includes('K')
            ? beloteCardsPlayedDuringRound['K']
            : prevState.belotePlayers['K']
        }
      }));
      if (this.state.belotePlayers['Q'] === this.state.belotePlayers['K']) {
        // rebelote for a team
        const beloteTeam = ['east', 'west'].includes(
          this.state.belotePlayers['Q']
        )
          ? 'east/west'
          : 'north/south';
        console.log('re-belote for ' + beloteTeam);
      }
    }
    this.setState(prevState => ({
      roundCards: { west: null, east: null, north: null, south: null },
      roundColor: null,
      gameScore: {
        ...prevState.gameScore,
        [winningTeam]: prevState.gameScore[winningTeam] + roundScore
      },
      deactivated: false
    }));
    if (this.state.round < 7) {
      this.setState(prevState => ({
        round: prevState.round + 1,
        roundsFirstPlayer: [...prevState.roundsFirstPlayer, winner],
        currentPlayer: winner
      }));
      // Robot players here
      const nextPlayer = winner;
      if (
        this.props.location.state.agents[nextPlayer] !== constants.REAL_PLAYER
      ) {
        this.playCardAutomatically(
          nextPlayer,
          constants.AGENT_TO_API[this.props.location.state.agents[nextPlayer]]
        );
      }
    } else {
      this.endGame();
    }
  }

  displayEndGameScore(score, contract, contractTeam, belotePlayers) {
    var scoreWithBelote = {
      ...score
    };
    // Deal with belote
    if (belotePlayers['Q'] === belotePlayers['K']) {
      const beloteTeam = ['east', 'west'].includes(belotePlayers['Q'])
        ? 'east/west'
        : 'north/south';
      scoreWithBelote[beloteTeam] += 20;
    }

    var displayMessage =
      score[contractTeam] >= contract
        ? 'Well done ' + contractTeam + ', you made it!'
        : 'Too bad ' + contractTeam + ', close but not enough...';
    displayMessage += '\nEast + West ==> ' + scoreWithBelote['east/west'];
    if (contractTeam === 'east/west') {
      displayMessage += ' (for ' + contract + ')';
    }
    displayMessage += '\nNorth + South ==> ' + scoreWithBelote['north/south'];
    if (contractTeam === 'north/south') {
      displayMessage += ' (for ' + contract + ')';
    }
    alert(displayMessage);
  }

  computeRealEndGameScore(score, contract, contractTeam, belotePlayers) {
    const otherTeam =
      contractTeam === 'east/west' ? 'north/south' : 'east/west';
    var realEndGameScore = { 'east/west': 0, 'north/south': 0 };
    // Deal with belote
    if (belotePlayers['Q'] === belotePlayers['K']) {
      const beloteTeam = ['east', 'west'].includes(belotePlayers['Q'])
        ? 'east/west'
        : 'north/south';
      realEndGameScore[beloteTeam] += 20;
    }
    // Check contract
    if ((score[contractTeam] > 81) & (score[contractTeam] >= contract)) {
      // contract succeeded
      realEndGameScore[contractTeam] += score[contractTeam] + contract;
      realEndGameScore[otherTeam] += score[otherTeam];
    } else {
      // contract failed
      realEndGameScore[otherTeam] += 162 + contract;
    }
    return realEndGameScore;
  }

  endGame() {
    this.displayEndGameScore(
      this.state.gameScore,
      this.state.contract,
      this.state.contractTeam,
      this.state.belotePlayers
    );
    console.log('END OF GAME');
    const realEndGameScore = this.computeRealEndGameScore(
      this.state.gameScore,
      this.state.contract,
      this.state.contractTeam,
      this.state.belotePlayers
    );
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
      auctionPassedTurnInRow: -1,
      belotePlayers: { K: null, Q: null },
      gameScore: { 'east/west': 0, 'north/south': 0 },
      globalScore: {
        'east/west':
          prevState.globalScore['east/west'] + realEndGameScore['east/west'],
        'north/south':
          prevState.globalScore['north/south'] + realEndGameScore['north/south']
      },
      contract: null,
      contractTeam: null,
      trumpColor: null,
      gameFirstPlayer: constants.NEXT_PLAYER[prevState.gameFirstPlayer],
      roundsFirstPlayer: [],
      currentPlayer: constants.NEXT_PLAYER[prevState.gameFirstPlayer]
    }));
    // Robot bettors here
    const nextPlayer = this.state['currentPlayer'];
    if (
      this.props.location.state.agents[nextPlayer] !== constants.REAL_PLAYER
    ) {
      this.passOrBetAutomatically(
        nextPlayer,
        constants.AGENT_TO_API[this.props.location.state.agents[nextPlayer]]
      );
    }
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

    if (
      state.deactivated |
      (player !== state.currentPlayer) |
      (state.mode !== constants.PLAY_MODE)
    ) {
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

  hydrateStateWithLocalStorage() {
    // for all items in state
    for (let key in this.state) {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }

  saveStateToLocalStorage() {
    // for every item in React state
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  componentDidMount() {
    document.title = 'Belote';
    window.addEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    );
    // POP action corresponds to F5 refresh (and other navigation actions: backward, forward,...)
    if (this.props.history.action === 'POP') {
      this.hydrateStateWithLocalStorage();
      // add event listener to save state to localStorage
      // when user leaves/refreshes the page
    } else {
      this.reset();
      this.saveStateToLocalStorage();
    }
  }

  componentWillUnmount() {
    window.removeEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    );
    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
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
        <header>
          Welcome to <strike>Belote</strike> Coinche my friend
        </header>
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
            trumpColor={this.state.trumpColor}
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
            trumpColor={this.state.trumpColor}
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
            trumpColor={this.state.trumpColor}
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
            trumpColor={this.state.trumpColor}
          />
          {boardGameCenterComponent}
        </div>
        <GameInfo
          trumpColor={this.state.trumpColor}
          contract={this.state.contract}
          contractTeam={this.state.contractTeam}
          globalScore={this.state.globalScore}
          reset={this.reset}
        />
      </>
    );
  }
}
