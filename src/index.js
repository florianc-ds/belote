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
1) FEATURE: ADD AUCTION PROCESS 
  A) BUGS:
    -> prevent player from submitting if no color has been set
    -> fix first player defaultValue to be set as value even if passed...
    -> fix minimalBidValue bug (should be updated after another player placed a bid...)
  B) AUCTION STATE
    -> create new Component AuctionState to display current state of auction: current best bid (value + color) + corresponding player
    -> place in place of RoundCards during mode='auction'
2) DEFINE 3 DIFFERENT MODES FOR CARDS RENDERING (add 'mode' to props of card, filled by parent (Hand or RoundCards) + update Card.render):
  -> hidden = hand of waiting players (all black)
  -> played = round cards (visible but no green/red margin on hovering)
  -> hidden = hand of playing player (current behaviour)
3) FEATURE: KEEP CARDS STATE WHEN REFRESHING PAGE (REDUX..?)
4) REPLACE CURRENT CARDS WITH {'\u{1F0C2}'}, ... (cf https://en.wikipedia.org/wiki/Playing_cards_in_Unicode)
5) FEATURE: AI AGENT: (web services..?)
  a) random
  b) "always play highest possible"
  c) expert
  d) reinforcement learning
6) DYNAMIC EFFECTS
*/
// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
