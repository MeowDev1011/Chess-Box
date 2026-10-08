// js/modal.js
// ============================================================
// ChessBox — custom modal
// Replaces window.confirm / alert / prompt with our own UI.
// Returns a Promise<boolean> for confirm/cancel flows.
// ============================================================

let modalResolve = null;

/* ============================================================
   OPEN MODAL
   opts:
     title       (string)  — heading text
     body        (string)  — HTML string for the body
     confirmText (string)  — label of the primary button
     cancelText  (string)  — label of the secondary button
     showCancel  (boolean) — hide the cancel button if false
   Returns a Promise that resolves to true (confirmed) or false.
   ============================================================ */
export function openModal(opts = {}) {
  const overlay = document.getElementById('cb-modal-overlay');
  const titleEl = document.getElementById('cb-modal-title');
  const bodyEl  = document.getElementById('cb-modal-body');
  const actions = document.getElementById('cb-modal-actions');

  if (!overlay || !titleEl || !bodyEl || !actions) {
    console.warn('Modal elements not found in the DOM.');
    return Promise.resolve(false);
  }

  titleEl.textContent = opts.title || '';
  bodyEl.innerHTML    = opts.body  || '';
  actions.innerHTML   = '';

  /* Cancel button */
  const cancelBtn = document.createElement('button');
  cancelBtn.className   = 'btn-secondary';
  cancelBtn.textContent = opts.cancelText || 'Cancel';
  cancelBtn.addEventListener('click', () => {
    closeModal();
    resolveModal(false);
  });

  /* Confirm button */
  const confirmBtn = document.createElement('button');
  confirmBtn.className   = 'btn-primary';
  confirmBtn.textContent = opts.confirmText || 'OK';
  confirmBtn.addEventListener('click', () => {
    closeModal();
    resolveModal(true);
  });

  if (opts.showCancel !== false) actions.appendChild(cancelBtn);
  actions.appendChild(confirmBtn);

  overlay.classList.add('visible');

  return new Promise((resolve) => { modalResolve = resolve; });
}

/* ============================================================
   CLOSE MODAL
   Removes the visible class and resolves any pending promise.
   ============================================================ */
export function closeModal() {
  const overlay = document.getElementById('cb-modal-overlay');
  if (overlay) overlay.classList.remove('visible');
  resolveModal(false);
}

/* ============================================================
   INTERNAL
   ============================================================ */
function resolveModal(value) {
  if (modalResolve) {
    const fn = modalResolve;
    modalResolve = null;
    fn(value);
  }
}

/* ============================================================
   WIRE STATIC LISTENERS
   Called from main.js once the DOM is ready.
   - Click on the overlay backdrop (outside the modal) closes it.
   - Escape key closes it.
   ============================================================ */
export function wireModal() {
  const overlay = document.getElementById('cb-modal-overlay');
  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('visible')) {
      closeModal();
    }
  });
}
