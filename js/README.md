# ⚙️ JavaScript

> Every module of **ChessBox**, split by concern.

## 📂 Structure

    js/
    ├── README.md       ← you are here
    ├── main.js         ← entry point
    ├── state.js        ← shared mutable state
    ├── config.js       ← static data
    ├── i18n.js         ← translations
    ├── audio.js        ← Web Audio tones
    ├── storage.js      ← localStorage stats
    ├── modal.js        ← custom modal
    ├── ui.js           ← banners, toasts, previews
    ├── board.js        ← Chessground wrapper
    ├── puzzle.js       ← Lichess API + game logic
    └── controls.js     ← all UI listeners

## 📄 Files

| 📄 File | 🎯 Responsibility |
|--------|-------------------|
| **`main.js`** | Entry point. Reads URL parameters, wires keyboard shortcuts, calls the initial `loadPuzzle()`. |
| **`state.js`** | Single mutable `state` object shared by every module (game, board, colors, language…). |
| **`config.js`** | Static data: piece sets (imported from `assets/`), board themes, level list, SVG icons. |
| **`i18n.js`** | All translations + `t(key)` lookup + auto language detection. |
| **`audio.js`** | Web Audio API tones for move, capture, and check. |
| **`storage.js`** | localStorage wrapper for stats (solved, streak, attempts, time). |
| **`modal.js`** | Custom modal (replaces `window.confirm` / `alert` / `prompt`). |
| **`ui.js`** | DOM helpers: banners, toasts, translations, turn indicator, previews. |
| **`board.js`** | Chessground wrapper: init, theme, piece set, orientation, 3D toggle, resize. |
| **`puzzle.js`** | Lichess API fetch, PGN parsing, move validation, hint, solution, reset. |
| **`controls.js`** | All UI event listeners: buttons, selects, level dropdown, corner triple-tap. |

## 🔗 Dependencies between modules

    main.js
      ├─ state.js
      ├─ config.js
      ├─ i18n.js
      ├─ board.js    ← imports assets/pieces_2d.js and assets/pieces_3d.js via config.js
      ├─ puzzle.js
      ├─ controls.js
      ├─ ui.js
      └─ modal.js

No circular imports. Every module imports only from `state.js`, `config.js`,
`i18n.js`, and lower-level helpers.

## 🧩 How modules communicate

- Shared mutable state lives in **`state.js`**.
- UI feedback goes through **`ui.js`** (`showBanner`, `showInfoToast`, …).
- Board updates go through **`board.js`** (`initBoard`, `applyPieceSet`, …).
- Puzzle logic lives entirely in **`puzzle.js`**.
- All event wiring is centralized in **`controls.js`**.

## 🚀 Adding a new feature

1. 📝 Add state to `state.js` if needed.
2. 🎨 Add constants to `config.js` if needed.
3. 🎛️ Add a listener in `controls.js`.
4. 🧠 Implement the logic in the most relevant module (`puzzle.js`, `board.js`…).
5. 🌐 Add translations to `i18n.js` for every supported language.

## 🎹 Keyboard shortcuts

Wired in `main.js`:

| 🔑 Key | 🎯 Action |
|-------|----------|
| `H` | Hint |
| `S` | Solution |
| `R` | Reset puzzle |
| `N` | Next puzzle |
| `E` | Toggle expanded board |
| `Esc` | Close panel / history / modal |

## 🌐 Languages

`i18n.js` supports 20 languages and auto-detects the user's language from the
browser. A `?lang=` URL parameter overrides the detection.

Supported codes:

`en`, `es`, `fr`, `de`, `pt`, `it`, `ru`, `zh`, `ja`, `ko`, `ar`, `hi`, `nl`,
`pl`, `tr`, `sv`, `da`, `no`, `fi`, `cs`

## 📜 License

MIT. See the root `LICENSE` file.
