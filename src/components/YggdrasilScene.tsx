import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { createEffect, onCleanup } from 'solid-js';

export default function YggdrasilScene() {
  let canvasRef: HTMLCanvasElement | undefined;

  createEffect(() => {
    if (!canvasRef) return;

    console.log('Yggdrasil scene initializing...');
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    scene.fog = new THREE.Fog(0x0a1628, 300, 2000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    const isMobile = window.innerWidth < 768;
    const initialZ = isMobile ? 200 : 100;
    camera.position.set(0, 0, initialZ);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef!, antialias: true });
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

    const ambientLight = new THREE.AmbientLight(0x4a4a6a, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(150, 200, 150);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    scene.add(directionalLight);

    const goldLight = new THREE.PointLight(0xd4af37, 3, 500);
    goldLight.position.set(0, 0, 0);
    scene.add(goldLight);

    // === YGGDRASIL ===
    const yggdrasilGroup = new THREE.Group();
    scene.add(yggdrasilGroup);

    const trunkGeo = new THREE.CylinderGeometry(12, 16, 300, 32);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x3d2817,
      roughness: 0.8,
      metalness: 0.1,
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    yggdrasilGroup.add(trunk);

    const branchMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0xd4af37,
      emissiveIntensity: 0.8,
      metalness: 0.6,
      roughness: 0.3,
    });

    const realmPositions = [
      { y: 120 },
      { y: 60 },
      { y: 0 },
      { y: -60 },
      { y: -120 },
    ];

    realmPositions.forEach((realm) => {
      const branchGeo = new THREE.CylinderGeometry(5, 8, 80, 16);
      const branch = new THREE.Mesh(branchGeo, branchMat);
      branch.position.y = realm.y;
      branch.position.x = 50;
      branch.rotation.z = 0.5;
      branch.castShadow = true;
      branch.receiveShadow = true;
      yggdrasilGroup.add(branch);

      const nodeGeo = new THREE.SphereGeometry(20, 32, 32);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        emissive: 0xd4af37,
        emissiveIntensity: 1,
        metalness: 0.8,
        roughness: 0.1,
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.y = realm.y;
      node.position.x = 80;
      node.castShadow = true;
      node.receiveShadow = true;
      yggdrasilGroup.add(node);

      const ringGeo = new THREE.TorusGeometry(25, 2, 16, 100);
      const ringMesh = new THREE.Mesh(ringGeo, branchMat);
      ringMesh.position.copy(node.position);
      ringMesh.rotation.x = Math.random() * Math.PI;
      yggdrasilGroup.add(ringMesh);
    });

    // === JÖRMUNGANDR ===
    const serpentGroup = new THREE.Group();
    scene.add(serpentGroup);

    const segmentCount = 100;
    const serpentGeo = new THREE.BufferGeometry();
    const serpentPositions = new Float32Array(segmentCount * 3);

    for (let i = 0; i < segmentCount; i++) {
      const t = i / segmentCount;
      const angle = t * Math.PI * 4;
      const height = 150 - t * 300;
      const radius = 60 + Math.sin(t * Math.PI) * 40;

      serpentPositions[i * 3] = Math.cos(angle) * radius;
      serpentPositions[i * 3 + 1] = height;
      serpentPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    const serpentMat = new THREE.MeshStandardMaterial({
      color: 0x2a5a2a,
      emissive: 0x5a8a5a,
      emissiveIntensity: 0.5,
      metalness: 0.4,
      roughness: 0.6,
    });

    for (let i = 0; i < segmentCount - 1; i++) {
      const segGeo = new THREE.CylinderGeometry(8, 8, 3, 16);
      const seg = new THREE.Mesh(segGeo, serpentMat);

      const x1 = serpentPositions[i * 3];
      const y1 = serpentPositions[i * 3 + 1];
      const z1 = serpentPositions[i * 3 + 2];

      seg.position.set(x1, y1, z1);
      seg.castShadow = true;
      seg.receiveShadow = true;
      serpentGroup.add(seg);
    }

    const headGeo = new THREE.SphereGeometry(12, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.7,
      roughness: 0.2,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(serpentPositions[0], serpentPositions[1], serpentPositions[2]);
    head.castShadow = true;
    serpentGroup.add(head);

    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0xff4444,
      emissive: 0xff4444,
      emissiveIntensity: 1,
      metalness: 0.9,
    });
    const eyeGeo = new THREE.SphereGeometry(3, 16, 16);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(serpentPositions[0] - 5, serpentPositions[1] + 3, serpentPositions[2] + 8);
    serpentGroup.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(serpentPositions[0] + 5, serpentPositions[1] + 3, serpentPositions[2] + 8);
    serpentGroup.add(eyeR);

    // === CONTENT ===
    const contentGroup = new THREE.Group();
    contentGroup.position.z = -150;
    scene.add(contentGroup);

    const sections = [
      'Ship Products',
      'About',
      'Skills',
      'Projects',
      'Let\'s Build',
    ];

    sections.forEach((sec, idx) => {
      const cardGeo = new THREE.BoxGeometry(40, 20, 2);
      const cardMat = new THREE.MeshStandardMaterial({
        color: 0x1a2332,
        emissive: 0xd4af37,
        emissiveIntensity: 0.6,
        metalness: 0.5,
      });
      const card = new THREE.Mesh(cardGeo, cardMat);
      card.position.y = 120 - idx * 60;
      card.position.x = -120;
      card.castShadow = true;
      card.receiveShadow = true;

      const edges = new THREE.EdgesGeometry(cardGeo);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xd4af37 }));
      card.add(line);

      contentGroup.add(card);
    });

    // === BIFROST ===
    const bifrostGeo = new THREE.PlaneGeometry(80, 8);
    const bifrostMat = new THREE.MeshStandardMaterial({
      color: 0x6aa3ff,
      emissive: 0x6aa3ff,
      emissiveIntensity: 0.7,
      metalness: 0.7,
      roughness: 0.2,
    });
    const bifrost = new THREE.Mesh(bifrostGeo, bifrostMat);
    bifrost.rotation.z = 0.3;
    bifrost.position.set(0, 60, -50);
    bifrost.castShadow = true;
    scene.add(bifrost);

    // === ANIMATION ===
    let time = 0;
    let scrollZ = 0;
    let targetScrollZ = 0;

    const handleScroll = (e: WheelEvent) => {
      targetScrollZ += e.deltaY * 0.1;
      targetScrollZ = Math.max(-600, Math.min(0, targetScrollZ));
    };

    window.addEventListener('wheel', handleScroll, { passive: true });

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      scrollZ += (targetScrollZ - scrollZ) * 0.1;
      camera.position.z = initialZ + scrollZ;

      yggdrasilGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material.emissive) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = 0.6 + Math.sin(time) * 0.4;
        }
      });

      serpentGroup.position.x = Math.sin(time * 0.3) * 20;
      serpentGroup.rotation.z += 0.002;

      contentGroup.children.forEach((card, idx) => {
        card.position.y += Math.sin(time + idx) * 0.05;
        card.rotation.z += 0.001;
      });

      bifrostMat.emissiveIntensity = 0.5 + Math.sin(time * 1.5) * 0.3;
      bloomPass.strength = 2 + Math.sin(time * 0.5) * 0.5;

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

    onCleanup(() => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleScroll);
      renderer.dispose();
    });
  });

  return (
    <canvas
      ref={canvasRef}
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
