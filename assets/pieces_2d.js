// assets/pieces_2d.js
// ============================================================
// ChessBox — 2D piece sets
// Flat, top-down chess piece sets from the official Lichess
// piece library. Each key maps to the base URL of the set.
// Piece files are named {color}{Piece}.svg under that base,
// e.g. horsey/wN.svg for the white knight.
//
// Used by js/config.js which merges this object with
// PIECE_SETS_3D from assets/pieces_3d.js.
// ============================================================

export const PIECE_SETS_2D = {
  horsey:      'https://lichess1.org/assets/piece/horsey/',
  cburnett:    'https://lichess1.org/assets/piece/cburnett/',
  merida:      'https://lichess1.org/assets/piece/merida/',
  alpha:       'https://lichess1.org/assets/piece/alpha/',
  chessnut:    'https://lichess1.org/assets/piece/chessnut/',
  fantasy:     'https://lichess1.org/assets/piece/fantasy/',
  spatial:     'https://lichess1.org/assets/piece/spatial/',
  staunty:     'https://lichess1.org/assets/piece/staunty/',
  pirouetti:   'https://lichess1.org/assets/piece/pirouetti/',
  chess7:      'https://lichess1.org/assets/piece/chess7/',
  reillycraig: 'https://lichess1.org/assets/piece/reillycraig/',
  companion:   'https://lichess1.org/assets/piece/companion/',
  riohacha:    'https://lichess1.org/assets/piece/riohacha/',
  kosal:       'https://lichess1.org/assets/piece/kosal/',
  leipzig:     'https://lichess1.org/assets/piece/leipzig/',
  celtic:      'https://lichess1.org/assets/piece/celtic/'
};

// Every 2D set uses the same 12 piece codes. This list is exposed
// so that other modules (like js/board.js) can build CSS selectors
// without hardcoding the piece list themselves.
export const PIECE_CODES_2D = [
  'wP', 'wN', 'wB', 'wR', 'wQ', 'wK',
  'bP', 'bN', 'bB', 'bR', 'bQ', 'bK'
];
