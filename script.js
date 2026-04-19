/* ─────────────────────────────────────────────────────────────
   Lanterns to Stars — script.js
   Each submitted thought becomes a glowing lantern that floats
   upward and settles into the sky as a twinkling star.
───────────────────────────────────────────────────────────── */

const sky     = document.getElementById('sky');
const input   = document.getElementById('thought');
const sendBtn = document.getElementById('send');
const hint    = document.getElementById('hint');

/* ── Utility: random float between [min, max] ── */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ── Utility: clamp a value within [lo, hi] ── */
function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

/* ── Pre-populate a handful of ambient background stars ──────
   These give the sky life before the user has done anything.  */
function seedAmbientStars(count = 80) {
  for (let i = 0; i < count; i++) {
    spawnStar(
      rand(1, 99) + '%',   // sx: spread across full width
      rand(2, 99) + '%',   // sy: upper 75% of screen
      rand(0.3, 0.55),     // base opacity: dimmer ambient stars
      rand(2, 5),        // size in px
      0                    // no appear delay needed for ambient
    );
  }
}

/* ── Create a permanent star at (sx, sy) in the sky ──────────
   Called when a lantern reaches its destination.              */
function spawnStar(sx, sy, baseOpacity, size, appearDelay) {
  const star = document.createElement('div');
  star.className = 'star';

  /* Each star gets its own random twinkle timing */
  star.style.setProperty('--sx', sx);
  star.style.setProperty('--sy', sy);
  star.style.setProperty('--base-opacity', baseOpacity);
  star.style.setProperty('--size', size + 'px');
  star.style.setProperty('--twinkle-dur',   rand(2.5, 7) + 's');
  star.style.setProperty('--twinkle-delay', rand(0, 4) + 's');

  /* Delay the appear animation if needed */
  // star.style.animationDelay = appearDelay + 's, ' + rand(0, 0) + 's';

  sky.appendChild(star);
}

/* ── Create and animate a lantern, then convert to a star ────
   thought : string — the user's input text                    */
function releaseLantern(thought) {
  const lantern = document.createElement('div');
  lantern.className = 'lantern';

  /* ── Build lantern DOM ── */
  const orb    = document.createElement('div');
  orb.className = 'lantern-orb';

  const string = document.createElement('div');
  string.className = 'lantern-string';

  const label  = document.createElement('div');
  label.className = 'lantern-text';
  label.textContent = thought;

  lantern.appendChild(orb);
  lantern.appendChild(string);
  if (thought) lantern.appendChild(label);

  /* ── Position: start near bottom center with small random offset ── */
  const startX   = clamp(rand(10, 90), 5, 95);   // % from left, near center
  const startY   = window.innerHeight * 0.82;     // 82% down the screen (px)
  const targetY  = window.innerHeight * rand(0.10, 0.5); // 10% to 75% from top

  /* Gentle horizontal drift as it rises */
  const driftStart = rand(-8, 8) + 'px';
  const driftEnd   = rand(-35, 35) + 'px';

  /* Animation duration: slow and calming */
  const duration = rand(9, 13) + 's';

  lantern.style.setProperty('--x',           startX + '%');
  lantern.style.setProperty('--y',           startY + 'px');
  lantern.style.setProperty('--target-y',    targetY + 'px');
  lantern.style.setProperty('--drift-start', driftStart);
  lantern.style.setProperty('--drift-end',   driftEnd);
  lantern.style.setProperty('--duration',    duration);
  lantern.style.setProperty('--delay',       '0s');

  sky.appendChild(lantern);

  /* ── When the float animation ends, replace lantern with a star ── */
  lantern.addEventListener('animationend', () => {
    /* Get the exact position of the orb before removing the lantern.
       This ensures the star appears exactly where the orb was,
       accounting for scaling, drift, and internal offsets. */
    const orbRect = orb.getBoundingClientRect();
    const finalX  = ((orbRect.left + orbRect.width / 2) / window.innerWidth) * 100;
    const finalY  = ((orbRect.top + orbRect.height / 2) / window.innerHeight) * 100;

    /* Remove the lantern element */
    lantern.remove();

    spawnStar(
      finalX + '%',
      finalY + '%',
      rand(0.55, 0.85),   // slightly brighter — it was a thought
      rand(5, 6),       // slightly larger than ambient stars
      0
    );
  });
}

/* ── Handle submission ────────────────────────────────────── */
function handleSubmit() {
  const text = input.value.trim();

  /* Always release a lantern even if the field is empty — an
     empty lantern is a wordless thought, which is also valid. */
  releaseLantern(text);

  /* Clear and refocus the input */
  input.value = '';
  input.focus();

  /* Fade hint out after first use */
  hint.style.opacity = '0';
}

const fullscreenBtn = document.getElementById('fullscreen-btn');

/* ── Fullscreen Toggle ────────────────────────────────────── */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

/* ── Sync Fullscreen UI ──────────────────────────────────── */
document.addEventListener('fullscreenchange', () => {
  const isFS = !!document.fullscreenElement;
  fullscreenBtn.innerHTML = isFS
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4"></path></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`;
});

/* ── Event listeners ─────────────────────────────────────── */
sendBtn.addEventListener('click', handleSubmit);
fullscreenBtn.addEventListener('click', toggleFullscreen);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSubmit();
});

/* ── Boot ─────────────────────────────────────────────────── */
seedAmbientStars(10);
input.focus();
