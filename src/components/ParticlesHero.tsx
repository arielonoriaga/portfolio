import { createSignal, onMount } from 'solid-js';
import * as THREE from 'three';

interface ParticlesHeroProps {
  onScrollHint?: () => void;
}

export default function ParticlesHero(props: ParticlesHeroProps) {
  let containerRef: HTMLDivElement | undefined;
  const [isReady, setIsReady] = createSignal(false);

  onMount(() => {
    if (!containerRef) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Create particles
    const particleCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      velocities[i] = (Math.random() - 0.5) * 0.05;
      velocities[i + 1] = (Math.random() - 0.5) * 0.05;
      velocities[i + 2] = (Math.random() - 0.5) * 0.05;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.userData.velocities = velocities;

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const pos = geometry.attributes.position.array as Float32Array;
      const vels = geometry.userData.velocities as Float32Array;

      for (let i = 0; i < pos.length; i += 3) {
        pos[i] += vels[i];
        pos[i + 1] += vels[i + 1];
        pos[i + 2] += vels[i + 2];

        // Wrap around
        if (Math.abs(pos[i]) > 10) pos[i] = pos[i] > 0 ? -10 : 10;
        if (Math.abs(pos[i + 1]) > 10) pos[i + 1] = pos[i + 1] > 0 ? -10 : 10;
        if (Math.abs(pos[i + 2]) > 10) pos[i + 2] = pos[i + 2] > 0 ? -10 : 10;
      }

      geometry.attributes.position.needsUpdate = true;
      particles.rotation.x += 0.00005;
      particles.rotation.y += 0.00008;

      renderer.render(scene, camera);
    };

    animate();
    setIsReady(true);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  });

  return (
    <div ref={containerRef} class="w-full h-screen fixed top-0 left-0 -z-10" />
  );
}
