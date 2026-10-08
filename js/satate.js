// js/state.js
// ============================================================
// ChessBox — shared mutable state
// Every module imports the single `state` object from here.
// ============================================================

export const state = {
  /* ---------- Board & game ---------- */
  cg: null,                    // Chessground instance
  game: null,                  // chess.js instance
  solution: [],                // Array of UCI strings from the Lichess API
  moveIndex: 0,                // How many solution moves have been played
  userColor: 'white',          // Which side the user plays

  /* ---------- Puzzle metadata ---------- */
  currentTheme: '',            // Theme string shown in the floating label
  puzzlePgn: '',               // Original PGN of the current puzzle
  puzzleRating: null,          // Puzzle rating (from the API)
  puzzlePerf: '',              // Perf type, e.g. "Blitz"
  puzzleClock: '',             // Time control, e.g. "300+0"
  puzzleRated: false,          // Rated or casual

  /* ---------- Visual preferences ---------- */
  boardOrientation: 'auto',    // 'auto' | 'white' | 'black'
  currentBoardColor: 'blue',   // Key of BOARD_THEMES
  currentPieceSet: 'horsey',   // Key of PIECE_SETS
  selectedLevel: '',           // '' | 'easiest' | 'easier' | 'normal' | 'harder' | 'hardest'
  isExpanded: false,           // Board expanded state
  is3D: false,                 // 3D perspective mode

  /* ---------- Localization & UI ---------- */
  currentLang: 'en',           // Language code, auto-detected or from ?lang=
  configVisible: true          // Panel visibility (URL ?config=none hides it)
};
