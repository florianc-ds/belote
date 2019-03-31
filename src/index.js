import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Game } from './Game';

/* _--_
 //    \\
|| TODO ||
 \\.__.//
 */

/*
1) SET A FLASK API AND PLUG IT TO BELOTE
  a) set Flask
  b) define 4 endpoints (random, highest_card, expert, reinforcement)
  c) define random and highest_card and set remaining ones to random
  d) use WIP commit to plug API to Belote
2) AUTOMATE AUCTION
  a) use a new method placeBidAutomaticallyOrPass
  b) define adapted strategies with flask
  c) plug both of them
3) CREATE BELOTE DATASETS
  -> export gameHistory at each game end 
4) DEFINE 3 DIFFERENT MODES FOR CARDS RENDERING (add 'mode' to props of card, filled by parent (Hand or RoundCards) + update Card.render):
  -> hidden = hand of waiting players (all black)
  -> played = round cards (visible but no green/red margin on hovering)
  -> hidden = hand of playing player (current behaviour)
5) REPLACE CURRENT CARDS WITH {'\u{1F0C2}'}, ... (cf https://en.wikipedia.org/wiki/Playing_cards_in_Unicode)
6) DYNAMIC EFFECTS

REMINDER:
USE CONSTANTS:
- TEAMS instead of 'east/west' & 'north/south'
SOME FEATURE ARE NOT INTEGRATED YET:
- annonces
- sans/tout atout
- (sur)coinche
*/
// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
