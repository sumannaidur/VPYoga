> **Correction:** this GLB is a single placeholder cube with no rig or animation clips. The description below does not match the file.

# 3D Models Directory

This directory contains the 3D assets for the Vishwa Poornima Yoga interactive web experience.

## Assets

- `yoga-character.glb`: Rigged 3D human character model in glTF 2.0 binary format.
  - **Art Direction**: Stylised 3D figure, natural proportions, minimalist ivory yoga linen attire.
  - **Lighting / Materials**: PBR Metallic-Roughness shader with soft warm-gold rim illumination.
  - **Poses / Animation Tracks**:
    - `Idle_Meditation_Breathing` (Lotus / Padmasana gentle breathing loop)
    - `Pose_Warrior_II` (Virabhadrasana II)
    - `Pose_Tree` (Vrikshasana)
    - `Surya_Namaskar_Cycle` (Complete 12-step sequence)

## WebGL / Three.js Implementation Example

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('/assets/models/yoga-character.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);
  
  // Animation mixer
  const mixer = new THREE.AnimationMixer(model);
  if (gltf.animations.length > 0) {
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
  }
});
```
