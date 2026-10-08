// js/audio.js
// ============================================================
// ChessBox — audio feedback
// Short tones generated with the Web Audio API.
// No audio files required.
// ============================================================

let audioCtx = null;

/* ============================================================
   INITIALIZATION
   Must be triggered from a user gesture the first time so the
   browser unlocks playback (autoplay policy).
   ============================================================ */
export function initAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

/* ============================================================
   LOW-LEVEL TONE
   ============================================================ */
function playTone(freq, dur, type = 'sine', gain = 0.15) {
  if (!audioCtx) return;
  const osc  = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(gain, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + dur);
}

/* ============================================================
   PUBLIC SOUNDS
   ============================================================ */

/** Subtle tone for a normal move. */
export function soundMove() {
  initAudio();
  playTone(520, 0.08, 'sine', 0.18);
}

/** Deeper, slightly longer tone for a capture. */
export function soundCapture() {
  initAudio();
  playTone(320, 0.12, 'triangle', 0.22);
}

/** Two quick tones to signal a check. */
export function soundCheck() {
  initAudio();
  playTone(660, 0.07, 'square', 0.15);
  setTimeout(() => playTone(880, 0.07, 'square', 0.15), 80);
}

/** Soft tone for a successful puzzle completion. */
export function soundSuccess() {
  initAudio();
  playTone(660, 0.08, 'sine', 0.18);
  setTimeout(() => playTone(880, 0.12, 'sine', 0.18), 100);
}

/** Low buzz for an illegal or incorrect move. */
export function soundError() {
  initAudio();
  playTone(220, 0.15, 'sawtooth', 0.15);
}

/** Tiny click for UI feedback (opening panel, toggling a mode). */
export function soundClick() {
  initAudio();
  playTone(440, 0.04, 'square', 0.10);
}
