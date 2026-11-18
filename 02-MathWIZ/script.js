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

// Each page's HTML lives in a <template id="page-..."> in index.html.
function loadPage(page) {
  const template = document.getElementById(`page-${page}`);
  if (!template) return;
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

function getInputValues() {
  const a = parseFloat(document.getElementById('firstTerm')?.value || '1');
  const d = parseFloat(document.getElementById('common')?.value || '1');
  const n = parseInt(document.getElementById('terms')?.value || '10');
  return { a, d, n };
}

function displaySeries(series, title) {
  const out = document.getElementById('output');
  if (out) {
    out.innerHTML = `<h4>${title}</h4><div>${series.join(', ')}</div>`;
  }
}

function generateAP() {
  const { a, d, n } = getInputValues();
  const s = [];
  for (let i = 0; i < n; i++) { s.push(a + i * d); }
  displaySeries(s, 'Arithmetic Progression (AP)');
}

function generateGP() {
  const { a, d, n } = getInputValues();
  const s = [];
  for (let i = 0; i < n; i++) { s.push(a * Math.pow(d, i)); }
  displaySeries(s, 'Geometric Progression (GP)');
}

function generateHP() {
  const { a, d, n } = getInputValues();
  const s = [];
  for (let i = 0; i < n; i++) {
    const ap = a + i * d;
    s.push((1 / ap).toFixed(4));
  }
  displaySeries(s, 'Harmonic Progression (HP)');
}

function generateFibonacci() {
  const { n } = getInputValues();
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
    if (mesh) scene.remove(mesh);
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
  (function animate() {
    requestAnimationFrame(animate);
    if (mesh) { mesh.rotation.y += 0.007; }
    renderer.render(scene, camera);
  })();
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
