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
      rand(2, 75) + '%',   // sy: upper 75% of screen
      rand(0.3, 0.55),     // base opacity: dimmer ambient stars
      rand(1, 2.5),        // size in px
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
  star.style.animationDelay = appearDelay + 's, ' + rand(0, 3) + 's';

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
  const startX   = clamp(rand(42, 58), 5, 95);   // % from left, near center
  const startY   = window.innerHeight * 0.82;     // 82% down the screen (px)
  const targetY  = window.innerHeight * 0.06;     // 6% from top (px)

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
    /* Remove the lantern element */
    lantern.remove();

    /* Calculate approximate final screen position as percentages.
       The drift-end offset is a px value — convert to % of width. */
    const driftPx  = parseFloat(driftEnd);
    const finalXpx = (startX / 100) * window.innerWidth + driftPx;
    const finalX   = clamp((finalXpx / window.innerWidth) * 100, 2, 98);
    const finalY   = clamp((targetY  / window.innerHeight) * 100, 2, 40);

    spawnStar(
      finalX + '%',
      finalY + '%',
      rand(0.55, 0.85),   // slightly brighter — it was a thought
      rand(1.5, 3),       // slightly larger than ambient stars
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

/* ── Event listeners ─────────────────────────────────────── */
sendBtn.addEventListener('click', handleSubmit);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSubmit();
});

/* ── Boot ─────────────────────────────────────────────────── */
seedAmbientStars(80);
input.focus();
