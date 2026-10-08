// js/ui.js
// ============================================================
// ChessBox — UI helpers
// Banners, toasts, translations, previews, turn indicator.
// ============================================================

import { state } from './state.js';
import { t } from './i18n.js';
import { PIECE_SETS, BOARD_THEMES, ICONS, LEVELS } from './config.js';
import { soundClick } from './audio.js';

const $ = (id) => document.getElementById(id);

/* ============================================================
   BANNER
   Small toast at the top of the board. Types: ok, error, info.
   Auto-hides after `duration` ms.
   ============================================================ */
export function showBanner(iconSvg, text, type = 'info', duration = 2500) {
  const el = $('puzzle-banner');
  if (!el) return;
  el.innerHTML = iconSvg + '<span>' + text + '</span>';
  el.className = 'visible ' + type;
  clearTimeout(el._timer);
  if (duration > 0) {
    el._timer = setTimeout(() => { el.className = ''; }, duration);
  }
}

/* ============================================================
   INFO TOAST
   Shows a 3-second info card with the current setup.
   ============================================================ */
export function showInfoToast() {
  const el = $('info-toast');
  if (!el) return;

  const base = PIECE_SETS[state.currentPieceSet] || PIECE_SETS.horsey;
  const kingCode = state.userColor === 'white' ? 'wK' : 'bK';
  const kingSrc  = base + kingCode + '.svg';

  const orientLabel = state.boardOrientation === 'auto' ? 'Auto'
    : (state.boardOrientation === 'white' ? t('orient_white') : t('orient_black'));

  let html = '<img class="toast-piece" src="' + kingSrc + '" alt="" ' +
             'onerror="this.src=\'' + PIECE_SETS.horsey + kingCode + '.svg\'" />';
  html += '<div class="info-text">';
  html += '<div class="info-title">' + t('you_play') +
          (state.userColor === 'white' ? t('white') : t('black')) + '</div>';

  if (state.puzzleRating) {
    html += '<div class="info-row"><span class="k">' + t('rating_label') +
            '</span><span class="v rating">' + state.puzzleRating + '</span></div>';
  }
  if (state.puzzlePerf) {
    html += '<div class="info-row"><span class="k">' + t('game_type') +
            '</span><span class="v">' + state.puzzlePerf +
            (state.puzzleRated ? ' · rated' : ' · casual') + '</span></div>';
  }
  if (state.puzzleClock) {
    html += '<div class="info-row"><span class="k">' + t('time_label') +
            '</span><span class="v">' + state.puzzleClock + '</span></div>';
  }
  html += '<div class="info-row"><span class="k">' + t('theme_label') +
          '</span><span class="v">' + state.currentTheme + '</span></div>';
  html += '<div class="info-row"><span class="k">' + t('board_label') +
          '</span><span class="v">' +
          (BOARD_THEMES[state.currentBoardColor]?.label || 'Blue') +
          '</span></div>';
  html += '<div class="info-row"><span class="k">' + t('orient_label') +
          '</span><span class="v">' + orientLabel + '</span></div>';
  html += '</div>';

  el.innerHTML = html;
  el.classList.add('visible');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('visible'), 3000);
}

/* ============================================================
   TURN INDICATOR
   Shows the King sprite of the current piece set when it's the
   user's turn.
   ============================================================ */
export function updateTurnIndicator() {
  if (!state.game) return;
  const el   = $('turn-indicator');
  const img  = $('turn-piece');
  const text = $('turn-text');
  if (!el || !img || !text) return;

  const turn = state.game.turn() === 'w' ? 'white' : 'black';

  if (turn === state.userColor) {
    el.classList.add('visible');
    const base = PIECE_SETS[state.currentPieceSet] || PIECE_SETS.horsey;
    const code = turn === 'white' ? 'wK' : 'bK';
    img.src = base + code + '.svg';
    img.onerror = function () { this.src = PIECE_SETS.horsey + code + '.svg'; };
    text.textContent = t('your_turn') +
      (state.userColor === 'white' ? t('white') : t('black'));
  } else {
    el.classList.remove('visible');
  }
}

/* ============================================================
   BOARD PREVIEW
   2x2 checkerboard preview of the currently selected theme.
   ============================================================ */
export function updateBoardPreview() {
  const el = $('board-preview');
  if (!el) return;
  const light = getComputedStyle(document.documentElement)
    .getPropertyValue('--board-light').trim();
  const dark  = getComputedStyle(document.documentElement)
    .getPropertyValue('--board-dark').trim();
  el.innerHTML =
    '<div style="background:' + light + '"></div>' +
    '<div style="background:' + dark  + '"></div>' +
    '<div style="background:' + dark  + '"></div>' +
    '<div style="background:' + light + '"></div>';
}

/* ============================================================
   PIECE PREVIEW
   Shows the white knight of the current piece set.
   ============================================================ */
export function updatePiecePreview(setName) {
  const base = PIECE_SETS[setName] || PIECE_SETS.horsey;
  const img  = $('piece-preview-img');
  if (!img) return;
  img.src = base + 'wN.svg';
  img.onerror = function () { this.src = PIECE_SETS.horsey + 'wN.svg'; };
}

/* ============================================================
   LEVEL ICON SVG
   Five staggered bars, `level` of them filled.
   ============================================================ */
export function levelIconSvg(level) {
  let bars = '';
  for (let i = 0; i < 5; i++) {
    const x  = 1 + i * 4;
    const h  = 4 + i * 3;
    const y  = 20 - h;
    const on = i < level ? ' class="on"' : '';
    bars += '<rect x="' + x + '" y="' + y + '" width="3" height="' + h + '" rx="1"' + on + '/>';
  }
  return '<svg class="level-icon" viewBox="0 0 22 22">' + bars + '</svg>';
}

/* ============================================================
   APPLY TRANSLATIONS
   Walks every [data-i18n] and [data-i18n-title] element and
   replaces its text/title with the translated string.
   Also sets button tooltips and select placeholders.
   ============================================================ */
export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const k = el.getAttribute('data-i18n');
    const val = t(k);
    if (val) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const k = el.getAttribute('data-i18n-title');
    const val = t(k);
    if (val) el.title = val;
  });

  /* Hardcoded button titles (they live outside the data-i18n scope
     because they use inline SVG icons). */
  const titles = {
    'btn-hint':     'hint',
    'btn-solution': 'solution',
    'btn-reset':    'reset',
    'btn-next':     'next',
    'btn-expand':   'expand',
    'btn-history':  'history',
    'btn-lupa':     'info'
  };
  Object.keys(titles).forEach((id) => {
    const el = $(id);
    if (el) el.title = t(titles[id]);
  });

  /* Search placeholder */
  const search = $('inp-search');
  if (search) search.placeholder = t('search') + '...';

  /* Refresh dynamic UI */
  if (state.game) updateTurnIndicator();
}

/* ============================================================
   BUILD PIECE SET OPTIONS
   Fills the #sel-piece-set select with 2D and 3D optgroups.
   ============================================================ */
export function buildPieceSetOptions() {
  const sel = $('sel-piece-set');
  if (!sel) return;

  sel.innerHTML = '';

  const group2d = document.createElement('optgroup');
  group2d.label = '2D';
  const group3d = document.createElement('optgroup');
  group3d.label = '3D';

  Object.keys(PIECE_SETS).forEach((key) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = prettifySetName(key);
    if (key === state.currentPieceSet) opt.selected = true;
    if (key.startsWith('3d-')) group3d.appendChild(opt);
    else group2d.appendChild(opt);
  });

  sel.appendChild(group2d);
  sel.appendChild(group3d);
}

/* ============================================================
   HELPERS
   ============================================================ */
function prettifySetName(key) {
  if (key.startsWith('3d-')) {
    const base = key.slice(3);
    return '3D ' + base.charAt(0).toUpperCase() + base.slice(1);
  }
  return key.charAt(0).toUpperCase() + key.slice(1);
}
