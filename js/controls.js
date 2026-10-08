// js/controls.js
// ============================================================
// ChessBox — UI event wiring
// Every button, select, input, dropdown, and the triple-tap
// corner gesture that toggles the configuration panel.
// ============================================================

import { state } from './state.js';
import { LEVELS, BOARD_THEMES, ICONS, TAP_WINDOW_MS, TAP_ZONE_PX } from './config.js';
import { t } from './i18n.js';
import {
  applyBoardTheme,
  applyPieceSet,
  set3D,
  applyOrientation,
  setExpanded,
  handleResize
} from './board.js';
import {
  handleHint,
  handleSolution,
  handleReset,
  loadPuzzle,
  ratingToDifficulty,
  renderMoveHistory
} from './puzzle.js';
import {
  showBanner,
  showInfoToast,
  updateBoardPreview,
  updatePiecePreview,
  applyTranslations,
  levelIconSvg
} from './ui.js';
import { openModal, closeModal } from './modal.js';
import { loadStats, saveStats } from './storage.js';
import { soundClick } from './audio.js';

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

/* ============================================================
   SEARCH
   Reads theme select, search input, rating input, and level.
   Rating overrides the level when present.
   ============================================================ */
export function handleSearch() {
  const selected   = $('sel-theme').value;
  const text       = $('inp-search').value.trim().toLowerCase();
  const theme      = selected || text;
  const ratingStr  = $('inp-rating').value.trim();
  const difficulty = ratingStr
    ? ratingToDifficulty(ratingStr)
    : state.selectedLevel;
  loadPuzzle(theme, difficulty);
}

/* ============================================================
   LEVEL DROPDOWN
   ============================================================ */
export function buildLevelMenu() {
  const menu = $('level-menu');
  if (!menu) return;
  menu.innerHTML = '';

  LEVELS.forEach((lvl) => {
    const displayName = lvl.i18n ? t(lvl.i18n) : lvl.name;
    const opt = document.createElement('div');
    opt.className = 'option' + (lvl.id === '' ? ' selected' : '');
    opt.dataset.value = lvl.id;
    opt.innerHTML = levelIconSvg(lvl.bars) +
      '<span class="level-name">' + displayName + '</span>' +
      '<span class="level-range">(' + lvl.note + ') ' + lvl.range + '</span>';
    opt.addEventListener('click', () => selectLevel(lvl));
    menu.appendChild(opt);
  });

  /* Ensure trigger shows the current selection (or "Any level") */
  if (!state.selectedLevel) {
    const any = LEVELS[0];
    const icon = $('level-trigger-icon');
    const name = $('level-trigger-name');
    const rng  = $('level-trigger-range');
    if (icon) icon.innerHTML = levelIconSvg(any.bars);
    if (name) name.textContent = t('any_level');
    if (rng)  rng.textContent  = '(' + any.note + ') ' + any.range;
  }
}

function selectLevel(lvl) {
  state.selectedLevel = lvl.id;
  const icon = $('level-trigger-icon');
  const name = $('level-trigger-name');
  const rng  = $('level-trigger-range');
  if (icon) icon.innerHTML = levelIconSvg(lvl.bars);
  if (name) name.textContent = lvl.i18n ? t(lvl.i18n) : lvl.name;
  if (rng)  rng.textContent  = '(' + lvl.note + ') ' + lvl.range;

  document.querySelectorAll('#level-menu .option').forEach((o) => {
    o.classList.toggle('selected', o.dataset.value === lvl.id);
  });
  const dd = $('level-dropdown');
  if (dd) dd.classList.remove('open');
  const ratingInput = $('inp-rating');
  if (ratingInput) ratingInput.value = '';
  handleSearch();
}

/* ============================================================
   CUSTOM BOARD COLORS
   ============================================================ */
function applyCustomColors() {
  const l = $('inp-custom-light').value;
  const d = $('inp-custom-dark').value;
  document.documentElement.style.setProperty('--board-light', l);
  document.documentElement.style.setProperty('--board-dark', d);
  state.currentBoardColor = 'custom';
  const lh = $('inp-custom-light-hex');
  const dh = $('inp-custom-dark-hex');
  if (lh) lh.value = l;
  if (dh) dh.value = d;
  updateBoardPreview();
  set3D(false);
}

/* ============================================================
   STATS MODAL
   ============================================================ */
export function showStats() {
  const s = loadStats();
  const body =
    '<div class="info-row"><span class="k">' + t('stats_solved')      + '</span><span class="v">' + s.solved     + '</span></div>' +
    '<div class="info-row"><span class="k">' + t('stats_streak')      + '</span><span class="v">' + s.streak     + '</span></div>' +
    '<div class="info-row"><span class="k">' + t('stats_best_streak') + '</span><span class="v">' + s.bestStreak + '</span></div>' +
    '<div class="info-row"><span class="k">' + t('stats_attempts')    + '</span><span class="v">' + s.attempts   + '</span></div>' +
    '<div class="info-row"><span class="k">' + t('stats_time')        + '</span><span class="v">' + Math.round(s.timePlayed / 60) + ' min</span></div>';

  openModal({
    title: t('stats_title'),
    body: body,
    confirmText: t('stats_reset'),
    cancelText: 'Close'
  }).then((ok) => {
    if (ok) {
      saveStats({ solved: 0, streak: 0, bestStreak: 0, attempts: 0, timePlayed: 0 });
      showBanner(ICONS.ok, 'Stats reset', 'ok', 1500);
    }
  });
}

/* ============================================================
   EXPORT — PGN
   ============================================================ */
function exportPGN() {
  if (!state.game) {
    openModal({ title: t('pgn_title'), body: '<code>(empty)</code>' });
    return;
  }
  const pgn = state.game.pgn({ maxWidth: 60, newline: '\n' });
  const safe = pgn ? pgn.replace(/</g, '&lt;') : '(empty)';

  openModal({
    title: t('pgn_title'),
    body: '<pre style="white-space:pre-wrap;word-break:break-all;">' + safe + '</pre>',
    confirmText: 'Copy',
    cancelText: 'Close'
  }).then((ok) => {
    if (ok) {
      navigator.clipboard.writeText(pgn || '')
        .then(() => showBanner(ICONS.ok, t('copied'), 'ok', 1500));
    }
  });
}

/* ============================================================
   EXPORT — FEN
   ============================================================ */
function exportFEN() {
  if (!state.game) {
    openModal({ title: t('fen_title'), body: '<code>(empty)</code>' });
    return;
  }
  const fen = state.game.fen();

  openModal({
    title: t('fen_title'),
    body: '<code>' + fen + '</code>',
    confirmText: 'Copy',
    cancelText: 'Close'
  }).then((ok) => {
    if (ok) {
      navigator.clipboard.writeText(fen)
        .then(() => showBanner(ICONS.ok, t('copied'), 'ok', 1500));
    }
  });
}

/* ============================================================
   TRIPLE-TAP CORNER GESTURE
   Three taps within TAP_WINDOW_MS inside any corner zone
   toggles the configuration panel.
   ============================================================ */
function wireTripleTap() {
  const widget = $('puzzle-widget');
  if (!widget) return;

  let tapTimes = [];

  widget.addEventListener('click', (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (['piece', 'square', 'cg-board', 'coords', 'coord'].includes(tag)) return;

    const rect = widget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = Date.now();

    const inTL = x < TAP_ZONE_PX            && y < TAP_ZONE_PX;
    const inTR = x > rect.width - TAP_ZONE_PX && y < TAP_ZONE_PX;
    const inBL = x < TAP_ZONE_PX            && y > rect.height - TAP_ZONE_PX;
    const inBR = x > rect.width - TAP_ZONE_PX && y > rect.height - TAP_ZONE_PX;

    if (inTL || inTR || inBL || inBR) {
      tapTimes = tapTimes.filter((ts) => now - ts < TAP_WINDOW_MS);
      tapTimes.push(now);
      if (tapTimes.length >= 3) {
        tapTimes = [];
        const panel = $('puzzle-selector');
        if (panel) panel.classList.toggle('open');
        showBanner(ICONS.info, t('panel_shown'), 'info', 1200);
        soundClick();
      }
    } else {
      tapTimes = [];
    }
  });
}

/* ============================================================
   WIRE ALL CONTROLS
   Called once from main.js after the DOM is ready.
   ============================================================ */
export function wireControls() {

  /* ---------- Primary buttons ---------- */
  const bind = (id, fn) => {
    const el = $(id);
    if (el) el.addEventListener('click', fn);
  };

  bind('btn-hint',     handleHint);
  bind('btn-solution', handleSolution);
  bind('btn-reset',    handleReset);
  bind('btn-next',     handleSearch);
  bind('btn-expand',   () => { setExpanded(!state.isExpanded); soundClick(); });
  bind('btn-history',  () => {
    renderMoveHistory();
    const el = $('move-history');
    if (el) el.classList.toggle('visible');
    soundClick();
  });
  bind('btn-lupa',     (e) => { e.stopPropagation(); showInfoToast(); });
  bind('btn-search',   handleSearch);
  bind('btn-export-pgn', exportPGN);
  bind('btn-export-fen', exportFEN);

  /* ---------- Selects ---------- */
  const theme = $('sel-theme');
  if (theme) theme.addEventListener('change', handleSearch);

  const pieceSet = $('sel-piece-set');
  if (pieceSet) {
    pieceSet.addEventListener('change', (e) => {
      applyPieceSet(e.target.value);
      updatePiecePreview(e.target.value);
      set3D(e.target.value.startsWith('3d-'));
    });
  }

  const boardColor = $('sel-board-color');
  if (boardColor) {
    boardColor.addEventListener('change', (e) => {
      if (e.target.value === 'custom') {
        const cc = $('custom-colors');
        if (cc) cc.style.display = 'flex';
        applyCustomColors();
      } else {
        const cc = $('custom-colors');
        if (cc) cc.style.display = 'none';
        applyBoardTheme(e.target.value);
      }
    });
  }

  const widgetBg = $('sel-widget-bg');
  if (widgetBg) {
    widgetBg.addEventListener('change', (e) => {
      const v = e.target.value;
      if (v === 'transparent') {
        document.documentElement.style.setProperty('--widget-bg', 'transparent');
      } else if (v === 'black') {
        document.documentElement.style.setProperty('--widget-bg', '#000000');
      } else if (v === 'white') {
        document.documentElement.style.setProperty('--widget-bg', '#ffffff');
      } else if (v === 'custom') {
        const colorInput = $('inp-bg-color');
        if (colorInput) {
          document.documentElement.style.setProperty('--widget-bg', colorInput.value);
        }
      }
    });
  }

  const bgColor = $('inp-bg-color');
  if (bgColor) {
    bgColor.addEventListener('input', (e) => {
      const sel = $('sel-widget-bg');
      if (sel && sel.value === 'custom') {
        document.documentElement.style.setProperty('--widget-bg', e.target.value);
      }
    });
  }

  const orientation = $('sel-orientation');
  if (orientation) {
    orientation.addEventListener('change', (e) => {
      state.boardOrientation = e.target.value;
      applyOrientation();
    });
  }

  /* ---------- Custom board colors ---------- */
  const cl = $('inp-custom-light');
  const cd = $('inp-custom-dark');
  if (cl) cl.addEventListener('input', applyCustomColors);
  if (cd) cd.addEventListener('input', applyCustomColors);

  const clh = $('inp-custom-light-hex');
  if (clh) {
    clh.addEventListener('input', (e) => {
      if (isHex(e.target.value)) {
        const clEl = $('inp-custom-light');
        if (clEl) clEl.value = normHex(e.target.value);
        applyCustomColors();
      }
    });
  }
  const cdh = $('inp-custom-dark-hex');
  if (cdh) {
    cdh.addEventListener('input', (e) => {
      if (isHex(e.target.value)) {
        const cdEl = $('inp-custom-dark');
        if (cdEl) cdEl.value = normHex(e.target.value);
        applyCustomColors();
      }
    });
  }

  /* ---------- Search + rating inputs ---------- */
  const searchInput = $('inp-search');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }
  const ratingInput = $('inp-rating');
  if (ratingInput) {
    ratingInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }

  /* ---------- Level dropdown ---------- */
  const trigger = $('level-trigger');
  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const dd = $('level-dropdown');
      if (dd) dd.classList.toggle('open');
    });
  }
  document.addEventListener('click', () => {
    const dd = $('level-dropdown');
    if (dd) dd.classList.remove('open');
  });
  const levelMenu = $('level-menu');
  if (levelMenu) {
    levelMenu.addEventListener('click', (e) => e.stopPropagation());
  }

  /* ---------- Triple-tap corner gesture ---------- */
  wireTripleTap();

  /* ---------- Modal backdrop ---------- */
  const overlay = $('cb-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }
}
