// js/config.js
// ============================================================
// ChessBox — static configuration
// Piece sets (imported from assets/), board themes, levels, icons.
// ============================================================

import { PIECE_SETS_2D, PIECE_CODES_2D } from '../assets/pieces_2d.js';
import { PIECE_SETS_3D } from '../assets/pieces_3d.js';

/* ============================================================
   PIECE SETS
   Merge 2D and 3D sets into a single lookup object.
   ============================================================ */
export const PIECE_SETS = { ...PIECE_SETS_2D, ...PIECE_SETS_3D };
export const PIECE_CODES = PIECE_CODES_2D;

/* ============================================================
   BOARD THEMES
   Each entry has: light square color, dark square color, label.
   3D themes trigger the is3d CSS mode when selected.
   ============================================================ */
export const BOARD_THEMES = {
  /* -------- 2D themes -------- */
  brown:  { light: '#f0d9b5', dark: '#b58863', label: 'Brown (Classic)' },
  blue:   { light: '#dee3e6', dark: '#4a75a0', label: 'Blue (Lichess)' },
  green:  { light: '#eeeed2', dark: '#769656', label: 'Green' },
  gray:   { light: '#f0f0f0', dark: '#808080', label: 'Gray' },
  dark:   { light: '#7a8a9a', dark: '#2c3e50', label: 'Dark' },
  light:  { light: '#fafafa', dark: '#c0c0c0', label: 'Light' },
  wood:   { light: '#e8c99b', dark: '#8b5a2b', label: 'Wood' },
  marble: { light: '#e8e8e8', dark: '#5a5a5a', label: 'Marble' },
  purple: { light: '#e8d5f0', dark: '#6a4c93', label: 'Purple' },

  /* -------- 3D themes -------- */
  '3d-classic': { light: '#f0d9b5', dark: '#b58863', label: '3D Classic' },
  '3d-blue':    { light: '#dee3e6', dark: '#4a75a0', label: '3D Blue' },
  '3d-green':   { light: '#eeeed2', dark: '#769656', label: '3D Green' },
  '3d-wood':    { light: '#d8b98a', dark: '#7a4a1e', label: '3D Wood' },
  '3d-marble':  { light: '#dcdcdc', dark: '#4a4a4a', label: '3D Marble' },
  '3d-dark':    { light: '#5a6a7a', dark: '#1a2530', label: '3D Dark' }
};

/* ============================================================
   LEVELS
   Maps user-facing levels to Lichess "difficulty" values.
   `i18n` is the translation key for the label (only "any_level"
   has a translation; the rest are proper names).
   ============================================================ */
export const LEVELS = [
  { id: '',        name: 'Any level', note: 'all ELOs',  range: 'all ELOs',    bars: 0, i18n: 'any_level' },
  { id: 'easiest', name: 'Baby',      note: 'very easy', range: '100 – 600',   bars: 1 },
  { id: 'easier',  name: 'Sprout',    note: 'easy',      range: '600 – 1200',  bars: 2 },
  { id: 'normal',  name: 'Sapling',   note: 'medium',    range: '1200 – 1800', bars: 3 },
  { id: 'harder',  name: 'Tree',      note: 'hard',      range: '1800 – 2400', bars: 4 },
  { id: 'hardest', name: 'Forest',    note: 'very hard', range: '2400+',       bars: 5 }
];

/* ============================================================
   ICONS
   Inline SVG strings used by banners, modals and toasts.
   ============================================================ */
export const ICONS = {
  ok:    '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
  error: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  info:  '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  hint:  '<svg viewBox="0 0 24 24"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>',
  key:   '<svg viewBox="0 0 24 24"><circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.5 12.5 21 2"/><path d="M18 5l3 3"/><path d="M15 8l3 3"/></svg>'
};

/* ============================================================
   CONSTANTS
   ============================================================ */
export const API_BASE = 'https://lichess.org/api/puzzle/next';
export const STORAGE_KEY = 'chessbox_stats_v1';
export const TAP_WINDOW_MS = 1000;   // Window for triple-tap on corners
export const TAP_ZONE_PX = 80;       // Corner size for triple-tap
export const TOAST_DURATION_MS = 3000;
