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

  // Measure again whenever the window changes size (at most once per frame)
  let queued = false;
  function remeasure() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fitPhone();
    });
  }

  fitPhone();
  window.addEventListener('resize', remeasure);
  document.fonts?.ready.then(remeasure);   // text can change height once fonts finish loading
}
