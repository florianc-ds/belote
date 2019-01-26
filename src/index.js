import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Game } from './Game';

/*
 //====\\
|| TODO ||
 \\====//
 */

// WHAT ABOUT HIDDEN HANDS?
// MOVE ON HOVER
// KEEP CARDS STATE WHEN REFRESHING PAGE (REDUX..?)
// REPLACE CURRENT CARDS WITH {'\u{1F0C2}'}, ... (cf https://en.wikipedia.org/wiki/Playing_cards_in_Unicode)
// IMPROVE Game.checkPlayability with trump special rules

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
