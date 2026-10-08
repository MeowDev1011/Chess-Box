# 🎨 Assets

> Metadata for every chess piece set supported by **ChessBox**.

## 📂 Structure

    assets/
    ├── README.md         ← you are here
    ├── pieces_2d.js      ← 2D piece set definitions
    └── pieces_3d.js      ← 3D piece set definitions

## 📄 Files

| 📄 File | 🎯 Purpose |
|--------|-----------|
| **`pieces_2d.js`** | Exports `PIECE_SETS_2D` and `PIECE_CODES_2D`. Flat, top-down piece sets. |
| **`pieces_3d.js`** | Exports `PIECE_SETS_3D`. 3D perspective sets (same Lichess SVGs + CSS transform). |
| **`README.md`**    | This file. |

## 🧩 How piece images are loaded

ChessBox does not ship piece images. It points at the official **Lichess**
piece library directly:

    https://lichess1.org/assets/piece/{set}/{color}{Piece}.svg

Where:

- 🎨 `{set}`   = the piece set name (e.g. `horsey`, `merida`, `staunty`)
- ⚪ `{color}` = `w` (white) or `b` (black)
- ♟️ `{Piece}` = one of `P`, `N`, `B`, `R`, `Q`, `K`

**Example** — white knight of the Horsey set:

    https://lichess1.org/assets/piece/horsey/wN.svg

## 🎭 2D vs 3D

| Type | Description |
|------|-------------|
| 🟦 **2D** | Flat, top-down SVGs rendered exactly as Lichess ships them. See `pieces_2d.js`. |
| 🟪 **3D** | Same 2D SVGs, but ChessBox applies a CSS transform (`rotateX(14deg)` + drop shadow) to give the board a physical tilt. Keys are prefixed with `3d-`. See `pieces_3d.js`. |

The 3D sets do **not** download additional images. They reuse the
underlying 2D SVGs and apply a purely CSS-based perspective.

## 🖼️ Supported sets

### 🟦 2D sets (16)

`horsey`, `cburnett`, `merida`, `alpha`, `chessnut`, `fantasy`,
`spatial`, `staunty`, `pirouetti`, `chess7`, `reillycraig`,
`companion`, `riohacha`, `kosal`, `leipzig`, `celtic`

### 🟪 3D sets (3)

`3d-staunty`, `3d-cburnett`, `3d-merida`

## ➕ Adding a new set

1. 🔍 Find a Lichess piece set that ships SVGs at
   `https://lichess1.org/assets/piece/<name>/`.
2. 📝 Add an entry to `pieces_2d.js` or `pieces_3d.js`.
3. 🧩 It is automatically merged into `PIECE_SETS` by `js/config.js`.
4. 🖼️ Add an `<option>` in `index.html` under the correct `<optgroup>`
   (or let `buildPieceSetOptions()` in `js/ui.js` populate it for you).
5. 📖 Document the new set in this README.

## 🔄 How the pieces are swapped at runtime

When the user selects a piece set, `js/board.js` calls `applyPieceSet()`,
which injects a `<style>` tag into the document head. That style tag
rewrites the `background-image` rule for every `piece.<type>.<color>`
selector to point at the new base URL. The old style tag is replaced, so
no extra rules accumulate over time.

## 🌐 CDN & offline usage

All piece SVGs are loaded at runtime from `lichess1.org`. There is no
build step and no local cache. If you need offline support, download the
SVGs you use and point `base` at a local folder instead.

## 📜 License

All piece SVGs are © the [Lichess](https://lichess.org) project and its
contributors, released under the **AGPL-3.0** license. ChessBox only
references them via URL; it does not redistribute them.
