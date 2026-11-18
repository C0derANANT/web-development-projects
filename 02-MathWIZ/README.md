# 📐 MathWIZ

A small maths lab in the browser: generate number series, plot any graph, and
spin 3D shapes, all from one page with a slide-out menu.

**🔗 Live:** <https://c0deranant.github.io/web-development-projects/02-MathWIZ/>
**🗂️ Original (Aug 2025, one file):** <https://c0deranant.github.io/web-development-projects/02-MathWIZ/original/MathWIZ.html>

## ✨ Features

- **Series Generator:** enter a first term, a difference or ratio, and how many terms (1 to 500), then make an AP, GP, HP or the Fibonacci series, with exact Fibonacci numbers of any size
- **Graph Plotter:** a full GeoGebra graphing calculator; type `y = x^2` or any equation and drag to explore
- **3D Shapes:** a cube, sphere or cone you can rotate with the mouse and zoom with the scroll wheel
- **Maths facts:** ten facts on the home page
- **Moving background:** a slowly shifting gradient with drifting particles that link up, reach for your mouse, and gain four more each time you click the background
- **Slide-out menu:** opens the pages without reloading; on phones it closes after you pick one

## 🧱 From one file to three

MathWIZ started in August 2025 as a single 268-line `MathWIZ.html` with its CSS
and JavaScript inside. It's now split into three files. The split itself changed
nothing about how the website works; the bug fixes came after, one commit each.

| File | What's in it |
| ---- | ------------ |
| `index.html` | The page frame, the menu, and one `<template>` per page (Home, Series, Graph, 3D Shapes) |
| `style.css` | All the styles, in numbered sections. The inline `style="..."` bits became named classes such as `.intro`, `.fact` and `.shape-picker` |
| `script.js` | All the behaviour, in numbered sections: menu, pages, facts, series, graph, 3D shapes, particles |

A few tidy-ups came with the split:

- The page HTML moved out of JavaScript strings into `<template>` tags, so `index.html` holds the markup and `script.js` only copies it in.
- The `onclick="generateAP()"` attributes became `data-series="ap"` buttons with a single click listener.
- The menu is a `<nav>` and tells screen readers whether it is open (`aria-expanded`).
- particles.js is pinned to version 2.0.0, the same file the unpinned link loaded.
- The name is **MathWIZ** everywhere. The original said "MathLab Pro" on the page.

The untouched original is kept in [`original/MathWIZ.html`](original/MathWIZ.html),
with its history from the old Mega-Projects repo.

## 🐛 Bugs fixed

All six were in the original, and each was checked in a browser before and after:

| Bug | Before | After |
| --- | ------ | ----- |
| 3D Shapes kept running after you left | 20 visits left 20 animation loops and WebGL canvases running | Leaving the page stops and frees the viewer |
| Particles never reacted to the mouse | The page content covered the particles everywhere | The empty background reaches them; the cards work as before |
| No limit on Terms (n) | Huge counts froze the page; 0, negative or 2.5 showed nothing | Whole numbers from 1 to 500, with a message otherwise |
| Floating-point noise | 0.1, 0.2 gave `0.30000000000000004`; 0.3, −0.1 gave `-5.551115123125783e-17` | `0.3` and `0`, and whole numbers stay exact |
| HP terms over zero | `Infinity`, or `-18014398509481984` when noise made the AP term nearly 0 | `undefined`, with a note saying why |
| Long Fibonacci series | Wrong from term 80 (`…220` instead of `…221`) | Exact for every term, using BigInt |

## 🧰 Tech Stack

| Purpose | Tool |
| ------- | ---- |
| Page structure | HTML with `<template>` pages |
| Styling | CSS: custom properties, gradient animation, `backdrop-filter` glass, media queries |
| Behaviour | JavaScript: DOM, events, arrays, template literals, BigInt |
| Graph Plotter | [GeoGebra](https://www.geogebra.org/) apps API |
| 3D Shapes | [Three.js](https://threejs.org/) 0.146 with OrbitControls |
| Background | [particles.js](https://vincentgarreau.com/particles.js/) 2.0.0 |
| Hosting | GitHub Pages |

## 📁 Project Structure

```
02-MathWIZ/
├── index.html           # Page frame, menu and the four page templates
├── style.css            # All styles, in seven sections
├── script.js            # All behaviour, in seven sections
└── original/
    └── MathWIZ.html     # The August 2025 single-file version, unchanged
```

## 🚀 Getting Started

```bash
cd 02-MathWIZ
python3 -m http.server 8000
```

Then open <http://localhost:8000>. No installs needed; the libraries load from
their CDNs, so you need to be online.

## 🪜 History

1. **Aug 2025:** built as one file in the Mega-Projects repo (`FINAL.html`, then `Group-L.html`)
2. **May 2026:** renamed to `MathWIZ.html`
3. **Nov 2026:** moved here with its history, split into HTML, CSS and JavaScript, and six bugs fixed
