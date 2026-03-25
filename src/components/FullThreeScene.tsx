import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

export default function FullThreeScene() {
  let mounted = false;

  const initScene = (canvas: HTMLCanvasElement) => {
    if (mounted) return;
    mounted = true;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    scene.fog = new THREE.Fog(0x0a1628, 200, 1000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 0, 50);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      2,
      0.5,
      0.9
    );
    bloomPass.threshold = 0.15;
    bloomPass.strength = 1.5;
    bloomPass.radius = 1;
    composer.addPass(bloomPass);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(100, 100, 100);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const goldLight = new THREE.PointLight(0xd4af37, 2, 200);
    goldLight.position.set(0, 50, 50);
    scene.add(goldLight);

    // === SECTION 1: HERO ===
    const heroGroup = new THREE.Group();
    heroGroup.position.z = 0;
    scene.add(heroGroup);

    // Main rune (center)
    const runeGeo = new THREE.BoxGeometry(5, 5, 0.5);
    const runeMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0xd4af37,
      emissiveIntensity: 1,
      metalness: 0.7,
      roughness: 0.2,
    });
    const mainRune = new THREE.Mesh(runeGeo, runeMat);
    mainRune.castShadow = true;
    mainRune.receiveShadow = true;
    heroGroup.add(mainRune);

    // Hero text (using canvas texture for simplicity)
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 1024;
    textCanvas.height = 256;
    const textCtx = textCanvas.getContext('2d')!;
    textCtx.fillStyle = '#d4af37';
    textCtx.font = 'bold 80px Arial';
    textCtx.textAlign = 'center';
    textCtx.fillText('Ship Products', 512, 100);
    textCtx.fillText('That Scale', 512, 200);

    const textTexture = new THREE.CanvasTexture(textCanvas);
    const textGeo = new THREE.PlaneGeometry(20, 5);
    const textMat = new THREE.MeshBasicMaterial({ map: textTexture });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.y = -10;
    heroGroup.add(textMesh);

    // CTA buttons as runes
    const buttonLeft = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 0.2), runeMat);
    buttonLeft.position.set(-6, -15, 0);
    buttonLeft.castShadow = true;
    heroGroup.add(buttonLeft);

    const buttonRight = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 0.2), runeMat);
    buttonRight.position.set(6, -15, 0);
    buttonRight.castShadow = true;
    heroGroup.add(buttonRight);

    // Particles around hero
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 40 + 10;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

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

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.3,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
    });

    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    heroGroup.add(particlesMesh);

    // === SECTION 2: ABOUT ===
    const aboutGroup = new THREE.Group();
    aboutGroup.position.z = -100;
    scene.add(aboutGroup);

    const aboutCards = [
      { title: '4+ Years', desc: 'Building systems' },
      { title: 'Results', desc: '90% cost reduction' },
      { title: 'Architecture', desc: 'DDD + Clean' },
    ];

    aboutCards.forEach((card, idx) => {
      const cardGeo = new THREE.BoxGeometry(8, 8, 1);
      const cardMat = new THREE.MeshStandardMaterial({
        color: 0x1a2332,
        emissive: 0xd4af37,
        emissiveIntensity: 0.3,
        metalness: 0.4,
        roughness: 0.6,
      });
      const cardMesh = new THREE.Mesh(cardGeo, cardMat);
      cardMesh.position.x = (idx - 1) * 15;
      cardMesh.castShadow = true;
      cardMesh.receiveShadow = true;

      // Add edges (gold outline)
      const edges = new THREE.EdgesGeometry(cardGeo);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xd4af37 }));
      cardMesh.add(line);

      aboutGroup.add(cardMesh);
    });

    // === SECTION 3: SKILLS ===
    const skillsGroup = new THREE.Group();
    skillsGroup.position.z = -250;
    scene.add(skillsGroup);

    const skills = ['TypeScript', 'Go', 'Rust', 'Docker', 'PostgreSQL', 'Astro'];
    const skillMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0xd4af37,
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.4,
    });

    skills.forEach((skill, idx) => {
      const skillGeo = new THREE.SphereGeometry(2, 16, 16);
      const skillMesh = new THREE.Mesh(skillGeo, skillMaterial);
      const angle = (idx / skills.length) * Math.PI * 2;
      skillMesh.position.x = Math.cos(angle) * 25;
      skillMesh.position.y = Math.sin(angle) * 25;
      skillMesh.castShadow = true;
      skillsGroup.add(skillMesh);
    });

    // === SECTION 4: PROJECTS ===
    const projectsGroup = new THREE.Group();
    projectsGroup.position.z = -400;
    scene.add(projectsGroup);

    const projects = ['Huggian', 'Mudanzas', 'Ez-Stock', 'VueHicons'];
    projects.forEach((proj, idx) => {
      const projGeo = new THREE.BoxGeometry(6, 6, 6);
      const projMat = new THREE.MeshStandardMaterial({
        color: 0x1a2332,
        emissive: 0xd4af37,
        emissiveIntensity: 0.4,
        metalness: 0.6,
        roughness: 0.3,
      });
      const projMesh = new THREE.Mesh(projGeo, projMat);
      projMesh.position.x = (idx - 1.5) * 18;
      projMesh.castShadow = true;

      const edges = new THREE.EdgesGeometry(projGeo);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xd4af37 }));
      projMesh.add(line);

      projectsGroup.add(projMesh);
    });

    // === SECTION 5: CTA ===
    const ctaGroup = new THREE.Group();
    ctaGroup.position.z = -550;
    scene.add(ctaGroup);

    const ctaRune = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 0.5), runeMat);
    ctaRune.castShadow = true;
    ctaRune.receiveShadow = true;
    ctaGroup.add(ctaRune);

    // Animation
    let time = 0;
    let scrollZ = 0;
    let targetScrollZ = 0;

    const handleScroll = (e: WheelEvent) => {
      targetScrollZ += e.deltaY * 0.1;
      targetScrollZ = Math.max(-550, Math.min(0, targetScrollZ));
    };

    window.addEventListener('wheel', handleScroll, { passive: true });

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Smooth scroll-driven camera
      scrollZ += (targetScrollZ - scrollZ) * 0.1;
      camera.position.z = 50 + scrollZ;

      // Animate runes
      mainRune.rotation.x += 0.003;
      mainRune.rotation.y += 0.005;
      mainRune.position.y = Math.sin(time) * 2;

      buttonLeft.rotation.z += 0.002;
      buttonRight.rotation.z -= 0.002;

      // Animate particles
      particlesMesh.rotation.x += 0.0002;
      particlesMesh.rotation.y += 0.0004;
      const posArray = particlesGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += Math.sin(time + i) * 0.02;
      }
      particlesGeo.attributes.position.needsUpdate = true;

      // Animate about cards
      aboutGroup.children.forEach((child, idx) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.x += 0.002;
          child.rotation.y += 0.001;
          child.position.y = Math.cos(time + idx) * 3;
        }
      });

      // Animate skills
      skillsGroup.children.forEach((child, idx) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.x += 0.003;
          child.rotation.y += 0.003;
          const scale = 1 + Math.sin(time + idx) * 0.2;
          child.scale.set(scale, scale, scale);
        }
      });

      // Animate projects
      projectsGroup.children.forEach((child, idx) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.x += 0.001;
          child.rotation.y += 0.002;
          child.position.y = Math.sin(time + idx) * 4;
        }
      });

      // Animate CTA
      ctaRune.rotation.x += 0.005;
      ctaRune.rotation.y += 0.007;
      ctaRune.scale.set(1 + Math.sin(time) * 0.1, 1 + Math.sin(time) * 0.1, 1);

      // Bloom pulse
      bloomPass.strength = 1.5 + Math.sin(time * 0.5) * 0.5;

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

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleScroll);
      renderer.dispose();
    };
  };

  return (
    <canvas
      onLoad={(el) => initScene(el as HTMLCanvasElement)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}
