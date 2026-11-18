// Runs after the page and both libraries have loaded.
const root = document.documentElement;
const librariesLoaded = typeof Lenis !== 'undefined' && typeof StringTune !== 'undefined';

if (root.classList.contains('motion') && librariesLoaded) {
  // Smooth scrolling: Lenis eases the page toward where the wheel or trackpad sent it.
  new Lenis({ autoRaf: true, anchors: true });

  // Scroll effects: StringTune turns the scroll position into numbers the CSS can use.
  const tune = StringTune.StringTune.getInstance();
  tune.scrollDesktopMode = 'default'; // Lenis already smooths the scroll, StringTune only reads it
  tune.scrollMobileMode = 'default';
  tune.use(StringTune.StringProgress); // sets --story from 0 to 1 on the story section
  tune.use(StringTune.StringSplit);    // splits each stage name into letters
  tune.start(60);

  setUpStory();
} else {
  // Less motion was asked for, or a library didn't load: show everything already sorted.
  root.classList.remove('motion');
}


// ---------- The story: measurements the CSS can't make by itself ----------
function setUpStory() {
  const story = document.querySelector('.story');
  const pin = story.querySelector('.story-pin');
  const pocketText = story.querySelector('.pocket-text');
  const board = story.querySelector('.board');
  const phone = story.querySelector('.phone');
  const rows = phone.querySelector('.rows');
  const stacked = matchMedia('(max-width: 700px)');   // the same width where style.css stacks the text above the phone
  const PHONE_HEIGHT = 670;                           // .phone's height in style.css

  // How much to shrink the phone so it fits the screen while pinned (1 = full size)
  function fitPhone() {
    const space = stacked.matches
      ? pin.clientHeight - pocketText.offsetHeight - 120   // room left under the text, the top bar and the gaps
      : pin.clientHeight - 140;                            // room left under the top bar, with a little below
    const fit = Math.min(1, Math.max(0.4, space / PHONE_HEIGHT));
    story.style.setProperty('--fit', fit.toFixed(3));
  }

  // Where the sorted board has to fly to land on the phone's list, for style.css
  function measureFlight() {
    story.classList.add('measuring');           // take the flight off for a moment...
    const b = board.getBoundingClientRect();    // ...so these are the real resting places
    const r = rows.getBoundingClientRect();
    const p = phone.getBoundingClientRect();
    story.classList.remove('measuring');

    const fit = parseFloat(story.style.getPropertyValue('--fit')) || 1;
    const boardMiddle = { x: b.left + b.width / 2, y: b.top + b.height / 2 };
    const listMiddle = { x: r.left + r.width / 2, y: r.top + r.height / 2 };

    story.style.setProperty('--fly-x', `${listMiddle.x - boardMiddle.x}px`);
    story.style.setProperty('--fly-y', `${listMiddle.y - boardMiddle.y}px`);
    story.style.setProperty('--fly-s', (r.width / b.width).toFixed(4));
    // the middle of the list, in the phone's own (unshrunk) pixels
    story.style.setProperty('--rows-x', `${(listMiddle.x - p.left) / fit}px`);
    story.style.setProperty('--rows-y', `${(listMiddle.y - p.top) / fit}px`);
  }

  function measure() {
    fitPhone();        // first the phone's size...
    measureFlight();   // ...then the flight, which depends on it
  }

  // Measure again whenever the window changes size (at most once per frame)
  let queued = false;
  function remeasure() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      measure();
    });
  }

  measure();
  window.addEventListener('resize', remeasure);
  document.fonts?.ready.then(remeasure);   // text can change size once fonts finish loading

  startConstellation(story);
}


// ---------- The constellation behind the story (MathWIZ's particles, in Pursuit's colours) ----------
function startConstellation(story) {
  if (typeof particlesJS === 'undefined') return;   // the library didn't load: the story works without it

  // the five stage colours, read from style.css so they live in one place
  const css = getComputedStyle(document.documentElement);
  const stageColours = ['--wishlist', '--applied', '--interviewing', '--offer', '--rejected']
    .map(name => css.getPropertyValue(name).trim());

  particlesJS('constellation', {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 900 } },
      color: { value: stageColours },
      shape: { type: 'circle' },
      opacity: { value: 0.85 },
      size: { value: 4, random: true },
      line_linked: { enable: true, distance: 160, color: '#8f97f2', opacity: 0.55, width: 1.2 },  // a light Pursuit indigo
      move: { enable: true, speed: 1.4, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'window',   // the scenes sit on top of the canvas, so listen to the whole window
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: false }, resize: true },
      modes: { grab: { distance: 180, line_linked: { opacity: 1 } } }
    },
    retina_detect: true
  });

  // Only animate while the story is on screen. particles.js stops its loop when movement is off,
  // and draw() starts it again.
  const pJS = window.pJSDom[window.pJSDom.length - 1].pJS;
  let running = true;
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting === running) return;
    running = entry.isIntersecting;
    pJS.particles.move.enable = running;
    if (running) pJS.fn.vendors.draw();
  }).observe(story);
}
