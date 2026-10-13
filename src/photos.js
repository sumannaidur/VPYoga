import PHOTOS from './photos.json';
// <img data-photo="id" src="local-fallback">: swaps in licensed photography (responsive srcset).
// local=false -> Pexels CDN; local=true -> files from scripts/fetch-photos.py in /assets/photos/.
// If the photo fails to load, the element reverts to its original local artwork, so nothing breaks.
const WIDTHS = [640, 1280, 1920, 2560];
const url = (id, p, w) => p.local ? `/assets/photos/${id}-${w}.webp` : `${p.cdn}?auto=compress&cs=tinysrgb&w=${w}`;
export const photo = id => PHOTOS.photos[id];

export function applyPhotos(root = document) {
  root.querySelectorAll('img[data-photo]').forEach(img => {
    const id = img.dataset.photo, p = PHOTOS.photos[id]; if (!p) return;
    const fb = img.getAttribute('src'), fbAlt = img.dataset.altFallback ?? img.alt;
    img.dataset.fallbackSrc = fb;
    img.addEventListener('error', () => { img.onerror = null; img.removeAttribute('srcset'); img.src = fb; img.alt = fbAlt; img.dataset.photoFallback = '1'; img.style.objectPosition = ''; img.style.visibility = ''; }, { once: true });
    img.addEventListener('load', () => { if (!img.dataset.photoFallback && (img.currentSrc.includes('pexels') || img.currentSrc.includes('/assets/photos/'))) img.closest('[data-photo-scope]')?.classList.add('photo-on'); });
    img.sizes = img.dataset.sizes || '100vw';
    img.srcset = WIDTHS.map(w => `${url(id, p, w)} ${w}w`).join(', '); img.src = url(id, p, 1280);
    img.style.objectPosition = p.position; img.alt = img.dataset.alt === 'none' ? '' : p.alt;
  });
}
export function renderCredits(el) {
  el.innerHTML = Object.values(PHOTOS.photos).map(p => `<li>${p.slot}: <a href="${p.page}" rel="noopener">photo</a> by <a href="${p.photographerUrl}" rel="noopener">${p.photographer}</a> on <a href="https://www.pexels.com/" rel="noopener">Pexels</a></li>`).join('');
}
