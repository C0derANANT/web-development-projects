# Pursuit landing page

A one-page website for **Pursuit**, my job application tracker for iPhone. As you scroll, twelve messy job applications sort themselves into the app's five stages.

- **Live page:** <https://c0deranant.github.io/web-development-projects/pursuit-landing/>
- **The app:** [C0derANANT/ios-development › Pursuit](https://github.com/C0derANANT/ios-development/tree/main/Pursuit)

## The idea

Most people track a job hunt in scattered notes, tabs and emails. The page starts with that mess: a pile of tilted paper notes under the question "Where did I apply again?". Scrolling sorts them into Wishlist, Applied, Interviewing, Offer and Rejected, and each note takes its stage colour as it lands. Colour arrives with order.

## How the sort works

Each note has two places:

- a **messy** spot in the pile and a tilt, written in the HTML as `--x`, `--y` and `--tilt`
- a **tidy** spot, worked out from its stage (the column) and its slot (the row)

While the section is pinned, StringTune turns the scroll position into one number, `--sort`, that goes from 0 to 1. The CSS blends the two places with it:

```css
left: calc(var(--messy-left) * (1 - var(--q)) + var(--tidy-left) * var(--q));
```

At 0 the note is fully messy, at 1 it is fully tidy, and at 0.5 it is halfway. Columns further right start a little later, so the notes land left to right. On small screens the same formula runs with the axes swapped, so the stages become rows.

## Built with

- Plain HTML, CSS and a little JavaScript, with no build step
- [Lenis](https://lenis.dev/) for smooth scrolling
- [StringTune](https://string-tune.fiddle.digital/) for scroll progress, letter-by-letter stage names, and the phone's parallax

If the visitor's device asks for reduced motion, or a library fails to load, the page skips the animation and shows everything already sorted.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## How it was built

One commit per step, so the history shows the order:

1. Plain page, everything already sorted, no motion
2. Each note gets a messy starting spot
3. Smooth scrolling with Lenis
4. The sort connected to scrolling with StringTune
5. Phone parallax, small screens and the no-animation fallback
6. This README

## Inspiration

[lenis.dev](https://lenis.dev/) and [StringTune](https://string-tune.fiddle.digital/).
