// Programme orbs: glass spheres (programme art under a lens) on floating stone platforms.
// DOM-driven: each orb tracks its <li>, so the existing GSAP reveal (scale/opacity/y) animates the 3D too.
import { Scene, PerspectiveCamera, Group, Mesh, SphereGeometry, CylinderGeometry, MeshBasicMaterial, MeshStandardMaterial, ShaderMaterial, AdditiveBlending,
  PointLight, HemisphereLight, TextureLoader, SRGBColorSpace, Sprite, SpriteMaterial, CanvasTexture } from 'three';
import { makeStage, glowTexture } from './util.js';

export function orbs(canvas, host, items) {
  const stage = makeStage(canvas, host), { renderer } = stage;
  const scene = new Scene(), cam = new PerspectiveCamera(30, 1, 10, 4000); cam.position.z = 1000;
  scene.add(new HemisphereLight(0xffe7c2, 0x1a2a30, 0.9));
  const loader = new TextureLoader().setCrossOrigin('anonymous'), glow = glowTexture(CanvasTexture);
  const sph = new SphereGeometry(1, 48, 32), shellG = new SphereGeometry(1.07, 48, 32);
  const p = sph.attributes.position, uv = sph.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) * 0.5 + 0.5, p.getY(i) * 0.5 + 0.5); // planar projection = lens look
  const stoneG = new CylinderGeometry(1, 1.16, 0.34, 9, 1); { const q = stoneG.attributes.position; for (let i = 0; i < q.count; i++) { const h = Math.sin(i * 12.9898) * 43758.5453; q.setX(i, q.getX(i) * (1 + (h - Math.floor(h) - 0.5) * 0.14)); q.setZ(i, q.getZ(i) * (1 + (Math.sin(i * 78.233) * 9e3 % 1) * 0.07)); } stoneG.computeVertexNormals(); }
  const rim = new ShaderMaterial({ transparent: true, depthWrite: false, blending: AdditiveBlending, uniforms: { uO: { value: 1 }, uH: { value: 0 } },
    vertexShader: 'varying vec3 vN,vV; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'varying vec3 vN,vV; uniform float uO,uH; void main(){ float f=pow(1.-abs(dot(vN,vV)),2.6); gl_FragColor=vec4(vec3(1.,.82,.5)*f*(1.1+uH),f*.9*uO); }' });
  // Cover-crop any photo aspect into the square lens; fall back to the local artwork if the photo cannot load.
  const loadInto = (mat, u, fb) => loader.load(u, t => {
    t.colorSpace = SRGBColorSpace; t.anisotropy = 4; const a = t.image.width / t.image.height;
    if (a > 1) { t.repeat.x = 1 / a; t.offset.x = (1 - 1 / a) / 2; } else { t.repeat.y = a; t.offset.y = (1 - a) / 2; }
    mat.map = t; mat.color.set(0xffffff); mat.needsUpdate = true;
  }, undefined, () => { if (fb && fb !== u) loadInto(mat, fb); });
  const nodes = items.map(li => {
    const g = new Group(), img = li.querySelector('.orb__img');
    const orbMat = new MeshBasicMaterial({ transparent: true, color: 0x1c3a40 }); loadInto(orbMat, img.currentSrc || img.src, img.dataset.fallbackSrc);
    const orb = new Mesh(sph, orbMat), shell = new Mesh(shellG, rim.clone());
    const stoneMat = new MeshStandardMaterial({ color: 0x5b554b, roughness: 0.95, flatShading: true, transparent: true });
    const stone = new Mesh(stoneG, stoneMat);
    const halo = new Sprite(new SpriteMaterial({ map: glow, blending: AdditiveBlending, transparent: true, depthWrite: false }));
    const light = new PointLight(0xffc97a, 0, 0, 1.4);
    g.add(stone, orb, shell, halo, light); scene.add(g);
    return { g, orb, orbMat, shell, stone, stoneMat, halo, light, li, img, hot: 0, target: 0 };
  });
  items.forEach((li, i) => { const on = v => () => (nodes[i].target = v); li.addEventListener('mouseenter', on(1)); li.addEventListener('mouseleave', on(0)); li.addEventListener('focusin', on(1)); li.addEventListener('focusout', on(0)); });
  const m = { x: 0, y: 0 };
  host.addEventListener('pointermove', e => { const r = host.getBoundingClientRect(); m.x = (e.clientX - r.left) / r.width - 0.5; m.y = (e.clientY - r.top) / r.height - 0.5; }, { passive: true });
  stage.onResize(s => { cam.aspect = s.w / s.h; cam.fov = 2 * Math.atan(s.h / 2 / 1000) * 180 / Math.PI; cam.updateProjectionMatrix(); });
  stage.onFrame((t, dt) => {
    const c = host.getBoundingClientRect();
    nodes.forEach((n, i) => {
      const r = n.img.getBoundingClientRect(), rad = Math.max(1, r.width / 2), op = +getComputedStyle(n.li).opacity;
      n.g.visible = op > 0.02; if (!n.g.visible) return;
      n.hot += (n.target - n.hot) * Math.min(1, dt * 7);
      const cx = r.left + r.width / 2 - c.left - c.width / 2, cy = c.height / 2 - (r.top + r.height / 2 - c.top), bob = Math.sin(t * 1.1 + i * 1.3) * 5;
      const k = 1 + n.hot * 0.07;
      n.orb.position.set(cx, cy + bob + n.hot * 6, 0); n.orb.scale.setScalar(rad * k); n.shell.position.copy(n.orb.position); n.shell.scale.setScalar(rad * k);
      n.orb.rotation.set(m.y * 0.35, m.x * 0.5 + Math.sin(t * 0.5 + i) * 0.08, 0); 
      n.stone.position.set(cx, cy - rad - rad * 0.17 + 9, -rad * 0.2); n.stone.scale.set(rad * 0.98, rad, rad * 0.98); n.stone.rotation.y = i * 0.7;
      n.halo.position.set(cx, cy + bob, -rad * 0.6); n.halo.scale.setScalar(rad * (3.1 + n.hot * 0.6)); n.halo.material.opacity = (0.5 + 0.12 * Math.sin(t * 1.6 + i) + n.hot * 0.3) * op;
      n.light.position.set(cx, cy + bob + rad * 0.2, rad * 1.1); n.light.intensity = (2.2 + n.hot * 2.5) * op * Math.pow(rad * 1.3, 1.4); // physical units: scale with distance^decay n.light.distance = rad * 5;
      n.orbMat.opacity = op; n.shell.material.uniforms.uO.value = op; n.shell.material.uniforms.uH.value = n.hot; n.stoneMat.opacity = op;
    });
    renderer.render(scene, cam);
  });
  stage.start(); return stage;
}
