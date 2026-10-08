# 🎨 CSS

> Styles for **ChessBox**. A single stylesheet with everything the widget needs.

## 📂 Structure

    css/
    ├── README.md       ← you are here
    └── styles.css      ← the full stylesheet

## 📄 Files

| 📄 File | 🎯 Purpose |
|--------|-----------|
| **`styles.css`** | The complete stylesheet for the widget, the board, the controls, the panel, and the modal. |
| **`README.md`** | This file. |

## 🧱 What `styles.css` covers

| 🧩 Block | 🎯 Purpose |
|---------|-----------|
| 🎨 `:root` variables | Board colors, coordinate size, widget background, max widths |
| 🧩 `.puzzle-widget` | Root container, responsive max-width, background |
| 🟦 `.board-area` | Wrapper around the Chessground board |
| ♟️ `.cg-wrap` / `cg-board` | The Chessground board (1:1 aspect ratio) |
| 🟪 `.is3d` | Perspective transform for 3D board mode |
| 🎭 `piece.pawn.white` … | Fallback piece rules (Horsey) until JS injects the active set |
| 🔤 `coords coord` | Coordinate labels (a–h, 1–8) |
| 🟢 `square.selected` / `square.move-dest` / `square.hint-origin` | Move highlights |
| 🏷️ `#puzzle-theme` | Floating theme label inside the board |
| 👑 `#turn-indicator` | Floating "your turn" badge |
| 🚨 `#puzzle-banner` | Toast / alert banner |
| 💬 `#info-toast` | The 3-second info card |
| 🎛️ `.puzzle-controls` | The row of buttons below the board |
| 📜 `.move-history` | The move list panel |
| ⚙️ `.puzzle-selector` | The configuration panel |
| 📦 `.level-dropdown` | The custom level selector |
| 🪟 `.cb-modal-overlay` / `.cb-modal` | The custom modal |
| 📱 `@media` queries | Small-screen adjustments and fullscreen mode |

## 🎨 CSS variables

Defined at `:root` in `styles.css`. You can override them at runtime from JS:

    document.documentElement.style.setProperty('--board-light', '#f0d9b5');

| 🏷️ Variable | 📌 Default | 🎯 Controls |
|------------|-----------|-----------|
| `--board-light` | `#dee3e6` | Light square color |
| `--board-dark`  | `#4a75a0` | Dark square color |
| `--coord-size`  | `11px`    | Coordinate label size |
| `--widget-bg`   | `transparent` | Widget background |
| `--board-max`   | `440px`   | Board max width |
| `--panel-max`   | `440px`   | Panel max width |

## 🎭 2D vs 3D

- **2D mode** (default): flat board, flat pieces.
- **3D mode**: activated by adding the class `.is3d` to `.puzzle-widget`.
  CSS then applies:

      .puzzle-widget.is3d .cg-board {
        transform: rotateX(14deg);
        transform-origin: center bottom;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
      }
      .puzzle-widget.is3d piece {
        filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.45));
      }

## 📱 Responsive rules

- The board grows/shrinks with its container (`width: 100%` + `aspect-ratio: 1 / 1`).
- Below `480px` the widget padding tightens and the buttons shrink slightly.
- In `:fullscreen` mode, the panel and controls are hidden and the board is centered.

## 🌐 RTL support

The layout is direction-agnostic. For right-to-left languages (Arabic, Hebrew),
the browser mirrors the panel and buttons automatically; the board itself stays
oriented as configured by the user.

## 🎯 Design tokens (palette used)

| 🎨 Color | 🎯 Where |
|---------|---------|
| `#dee3e6` | Light squares (Blue board) |
| `#4a75a0` | Dark squares (Blue board) |
| `#7ec8e3` | Accent (links, ratings, highlights) |
| `#ffd166` | Puzzle rating text |
| `#151a26` | Modal background |
| `#1a1a2e` | Select dropdown background |
| `rgba(0,0,0,0.65)` | Floating label background |
| `rgba(34,139,34,0.92)` | Success banner |
| `rgba(178,34,34,0.92)` | Error banner |
| `rgba(30,60,90,0.92)` | Info banner |

## 📜 License

MIT. See the root `LICENSE` file.
