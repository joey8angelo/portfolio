export const RENDER_VERTEX_SHADER_GLSL = `#version 300 es
  precision mediump float;

  layout(location=0) in vec2 aPosition;

  uniform float uPointSize;

  void main() {
    gl_PointSize = uPointSize;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

export const RENDER_FRAGMENT_SHADER_GLSL = `#version 300 es
  precision mediump float;

  uniform vec4 uColor;

  out vec4 fragColor;

  void main() {
    fragColor = uColor;
  }
`;

export const TRANSFORM_VERTEX_SHADER_GLSL = `#version 300 es
  precision mediump float; 

  layout(location=0) in vec2 aPosition;
  layout(location=1) in vec2 aVelocity;
  
  uniform float uDeltaTime;
  uniform float uDragConstant;
  
  uniform sampler2D uNoise; 
  
  out vec2 nPosition;
  out vec2 nVelocity;
  
  vec2 rand(int i, vec2 co) {
    vec4 p = vec4(co.x, float(i), co.y, float(i)*0.48311567);
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    p = fract(p * p.yxwz * p.zyxz);
    vec2 res = fract(p.xy + p.zw) * 2.0 - 1.0;
    return res;
  }
  
  void main() {
    nPosition = aPosition + aVelocity * uDeltaTime;
  
    // Check if the particle is out of bounds
    if (nPosition.x <= -1.0 || nPosition.x >= 1.0 || nPosition.y <= -1.0 || nPosition.y >= 1.0) {
      nPosition = rand(gl_VertexID, aPosition);
    }

    vec2 v = aVelocity + texture(uNoise, (aPosition+1.0)*0.5).rg;
    float speed = length(v);
    float dragMag = -uDragConstant * speed * speed;
    vec2 drag = v * dragMag;
    if(length(drag) > speed) {
      v = vec2(0.0, 0.0);
    } else {
      v += drag;
    }

    nVelocity = v;
  }
`;

export const TRANSFORM_FRAGMENT_SHADER_GLSL = `#version 300 es
  precision mediump float;

  void main() {
    discard;
  }
`;
