import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

export default function ThreeCanvas() {
  let mounted = false;

  const initThree = (canvas: HTMLCanvasElement) => {
    if (mounted) return;
    mounted = true;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    scene.fog = new THREE.Fog(0x0a1628, 100, 500);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = 0.2;
    bloomPass.strength = 1.2;
    bloomPass.radius = 0.8;
    composer.addPass(bloomPass);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const goldLight = new THREE.PointLight(0xd4af37, 1, 100);
    goldLight.position.set(30, 20, 30);
    scene.add(goldLight);

    // Particles
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

      const rand = Math.random();
      if (rand < 0.6) {
        colors[i * 3] = 0.83;
        colors[i * 3 + 1] = 0.68;
        colors[i * 3 + 2] = 0.22;
      } else if (rand < 0.9) {
        colors[i * 3] = 0.91;
        colors[i * 3 + 1] = 0.91;
        colors[i * 3 + 2] = 0.91;
      } else {
        colors[i * 3] = 0.75;
        colors[i * 3 + 1] = 0.86;
        colors[i * 3 + 2] = 0.91;
      }
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.5,
      sizeAttenuation: true,
      vertexColors: true,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Runes
    const runeGeometry = new THREE.BoxGeometry(1, 1, 0.1);
    const runeMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0xd4af37,
      emissiveIntensity: 0.5,
      metalness: 0.6,
      roughness: 0.3,
    });

    const runesMesh = new THREE.InstancedMesh(runeGeometry, runeMaterial, 500);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < 500; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 150
      );
      dummy.scale.set(Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1);
      dummy.rotation.z = Math.random() * Math.PI * 2;
      dummy.updateMatrix();
      runesMesh.setMatrixAt(i, dummy.matrix);
    }
    runesMesh.castShadow = true;
    runesMesh.receiveShadow = true;
    scene.add(runesMesh);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;

      particlesMesh.rotation.x += 0.0001;
      particlesMesh.rotation.y += 0.0002;

      const posArray = particlesGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += Math.sin(time + i) * 0.01;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      for (let i = 0; i < 500; i++) {
        dummy.position.set(
          Math.sin(time * 0.5 + i) * 50,
          Math.cos(time * 0.3 + i) * 50,
          Math.sin(time * 0.2 + i) * 50
        );
        dummy.rotation.x += 0.001;
        dummy.rotation.y += 0.002;
        dummy.updateMatrix();
        runesMesh.setMatrixAt(i, dummy.matrix);
      }
      runesMesh.instanceMatrix.needsUpdate = true;

      bloomPass.strength = 1.2 + Math.sin(time) * 0.3;

      composer.render();
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
  };

  return (
    <canvas
      onLoad={(el) => initThree(el as HTMLCanvasElement)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        'z-index': -10,
      }}
    />
  );
}
