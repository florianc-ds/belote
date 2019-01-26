import React from 'react';
import { extractValueFromCardRepr, extractColorFromCardRepr } from './helpers';
import * as constants from './constants.js';

export class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: extractValueFromCardRepr(this.props.rawValue),
      color: extractColorFromCardRepr(this.props.rawValue),
      isHovered: false
    };
    this.play = this.play.bind(this);
  }
  play() {
    if (!this.props.isPlayable) {
      //alert('Card ' + this.props.rawValue + ' is not playable');
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
        onMouseOver={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false })}
      >
        {this.state.value + ' ' + constants.COLOR_TO_SYMBOL[this.state.color]}
      </button>
    );
  }
}
