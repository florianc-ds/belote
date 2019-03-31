export const PLAY_MODE = 'play';
export const AUCTION_MODE = 'auction';

export const COLOR_TO_SYMBOL = {
  s: '\u2660',
  c: '\u2663',
  h: '\u2665',
  d: '\u2666'
};

export const NEXT_PLAYER = {
  west: 'south',
  south: 'east',
  east: 'north',
  north: 'west'
};

export const PARTNER = {
  west: 'east',
  south: 'north',
  east: 'west',
  north: 'south'
};

export const PLAYING_CARDS = [
  '7h',
  '8h',
  '9h',
  '10h',
  'Jh',
  'Qh',
  'Kh',
  'Ah',
  '7s',
  '8s',
  '9s',
  '10s',
  'Js',
  'Qs',
  'Ks',
  'As',
  '7d',
  '8d',
  '9d',
  '10d',
  'Jd',
  'Qd',
  'Kd',
  'Ad',
  '7c',
  '8c',
  '9c',
  '10c',
  'Jc',
  'Qc',
  'Kc',
  'Ac'
];

export const COLOR_DISPLAY_ORDER = ['h', 's', 'd', 'c'];

export const TRUMP_POINTS = {
  J: 20,
  '9': 14,
  A: 11,
  '10': 10,
  K: 4,
  Q: 3,
  '8': 0,
  '7': 0
};

export const PLAIN_POINTS = {
  A: 11,
  '10': 10,
  K: 4,
  Q: 3,
  J: 2,
  '9': 0,
  '8': 0,
  '7': 0
};

export const TRUMP_RANKING = {
  J: 7,
  '9': 6,
  A: 5,
  '10': 4,
  K: 3,
  Q: 2,
  '8': 1,
  '7': 0
};

export const PLAIN_RANKING = {
  A: 7,
  '10': 6,
  K: 5,
  Q: 4,
  J: 3,
  '9': 2,
  '8': 1,
  '7': 0
};

export const END_ROUND_TIMEOUT = 1500;
export const AUTOPLAY_TIMEOUT = 1000;
