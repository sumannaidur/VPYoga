// Procedural 3D lotus + water + falling petals. Opening is driven by state.open (scrubbed by scroll).
import { Scene, PerspectiveCamera, Group, Mesh, PlaneGeometry, CircleGeometry, CylinderGeometry, MeshStandardMaterial, MeshBasicMaterial, ShaderMaterial, DoubleSide,
  HemisphereLight, PointLight, Sprite, SpriteMaterial, CanvasTexture, AdditiveBlending, InstancedMesh, Object3D, MathUtils } from 'three';
import { makeStage, glowTexture, isSmall } from './util.js';
import { particles } from './ambient.js';

// [petals, length, width, max open angle, phase] - outer rings open first, inner rings stay cupped.
const RINGS = [[8, 1.7, 0.74, 1.38, 0], [10, 1.55, 0.66, 1.08, 0.2], [12, 1.3, 0.58, 0.78, 0.1], [9, 0.95, 0.46, 0.42, 0.3]];

function petalGeo(len, w) {
  const g = new PlaneGeometry(1, 1, 6, 14); g.translate(0, 0.5, 0);
  const p = g.attributes.position, col = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), prof = Math.pow(Math.sin(Math.PI * Math.pow(y, 0.72)), 0.85);
    p.setXYZ(i, x * w * prof, y * len, (x * x * 1.1 + y * y * y * 0.35 + y * y * 0.1) * len * 0.5);
    const a = y < 0.45 ? [1, 0.84 + y * 0.2, 0.62 + y * 0.6] : [1, 0.97, 0.9 - (y - 0.45) * 0.18]; col.set(a, i * 3);
  }
  g.setAttribute('color', new (p.constructor)(col, 3)); g.computeVertexNormals(); return g;
}
const ease = t => t * t * (3 - 2 * t);

function lotus(opacity = 1) {
  const group = new Group(), mat = new MeshStandardMaterial({ vertexColors: true, side: DoubleSide, roughness: 0.5, emissive: 0xffb860, emissiveIntensity: 0.1, transparent: opacity < 1, opacity });
  const rings = RINGS.map(([n, len, w, max, ph], ri) => {
    const geo = petalGeo(len, w), petals = [];
    for (let i = 0; i < n; i++) { const piv = new Group(), pe = new Mesh(geo, mat); piv.rotation.y = (i / n) * Math.PI * 2 + ph + ri * 0.17; piv.position.y = ri * 0.045; piv.add(pe); group.add(piv); petals.push(pe); }
    return { petals, max, ri };
  });
  const pod = new Mesh(new CylinderGeometry(0.2, 0.16, 0.14, 24), new MeshStandardMaterial({ color: 0xf2c25a, emissive: 0xffc060, emissiveIntensity: 0.9, roughness: 0.4, transparent: opacity < 1, opacity }));
  pod.position.y = 0.16; group.add(pod);
  group.userData.update = o => rings.forEach(r => { const k = ease(MathUtils.clamp((o - r.ri * 0.1) / 0.62, 0, 1)); const a = 0.1 + r.ri * 0.04 + (r.max - 0.1) * k; r.petals.forEach((pe, i) => { pe.rotation.x = a + Math.sin(i * 2.3 + r.ri) * 0.04 * k; }); mat.emissiveIntensity = 0.1 + 0.28 * o; });
  return group;
}

export function lotusScene(canvas, host, st) {
  const stage = makeStage(canvas, host), { renderer } = stage;
  const scene = new Scene(), cam = new PerspectiveCamera(42, 1, 0.1, 100);
  scene.add(new HemisphereLight(0xcfeeea, 0x06181c, 0.7));
  const key = new PointLight(0xffd08a, 0, 0, 1.2); key.position.set(0, 1.4, 0.6); scene.add(key);
  const rim = new PointLight(0x6fe0d0, 6, 0, 1.4); rim.position.set(-4, 3, 3); scene.add(rim);
  const L = lotus(), R = lotus(0.42); L.scale.setScalar(0.82); R.scale.set(0.82, -0.82, 0.82); scene.add(L, R);
  const water = new Mesh(new CircleGeometry(40, 64).rotateX(-Math.PI / 2), new ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uT: { value: 0 }, uG: { value: 0 } },
    vertexShader: 'varying vec3 vW; void main(){ vW=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `varying vec3 vW; uniform float uT,uG; void main(){ float d=length(vW.xz); float ring=sin(d*3.2-uT*.9)*.5+.5; ring*=exp(-d*.1);
      vec3 c=mix(vec3(.015,.09,.11),vec3(.05,.26,.28),ring*.4+.1); c+=vec3(1.,.78,.45)*exp(-d*d*.09)*uG*.55;
      gl_FragColor=vec4(c,.62*(1.-smoothstep(16.,40.,d))); }` })); water.renderOrder = 1; scene.add(water);
  const glow = new Sprite(new SpriteMaterial({ map: glowTexture(CanvasTexture), blending: AdditiveBlending, transparent: true, depthWrite: false })); glow.position.y = 0.7; scene.add(glow);
  const { points, mat } = particles(isSmall() ? 50 : 110, ['#bff7ea', '#ffd98a'], renderer.getPixelRatio(), [8, 3, 5]); points.position.y = 2.2; scene.add(points);
  const N = isSmall() ? 18 : 34, fall = new InstancedMesh(petalGeo(0.28, 0.2), new MeshBasicMaterial({ color: 0xffe6c4, side: DoubleSide, transparent: true, opacity: 0.8 }), N);
  const seeds = Array.from({ length: N }, () => ({ x: (Math.random() - 0.5) * 12, z: (Math.random() - 0.5) * 7 - 1, y: Math.random() * 7, v: 0.12 + Math.random() * 0.2, ph: Math.random() * 6.28 })), d = new Object3D(); scene.add(fall);
  const m = { x: 0, tx: 0 }; host.addEventListener('pointermove', e => { m.tx = e.clientX / innerWidth - 0.5; }, { passive: true });
  stage.onResize(s => { cam.aspect = s.w / s.h; cam.updateProjectionMatrix(); });
  stage.onFrame((t, dt) => {
    const o = st.open; m.x += (m.tx - m.x) * 0.04;
    L.userData.update(o); R.userData.update(o);
    key.intensity = o * 2.2; glow.material.opacity = 0.12 + 0.6 * o; glow.scale.setScalar(2.2 + o * 4.2 + Math.sin(t * 1.4) * 0.12); water.material.uniforms.uT.value = t; water.material.uniforms.uG.value = o;
    L.position.y = Math.sin(t * 0.8) * 0.025; R.position.y = -L.position.y; mat.uniforms.uT.value = t;
    const wide = cam.aspect < 1 ? 1.5 : 1;
    cam.position.set(m.x * 1.6, 3.4 - o * 1.1, (9.6 - o * 1.4) * wide); cam.lookAt(0, 0.55 + o * 0.2, 0);
    seeds.forEach((s, i) => { s.y -= s.v * dt * 1.6; if (s.y < 0.05) s.y = 7; d.position.set(s.x + Math.sin(t * 0.6 + s.ph) * 0.5, s.y, s.z); d.rotation.set(t * 0.7 + s.ph, t * 0.5 + i, t * 0.4); d.updateMatrix(); fall.setMatrixAt(i, d.matrix); });
    fall.instanceMatrix.needsUpdate = true; fall.visible = o > 0.25;
    renderer.render(scene, cam);
  });
  stage.start(); return stage;
}
