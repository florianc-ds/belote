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
1) DISPLAY FEATURES:
  => always display global score => use a global score that does not reset at new game and a local score for each "game"
2) WHEN NOT PLAYER TURN, SET AN API CALL API FOR NEXT MOVE
3) FEATURE: AI AGENT: (web services..?)
  a) random
  b) "always play highest possible"
  c) expert
  d) reinforcement learning
4) DEFINE 3 DIFFERENT MODES FOR CARDS RENDERING (add 'mode' to props of card, filled by parent (Hand or RoundCards) + update Card.render):
  -> hidden = hand of waiting players (all black)
  -> played = round cards (visible but no green/red margin on hovering)
  -> hidden = hand of playing player (current behaviour)
5) REPLACE CURRENT CARDS WITH {'\u{1F0C2}'}, ... (cf https://en.wikipedia.org/wiki/Playing_cards_in_Unicode)
6) DYNAMIC EFFECTS
*/
// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
