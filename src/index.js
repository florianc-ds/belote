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
1) DEFINE 3 DIFFERENT MODES FOR CARDS RENDERING (add 'mode' to props of card, filled by parent (Hand or RoundCards) + update Card.render):
  -> hidden = hand of waiting players (all black)
  -> played = round cards (visible but no green/red margin on hovering)
  -> hidden = hand of playing player (current behaviour)
2) FEATURE: ADD SCORE
  a) add endGame method in Game that triggers a count method based on GameHistory (don't forget belote ;) )
  b) display score at the end
3) FEATURE: ADD AUCTION PROCESS
  -) auction = trump color + bet
  -) can only place auction if higher than previous
  -) use up/down counter button for auctions
  -) auction ends when 4 pass
4) FEATURE: KEEP CARDS STATE WHEN REFRESHING PAGE (REDUX..?)
5) REPLACE CURRENT CARDS WITH {'\u{1F0C2}'}, ... (cf https://en.wikipedia.org/wiki/Playing_cards_in_Unicode)
6) FEATURE: AI AGENT: (web services..?)
  a) random
  b) "always play highest possible"
  c) expert
  d) reinforcement learning
7) DYNAMIC EFFECTS
*/
// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
