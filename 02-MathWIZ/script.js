/* ==========================================================
   MathWIZ: script.js
   1. Sidebar menu
   2. Pages
   3. Home: maths facts
   4. Series Generator
   5. Graph Plotter (GeoGebra)
   6. 3D Shapes (Three.js)
   7. Particle background
   ========================================================== */

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const content = document.getElementById('content');


/* ---------- 1. Sidebar menu ---------- */

function setSidebar(open) {
  sidebar.style.left = open ? '0px' : `-${sidebar.offsetWidth}px`;
  content.style.marginLeft = open ? `${sidebar.offsetWidth}px` : '0';
  toggleBtn.setAttribute('aria-expanded', open);
}

toggleBtn.addEventListener('click', () => {
  const open = sidebar.style.left === '0px';
  setSidebar(!open);
});

sidebar.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-page]');
  if (!link) return;
  e.preventDefault();
  loadPage(link.dataset.page);
  if (window.innerWidth < 900) setSidebar(false);   // on small screens, close the menu after picking a page
});


/* ---------- 2. Pages ---------- */

// A page that keeps running in the background (the 3D viewer) leaves its stop function here.
let stopCurrentPage = null;

// Each page's HTML lives in a <template id="page-..."> in index.html.
function loadPage(page) {
  const template = document.getElementById(`page-${page}`);
  if (!template) return;
  if (stopCurrentPage) {
    stopCurrentPage();
    stopCurrentPage = null;
  }
  content.replaceChildren(template.content.cloneNode(true));

  if (page === 'home') showFacts();
  if (page === 'graph') setTimeout(graphInit, 0);    // wait one tick so the new box has its size
  if (page === 'shapes') setTimeout(shapesInit, 0);
}


/* ---------- 3. Home: maths facts ---------- */

const randomFacts = [
  "Zero is the only number that cannot be represented in Roman numerals.",
  "The Fibonacci sequence appears in nature, like sunflower seeds and pinecones.",
  "A circle has infinite lines of symmetry.",
  "The word 'mathematics' comes from the Greek word 'mathema', meaning knowledge.",
  "Euler’s identity e^(iπ) + 1 = 0 is often called the most beautiful equation.",
  "There are infinitely many prime numbers.",
  "The golden ratio is approximately 1.618, and it appears in art, nature, and architecture.",
  "Light travels about 299,792 kilometers per second.",
  "Pi (π) is an irrational number, meaning it never ends or repeats.",
  "Absolute zero is −273.15°C, the lowest possible temperature."
];

function showFacts() {
  const factBox = document.getElementById('factBox');
  factBox.innerHTML = randomFacts.map((fact, i) => `
    <p class="fact"><b>💡 Fact ${i + 1}:</b> ${fact}</p>
  `).join('');
}


/* ---------- 4. Series Generator ---------- */

const MAX_TERMS = 500;   // more than this freezes the page for no benefit

function getInputValues() {
  const a = parseFloat(document.getElementById('firstTerm')?.value || '1');
  const d = parseFloat(document.getElementById('common')?.value || '1');
  const n = Number(document.getElementById('terms')?.value || '10');   // Number, not parseInt, so 2.5 is caught
  return { a, d, n };
}

// Terms (n) must be a whole number from 1 to MAX_TERMS
function termsAreValid(n) {
  if (Number.isInteger(n) && n >= 1 && n <= MAX_TERMS) return true;
  showMessage(`Terms (n) must be a whole number from 1 to ${MAX_TERMS}.`);
  return false;
}

function showMessage(text) {
  const out = document.getElementById('output');
  if (out) out.innerHTML = `<p class="note">${text}</p>`;
}

function displaySeries(series, title, note = '') {
  const out = document.getElementById('output');
  if (!out) return;
  if (!note && series.some(x => typeof x === 'number' && !Number.isFinite(x))) {
    note = 'Some terms are too big for JavaScript numbers, so they show as Infinity.';
  }
  out.innerHTML = `<h4>${title}</h4><div>${series.join(', ')}</div>` +
    (note ? `<p class="note">${note}</p>` : '');
}

// Computers store decimals in binary, so 0.1 + 0.2 comes out as 0.30000000000000004.
// tidy() keeps 12 significant digits, which hides that noise, and turns a result that is
// tiny next to the numbers that made it (like 0.3 - 3 × 0.1) into a clean 0.
// Whole numbers have no noise, so they are left exactly as they are.
function tidy(x, scale = Math.abs(x)) {
  if (!Number.isFinite(x) || Number.isInteger(x)) return x;
  if (Math.abs(x) <= scale * 1e-12) return 0;
  return Number(x.toPrecision(12));
}

// The i-th term of an AP (counting from 0): a + i × d
function apTerm(a, d, i) {
  return tidy(a + i * d, Math.max(Math.abs(a), Math.abs(i * d)));
}

function generateAP() {
  const { a, d, n } = getInputValues();
  if (!termsAreValid(n)) return;
  const s = [];
  for (let i = 0; i < n; i++) { s.push(apTerm(a, d, i)); }
  displaySeries(s, 'Arithmetic Progression (AP)');
}

function generateGP() {
  const { a, d, n } = getInputValues();
  if (!termsAreValid(n)) return;
  const s = [];
  for (let i = 0; i < n; i++) { s.push(tidy(a * Math.pow(d, i))); }
  displaySeries(s, 'Geometric Progression (GP)');
}

function generateHP() {
  const { a, d, n } = getInputValues();
  if (!termsAreValid(n)) return;
  const s = [];
  let hasZero = false;
  for (let i = 0; i < n; i++) {
    const ap = apTerm(a, d, i);
    if (ap === 0) {
      s.push('undefined');    // 1 ÷ 0 has no value
      hasZero = true;
    } else {
      s.push((1 / ap).toFixed(4));
    }
  }
  displaySeries(s, 'Harmonic Progression (HP)',
    hasZero ? 'A term of the matching AP is 0, and 1 ÷ 0 has no value, so that HP term is undefined.' : '');
}

function generateFibonacci() {
  const { n } = getInputValues();
  if (!termsAreValid(n)) return;
  const s = [];
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    s.push(a);
    [a, b] = [b, a + b];
  }
  displaySeries(s, 'Fibonacci Series');
}

// The four buttons say which series they make with data-series="..."
const seriesGenerators = {
  ap: generateAP,
  gp: generateGP,
  hp: generateHP,
  fibonacci: generateFibonacci
};

content.addEventListener('click', (e) => {
  const button = e.target.closest('button[data-series]');
  if (button) seriesGenerators[button.dataset.series]();
});


/* ---------- 5. Graph Plotter (GeoGebra) ---------- */

function graphInit() {
  const box = document.getElementById('ggb-element');
  const params = {
    appName: 'graphing',
    width: box.clientWidth,
    height: box.clientHeight,
    showToolBar: false,
    showAlgebraInput: true,
    showMenuBar: false,
    enableShiftDragZoom: true,
    enableRightClick: false
  };
  const applet = new GGBApplet(params, true);
  applet.inject('ggb-element');
}


/* ---------- 6. 3D Shapes (Three.js) ---------- */

function shapesInit() {
  const container = document.getElementById('shapeContainer');
  if (!container) return;                    // you already left the page
  if (stopCurrentPage) stopCurrentPage();    // never run two viewers at once
  container.innerHTML = '';

  // Scene, camera and renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f1724);
  const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Drag to rotate, scroll to zoom
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  camera.position.set(4, 3, 6);
  controls.update();

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 1.0);
  dir.position.set(5, 5, 5);
  scene.add(dir);

  // The shape on show
  let mesh;
  function addShape(type) {
    if (mesh) {
      scene.remove(mesh);
      mesh.geometry.dispose();   // free the old shape's memory on the graphics card
      mesh.material.dispose();
    }
    let geometry;
    if (type === 'cube') geometry = new THREE.BoxGeometry(3.6, 3.6, 3.6);
    if (type === 'sphere') geometry = new THREE.SphereGeometry(2.8, 48, 32);
    if (type === 'cone') geometry = new THREE.ConeGeometry(2.6, 5.2, 64);
    const material = new THREE.MeshStandardMaterial({ color: 0x22c1c3, metalness: 0.3, roughness: 0.35 });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }
  addShape('cube');
  document.getElementById('shapeSelect').onchange = (e) => addShape(e.target.value);

  // Keep the picture sharp when the window changes size
  function onResize() {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // Spin the shape slowly, every frame
  let frameId;
  (function animate() {
    frameId = requestAnimationFrame(animate);
    if (mesh) { mesh.rotation.y += 0.007; }
    renderer.render(scene, camera);
  })();

  // loadPage calls this when you leave, so the loop, the listener and the WebGL canvas don't pile up
  stopCurrentPage = () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener('resize', onResize);
    controls.dispose();
    mesh.geometry.dispose();
    mesh.material.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };
}


/* ---------- 7. Particle background ---------- */

particlesJS('particles-js', {
  particles: {
    number: { value: 70, density: { enable: true, value_area: 800 } },
    color: { value: '#ffffff' },
    shape: { type: 'circle' },
    opacity: { value: 0.5 },
    size: { value: 3 },
    line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
    move: { enable: true, speed: 3, direction: 'none', random: false, straight: false, out_mode: 'out' }
  },
  interactivity: {
    detect_on: 'canvas',
    events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
    modes: { grab: { distance: 200, line_linked: { opacity: 0.7 } }, push: { particles_nb: 4 } }
  },
  retina_detect: true
});


/* ---------- Start on the home page ---------- */

loadPage('home');
