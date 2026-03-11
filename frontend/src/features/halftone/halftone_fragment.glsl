precision highp float;

uniform float uScale;
uniform float uRotation;
uniform float uFrequency;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // 1. Create a rotation matrix
  float s = sin(uRotation);
  float c = cos(uRotation);
  mat2 rotationMatrix = mat2(c, -s, s, c);
  
  // 2. Rotate coordinates for the grid
  vec2 st2 = rotationMatrix * uv;
  
  // 3. Create the circular grid pattern
  vec2 nearest = 2.0 * fract(uFrequency * st2) - 1.0;
  float dist = length(nearest);
  
  // 4. Determine dot radius based on scene brightness
  float brightness = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
  float radius = uScale * brightness;
  
  if (radius == 0.0) {
    outputColor = inputColor; // Avoid division by zero
    return;
  }
  
  // 5. Anti-aliasing using standard derivatives
  float afwidth = 0.7 * length(vec2(dFdx(dist), dFdy(dist)));
  float edge = smoothstep(radius - afwidth, radius + afwidth, dist);
  
  // 6. Define colors
  vec3 black = vec3(0.0);
  vec3 white = vec3(1.0);
  
  // 7. Mix and output
  vec3 fragcolor = mix(white, black, edge);
  outputColor = vec4(fragcolor, inputColor.a);
}