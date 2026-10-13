import { WebGLRenderer } from 'three';
export const isSmall = () => matchMedia('(max-width: 700px)').matches;
export { webglOK } from './support.js';
// One stage = one renderer bound to a canvas. Renders only while its host is on screen.
export function makeStage(canvas, host) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !isSmall(), powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, isSmall() ? 1 : 1.75));
  const size = { w: 1, h: 1 }, frames = [], resizers = [];
  const t0 = performance.now(); let raf = 0, visible = true, last = 0, ready = false;
  const resize = () => {
    const r = host.getBoundingClientRect(); size.w = Math.max(1, r.width); size.h = Math.max(1, r.height);
    renderer.setSize(size.w, size.h, false); resizers.forEach(f => f(size));
  };
  const loop = now => {
    raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    const t = (now - t0) / 1000, dt = Math.min(0.05, t - last); last = t;
    frames.forEach(f => f(t, dt));
    if (!ready) { ready = true; canvas.dataset.gl = 'on'; }
  };
  const kick = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); });
  io.observe(host);
  const ro = new ResizeObserver(resize); ro.observe(host);
  document.addEventListener('visibilitychange', kick);
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); canvas.dataset.gl = 'lost'; cancelAnimationFrame(raf); raf = 0; visible = false; });
  resize();
  return { renderer, size, onFrame: f => frames.push(f), onResize: f => { resizers.push(f); f(size); }, start: kick,
    dispose() { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', kick); renderer.dispose(); } };
}
export const glowTexture = (CanvasTexture, a = 'rgba(255,236,190,1)', b = 'rgba(255,170,70,0)') => {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, a); r.addColorStop(0.35, 'rgba(255,200,120,.45)'); r.addColorStop(1, b);
  g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new CanvasTexture(c);
};
