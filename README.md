# ♟️ ChessBox 🏆

**Small widget easy to integrate into web pages with customizable chess puzzles, various parameters, and guides on the Wiki — under the MIT license.** 🧩🌐📜

> 🎯 An embeddable, fully customizable chess puzzle widget powered by [Lichess](https://lichess.org) ♞ and [Chessground](https://github.com/lichess-org/chessground) 🧠

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/MeowDev1011/Chess-Box/blob/main/LICENSE)
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-f7df1e.svg)](https://developer.mozilla.org/docs/Web/JavaScript)
[![GitHub stars](https://img.shields.io/github/stars/MeowDev1011/Chess-Box?style=social)](https://github.com/MeowDev1011/Chess-Box)
[![GitHub forks](https://img.shields.io/github/forks/MeowDev1011/Chess-Box?style=social)](https://github.com/MeowDev1011/Chess-Box/network/members)

---

## 📚 Documentation & Wiki 🔗

Everything you need to use, customize, and embed ChessBox lives in the **[ChessBox Wiki](https://github.com/MeowDev1011/Chess-Box/wiki)** 📖✨.

| 📘 Page | 🎯 What you'll find |
|---|---|
| 🏁 [Getting Started](https://github.com/MeowDev1011/Chess-Box/wiki/Getting-Started) | Download, run locally, deploy to GitHub Pages, embed with an iframe |
| 🔧 [URL Parameters Reference](https://github.com/MeowDev1011/Chess-Box/wiki/URL-Parameters-Reference) | Every parameter, its values, defaults, and examples |
| 🎨 [Customization Guide](https://github.com/MeowDev1011/Chess-Box/wiki/Customization-Guide) | Add new piece sets, board themes, and languages |
| 🖼️ [Examples Gallery](https://github.com/MeowDev1011/Chess-Box/wiki/Examples-Gallery) | Ready-to-copy URLs and embedding snippets |
| ❓ [FAQ & Troubleshooting](https://github.com/MeowDev1011/Chess-Box/wiki/FAQ-and-Troubleshooting) | Blank board, CORS, iframe issues, and more |

---

## 👤 Author 🌟

- 🐙 **GitHub:** [@MeowDev1011](https://github.com/MeowDev1011)
- ♟️ **Lichess:** [@GatoChess89](https://lichess.org/@/GatoChess89)

---

## ⚡ Quick start 🚀

1. 📥 Download or clone this repository.
2. 🖱️ Open `index.html` in your browser. That's it. ✨

To serve it locally 🖥️:

```bash
npx serve .
# or
python -m http.server 8000
```

To embed it anywhere 🌍, upload it to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages) and drop it into an iframe 🖼️:

```html
<iframe
  src="https://meowdev1011.github.io/Chess-Box/"
  width="460"
  height="640"
  style="border:none;"
  loading="lazy">
</iframe>
```

---

## ✨ What is ChessBox? 🧩

ChessBox is a **self-contained HTML file** that turns any web page into an **interactive chess puzzle trainer**. It pulls puzzles directly from the **official Lichess puzzle API**, so you always get fresh, high-quality positions curated by the Lichess community. 🏅

No installation. No npm. No bundler. Just one file. 📄

---

## 🎁 Features 💎

### 🎮 Gameplay

- 🧩 **Real Lichess puzzles** — daily puzzles, themed puzzles, or difficulty-filtered puzzles, pulled live.
- ♟️ **Play the winning side** — the widget detects whether you're playing as White or Black automatically.
- 🤖 **Automatic opponent's first move** — the position is set up exactly as Lichess presents it.
- 🖱️ **Drag-and-drop or tap-to-move** — both interaction modes work, on desktop and mobile.
- ✅ **Full legal move validation** — powered by `chess.js`, so illegal moves are impossible to play.
- 🔄 **Snap-back on wrong moves** — if you play an incorrect move, the piece returns to its square.
- 🎯 **Move-by-move feedback** — every correct move advances the puzzle; every wrong move is explained.

### 💡 Helper tools

- 💡 **Hint button** — animates the next solution move on the board for half a second and shows the notation.
- 🗝️ **Solution button** — displays the full remaining sequence and replays it move by move.
- 🔄 **Reset button** — restores the starting position of the current puzzle instantly.
- ➡️ **Next button** — fetches a brand-new puzzle using the current theme and difficulty.
- 🔍 **Magnifier button** — enters *clean mode*: hides all UI and shows an info card for 3 seconds.
- 🧘 **Clean / Zen mode** — pure board, no distractions.
- 🎛️ **3-tap corner gesture** — tap 3 times in any of the 4 corners to toggle the control panel.

### 🎨 Visual customization

- 🎨 **16 piece sets** — Horsey (default), Cburnett, Merida, Alpha, Chessnut, Fantasy, Spatial, Staunty, Pirouetti, Chess7, Reillycraig, Companion, Riohacha, Kosal, Leipzig, Celtic.
- 🎨 **9 board themes** — Blue (Lichess), Green, Brown, Gray, Dark, Light, Wood, Marble, Purple.
- 🌈 **Custom hex colors** — pick any light/dark square pair you want.
- 🖼️ **Widget background control** — transparent, black, white, or any hex color.
- 🔤 **Coordinate font size** — small, normal, large.
- 👑 **King indicator** — the turn indicator shows the King sprite from the currently selected piece set.
- 🖼️ **Live previews** — 2×2 board preview and knight preview inside the settings panel.

### 🌐 Localization

- 🌍 **8 languages** — English 🇬🇧, Spanish 🇪🇸, French 🇫🇷, German 🇩🇪, Portuguese 🇵🇹, Italian 🇮🇹, Russian 🇷🇺, Chinese 🇨🇳.
- 🔄 **Instant language switching** — no reload needed.
- 📝 **Full coverage** — buttons, banners, error messages, hints, solutions, tooltips, everything.

### 🔊 Audio

- 🎵 **Move sound** — subtle tone when a piece moves.
- 💥 **Capture sound** — deeper tone when a piece is captured.
- ⚔️ **Check sound** — distinct tone when the king is put in check.
- 🔇 **No audio files** — everything generated live with the Web Audio API.

### 📱 Responsive design

- 📐 **Fluid board** — scales to any screen width without breaking.
- 🖥️ **Max width 440px** — stays crisp on desktop.
- 📱 **Mobile-optimized** — touch-action rules prevent accidental scrolling.
- 🔄 **Orientation aware** — recalculates on device rotation.

### 🛠️ Developer friendly

- 📄 **Single HTML file** — no build pipeline, no bundler, no CLI.
- 📦 **Zero npm dependencies** — libraries load from stable CDNs.
- 🧩 **Modern ES modules** — uses `<script type="module">`.
- 🎯 **No backend required** — talks directly to the Lichess public API.
- 🧼 **No tracking, no analytics** — completely private.
- 🔗 **Fully URL-configurable** — see the [URL Parameters Reference](https://github.com/MeowDev1011/Chess-Box/wiki/URL-Parameters-Reference) in the wiki.
- 📖 **Well documented** — full wiki with guides and examples.

---

## 🎮 How a puzzle works 🧠

1. 📡 The widget fetches a puzzle from the Lichess public API.
2. ♟️ It loads the PGN and identifies **which side you play**.
3. 🤖 The **opponent's first move is played automatically**.
4. 🎯 It becomes **your turn** — you see the position after the opponent's move.
5. 🖱️ You **drag or tap** a piece to a legal square.
6. ✅ If the move is correct, the puzzle continues.
7. ❌ If the move is wrong, the piece snaps back and a red banner explains why.
8. 🎉 When you complete the sequence, a green banner congratulates you.
9. ➡️ Press **Next** to load another puzzle, or **Reset** to retry.

---

## 🎛️ Panel controls 🎚️

The control panel below the board lets you change everything on the fly, no URL editing required:

- 🌐 Language selector (8 languages).
- 🧩 Puzzle theme selector (Mate in 1/2/3, Fork, Pin, Skewer, Sacrifice, Endgame, Opening, and many more).
- 📊 Level selector.
- 📈 Optional rating override.
- 🔍 Free-text theme search.
- 🎨 Board color selector with live 2×2 preview.
- 🌈 Custom light/dark hex color pickers.
- ♟️ Piece set selector with live knight preview.
- 🖼️ Widget background selector.
- 🧭 Board orientation selector.

The panel is **open by default**. Three quick taps in any corner hide or show it. 🎯

---

## 🧰 Tech stack 🛠️

| 🧱 Layer | 📦 Library / Source |
|---|---|
| 🎨 Board rendering | [Chessground](https://github.com/lichess-org/chessground) `10.1.1` |
| 🧠 Game logic | [chess.js](https://github.com/jhlywa/chess.js) `1.4.0` |
| 🧩 Puzzles | [Lichess API](https://lichess.org/api#tag/Puzzles) |
| ♟️ Piece sprites | `https://lichess1.org/assets/piece/*` |
| 🔊 Audio | Web Audio API (no files) |
| 🎨 Styling | Pure CSS, CSS variables |

---

## 🧪 Browser support 🌐

| Browser | Minimum version |
|---|---|
| 🟢 Chrome / Edge | 89+ |
| 🦊 Firefox | 89+ |
| 🧭 Safari | 15+ |
| 📱 iOS Safari | 15+ |
| 🤖 Chrome Android | 89+ |

Requires: **ES modules**, **URLSearchParams**, **Fetch API**, **CSS `aspect-ratio`**, **Web Audio API** (optional, for sound).

---

## 📂 Project structure 🗂️

```
Chess-Box/
├── 📄 index.html      # The entire widget (single file)
├── 📜 LICENSE         # MIT license
└── 📖 README.md       # This file
```

No `package.json`. No `node_modules`. No `dist/`. No build scripts. ✅

---

## 🤝 Contributing 💬

Found a bug 🐛 or want to add a feature ✨? Open an [issue](https://github.com/MeowDev1011/Chess-Box/issues) or send a [pull request](https://github.com/MeowDev1011/Chess-Box/pulls) 🎉.

When reporting a bug, please include:

1. 🔗 The URL you used.
2. 🌐 Your browser and version.
3. 🎯 What you expected vs. what happened.
4. 🖥️ The console output (F12 → Console), if there is an error.

---

## 📜 License ⚖️

Released under the [MIT License](https://github.com/MeowDev1011/Chess-Box/blob/main/LICENSE) ✅.

You are free to **use, modify, embed, and redistribute** ChessBox — commercial or personal 🎉 — as long as you keep the copyright notice 📝.

---

## 🙏 Acknowledgements 💖

- 🐴 The [Lichess](https://lichess.org) team, for the open puzzle API and the Chessground library.
- ♞ The [chess.js](https://github.com/jhlywa/chess.js) authors, for a clean, rules-only engine.
- 🎨 Everyone who contributed piece sets to the Lichess piece library.
- 💙 The open-source chess community, for keeping the game free.

---

## 🌟 Support the project 💫

If you like ChessBox, consider:

- ⭐ Starring the [repository](https://github.com/MeowDev1011/Chess-Box)
- 🐛 Reporting bugs on the [issue tracker](https://github.com/MeowDev1011/Chess-Box/issues)
- 🔀 Contributing with a pull request
- 💬 Sharing it with your chess friends ♟️

---

## 🔗 Quick links 🚀

| 🔖 Resource | 🌐 URL |
|---|---|
| 📦 Repository | `https://github.com/MeowDev1011/Chess-Box` |
| 📚 Wiki | `https://github.com/MeowDev1011/Chess-Box/wiki` |
| 📜 License (MIT) | `https://github.com/MeowDev1011/Chess-Box/blob/main/LICENSE` |
| 🎮 Live demo | `https://meowdev1011.github.io/Chess-Box/` |
| 🐛 Issues | `https://github.com/MeowDev1011/Chess-Box/issues` |
| 🔀 Pull requests | `https://github.com/MeowDev1011/Chess-Box/pulls` |
| ⭐ Stars | `https://github.com/MeowDev1011/Chess-Box/stargazers` |

---

## 🎯 Roadmap 🗺️

- [x] ✅ Real Lichess puzzles
- [x] ✅ 16 piece sets
- [x] ✅ 9 board themes + custom colors
- [x] ✅ 8 languages
- [x] ✅ Full URL parameter API
- [x] ✅ Hint and solution playback
- [x] ✅ Web Audio sounds
- [x] ✅ Responsive design
- [x] ✅ Clean / Zen mode
- [ ] 🔜 Puzzle history and progress tracking
- [ ] 🔜 Local storage for preferences
- [ ] 🔜 PGN export
- [ ] 🔜 More piece sets
- [ ] 🔜 Keyboard shortcuts
- [ ] 🔜 Theme packs (download/upload)

---

## 📊 Repository stats 📈

![Repo size](https://img.shields.io/github/repo-size/MeowDev1011/Chess-Box)
![Last commit](https://img.shields.io/github/last-commit/MeowDev1011/Chess-Box)
![Issues](https://img.shields.io/github/issues/MeowDev1011/Chess-Box)
![Pull requests](https://img.shields.io/github/issues-pr/MeowDev1011/Chess-Box)

---

<p align="center">
  ♟️ Made with ❤️ by <a href="https://github.com/MeowDev1011">MeowDev1011</a> ♟️
  <br/>
  ⭐ If you like this project, don't forget to star it! ⭐
  <br/>
  🎉 Happy puzzling! 🧩
</p>
