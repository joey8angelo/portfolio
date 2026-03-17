uniform float uTime;
varying vec3 vColor;
varying float vSeed;
uniform float uTwinkleIntensity;
uniform float uInnerRadius;
uniform float uGlowIntensity;


void main() {
  float d = distance(gl_PointCoord, vec2(0.5, 0.5));
  if (d > 0.5) discard;
  
  // Twinkle effect
  float pulseAmp = uTwinkleIntensity * 0.5;
  float twinkle = (1.0 - pulseAmp) + pulseAmp * sin(uTime * vSeed * 6.2831);
  
  float coreEdge = 0.5 * uInnerRadius;  
  
  if (d <= coreEdge) {
    gl_FragColor = vec4(vColor, twinkle);
  } else {
    float falloff = 1.0 - smoothstep(coreEdge, 0.5, d);
    float glow = pow(falloff, 2.0) * uGlowIntensity;
    gl_FragColor = vec4(vColor, clamp(glow, 0.0, 1.0) * twinkle);
  }
}