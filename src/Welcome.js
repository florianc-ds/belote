import React from 'react';
import { Redirect } from 'react-router-dom';
import * as constants from './constants.js';

export class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readyToPlay: false,
      player: null,
      partnerLevel: null,
      opponentOneLevel: null,
      opponentTwoLevel: null,
      agents: null
    };
    this.updatePlayer = this.updatePlayer.bind(this);
    this.updatePartnerLevel = this.updatePartnerLevel.bind(this);
    this.updateOpponentOneLevel = this.updateOpponentOneLevel.bind(this);
    this.updateOpponentTwoLevel = this.updateOpponentTwoLevel.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  updatePlayer(newPlayer) {
    this.setState({ player: newPlayer });
  }

  updatePartnerLevel(newLevel) {
    this.setState({ partnerLevel: newLevel });
  }

  updateOpponentOneLevel(newLevel) {
    this.setState({ opponentOneLevel: newLevel });
  }

  updateOpponentTwoLevel(newLevel) {
    this.setState({ opponentTwoLevel: newLevel });
  }

  deriveGameAgents(player, partnerLevel, opponentOneLevel, opponentTwoLevel) {
    const partner = constants.PARTNER[player];
    const opponents = Object.keys(constants.NEXT_PLAYER).filter(
      p => (p !== player) & (p !== partner)
    );
    return {
      [player]: constants.REAL_PLAYER,
      [partner]: partnerLevel,
      [opponents[0]]: opponentOneLevel,
      [opponents[1]]: opponentTwoLevel
    };
  }

  startGame(event) {
    const gameAgents = this.deriveGameAgents(
      this.state.player,
      this.state.partnerLevel,
      this.state.opponentOneLevel,
      this.state.opponentTwoLevel
    );
    this.setState({ readyToPlay: true, agents: gameAgents });
    event.preventDefault();
  }

  render() {
    const readyToPlay = this.state.readyToPlay;
    if (readyToPlay === true) {
      return (
        <Redirect
          to={{
            pathname: '/game',
            state: { agents: this.state.agents }
          }}
        />
      );
    }
    var submittable =
      (this.state.player != null) &
      (this.state.partnerLevel != null) &
      (this.state.opponentOneLevel != null) &
      (this.state.opponentTwoLevel != null);
    return (
      <>
        <header>
          Welcome to <strike>Belote</strike> Coinche my friend
        </header>
        <form onSubmit={this.startGame}>
          <div>What side do you want to play:</div>
          <select
            onChange={event => this.updatePlayer(event.target.value)}
            defaultValue="empty"
          >
            <option disabled value="empty" />
            <option value="west">WEST</option>
            <option value="south">SOUTH</option>
            <option value="east">EAST</option>
            <option value="north">NORTH</option>
          </select>
          <div>What level for your partner:</div>
          <select
            onChange={event => this.updatePartnerLevel(event.target.value)}
            defaultValue="empty"
          >
            <option disabled value="empty" />
            <option value={constants.RANDOM_AGENT}>Noob</option>
            <option value={constants.HIGHEST_CARD_AGENT}>Trainee</option>
            <option value={constants.EXPERT_AGENT}>Resident</option>
            <option value={constants.REINFORCEMENT_AGENT} disabled={true}>
              Legend
            </option>
          </select>
          <div>What levels for your opponents:</div>
          <select
            onChange={event => this.updateOpponentOneLevel(event.target.value)}
            defaultValue="empty"
          >
            <option disabled value="empty" />
            <option value={constants.RANDOM_AGENT}>Noob</option>
            <option value={constants.HIGHEST_CARD_AGENT}>Trainee</option>
            <option value={constants.EXPERT_AGENT}>Resident</option>
            <option value={constants.REINFORCEMENT_AGENT} disabled={true}>
              Legend
            </option>
          </select>
          <select
            onChange={event => this.updateOpponentTwoLevel(event.target.value)}
            defaultValue="empty"
          >
            <option disabled value="empty" />
            <option value={constants.RANDOM_AGENT}>Noob</option>
            <option value={constants.HIGHEST_CARD_AGENT}>Trainee</option>
            <option value={constants.EXPERT_AGENT}>Resident</option>
            <option value={constants.REINFORCEMENT_AGENT} disabled={true}>
              Legend
            </option>
          </select>
          <br />
          <input type="submit" value="START!" disabled={!submittable} />
        </form>
      </>
    );
  }
}
