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

    console.log('Initializing ProfessionalYggdrasil...');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    scene.fog = new THREE.Fog(0x0a1628, 400, 2500);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    const isMobile = window.innerWidth < 768;
    camera.position.set(0, 0, isMobile ? 250 : 150);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      2.5,
      0.6,
      0.9
    );
    bloomPass.threshold = 0.1;
    bloomPass.strength = 2;
    bloomPass.radius = 1.2;
    composer.addPass(bloomPass);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x6a6a8a, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(200, 300, 200);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const goldLight = new THREE.PointLight(0xd4af37, 2.5, 600);
    goldLight.position.set(0, 0, 0);
    scene.add(goldLight);

    // === YGGDRASIL BACKBONE ===
    const yggdrasilGroup = new THREE.Group();
    scene.add(yggdrasilGroup);

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(15, 20, 400, 32);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x4d3319,
      roughness: 0.85,
      metalness: 0.05,
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    yggdrasilGroup.add(trunk);

    // Realm branches and nodes
    const realms = [
      { y: 150, name: 'Asgard', color: 0xffd700 },
      { y: 75, name: 'Midgard', color: 0xd4af37 },
      { y: 0, name: 'Vanaheim', color: 0xc9a961 },
      { y: -75, name: 'Muspelheim', color: 0xff9500 },
      { y: -150, name: 'Niflheim', color: 0x87ceeb },
    ];

    const branchMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0xd4af37,
      emissiveIntensity: 0.7,
      metalness: 0.6,
      roughness: 0.3,
    });

    realms.forEach((realm) => {
      // Branch
      const branchGeo = new THREE.CylinderGeometry(6, 10, 90, 16);
      const branch = new THREE.Mesh(branchGeo, branchMat);
      branch.position.y = realm.y;
      branch.position.x = 60;
      branch.rotation.z = 0.5;
      branch.castShadow = true;
      branch.receiveShadow = true;
      yggdrasilGroup.add(branch);

      // Realm node
      const nodeGeo = new THREE.SphereGeometry(22, 32, 32);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: realm.color,
        emissive: realm.color,
        emissiveIntensity: 0.9,
        metalness: 0.8,
        roughness: 0.15,
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.y = realm.y;
      node.position.x = 100;
      node.castShadow = true;
      node.receiveShadow = true;
      yggdrasilGroup.add(node);

      // Glow ring
      const ringGeo = new THREE.TorusGeometry(28, 2.5, 16, 100);
      const ringMesh = new THREE.Mesh(ringGeo, branchMat);
      ringMesh.position.copy(node.position);
      ringMesh.rotation.x = Math.random() * Math.PI;
      yggdrasilGroup.add(ringMesh);
    });

    // === JÖRMUNGANDR ===
    const serpentGroup = new THREE.Group();
    scene.add(serpentGroup);

    const segmentCount = 120;
    const serpentPositions = new Float32Array(segmentCount * 3);

    for (let i = 0; i < segmentCount; i++) {
      const t = i / segmentCount;
      const angle = t * Math.PI * 5;
      const height = 200 - t * 400;
      const radius = 80 + Math.sin(t * Math.PI) * 50;

      serpentPositions[i * 3] = Math.cos(angle) * radius;
      serpentPositions[i * 3 + 1] = height;
      serpentPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    const serpentMat = new THREE.MeshStandardMaterial({
      color: 0x1a4d1a,
      emissive: 0x4d8a4d,
      emissiveIntensity: 0.6,
      metalness: 0.3,
      roughness: 0.7,
    });

    for (let i = 0; i < segmentCount - 1; i++) {
      const segGeo = new THREE.CylinderGeometry(7, 7, 3, 16);
      const seg = new THREE.Mesh(segGeo, serpentMat);

      seg.position.set(
        serpentPositions[i * 3],
        serpentPositions[i * 3 + 1],
        serpentPositions[i * 3 + 2]
      );
      seg.castShadow = true;
      seg.receiveShadow = true;
      serpentGroup.add(seg);
    }

    // Serpent head
    const headGeo = new THREE.SphereGeometry(14, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      metalness: 0.8,
      roughness: 0.15,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(serpentPositions[0], serpentPositions[1], serpentPositions[2]);
    head.castShadow = true;
    serpentGroup.add(head);

    // Eyes
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0xff5555,
      emissive: 0xff5555,
      emissiveIntensity: 1,
      metalness: 0.95,
    });
    const eyeGeo = new THREE.SphereGeometry(3.5, 16, 16);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(serpentPositions[0] - 6, serpentPositions[1] + 4, serpentPositions[2] + 10);
    serpentGroup.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(serpentPositions[0] + 6, serpentPositions[1] + 4, serpentPositions[2] + 10);
    serpentGroup.add(eyeR);

    // === CONTENT CARDS ===
    const realmsData = ['Ship Products', 'About', 'Skills', 'Projects', "Let's Build"];
    
    realmsData.forEach((title, idx) => {
      const cardGeo = new THREE.BoxGeometry(50, 30, 2);
      const cardMat = new THREE.MeshStandardMaterial({
        color: 0x1a2332,
        emissive: 0xd4af37,
        emissiveIntensity: 0.5,
        metalness: 0.4,
      });
      const card = new THREE.Mesh(cardGeo, cardMat);
      card.position.y = realms[idx].y;
      card.position.z = -200;
      card.castShadow = true;
      card.receiveShadow = true;

      // Gold edges
      const edges = new THREE.EdgesGeometry(cardGeo);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xd4af37 }));
      card.add(line);

      scene.add(card);
    });

    // === ANIMATION ===
    let time = 0;
    let scrollZ = 0;
    let targetScrollZ = 0;
    let currentRealmIndex = 0;

    const handleScroll = (e: WheelEvent) => {
      targetScrollZ += e.deltaY * 0.08;
      targetScrollZ = Math.max(-750, Math.min(0, targetScrollZ));
      currentRealmIndex = Math.round(Math.abs(targetScrollZ) / 150);
      currentRealmIndex = Math.min(currentRealmIndex, 4);
    };

    window.addEventListener('wheel', handleScroll, { passive: true });

    let animating = true;
    const animate = () => {
      if (!animating) return;
      requestAnimationFrame(animate);
      time += 0.01;

      // Smooth scroll
      scrollZ += (targetScrollZ - scrollZ) * 0.08;
      const baseZ = isMobile ? 250 : 150;
      camera.position.z = baseZ + scrollZ;

      // Camera orbits
      const realmY = realms[currentRealmIndex].y;
      camera.position.y += (realmY - camera.position.y) * 0.05;

      // Yggdrasil pulses
      yggdrasilGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh && (child.material as any).emissiveIntensity !== undefined) {
          (child.material as any).emissiveIntensity = 0.5 + Math.sin(time) * 0.35;
        }
      });

      // Jörmungandr writhes
      serpentGroup.position.x = Math.sin(time * 0.25) * 25;
      serpentGroup.rotation.z += 0.0015;

      // Bloom pulse
      bloomPass.strength = 2 + Math.sin(time * 0.5) * 0.6;

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

  // Trigger init when canvas mounts
  setTimeout(() => {
    if (canvas) init();
  }, 100);

  return (
    <canvas
      ref={(el) => {
        canvas = el as HTMLCanvasElement;
        init();
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
