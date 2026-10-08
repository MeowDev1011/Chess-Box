// assets/pieces_3d.js
// ============================================================
// ChessBox — 3D piece sets
// These sets reuse the underlying Lichess 2D SVGs and ChessBox
// applies a CSS perspective effect (rotateX + drop shadow) on
// top. The `3d-` prefix tells the widget to activate `.is3d`
// mode automatically when the set is selected.
//
// Used by js/config.js which merges this object with
// PIECE_SETS_2D from assets/pieces_2d.js.
// ============================================================

export const PIECE_SETS_3D = {
  '3d-staunty':  'https://lichess1.org/assets/piece/staunty/',
  '3d-cburnett': 'https://lichess1.org/assets/piece/cburnett/',
  '3d-merida':   'https://lichess1.org/assets/piece/merida/'
};

// The 3D sets use the exact same 12 piece codes as the 2D sets.
// Exposed for symmetry with pieces_2d.js and to make it easy to
// extend the 3D list later without duplicating the codes.
export const PIECE_CODES_3D = [
  'wP', 'wN', 'wB', 'wR', 'wQ', 'wK',
  'bP', 'bN', 'bB', 'bR', 'bQ', 'bK'
];
