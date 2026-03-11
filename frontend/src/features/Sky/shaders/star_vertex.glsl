attribute float size;
attribute float seed;
uniform float uRadius;
varying vec3 vColor;
varying float vSeed;

void main() {
  vColor = color;
  vSeed = seed;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (uRadius / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}