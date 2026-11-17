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
  tune.use(StringTune.StringProgress); // sets --sort from 0 to 1 on the sort section
  tune.use(StringTune.StringSplit);    // splits each stage name into letters
  tune.use(StringTune.StringParallax); // moves the phone a little slower than the page
  tune.start(60);
} else {
  // Less motion was asked for, or a library didn't load: show everything already sorted.
  root.classList.remove('motion');
}
