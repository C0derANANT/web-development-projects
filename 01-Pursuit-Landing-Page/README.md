# 🧭 Pursuit Landing Page

A one-page website for **Pursuit**, my job application tracker for iPhone. As you
scroll, twelve messy job applications sort themselves into the app's five stages.

**🔗 Live:** <https://c0deranant.github.io/web-development-projects/01-Pursuit-Landing-Page/>
**📱 The app:** [ios-development › Pursuit](https://github.com/C0derANANT/ios-development/tree/main/Pursuit)

## ✨ Features

- **The Sort:** a pile of tilted paper notes sorts itself into Wishlist, Applied, Interviewing, Offer and Rejected as you scroll, and each note takes its stage colour as it lands
- **Into the phone:** once sorted, the whole board shrinks and flies onto the app's list, and the phone frame closes around it
- **The app shows itself:** the phone stays pinned and acts out each feature while its caption changes beside it:
  - **01 Log an application:** "+" opens the New Application sheet, PhonePe gets typed in, and the new row opens at the top of the list
  - **02 Every stage at a glance:** a spotlight moves from Wishlist to Rejected, in the list and in the badges under the caption
  - **03 No account, works offline:** Wi-Fi turns into airplane mode, and a note says everything is still saved
- **One pinned story:** the sort, the phone and the demo share one pinned section, so each scene hands over to the next
- **A constellation when a scene settles:** the moving background from my [MathWIZ](../02-MathWIZ) project, here in the five stage colours, fades in behind a scene once it has finished moving
- **Light and dark themes:** a button in the corner flips every colour on the page, including the phone, which switches to iOS dark mode. It starts on your device's setting and remembers your choice, and the new theme spreads out from the button as a circle
- **App Store, coming soon:** an honest "Coming soon to the App Store" note next to "Get the code on GitHub", until the app is live
- **Small touches:** stage names appear letter by letter
- **Works on phones:** on small screens the stages become rows instead of columns
- **Accessible fallback:** if the device asks for reduced motion, or a library fails to load, the page shows everything already sorted
- **No build step:** plain HTML, CSS and JavaScript

## 🧠 How the sort works

Each note has two places:

- a **messy** spot in the pile and a tilt, written in the HTML as `--x`, `--y` and `--tilt`
- a **tidy** spot, worked out from its stage (the column) and its slot (the row)

While the story is pinned, StringTune turns the scroll position into one number,
`--story`, that goes from 0 to 1. The CSS cuts it into scenes, each with its own
0 to 1: first `--sort`, then `--handoff` for the flight into the phone, then
`--demo-1` to `--demo-3` for the app demo. The sort blends the two places with `--sort`:

```css
left: calc(var(--messy-left) * (1 - var(--q)) + var(--tidy-left) * var(--q));
```

At 0 the note is fully messy, at 1 it is fully tidy, and at 0.5 it is halfway.
Columns further right start a little later, so the notes land left to right. On
small screens the same formula runs with the axes swapped.

## 🧰 Tech Stack

| Purpose                               | Tool                                                     |
| ------------------------------------- | -------------------------------------------------------- |
| Page structure                        | HTML                                                     |
| Layout, the sort and the flight       | CSS custom properties, `calc()`, `clamp()`, `color-mix()`, `min()`/`max()` |
| Measuring the flight into the phone   | JavaScript: `getBoundingClientRect()`, resize handling   |
| Smooth scrolling                      | [Lenis](https://lenis.dev/) 1.3.27                       |
| Scroll progress, split text           | [StringTune](https://string-tune.fiddle.digital/) 1.2.7  |
| Constellation background              | [particles.js](https://vincentgarreau.com/particles.js/) 2.0.0, as in MathWIZ |
| Hosting                               | GitHub Pages                                             |

## 📁 Project Structure

```
01-Pursuit-Landing-Page/
├── index.html    # The page: the pinned story (sort + phone), features, made while learning
├── style.css     # Layout, the scenes, the sort and flight formulas, small-screen layout
├── main.js       # Starts the libraries, measures the flight, runs the constellation, or falls back
└── favicon.svg   # Tab icon
```

## 🚀 Getting Started

```bash
cd 01-Pursuit-Landing-Page
python3 -m http.server 8000
```

Then open <http://localhost:8000>. No installs needed; the libraries load from jsDelivr.

## 🪜 How it was built

One commit per step, so the history shows the order:

1. Plain page, everything already sorted, no motion
2. Each note gets a messy starting spot
3. Smooth scrolling with Lenis
4. The sort connected to scrolling with StringTune
5. Phone parallax, small screens and the no-animation fallback
6. README
7. The sort and the phone joined into one pinned story
8. The sorted board flies into the phone, and a constellation appears as scenes settle
9. The phone logs an application: the form slides up and gets typed in
10. The phone shows every stage and works offline, with the feature captions beside it
11. A light/dark theme button, and the App Store coming-soon note

## 🎨 Inspiration

[lenis.dev](https://lenis.dev/), [StringTune](https://string-tune.fiddle.digital/), and the way
[buttermax.net](https://buttermax.net/) lets one scene turn into the next.
