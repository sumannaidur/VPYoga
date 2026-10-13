// Sun rays + drifting embers. Used behind/over the hero, Surya Namaskar and final CTA.
import { Scene, PerspectiveCamera, BufferGeometry, Float32BufferAttribute, Points, ShaderMaterial, AdditiveBlending, Mesh, PlaneGeometry, Color } from 'three';
import { makeStage, isSmall } from './util.js';

export function particles(n, [c1, c2], px, spread = [9, 5, 4]) {
  const pos = new Float32Array(n * 3), seed = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    pos.set([(Math.random() * 2 - 1) * spread[0], (Math.random() * 2 - 1) * spread[1], (Math.random() * 2 - 1) * spread[2]], i * 3);
    seed.set([Math.random(), Math.random(), Math.random(), 0.5 + Math.random() * 1.8], i * 4);
  }
  const geo = new BufferGeometry(); geo.setAttribute('position', new Float32BufferAttribute(pos, 3)); geo.setAttribute('aSeed', new Float32BufferAttribute(seed, 4));
  const mat = new ShaderMaterial({ transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uT: { value: 0 }, uScroll: { value: 0 }, uPx: { value: px }, uC1: { value: new Color(c1) }, uC2: { value: new Color(c2) }, uH: { value: spread[1] * 2 } },
    vertexShader: `uniform float uT,uScroll,uPx,uH; attribute vec4 aSeed; varying float vA; varying float vC;
      void main(){ vec3 p=position; p.y=mod(p.y+uT*(.1+aSeed.x*.28)+uScroll*(1.+aSeed.y*2.)*2.+uH*.5,uH)-uH*.5;
        p.x+=sin(uT*.45+aSeed.z*6.283)*.4; vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv;
        gl_PointSize=aSeed.w*uPx*95./-mv.z; vA=.25+.75*(.5+.5*sin(uT*1.4+aSeed.z*40.)); vC=aSeed.y; }`,
    fragmentShader: `uniform vec3 uC1,uC2; varying float vA; varying float vC;
      void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,.0,d); a*=a; gl_FragColor=vec4(mix(uC1,uC2,vC),a*vA); }` });
  return { points: new Points(geo, mat), mat };
}

export function ambient(canvas, host, st, o = {}) {
  o = { count: 300, colors: ['#ffe2a8', '#ff9d3c'], sun: [0.5, 0.64], tint: [1, 0.78, 0.45], ...o };
  const stage = makeStage(canvas, host), { renderer } = stage;
  const scene = new Scene(), cam = new PerspectiveCamera(50, 1, 0.1, 60); cam.position.z = 8;
  const { points, mat } = particles(isSmall() ? Math.round(o.count * 0.45) : o.count, o.colors, renderer.getPixelRatio());
  scene.add(points);
  const rays = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uSun: { value: [...o.sun] }, uT: { value: 0 }, uI: { value: 0.4 }, uAsp: { value: 1 }, uTint: { value: new Color(...o.tint) } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
    fragmentShader: `varying vec2 vUv; uniform vec2 uSun; uniform float uT,uI,uAsp; uniform vec3 uTint;
      void main(){ vec2 d=vUv-uSun; d.x*=uAsp; float a=atan(d.y,d.x), r=length(d);
        float s=(.5+.5*sin(a*13.+uT*.12))*(.5+.5*sin(a*29.-uT*.09+1.7)); s=pow(s,1.4);
        float rays=s*exp(-r*1.7)*smoothstep(.0,.25,r), core=exp(-r*r*14.);
        float v=(rays*.75+core*.45)*uI; gl_FragColor=vec4(uTint*v,v); }` }));
  rays.renderOrder = -1; rays.frustumCulled = false; scene.add(rays);
  const m = { x: 0, y: 0, tx: 0, ty: 0 };
  host.addEventListener('pointermove', e => { const r = host.getBoundingClientRect(); m.tx = (e.clientX - r.left) / r.width - 0.5; m.ty = (e.clientY - r.top) / r.height - 0.5; }, { passive: true });
  stage.onResize(s => { cam.aspect = s.w / s.h; cam.updateProjectionMatrix(); rays.material.uniforms.uAsp.value = s.w / s.h; });
  stage.onFrame(t => {
    m.x += (m.tx - m.x) * 0.04; m.y += (m.ty - m.y) * 0.04; cam.position.x = m.x * 1.2; cam.position.y = -m.y * 0.7; cam.lookAt(0, 0, 0);
    mat.uniforms.uT.value = t; mat.uniforms.uScroll.value = st.scroll;
    const u = rays.material.uniforms; u.uT.value = t; u.uI.value = st.rays; u.uSun.value = [o.sun[0] + m.x * 0.03, o.sun[1] + st.lift];
    renderer.render(scene, cam);
  });
  stage.start(); return stage;
}
