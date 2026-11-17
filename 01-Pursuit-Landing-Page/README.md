# 🧭 Pursuit Landing Page

A one-page website for **Pursuit**, my job application tracker for iPhone. As you
scroll, twelve messy job applications sort themselves into the app's five stages.

**🔗 Live:** <https://c0deranant.github.io/web-development-projects/01-Pursuit-Landing-Page/>
**📱 The app:** [ios-development › Pursuit](https://github.com/C0derANANT/ios-development/tree/main/Pursuit)

## ✨ Features

- **The Sort:** a pile of tilted paper notes sorts itself into Wishlist, Applied, Interviewing, Offer and Rejected as you scroll, and each note takes its stage colour as it lands
- **Pinned scroll section:** the board stays on screen while scrolling drives the animation
- **Small touches:** stage names appear letter by letter, and the phone drifts a little slower than the page
- **Works on phones:** on small screens the stages become rows instead of columns
- **Accessible fallback:** if the device asks for reduced motion, or a library fails to load, the page shows everything already sorted
- **No build step:** plain HTML, CSS and JavaScript

## 🧠 How the sort works

Each note has two places:

- a **messy** spot in the pile and a tilt, written in the HTML as `--x`, `--y` and `--tilt`
- a **tidy** spot, worked out from its stage (the column) and its slot (the row)

While the section is pinned, StringTune turns the scroll position into one number,
`--sort`, that goes from 0 to 1. The CSS blends the two places with it:

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
| Layout and the sort animation         | CSS custom properties, `calc()`, `clamp()`, `color-mix()` |
| Smooth scrolling                      | [Lenis](https://lenis.dev/) 1.3.27                       |
| Scroll progress, split text, parallax | [StringTune](https://string-tune.fiddle.digital/) 1.2.7  |
| Hosting                               | GitHub Pages                                             |

## 📁 Project Structure

```
01-Pursuit-Landing-Page/
├── index.html    # The page: five sections, each note with its messy spot
├── style.css     # Layout, the sort formula, small-screen layout
├── main.js       # Starts Lenis and StringTune, or falls back to the sorted page
└── favicon.svg   # Tab icon
```

## 🚀 Getting Started

```bash
cd 01-Pursuit-Landing-Page
python3 -m http.server 8000
```

Then open <http://localhost:8000>. No installs needed; both libraries load from jsDelivr.

## 🪜 How it was built

One commit per step, so the history shows the order:

1. Plain page, everything already sorted, no motion
2. Each note gets a messy starting spot
3. Smooth scrolling with Lenis
4. The sort connected to scrolling with StringTune
5. Phone parallax, small screens and the no-animation fallback
6. README

## 🎨 Inspiration

[lenis.dev](https://lenis.dev/) and [StringTune](https://string-tune.fiddle.digital/).
