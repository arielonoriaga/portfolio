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
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      2,
      0.5,
      0.85
    );
    bloomPass.threshold = 0.15;
    bloomPass.strength = 1.8;
    bloomPass.radius = 1;
    composer.addPass(bloomPass);

    // ===== LIGHTING =====
    const ambientLight = new THREE.AmbientLight(0x8899bb, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(150, 200, 150);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const goldLight = new THREE.PointLight(0xd4af37, 2.5, 500);
    goldLight.position.set(0, 0, 0);
    scene.add(goldLight);

    // ===== CUSTOM REALM SHADER =====
    const realmVertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vViewDir = normalize(cameraPosition - vPosition);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const realmFragmentShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;
      
      uniform vec3 uColor;
      uniform float uTime;
      
      void main() {
        // Fresnel rim effect
        float fresnel = pow(1.0 - dot(vNormal, vViewDir), 2.5);
        
        // Pulsing glow
        float pulse = sin(uTime * 0.8) * 0.3 + 0.7;
        
        // Noise pattern (cheap procedural)
        float pattern = sin(vPosition.x * 3.0 + uTime) * sin(vPosition.y * 3.0) * 0.1;
        
        // Base color + effects
        vec3 baseColor = uColor * 0.8;
        vec3 rimColor = uColor * fresnel * 1.2;
        vec3 glowColor = vec3(1.0) * fresnel * fresnel * 0.8;
        
        vec3 finalColor = baseColor + rimColor * pulse + glowColor + pattern;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // ===== YGGDRASIL TRUNK =====
    const trunkGeo = new THREE.CylinderGeometry(8, 12, 350, 24);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x6b4423,
      roughness: 0.9,
      metalness: 0.05,
      map: createWoodTexture(),
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    scene.add(trunk);

    // ===== JÖRMUNGANDR SERPENT =====
    const serpent = new THREE.Group();
    scene.add(serpent);

    const segmentCount = 80;
    const serpentRadius = 70;

    for (let i = 0; i < segmentCount; i++) {
      const t = i / segmentCount;
      const angle = t * Math.PI * 6;
      const height = 150 - t * 300;
      const coilRadius = serpentRadius + Math.sin(t * Math.PI) * 30;

      const segmentGeo = new THREE.CapsuleGeometry(3.5, 5, 4, 8);
      const segmentMat = new THREE.MeshStandardMaterial({
        color: 0x1a4d1a,
        emissive: 0x2d8a2d,
        emissiveIntensity: 0.6,
        metalness: 0.3,
        roughness: 0.7,
        map: createScalesTexture(),
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

    // Serpent head
    const headGeo = new THREE.IcosahedronGeometry(9, 4);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x0d1f0d,
      emissive: 0x3d7a3d,
      emissiveIntensity: 0.8,
      metalness: 0.6,
      roughness: 0.3,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(serpentRadius, 160, 0);
    head.castShadow = true;
    serpent.add(head);

    // Eyes
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0xff3333,
      emissive: 0xff3333,
      emissiveIntensity: 1.2,
      metalness: 0.95,
    });
    const eyeGeo = new THREE.SphereGeometry(2.5, 16, 16);

    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(serpentRadius - 5, 163, 4);
    serpent.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(serpentRadius - 5, 163, -4);
    serpent.add(eyeR);

    // ===== 5 REALM NODES WITH CUSTOM SHADERS =====
    const realms = [
      { y: 130, label: 'Asgard', color: new THREE.Color(0xffd700) },
      { y: 65, label: 'Midgard', color: new THREE.Color(0xd4af37) },
      { y: 0, label: 'Vanaheim', color: new THREE.Color(0xc9a961) },
      { y: -65, label: 'Muspelheim', color: new THREE.Color(0xff9500) },
      { y: -130, label: 'Niflheim', color: new THREE.Color(0x87ceeb) },
    ];

    const shaderUniforms = {
      uColor: { value: new THREE.Color(0xffd700) },
      uTime: { value: 0 },
    };

    const realmShaderMat = new THREE.ShaderMaterial({
      vertexShader: realmVertexShader,
      fragmentShader: realmFragmentShader,
      uniforms: shaderUniforms,
      side: THREE.FrontSide,
    });

    realms.forEach((realm, idx) => {
      // Create realm with shader material
      const realmGeo = new THREE.IcosahedronGeometry(18, 5);
      const realmMatClone = realmShaderMat.clone();
      realmMatClone.uniforms.uColor = { value: realm.color };
      
      const realmNode = new THREE.Mesh(realmGeo, realmMatClone);
      realmNode.position.set(50, realm.y, 0);
      realmNode.castShadow = true;
      realmNode.receiveShadow = true;
      scene.add(realmNode);

      // Store for animation
      realmNode.userData.shaderMaterial = realmMatClone;

      // Glow ring
      const ringGeo = new THREE.TorusGeometry(24, 2, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: realm.color,
        emissive: realm.color,
        emissiveIntensity: 0.9,
        metalness: 0.8,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(realmNode.position);
      ring.rotation.x = Math.random() * Math.PI;
      scene.add(ring);
    });

    // ===== ANIMATION LOOP =====
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
      time += 0.016; // ~60fps

      // Update shader time
      scene.children.forEach((child) => {
        if (child.userData.shaderMaterial) {
          child.userData.shaderMaterial.uniforms.uTime.value = time;
        }
      });

      // Camera movement
      scrollZ += (targetScrollZ - scrollZ) * 0.1;
      camera.position.z = 120 + scrollZ;
      camera.position.y = Math.sin(scrollZ * 0.005) * 30;

      // Serpent animation
      serpent.rotation.z += 0.0015;
      serpent.position.x = Math.sin(time * 0.2) * 15;
      serpent.position.y = Math.cos(time * 0.15) * 12;

      // Bloom pulse
      bloomPass.strength = 1.8 + Math.sin(time * 0.3) * 0.3;

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

  // Texture generators
  const createWoodTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Wood grain pattern
    ctx.fillStyle = '#6b4423';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 100; i++) {
      ctx.strokeStyle = `rgba(${100 + Math.random() * 50}, ${60 + Math.random() * 30}, 0, ${Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * canvas.height);
      ctx.quadraticCurveTo(
        canvas.width * 0.5,
        Math.random() * canvas.height,
        canvas.width,
        Math.random() * canvas.height
      );
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.LinearFilter;
    return texture;
  };

  const createScalesTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#1a4d1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scale pattern
    for (let y = 0; y < canvas.height; y += 16) {
      for (let x = 0; x < canvas.width; x += 16) {
        ctx.strokeStyle = `rgba(100, 150, 100, ${Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(x + 8, y + 8, 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.LinearFilter;
    return texture;
  };

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
