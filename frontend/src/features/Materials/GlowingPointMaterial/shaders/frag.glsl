uniform float uTime;
varying vec3 vColor;
varying float vSeed;
uniform float uTwinkleIntensity;


void main() {
  float d = distance(gl_PointCoord, vec2(0.5, 0.5));
  if (d > 0.5) discard;
  
  // Twinkle effect
  float pulseAmp = uTwinkleIntensity * 0.5;
  float twinkle = (1.0 - pulseAmp) + pulseAmp * sin(uTime * vSeed * 6.2831);
  
  // glow
  float strength = pow(1.0 - d * 2.0, 2.0);
  gl_FragColor = vec4(vColor, strength * twinkle);
}