// js/board.js
// ============================================================
// ChessBox — Chessground wrapper
// Everything that touches the board itself: initialization,
// theme, piece set, orientation, 3D toggle, resize.
// ============================================================

import { Chessground } from 'https://esm.sh/@lichess-org/chessground@10.1.1';
import { state } from './state.js';
import { PIECE_SETS, BOARD_THEMES } from './config.js';
import { updateBoardPreview } from './ui.js';

const $ = (id) => document.getElementById(id);

/* ============================================================
   BOARD THEME
   Applies light/dark colors via CSS variables, updates the 2x2
   preview, and toggles 3D mode if the theme key starts with "3d-".
   ============================================================ */
export function applyBoardTheme(name) {
  if (name === 'custom') return;
  const th = BOARD_THEMES[name] || BOARD_THEMES.blue;
  document.documentElement.style.setProperty('--board-light', th.light);
  document.documentElement.style.setProperty('--board-dark',  th.dark);
  state.currentBoardColor = name;
  updateBoardPreview();
  set3D(name.startsWith('3d-'));
}

/* ============================================================
   PIECE SET
   Injects a <style> block that rewrites the `background-image`
   rule for every `piece.<type>.<color>` to point at the base URL
   of the selected set.
   ============================================================ */
export function applyPieceSet(setName) {
  const base = PIECE_SETS[setName] || PIECE_SETS.horsey;
  state.currentPieceSet = setName;

  const pieces = [
    { code: 'wP', classes: ['pawn', 'white'] },
    { code: 'wN', classes: ['knight', 'white'] },
    { code: 'wB', classes: ['bishop', 'white'] },
    { code: 'wR', classes: ['rook', 'white'] },
    { code: 'wQ', classes: ['queen', 'white'] },
    { code: 'wK', classes: ['king', 'white'] },
    { code: 'bP', classes: ['pawn', 'black'] },
    { code: 'bN', classes: ['knight', 'black'] },
    { code: 'bB', classes: ['bishop', 'black'] },
    { code: 'bR', classes: ['rook', 'black'] },
    { code: 'bQ', classes: ['queen', 'black'] },
    { code: 'bK', classes: ['king', 'black'] }
  ];

  let style = document.getElementById('piece-set-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'piece-set-style';
    document.head.appendChild(style);
  }

  let css = '';
  pieces.forEach((p) => {
    const cls = p.classes.map((c) => '.' + c).join('');
    css += '.puzzle-widget .cg-wrap piece' + cls +
           ' { background-image: url("' + base + p.code + '.svg") !important; }\n';
  });
  style.textContent = css;
}

/* ============================================================
   3D MODE
   Toggles the .is3d class on the widget root.
   ============================================================ */
export function set3D(enable) {
  state.is3D = !!enable;
  const w = $('puzzle-widget');
  if (w) w.classList.toggle('is3d', state.is3D);
}

/* ============================================================
   ORIENTATION
   Computes the board orientation from state and applies it to
   the Chessground instance.
   ============================================================ */
export function computeOrientation() {
  return state.boardOrientation === 'auto'
    ? state.userColor
    : state.boardOrientation;
}

export function applyOrientation() {
  if (state.cg) state.cg.set({ orientation: computeOrientation() });
}

/* ============================================================
   BOARD INITIALIZATION
   Creates (or recreates) the Chessground instance.
   `onMove` is the callback that fires after a user drag.
   ============================================================ */
export function initBoard(fen, onMove) {
  if (state.cg) state.cg.destroy();

  state.cg = Chessground($('board'), {
    fen: fen,
    orientation: computeOrientation(),
    turnColor: 'white',
    movable: {
      free: false,
      color: 'white',
      dests: new Map(),
      events: {
        after: (orig, dest) => onMove(orig, dest)
      }
    },
    draggable: {
      enabled: true,
      showGhost: true,
      distance: 0,
      autoDistance: false
    },
    selectable: { enabled: true },
    animation: { enabled: true, duration: 200 },
    highlight: { lastMove: true, check: true },
    premovable: { enabled: false },
    drawable: { enabled: false }
  });

  /* Re-apply the current piece set after the board is rebuilt */
  applyPieceSet(state.currentPieceSet);
}

/* ============================================================
   STATE SYNC
   Push game state (FEN, turn, last move) into Chessground.
   ============================================================ */
export function syncBoardWithChess(chess, opts = {}) {
  if (!state.cg) return;
  const turn = chess.turn() === 'w' ? 'white' : 'black';
  state.cg.set({
    fen: chess.fen(),
    turnColor: turn,
    lastMove: opts.lastMove || null
  });
}

/* ============================================================
   MOVABLE UPDATE
   Recomputes the legal destinations from chess.js and enables
   them in Chessground only when it's the user's turn.
   ============================================================ */
export function updateMovableFromChess(chess) {
  if (!state.cg) return;

  const turn = chess.turn() === 'w' ? 'white' : 'black';
  const dests = new Map();

  chess.moves({ verbose: true }).forEach((m) => {
    if (!dests.has(m.from)) dests.set(m.from, []);
    dests.get(m.from).push(m.to);
  });

  state.cg.set({
    turnColor: turn,
    movable: {
      color: turn === state.userColor ? state.userColor : undefined,
      dests: turn === state.userColor ? dests : new Map()
    }
  });
}

/* ============================================================
   LOCK / UNLOCK
   Disables movement (used when the puzzle is solved).
   ============================================================ */
export function lockBoard() {
  if (!state.cg) return;
  state.cg.set({ movable: { color: undefined, dests: new Map() } });
}

/* ============================================================
   EXPANDED MODE
   Toggles the .expanded class on the widget root and forces a
   redraw once the CSS transition settles.
   ============================================================ */
export function setExpanded(on) {
  state.isExpanded = !!on;
  const w = $('puzzle-widget');
  if (w) w.classList.toggle('expanded', state.isExpanded);
  const btn = $('btn-expand');
  if (btn) btn.classList.toggle('active', state.isExpanded);
  setTimeout(() => { if (state.cg) state.cg.redrawAll(); }, 350);
}

/* ============================================================
   RESIZE
   Called (debounced) from main.js when the window changes size.
   ============================================================ */
export function handleResize() {
  if (state.cg) state.cg.redrawAll();
}
