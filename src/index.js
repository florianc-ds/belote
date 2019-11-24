import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import './index.css';
import { Game } from './Game';
import { Welcome } from './Welcome';

/* _--_
 //    \\
|| TODO ||
 \\.__.//
 */

/*
1) AUTOMATE AUCTION
  a) use a new method placeBidAutomaticallyOrPass
  b) define adapted strategies with flask
  c) plug both of them
2) EXPERT AGENT
  a) implement expert play strategy (https://www.draw.io/?state=%7B%22ids%22:%5B%221jWwhTPWHRz6CE27vxq1PgiaGvBKqs8Aw%22%5D,%22action%22:%22open%22,%22userId%22:%22112040441941885221837%22%7D#G1jWwhTPWHRz6CE27vxq1PgiaGvBKqs8Aw)
  b) define an auction strategy
  c) implement expert bet strategy in flask
3) CREATE BELOTE DATASETS
  -> export gameHistory at each game end 
4) TRAIN REINFORCEMENT AGENT
5) DEFINE 3 DIFFERENT MODES FOR CARDS RENDERING (add 'mode' to props of card, filled by parent (Hand or RoundCards) + update Card.render):
  -> hidden = hand of waiting players (all black)
  -> played = round cards (visible but no green/red margin on hovering)
  -> hidden = hand of playing player (current behaviour)
6) REPLACE CURRENT CARDS WITH {'\u{1F0C2}'}, ... (cf https://en.wikipedia.org/wiki/Playing_cards_in_Unicode)
7) DYNAMIC EFFECTS

REMINDER:
USE CONSTANTS:
- TEAMS instead of 'east/west' & 'north/south'
SOME FEATURE ARE NOT INTEGRATED YET:
- annonces
- sans/tout atout
- (sur)coinche
BUG:
During Auction mode, upgrade is broken (displayed bet is not the one taken into account)
During Auction mode, when playing automatically, no value nor color is kept displayed for players that have placed a bid
*/
// ========================================

const routing = (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route path="/game" component={Game} />
        <Route component={() => <h1>404 Not found</h1>} />
      </Switch>
    </div>
  </Router>
);
ReactDOM.render(routing, document.getElementById('root'));
