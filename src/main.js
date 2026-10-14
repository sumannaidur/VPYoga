import './styles.css';
import { PROGRAMMES } from './data.js';
import { initEnquiry } from './enquiry.js';
import { buildSurya, wireSuryaControls } from './surya.js';
import { initScroll, initRail, refresh } from './scroll.js';
import { state } from './gl/state.js';
import { webglOK } from './gl/support.js';

const $ = (s, r = document) => r.querySelector(s);

// Programme orbs + footer links. Each programme opens the enquiry form pre-filled (no per-programme pages exist yet).
$('.orbs').innerHTML = PROGRAMMES.map(p => `<li id="programme-${p.id}"><a class="orb" href="#" data-enquire="${p.title}" aria-label="Enquire about ${p.title}">
  <img class="orb__img" src="/assets/programmes/orb-${p.id}.webp" alt="" loading="lazy" width="190" height="190"><span class="orb__base" aria-hidden="true"></span>
  <h3>${p.title}</h3><small>${p.tag}</small><p>${p.text}</p></a></li>`).join('');
$('.foot__prog').insertAdjacentHTML('beforeend', PROGRAMMES.map(p => `<a href="#" data-enquire="${p.title}">${p.title}</a>`).join(''));

// Nav
const menu = $('#menu'), toggle = $('.nav__toggle');
toggle.addEventListener('click', () => { const o = menu.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', o); });
menu.addEventListener('click', e => { if (e.target.closest('a,button')) { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', false); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape') menu.classList.remove('is-open'); });

// Optional, silent breathing guide: inhale 4s, hold 4s, exhale 6s.
const btn = $('#breath-btn'), txt = $('#breath-text'); let timer;
const phases = [['Inhale', 'in', 4000], ['Hold', 'hold', 4000], ['Exhale', 'out', 6000]];
function breathe(i = 0) {
  const [label, cls, ms] = phases[i % 3];
  btn.className = 'breath__orb ' + cls; txt.textContent = label;
  timer = setTimeout(() => breathe(i + 1), ms);
}
btn.addEventListener('click', () => {
  const on = btn.getAttribute('aria-pressed') !== 'true';
  btn.setAttribute('aria-pressed', on); clearTimeout(timer);
  if (on) requestAnimationFrame(() => breathe()); else { btn.className = 'breath__orb'; txt.textContent = 'Start'; }
});
window.addEventListener('pagehide', () => clearTimeout(timer));

// A missing image should never leave a broken-image icon.
document.addEventListener('error', e => { if (e.target.tagName === 'IMG') e.target.style.visibility = 'hidden'; }, true);

buildSurya(); wireSuryaControls(); initEnquiry(PROGRAMMES); initRail(); initScroll();
addEventListener('load', refresh);
// Lazy images can shift layout after ScrollTrigger measured it; re-measure (debounced).
let rt; document.addEventListener('load', e => { if (e.target.tagName === 'IMG') { clearTimeout(rt); rt = setTimeout(refresh, 200); } }, true);

// ---- WebGL scenes: lazy-loaded when their section is near the viewport; skipped for reduced motion or no WebGL.
// Every scene has an HTML/image fallback already in the page, so a failure only costs the extra polish.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && webglOK()) {
  const when = (host, load) => {
    const io = new IntersectionObserver(es => {
      if (!es.some(e => e.isIntersecting)) return; io.disconnect();
      load().then(() => host.classList.add('gl-on')).catch(err => console.warn('3D scene disabled:', host.id || host.className, err));
    }, { rootMargin: '700px' });
    io.observe(host);
  };
  const amb = (sel, stageSel, st, o) => () => import('./gl/ambient.js').then(g => g.ambient($(sel), $(stageSel), st, o));
  when($('.hero'), amb('#fx-hero', '.hero__stage', state.hero, { count: 320, sun: [0.61, 0.62] }));
  when($('.surya'), amb('#fx-surya', '.surya__stage', state.surya, { count: 190, sun: [0.7, 0.66] }));
  when($('.cta'), amb('#fx-cta', '.cta', state.cta, { count: 170, sun: [0.73, 0.58], colors: ['#ffe0a0', '#ff8f3a'] }));
}
