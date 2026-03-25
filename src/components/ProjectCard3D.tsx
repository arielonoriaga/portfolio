import { createSignal, onMount } from 'solid-js';
import * as THREE from 'three';

interface ProjectCard3DProps {
  title: string;
  description: string;
  metrics: string[];
  technologies: string[];
  accentColor: string;
}

export default function ProjectCard3D(props: ProjectCard3DProps) {
  let canvasRef: HTMLCanvasElement | undefined;
  let sceneRef: any;
  let rendererRef: any;
  const [isHovering, setIsHovering] = createSignal(false);

  onMount(() => {
    if (!canvasRef) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvasRef.clientWidth / canvasRef.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef, antialias: true, alpha: true });

    renderer.setSize(canvasRef.clientWidth, canvasRef.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0.1);

    camera.position.z = 3;

    // Create rotating cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
      color: props.accentColor,
      emissive: props.accentColor,
      emissiveIntensity: 0.3,
      wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    sceneRef = scene;
    rendererRef = renderer;

    let rotationTarget = { x: 0, y: 0 };
    let rotationCurrent = { x: 0, y: 0 };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering()) return;
      const rect = canvasRef!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      rotationTarget.y = (x - 0.5) * Math.PI;
      rotationTarget.x = (y - 0.5) * Math.PI;
    };

    canvasRef.addEventListener('mouseenter', handleMouseEnter);
    canvasRef.addEventListener('mouseleave', handleMouseLeave);
    canvasRef.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Smooth rotation interpolation
      rotationCurrent.x += (rotationTarget.x - rotationCurrent.x) * 0.1;
      rotationCurrent.y += (rotationTarget.y - rotationCurrent.y) * 0.1;

      if (isHovering()) {
        cube.rotation.x = rotationCurrent.x;
        cube.rotation.y = rotationCurrent.y;
      } else {
        cube.rotation.x += 0.003;
        cube.rotation.y += 0.005;
      }

      // Scale animation
      const targetScale = isHovering() ? 1.1 : 1;
      cube.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      const width = canvasRef!.clientWidth;
      const height = canvasRef!.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      canvasRef?.removeEventListener('mouseenter', handleMouseEnter);
      canvasRef?.removeEventListener('mouseleave', handleMouseLeave);
      canvasRef?.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  });

  return (
    <div class="group relative h-80 rounded-lg border border-gray-800 overflow-hidden bg-gray-950 hover:border-gray-700 transition-colors">
      <canvas
        ref={canvasRef}
        class="w-full h-full absolute inset-0"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 pointer-events-none" />

      <div class="absolute inset-0 p-6 flex flex-col justify-end pointer-events-none">
        <h3 class="text-xl font-bold mb-2 group-hover:text-opacity-100 transition-colors" style={{ color: props.accentColor }}>
          {props.title}
        </h3>
        <p class="text-sm text-gray-400 mb-3 line-clamp-2">{props.description}</p>

        <div class="flex flex-wrap gap-2 mb-3">
          {props.metrics.map((metric) => (
            <span
              class="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700"
              style={{ borderColor: props.accentColor + '40' }}
            >
              {metric}
            </span>
          ))}
        </div>

        <div class="flex flex-wrap gap-1">
          {props.technologies.slice(0, 3).map((tech) => (
            <span class="text-xs px-1.5 py-0.5 rounded bg-gray-900 text-gray-400 border border-gray-800">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
