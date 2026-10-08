// js/main.js
// ============================================================
// ChessBox — entry point
// Loads URL params, wires keyboard shortcuts, starts the puzzle.
// ============================================================

import { state }         from './state.js';
import { BOARD_THEMES, PIECE_SETS, LEVELS } from './config.js';
import { setLang, t, TRANSLATIONS, detectLang } from './i18n.js';
import {
  applyBoardTheme,
  applyPieceSet,
  set3D,
  setExpanded,
  handleResize,
  initBoard
} from './board.js';
import { loadPuzzle, ratingToDifficulty } from './puzzle.js';
import {
  applyTranslations,
  updatePiecePreview,
  updateBoardPreview,
  levelIconSvg,
  buildPieceSetOptions
} from './ui.js';
import { wireControls, buildLevelMenu } from './controls.js';
import { closeModal } from './modal.js';

const $ = (id) => document.getElementById(id);

/* ============================================================
   HELPERS
   ============================================================ */
function isHex(s) {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s);
}

function normHex(s) {
  if (!s) return null;
  let x = s.replace('#', '');
  if (x.length === 3) x = x.split('').map(c => c + c).join('');
  return '#' + x;
}

function getUrlParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    board:       p.get('board'),
    pieces:      p.get('pieces'),
    difficulty:  p.get('difficulty'),
    font:        p.get('font'),
    bg:          p.get('bg'),
    customlight: p.get('customlight'),
    customdark:  p.get('customdark'),
    lang:        p.get('lang'),
    size:        p.get('size'),
    config:      p.get('config')
  };
}

/* ============================================================
   APPLY URL PARAMETERS
   Every parameter is optional. Missing ones fall back to
   sensible defaults. Unknown values are ignored silently.
   ============================================================ */
function applyUrlParams() {
  const p = getUrlParams();

  /* Language: explicit ?lang= wins, otherwise auto-detect from browser */
  if (p.lang && TRANSLATIONS[p.lang]) {
    setLang(p.lang);
  } else {
    setLang(detectLang());
  }

  /* Board theme */
  if (p.board) {
    if (p.board === 'custom' && p.customlight && p.customdark) {
      const l = normHex(p.customlight);
      const d = normHex(p.customdark);
      if (l && d) {
        document.documentElement.style.setProperty('--board-light', l);
        document.documentElement.style.setProperty('--board-dark', d);
        state.currentBoardColor = 'custom';
        $('sel-board-color').value = 'custom';
        $('custom-colors').style.display = 'flex';
        $('inp-custom-light').value = l;
        $('inp-custom-light-hex').value = l;
        $('inp-custom-dark').value = d;
        $('inp-custom-dark-hex').value = d;
        updateBoardPreview();
        set3D(false);
      }
    } else if (BOARD_THEMES[p.board]) {
      applyBoardTheme(p.board);
      $('sel-board-color').value = p.board;
    }
  }

  /* Piece set */
  if (p.pieces && PIECE_SETS[p.pieces]) {
    applyPieceSet(p.pieces);
    $('sel-piece-set').value = p.pieces;
    updatePiecePreview(p.pieces);
    set3D(p.pieces.startsWith('3d-'));
  }

  /* Difficulty level */
  if (p.difficulty) {
    const lvl = LEVELS.find(l => l.id === p.difficulty);
    if (lvl) {
      state.selectedLevel = lvl.id;
      $('level-trigger-icon').innerHTML = levelIconSvg(lvl.bars);
      $('level-trigger-name').textContent = lvl.i18n ? t(lvl.i18n) : lvl.name;
      $('level-trigger-range').textContent = '(' + lvl.note + ') ' + lvl.range;
    }
  }

  /* Coordinate font size */
  if (p.font) {
    const sizes = { small: '9px', normal: '11px', large: '14px' };
    if (sizes[p.font]) {
      document.documentElement.style.setProperty('--coord-size', sizes[p.font]);
    }
  }

  /* Widget background — only controllable via URL parameter */
  if (p.bg) {
    if (p.bg === 'transparent') {
      document.documentElement.style.setProperty('--widget-bg', 'transparent');
    } else if (p.bg === 'black') {
      document.documentElement.style.setProperty('--widget-bg', '#000000');
    } else if (p.bg === 'white') {
      document.documentElement.style.setProperty('--widget-bg', '#ffffff');
    } else if (isHex(p.bg)) {
      const hex = normHex(p.bg);
      document.documentElement.style.setProperty('--widget-bg', hex);
    }
  }

  /* Board size: expanded or normal */
  if (p.size === 'expanded') {
    setExpanded(true);
  }

  /* Config visibility: none hides the panel entirely */
  if (p.config === 'none') {
    state.configVisible = false;
    $('puzzle-selector').style.display = 'none';
  } else {
    $('puzzle-selector').classList.add('open');
  }

  return p;
}

/* ============================================================
   KEYBOARD SHORTCUTS
   Global shortcuts, ignored when typing in an input field.
   ============================================================ */
function wireKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    switch (e.key) {
      case 'h':
      case 'H':
        $('btn-hint').click();
        break;
      case 's':
      case 'S':
        $('btn-solution').click();
        break;
      case 'r':
      case 'R':
        $('btn-reset').click();
        break;
      case 'n':
      case 'N':
        $('btn-next').click();
        break;
      case 'e':
      case 'E':
        setExpanded(!state.isExpanded);
        break;
      case 'Escape':
        $('puzzle-selector').classList.remove('open');
        $('move-history').classList.remove('visible');
        closeModal();
        break;
    }
  });
}

/* ============================================================
   RESIZE HANDLING
   Debounced so the board only redraws once the resize settles.
   ============================================================ */
let resizeTimer = null;
function wireResize() {
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 150);
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 200);
  });
}

/* ============================================================
   FORCE BOARD REDRAW
   Sometimes Chessground needs a couple of redraws to detect
   the container size (especially the first paint after the
   CSS transition finishes). This fires a few redraws.
   ============================================================ */
function forceRedraws() {
  [50, 200, 600, 1200].forEach((delay) => {
    setTimeout(() => {
      if (state.cg) state.cg.redrawAll();
    }, delay);
  });
}

/* ============================================================
   BOOT
   ============================================================ */
function boot() {
  /* 1. Defaults: brown board (classic white/brown), cburnett pieces,
        white background */
  document.documentElement.style.setProperty('--widget-bg', '#ffffff');
  applyBoardTheme('brown');
  applyPieceSet('cburnett');
  updatePiecePreview('cburnett');
  updateBoardPreview();

  /* 2. Populate dynamic selects (piece sets, level menu) */
  buildPieceSetOptions();
  buildLevelMenu();

  /* 3. Wire every UI event listener */
  wireControls();
  wireKeyboardShortcuts();
  wireResize();

  /* 4. Read URL parameters and override defaults */
  const urlParams = applyUrlParams();

  /* 5. Translate the interface */
  applyTranslations();

  /* 6. Show a board with the standard starting position IMMEDIATELY,
        before the puzzle is fetched. If the API is slow or fails,
        the user still sees a proper board with pieces. */
  initBoard(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    () => {} // no-op until the real puzzle arrives
  );

  /* 7. Force a few redraws so Chessground syncs with the container */
  forceRedraws();

  /* 8. Load the first puzzle */
  const initialDifficulty =
    urlParams.difficulty ||
    state.selectedLevel ||
    '';

  loadPuzzle('', initialDifficulty);
}

/* Wait for the DOM to be parsed before booting */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
