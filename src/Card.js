import React from 'react';
import { extractValueFromCardRepr, extractColorFromCardRepr } from './helpers';

function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('./images/cards', false, /\.(png|jpe?g|svg)$/));

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
    if (this.state.isHovered) {
      classNames += this.props.isPlayable ? 'playable ' : 'not-playable ';
    }
    let card = null;
    if (!this.props.toBeRendered) {
      card = (
        <button className="card">
          <img src={images['red_back_neutral.png']} alt="" width="38" height="58" />
        </button>
      );
    } else {
      card = (
        <button
          className={classNames}
          onClick={this.play}
          onMouseOver={() => this.setState({ isHovered: true })}
          onMouseLeave={() => this.setState({ isHovered: false })}
        >
          <img src={images[this.state.value + this.state.color + '.png']} alt="" width="38" height="58" />
        </button>
      );
    }
    return card;
  }
}
