// Realm Sphere Shader - Gold/Magical Orb Effect

varying vec3 vNormal;
varying vec3 vPosition;
varying float vTime;

uniform sampler2D uTexture;
uniform vec3 uColor;
uniform float uTime;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vTime = uTime;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// ===== FRAGMENT SHADER =====

varying vec3 vNormal;
varying vec3 vPosition;
varying float vTime;

uniform vec3 uColor;
uniform float uTime;

void main() {
  // Fresnel effect for rim glow
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - dot(vNormal, viewDir), 3.0);
  
  // Pulsing glow based on time
  float pulse = sin(uTime * 0.5) * 0.5 + 0.5;
  
  // Combine color with Fresnel + pulse
  vec3 finalColor = uColor * (0.7 + fresnel * 0.3 + pulse * 0.2);
  
  // Add some internal glow
  float glow = pow(fresnel, 2.0) * 1.5;
  finalColor += vec3(1.0) * glow * 0.5;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
