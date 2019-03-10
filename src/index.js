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
1) FEATURE: KEEP CARDS STATE WHEN REFRESHING PAGE (REDUX..?)
2) DISPLAY FEATURES:
  a) display team that has current contract
  b) sort cards by point (either plain or trump)
  c) print winner at the end of game (points > contract)
  d) always display global score => use a global score that does not reset at new game
3) DEFINE 3 DIFFERENT MODES FOR CARDS RENDERING (add 'mode' to props of card, filled by parent (Hand or RoundCards) + update Card.render):
  -> hidden = hand of waiting players (all black)
  -> played = round cards (visible but no green/red margin on hovering)
  -> hidden = hand of playing player (current behaviour)
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
