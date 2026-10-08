// js/puzzle.js
// ============================================================
// ChessBox — puzzle logic
// Fetches puzzles from the Lichess API, parses them, validates
// moves, drives the hint/solution/reset flow, and renders the
// move history.
// ============================================================

import { Chess } from 'https://esm.sh/chess.js@1.4.0';
import { state } from './state.js';
import { ICONS, API_BASE, TOAST_DURATION_MS } from './config.js';
import { t } from './i18n.js';
import { showBanner } from './ui.js';
import {
  initBoard,
  updateMovableFromChess,
  syncBoardWithChess,
  lockBoard,
  applyOrientation,
  applyPieceSet
} from './board.js';
import { soundMove, soundCapture, soundCheck, soundSuccess, soundError } from './audio.js';
import { recordSolved, recordAttempt } from './storage.js';
import { openModal } from './modal.js';

const $ = (id) => document.getElementById(id);

/* ============================================================
   UTILITIES
   ============================================================ */

/** Converts a UCI move (e.g. "e2e4") to Standard Algebraic Notation. */
export function uciToSan(uci) {
  const from = uci.slice(0, 2);
  const to   = uci.slice(2, 4);
  const tmp  = new Chess(state.game.fen());
  const move = tmp.move({ from, to, promotion: uci[4] || 'q' });
  return move ? move.san : (from + to).toUpperCase();
}

/** Maps a user-entered rating to the Lichess "difficulty" parameter. */
export function ratingToDifficulty(str) {
  if (!str) return '';
  let r = parseInt(str.replace(/\D/g, ''), 10);
  if (isNaN(r) || r <= 0) return '';
  if (r < 100) r = r * 100;
  if (r >= 2100) return 'hardest';
  if (r >= 1800) return 'harder';
  if (r >= 1200) return 'normal';
  if (r >= 900)  return 'easier';
  return 'easiest';
}

/** Renders the current move list into the #move-history panel. */
export function renderMoveHistory() {
  const el = $('move-history');
  if (!el) return;

  if (!state.game) {
    el.innerHTML = '<div style="color:#888">' + t('history_empty') + '</div>';
    return;
  }

  const hist = state.game.history({ verbose: true });
  if (!hist.length) {
    el.innerHTML = '<div style="color:#888">' + t('history_empty') + '</div>';
    return;
  }

  let html = '';
  for (let i = 0; i < hist.length; i += 2) {
    const w = hist[i]     ? hist[i].san     : '';
    const b = hist[i + 1] ? hist[i + 1].san : '';
    html += '<div class="mh-row">' +
            '<span class="mh-num">' + (i / 2 + 1) + '.</span>' +
            '<span class="mh-white">' + w + '</span>' +
            '<span class="mh-black">' + b + '</span>' +
            '</div>';
  }
  el.innerHTML = html;
}

/* ============================================================
   PARSE PUZZLE
   Takes the JSON response from the Lichess API and sets up the
   full game state.
   ============================================================ */
export function parsePuzzle(data) {
  state.currentTheme = (data.puzzle?.themes || []).join(' · ') || 'Puzzle';
  const themeEl = $('puzzle-theme');
  if (themeEl) themeEl.textContent = state.currentTheme;

  state.puzzleRating = data.puzzle?.rating || null;
  state.puzzlePerf   = data.game?.perf?.name || '';
  state.puzzleClock  = data.game?.clock || '';
  state.puzzleRated  = data.game?.rated || false;

  state.puzzlePgn = data.game.pgn;
  state.game = new Chess();
  state.game.loadPgn(state.puzzlePgn);

  const fenBefore = state.game.fen();
  state.solution  = data.puzzle.solution || [];

  /* Determine the user's color from whose turn it is in the PGN */
  const turn = state.game.turn();
  state.userColor = turn === 'w' ? 'black' : 'white';
  state.moveIndex = 0;

  /* Initialize the board with the pre-first-move position */
  initBoard(fenBefore, (orig, dest) => handleUserMove(orig, dest));
  applyOrientation();
  applyPieceSet(state.currentPieceSet);

  /* Play the opponent's first move automatically */
  playOpponentMove();
  renderMoveHistory();
}

/* ============================================================
   OPPONENT MOVE
   Plays the next move in the solution that belongs to the
   opponent (i.e. not the user's color).
   ============================================================ */
export function playOpponentMove() {
  if (!state.game || state.moveIndex >= state.solution.length) return;

  const uci  = state.solution[state.moveIndex];
  const from = uci.slice(0, 2);
  const to   = uci.slice(2, 4);
  const isCapture = state.game.get(to) !== null;

  state.game.move({ from, to, promotion: uci[4] || 'q' });
  syncBoardWithChess(state.game, { lastMove: [from, to] });

  if (isCapture) soundCapture(); else soundMove();

  state.moveIndex++;
  updateMovableFromChess(state.game);
  renderMoveHistory();

  if (state.moveIndex >= state.solution.length) {
    showBanner(ICONS.ok, t('puzzle_solved'), 'ok', TOAST_DURATION_MS);
    lockBoard();
    soundSuccess();
  }
}

/* ============================================================
   USER MOVE
   Validates the move against chess.js, checks it against the
   solution, and advances the game accordingly.
   ============================================================ */
export function handleUserMove(orig, dest) {
  if (!state.game || !state.cg) return;

  const turn = state.game.turn() === 'w' ? 'white' : 'black';
  if (turn !== state.userColor) return;

  /* Validate against legal moves */
  const legal = state.game.moves({ verbose: true });
  const move  = legal.find((m) => m.from === orig && m.to === dest);

  if (!move) {
    let reason = t('illegal');
    const piece = state.game.get(orig);
    if (!piece) reason = t('no_piece');
    else if (piece.color !== state.game.turn()) reason = t('not_your_turn');
    else if (state.game.inCheck()) reason = t('you_in_check');
    else {
      const target = state.game.get(dest);
      if (target && target.color === piece.color) reason = t('cannot_capture_own');
      else reason = t('cannot_move_there');
    }
    showBanner(ICONS.error, reason, 'error', 2500);
    soundError();
    return;
  }

  const san = move.san || (orig + dest).toUpperCase();
  const wasCapture = state.game.get(dest) !== null;

  state.game.move({ from: orig, to: dest, promotion: 'q' });
  if (wasCapture) soundCapture(); else soundMove();
  if (state.game.inCheck()) soundCheck();

  syncBoardWithChess(state.game, { lastMove: [orig, dest] });
  renderMoveHistory();

  const expected  = state.solution[state.moveIndex];
  const expFrom   = expected.slice(0, 2);
  const expTo     = expected.slice(2, 4);

  if (orig === expFrom && dest === expTo) {
    /* Correct move */
    showBanner(ICONS.ok, t('correct') + san, 'ok', 1500);
    state.moveIndex++;

    if (state.moveIndex < state.solution.length) {
      setTimeout(() => playOpponentMove(), 400);
    } else {
      showBanner(ICONS.ok, t('puzzle_solved'), 'ok', TOAST_DURATION_MS);
      lockBoard();
      soundSuccess();
      recordSolved();
    }
  } else {
    /* Wrong move: revert */
    showBanner(ICONS.error, t('incorrect') + san + t('is_not_solution'), 'error', 2500);
    soundError();
    recordAttempt();
    state.game.undo();
    syncBoardWithChess(state.game, { lastMove: [expFrom, expTo] });
    renderMoveHistory();
  }
}

/* ============================================================
   HINT
   Animates the next solution move on the board for 600 ms and
   shows the SAN in the banner.
   ============================================================ */
export function handleHint() {
  if (!state.game || state.moveIndex >= state.solution.length) {
    showBanner(ICONS.info, t('no_more_hints'), 'info', 2000);
    return;
  }

  const uci  = state.solution[state.moveIndex];
  const from = uci.slice(0, 2);
  const to   = uci.slice(2, 4);
  const san  = uciToSan(uci);

  /* Highlight origin square */
  document.querySelectorAll('.hint-origin').forEach((el) => el.classList.remove('hint-origin'));
  const fromSquare = document.querySelector(
    '.cg-wrap square[data-square="' + from + '"]'
  );
  if (fromSquare) fromSquare.classList.add('hint-origin');

  /* Animate the move */
  if (state.cg) {
    const tmp = new Chess(state.game.fen());
    tmp.move({ from, to, promotion: uci[4] || 'q' });
    state.cg.set({ fen: tmp.fen(), lastMove: [from, to] });

    setTimeout(() => {
      state.cg.set({
        fen: state.game.fen(),
        turnColor: state.game.turn() === 'w' ? 'white' : 'black'
      });
    }, 600);
  }

  showBanner(
    ICONS.hint,
    t('move_from') + san + ' (' + from.toUpperCase() + ' → ' + to.toUpperCase() + ')',
    'info',
    4000
  );
}

/* ============================================================
   SOLUTION
   Shows the full remaining sequence in a modal, then replays it
   on the board move by move.
   ============================================================ */
export function handleSolution() {
  if (!state.solution.length) return;

  const remaining = state.solution.slice(state.moveIndex);
  if (!remaining.length) {
    showBanner(ICONS.ok, t('already_solved'), 'ok', 2000);
    return;
  }

  /* Convert all remaining moves to SAN */
  const sanMoves = [];
  const tmpGame  = new Chess(state.game.fen());
  for (const uci of remaining) {
    const from = uci.slice(0, 2);
    const to   = uci.slice(2, 4);
    const mv   = tmpGame.move({ from, to, promotion: uci[4] || 'q' });
    sanMoves.push(mv ? mv.san : (from + to).toUpperCase());
  }

  /* Render the modal */
  const chips = sanMoves.map((s, i) =>
    '<span style="background:rgba(255,255,255,0.12);padding:3px 8px;' +
    'border-radius:4px;font-family:monospace;color:#7ec8e3;margin:2px;">' +
    (i + 1) + '. ' + s + '</span>'
  ).join('');

  openModal({
    title: t('solution_title') + sanMoves.length + t('moves'),
    body: '<div style="display:flex;flex-wrap:wrap;gap:6px;">' + chips + '</div>',
    showCancel: false,
    confirmText: 'OK'
  });

  /* Replay the sequence on the board */
  let i = 0;
  const playNext = () => {
    if (i >= remaining.length) return;
    const uci  = remaining[i];
    const from = uci.slice(0, 2);
    const to   = uci.slice(2, 4);

    const tmp = new Chess(state.game.fen());
    for (let j = 0; j <= i; j++) {
      const u = remaining[j];
      tmp.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] || 'q' });
    }

    state.cg.set({
      fen: tmp.fen(),
      lastMove: [from, to],
      turnColor: tmp.turn() === 'w' ? 'white' : 'black'
    });

    i++;
    if (i < remaining.length) {
      setTimeout(playNext, 800);
    } else {
      setTimeout(() => {
        state.cg.set({
          fen: state.game.fen(),
          turnColor: state.game.turn() === 'w' ? 'white' : 'black'
        });
      }, 800);
    }
  };
  setTimeout(playNext, 300);
}

/* ============================================================
   RESET
   Restores the puzzle to its starting position.
   ============================================================ */
export function handleReset() {
  if (!state.solution.length || !state.puzzlePgn) return;

  state.moveIndex = 0;
  document.querySelectorAll('.hint-origin').forEach((el) => el.classList.remove('hint-origin'));
  const msg = $('puzzle-message');
  if (msg) msg.classList.remove('visible');

  state.game = new Chess();
  state.game.loadPgn(state.puzzlePgn);

  initBoard(state.game.fen(), (orig, dest) => handleUserMove(orig, dest));
  applyOrientation();
  applyPieceSet(state.currentPieceSet);
  playOpponentMove();
  renderMoveHistory();

  showBanner(ICONS.info, t('puzzle_reset'), 'info', 1500);
}

/* ============================================================
   LOAD PUZZLE
   Fetches a puzzle from the Lichess API. When `theme` or
   `difficulty` are provided, they are forwarded as query params.
   ============================================================ */
export async function loadPuzzle(theme = '', difficulty = '') {
  const themeEl = $('puzzle-theme');
  if (themeEl) themeEl.textContent = t('loading');
  showBanner(ICONS.info, t('loading_puzzle'), 'info', 1500);

  try {
    const url = new URL(API_BASE);
    if (theme)       url.searchParams.set('angle', theme);
    if (difficulty)  url.searchParams.set('difficulty', difficulty);

    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const data = await res.json();
    parsePuzzle(data);

    showBanner(ICONS.ok, t('puzzle_loaded') + state.currentTheme, 'ok', 2000);
  } catch (err) {
    console.error('Failed to fetch puzzle:', err);
    if (themeEl) themeEl.textContent = 'Error';
    showBanner(ICONS.error, t('could_not_load') + err.message, 'error', 4000);
  }
}
