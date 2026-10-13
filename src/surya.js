import { state } from './gl/state.js';
import { SURYA } from './data.js';
const $ = (s, r = document) => r.querySelector(s);

// Build once. Image-based pose player: swap this module's `show()` for a GLB/AnimationMixer
// driver when a rigged model with clips exists (the supplied GLB is a single cube).
const mandala = () => {
  const dots = SURYA.map((_, i) => { const a = (i / 12) * Math.PI * 2 - Math.PI / 2; return `<circle class="dot" cx="${(46 * Math.cos(a)).toFixed(2)}" cy="${(46 * Math.sin(a)).toFixed(2)}" r="1.7"/>`; }).join('');
  const petals = SURYA.map((_, i) => `<ellipse cx="0" cy="-33" rx="3.4" ry="9" transform="rotate(${i * 30})"/>`).join('');
  return `<svg class="surya__mandala" viewBox="-50 -50 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".35"><circle r="46"/><circle r="41" stroke-dasharray="1 2.2"/><circle r="24"/>${petals}</g>${dots}</svg>`;
};
export function buildSurya() {
  $('.surya__fig').insertAdjacentHTML('afterbegin', mandala());
  $('.surya__imgs').innerHTML = SURYA.map(s => `<img src="/assets/${'poses/clean/step-' + String(s.n).padStart(2, '0')}.webp" alt="" ${s.n > 1 ? 'loading="lazy"' : ''}>`).join('');
  $('.thumbs').innerHTML = SURYA.map((s, i) => `<li><button data-i="${i}" aria-label="Step ${s.n}: ${s.name}"><img src="/assets/${s.img}" alt=""></button></li>`).join('');
}

let current = -1, trigger = null;
export function setStep(i) {
  i = Math.max(0, Math.min(SURYA.length - 1, i));
  if (i === current) return;
  current = i;
  const s = SURYA[i];
  document.querySelectorAll('.surya__imgs img').forEach((im, k) => { im.classList.toggle('is-on', k === i); im.alt = k === i ? `${s.name}, ${s.en}` : ''; });
  document.querySelectorAll('.surya__mandala .dot').forEach((d, k) => d.classList.toggle('on', k <= i));
  document.querySelectorAll('.thumbs button').forEach((b, k) => b.setAttribute('aria-current', k === i));
  $('#s-n').textContent = s.n; $('#s-name').textContent = s.name; $('#s-en').textContent = `(${s.en})`;
  $('#s-breath').textContent = s.breath; $('#s-tips').innerHTML = s.tips.map(t => `<li>${t}</li>`).join('');
  $('#s-prev').disabled = i === 0; $('#s-next').textContent = i === SURYA.length - 1 ? 'Start again' : 'Next step';
  const t = document.querySelector('.thumbs button[aria-current=true]'); // keep thumbnail in view on small screens
  t?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'auto' });
}

// Scroll is the source of truth: buttons and thumbnails scroll to the step's slice of the pinned range.
function goTo(i) {
  i = (i + SURYA.length) % SURYA.length;
  if (!trigger) return setStep(i);
  window.scrollTo({ top: trigger.start + ((i + 0.5) / SURYA.length) * (trigger.end - trigger.start) });
}

export function wireSuryaControls() {
  $('#s-next').addEventListener('click', () => goTo(current + 1));
  $('#s-prev').addEventListener('click', () => goTo(current - 1));
  $('.thumbs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) goTo(+b.dataset.i); });
  setStep(0);
}

export function scrubSurya(gsap, perStepVh) {
  const stage = $('.surya__stage');
  // Lighting: the sun climbs and warms as steps progress; reversible because it is scrubbed.
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { refreshPriority: 30,
    trigger: stage, start: 'top top', end: () => `+=${perStepVh * SURYA.length}%`, pin: true, scrub: 0.4, anticipatePin: 1,
    onUpdate: self => setStep(Math.floor(self.progress * SURYA.length)),
    onRefresh: self => { trigger = self; } } });
  tl.to(state.surya, { rays: 0.85, scroll: 1, lift: 0.12 }, 0).fromTo('.surya__mandala', { rotation: 0 }, { rotation: 360 }, 0).fromTo('.surya__sun', { yPercent: 40, scale: 0.8, opacity: 0.6 }, { yPercent: -20, scale: 1.1, opacity: 1 }, 0)
    .fromTo('.surya__stage', { '--tone': 0 }, { '--tone': 1 }, 0)
    .fromTo('.surya__imgs', { y: 6 }, { y: -6 }, 0);
  trigger = tl.scrollTrigger;
}
