import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

export default function ProfessionalYggdrasil() {
  let canvas: HTMLCanvasElement;
  let initialized = false;

  const init = () => {
    if (initialized || !canvas) return;
    initialized = true;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    scene.fog = new THREE.Fog(0x0a1628, 500, 3000);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 0, 120);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      2,
      0.5,
      0.85
    );
    bloomPass.threshold = 0.2;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0.8;
    composer.addPass(bloomPass);

    // Lighting - dramatic and clean
    const ambientLight = new THREE.AmbientLight(0x8899bb, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(150, 200, 150);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const goldLight = new THREE.PointLight(0xd4af37, 2, 400);
    goldLight.position.set(0, 0, 0);
    scene.add(goldLight);

    // === SIMPLE YGGDRASIL ===
    // Main trunk - simple cylinder
    const trunkGeo = new THREE.CylinderGeometry(8, 12, 350, 16);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x5a3a1a,
      roughness: 0.9,
      metalness: 0,
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    scene.add(trunk);

    // === JÖRMUNGANDR - PROPER SERPENT ===
    const serpent = new THREE.Group();
    scene.add(serpent);

    const segmentCount = 80;
    const serpentRadius = 70;

    // Create thick serpent body
    for (let i = 0; i < segmentCount; i++) {
      const t = i / segmentCount;
      const angle = t * Math.PI * 6; // 3 full coils
      const height = 150 - t * 300;
      const coilRadius = serpentRadius + Math.sin(t * Math.PI) * 30;

      // Segment body
      const segmentGeo = new THREE.CapsuleGeometry(3, 4, 4, 8);
      const segmentMat = new THREE.MeshStandardMaterial({
        color: 0x1a3a1a,
        emissive: 0x4d8a4d,
        emissiveIntensity: 0.7,
        metalness: 0.2,
        roughness: 0.8,
      });
      const segment = new THREE.Mesh(segmentGeo, segmentMat);

      const x = Math.cos(angle) * coilRadius;
      const z = Math.sin(angle) * coilRadius;

      segment.position.set(x, height, z);
      segment.rotation.z = angle + Math.PI / 2;
      segment.castShadow = true;
      segment.receiveShadow = true;
      serpent.add(segment);
    }

    // Serpent head - LARGE and INTIMIDATING
    const headGeo = new THREE.SphereGeometry(8, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x0a1a0a,
      emissive: 0x2d5a2d,
      emissiveIntensity: 0.8,
      metalness: 0.7,
      roughness: 0.2,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(serpentRadius, 160, 0);
    head.castShadow = true;
    serpent.add(head);

    // Red eyes - MENACING
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0xff3333,
      emissive: 0xff3333,
      emissiveIntensity: 1,
      metalness: 0.9,
    });
    const eyeGeo = new THREE.SphereGeometry(2, 16, 16);

    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(serpentRadius - 4, 163, 3);
    serpent.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(serpentRadius - 4, 163, -3);
    serpent.add(eyeR);

    // === 5 CLEAR REALM NODES ===
    const realms = [
      { y: 130, label: 'Asgard', color: 0xffd700 },
      { y: 65, label: 'Midgard', color: 0xd4af37 },
      { y: 0, label: 'Vanaheim', color: 0xc9a961 },
      { y: -65, label: 'Muspelheim', color: 0xff9500 },
      { y: -130, label: 'Niflheim', color: 0x87ceeb },
    ];

    realms.forEach((realm) => {
      // Large sphere = clear realm
      const realmGeo = new THREE.SphereGeometry(18, 32, 32);
      const realmMat = new THREE.MeshStandardMaterial({
        color: realm.color,
        emissive: realm.color,
        emissiveIntensity: 0.8,
        metalness: 0.7,
        roughness: 0.2,
      });
      const realmNode = new THREE.Mesh(realmGeo, realmMat);
      realmNode.position.set(50, realm.y, 0);
      realmNode.castShadow = true;
      realmNode.receiveShadow = true;
      scene.add(realmNode);

      // Glow ring around realm
      const ringGeo = new THREE.TorusGeometry(22, 1.5, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: realm.color,
        emissive: realm.color,
        emissiveIntensity: 0.9,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(realmNode.position);
      ring.rotation.x = Math.random() * Math.PI;
      scene.add(ring);
    });

    // === SIMPLE CONTENT TEXT (overlaid on canvas) ===
    // We'll keep it minimal - just the 3D scene with clear realms

    // === ANIMATION ===
    let time = 0;
    let scrollZ = 0;
    let targetScrollZ = 0;

    const handleScroll = (e: WheelEvent) => {
      targetScrollZ += e.deltaY * 0.05;
      targetScrollZ = Math.max(-600, Math.min(0, targetScrollZ));
    };

    window.addEventListener('wheel', handleScroll, { passive: true });

    let animating = true;
    const animate = () => {
      if (!animating) return;
      requestAnimationFrame(animate);
      time += 0.01;

      // Smooth camera movement
      scrollZ += (targetScrollZ - scrollZ) * 0.1;
      camera.position.z = 120 + scrollZ;
      camera.position.y = Math.sin(scrollZ * 0.005) * 30;

      // Serpent writhes
      serpent.rotation.z += 0.002;
      serpent.position.x = Math.sin(time * 0.2) * 15;
      serpent.position.y = Math.cos(time * 0.15) * 10;

      // Realms pulse
      scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh && (child.material as any).emissiveIntensity !== undefined) {
          (child.material as any).emissiveIntensity = 0.6 + Math.sin(time + Math.random()) * 0.3;
        }
      });

      // Bloom pulse
      bloomPass.strength = 1.5 + Math.sin(time * 0.3) * 0.4;

      composer.render();
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
  };

  // Init on ref callback
  return (
    <canvas
      ref={(el) => {
        if (el) {
          canvas = el as HTMLCanvasElement;
          setTimeout(() => init(), 50);
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
