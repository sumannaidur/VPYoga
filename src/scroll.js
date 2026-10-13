import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrubSurya } from './surya.js';
import { state } from './gl/state.js';
gsap.registerPlugin(ScrollTrigger);

const PRI = { hero: 60, journey: 50, orbs: 40, surya: 30, med: 20, cta: 10 }; // page order, top to bottom
const S = (trigger, extra = {}) => ({ trigger, start: 'top top', end: '+=100%', scrub: 0.6, ...extra });

export function initScroll() {
  const mm = gsap.matchMedia();
  // Reduced motion: no scrubbed or pinned animation. All content stays in normal flow.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    mm.add('(min-width: 1001px)', () => {
      // Hero: pinned; the sun rises behind the figure and the camera drifts in.
      const h = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: S('.hero', { refreshPriority: PRI.hero, end: '+=90%', pin: '.hero__stage', anticipatePin: 1 }) });
      h.to(state.hero, { rays: 0.5, scroll: 1, lift: 0.1 }, 0).to('.hero__bg', { scale: 1.16, yPercent: -3 }, 0).to('.hero__sun', { top: '24%', scale: 1.3 }, 0)
        .to('.hero__yogi', { yPercent: -4, scale: 1.05 }, 0).to('.hero__mist--a', { xPercent: 8 }, 0)
        .to('.hero__copy', { opacity: 0, y: -70 }, 0.35);
      // Meditation: pinned; light grows and the scene opens as you scroll.
      meditation(true);
    });
    mm.add('(max-width: 1000px)', () => {
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: S('.hero', { refreshPriority: PRI.hero, start: 'top top', end: 'bottom top' }) })
        .to(state.hero, { rays: 0.9, scroll: 1, lift: 0.08 }, 0).to('.hero__bg', { yPercent: 8 }, 0).to('.hero__sun', { top: '28%' }, 0);
      meditation(false);
    });

    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: S('.journey', { refreshPriority: PRI.journey, start: 'top bottom', end: 'bottom top' }) })
      .fromTo('.journey__bg', { yPercent: -8 }, { yPercent: 8 }, 0).fromTo('.journey__fig img', { yPercent: 6, scale: 0.96 }, { yPercent: -6, scale: 1.03 }, 0);
    gsap.from('.benefits li', { x: 60, opacity: 0, stagger: 0.25, ease: 'none', scrollTrigger: { trigger: '.benefits', start: 'top 85%', end: 'top 35%', scrub: 0.6 } });
    gsap.from('.orb', { y: 90, scale: 0.7, opacity: 0, stagger: 0.18, ease: 'none', scrollTrigger: { refreshPriority: PRI.orbs, trigger: '.orbs', start: 'top 90%', end: 'center 55%', scrub: 0.6 } });
    gsap.fromTo('.cta__bg', { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: S('.cta', { refreshPriority: PRI.cta, start: 'top bottom', end: 'bottom top' }) });
    gsap.fromTo(state.cta, { scroll: 0, rays: 0.2 }, { scroll: 1, rays: 0.8, ease: 'none', scrollTrigger: S('.cta', { refreshPriority: PRI.cta, start: 'top bottom', end: 'bottom top' }) });
    mm.add('(min-width: 1001px)', () => scrubSurya(gsap, 55));
    mm.add('(max-width: 1000px)', () => scrubSurya(gsap, 40));
  });
}

function meditation(pin) {
  const t = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: pin ? S('.med__stage', { refreshPriority: PRI.med, end: '+=110%', pin: true, anticipatePin: 1 })
    : S('.med__stage', { refreshPriority: PRI.med, start: 'top 80%', end: 'bottom 30%' }) });
  t.fromTo(state.lotus, { open: 0 }, { open: 1 }, 0).fromTo('.med__bg', { scale: 1.02, filter: 'brightness(.55)' }, { scale: 1.2, filter: 'brightness(1.05)' }, 0)
    .fromTo('.med__glow', { scale: 0.3, opacity: 0.1 }, { scale: 1.15, opacity: 1 }, 0)
    .fromTo('.med__rays', { opacity: 0, rotate: -6 }, { opacity: 1, rotate: 6 }, 0.1)
    .fromTo('.med__copy', { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.05);
}

export function initRail() {
  const secs = [...document.querySelectorAll('[data-rail]')];
  const rail = document.querySelector('.rail');
  rail.innerHTML = secs.map(s => `<li><a href="#${s.id}"><span>${s.dataset.rail}</span></a></li>`).join('');
  const links = [...rail.querySelectorAll('a')];
  secs.forEach((s, i) => ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%',
    onToggle: self => self.isActive && links.forEach((l, k) => { l.classList.toggle('is-on', k === i); k === i ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current'); }) }));
  ScrollTrigger.create({ start: 60, end: 'max', onToggle: self => document.getElementById('nav').classList.toggle('is-solid', self.isActive) });
}
export const refresh = () => ScrollTrigger.refresh();
