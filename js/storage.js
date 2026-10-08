// js/storage.js
// ============================================================
// ChessBox — localStorage wrapper for stats
// Stores: solved count, current streak, best streak,
//         total attempts, and time played (in seconds).
// ============================================================

import { STORAGE_KEY } from './config.js';

/* ============================================================
   DEFAULT SHAPE
   ============================================================ */
const DEFAULT_STATS = {
  solved: 0,
  streak: 0,
  bestStreak: 0,
  attempts: 0,
  timePlayed: 0
};

/* ============================================================
   LOAD
   Returns a merged object with DEFAULT_STATS so missing keys
   are always present.
   ============================================================ */
export function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATS, ...parsed };
  } catch (e) {
    console.warn('Could not read stats from localStorage:', e);
    return { ...DEFAULT_STATS };
  }
}

/* ============================================================
   SAVE
   Silently ignores failures (private mode, quota exceeded, etc.)
   ============================================================ */
export function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn('Could not write stats to localStorage:', e);
  }
}

/* ============================================================
   MUTATIONS
   ============================================================ */

/** Called when the user solves a puzzle. */
export function recordSolved() {
  const s = loadStats();
  s.solved++;
  s.streak++;
  if (s.streak > s.bestStreak) s.bestStreak = s.streak;
  saveStats(s);
  return s;
}

/** Called when the user plays a wrong/illegal move. Resets streak. */
export function recordAttempt() {
  const s = loadStats();
  s.attempts++;
  s.streak = 0;
  saveStats(s);
  return s;
}

/** Adds seconds to the total time played. */
export function addTimePlayed(seconds) {
  const s = loadStats();
  s.timePlayed += Math.max(0, seconds);
  saveStats(s);
  return s;
}

/** Wipes all stats. */
export function resetStats() {
  const empty = { ...DEFAULT_STATS };
  saveStats(empty);
  return empty;
}

/* ============================================================
   TIME TRACKER
   Start/stop tracking with a simple pair of helpers.
   Usage:
     const stop = startTimer();
     // ... later
     stop();
   ============================================================ */
let timerStart = null;

export function startTimer() {
  timerStart = Date.now();
  return function stopTimer() {
    if (timerStart === null) return 0;
    const elapsed = Math.round((Date.now() - timerStart) / 1000);
    timerStart = null;
    if (elapsed > 0) addTimePlayed(elapsed);
    return elapsed;
  };
}
