import getNoiseData from "@/components/particles/getNoiseData";
import {
  RENDER_VERTEX_SHADER_GLSL,
  RENDER_FRAGMENT_SHADER_GLSL,
  TRANSFORM_VERTEX_SHADER_GLSL,
  TRANSFORM_FRAGMENT_SHADER_GLSL,
} from "@/components/particles/shaders";

export interface State {
  id: string;
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  renderProgram: WebGLProgram | null;
  transformProgram: WebGLProgram | null;
  uDeltaTimeLoc: WebGLUniformLocation | null;
  uPointSizeLoc: WebGLUniformLocation | null;
  uDragConstantLoc: WebGLUniformLocation | null;
  uColorLoc: WebGLUniformLocation | null;
  uNoiseLoc: WebGLUniformLocation | null;
  particlesBuf1: WebGLBuffer | null;
  particlesBuf2: WebGLBuffer | null;
  particlesVao1: WebGLVertexArrayObject | null;
  particlesVao2: WebGLVertexArrayObject | null;
  noiseTexture: WebGLTexture | null;
  noiseZ: number;
  deltaTime: number;
  lastTime: number;
  startTime: number;
  frame: number;
  settings: any;
  active: boolean;
}

export function saveSettings(
  id: string,
  settings: any,
  onlyParticleCount: boolean = false,
) {
  if (onlyParticleCount) {
    const localSettings = localStorage.getItem(`${id}:settings`);
    if (localSettings) {
      const parsedSettings = JSON.parse(localSettings);
      parsedSettings.particleCount = settings.particleCount;
      localStorage.setItem(`${id}:settings`, JSON.stringify(parsedSettings));
    } else {
      localStorage.setItem(`${id}:settings`, JSON.stringify(settings));
    }
  } else {
    localStorage.setItem(`${id}:settings`, JSON.stringify(settings));
  }
}

export function loadSettings(
  id: string,
  settings: any,
  onlyParticleCount: boolean = false,
) {
  const cachedSettings = localStorage.getItem(`${id}:settings`);
  if (cachedSettings) {
    const parsedSettings = JSON.parse(cachedSettings);
    settings.particleCount = parsedSettings.particleCount;
    if (!onlyParticleCount) {
      settings.pointSize = parsedSettings.pointSize;
      settings.noiseSize = parsedSettings.noiseSize;
      settings.dragConstant = parsedSettings.dragConstant;
      settings.red = parsedSettings.red;
      settings.green = parsedSettings.green;
      settings.blue = parsedSettings.blue;
      settings.alpha = parsedSettings.alpha;
      settings.noiseOffsetX = parsedSettings.noiseOffsetX;
      settings.noiseOffsetY = parsedSettings.noiseOffsetY;
      settings.noiseStrength = parsedSettings.noiseStrength;
      settings.noiseStepX = parsedSettings.noiseStepX;
      settings.noiseStepY = parsedSettings.noiseStepY;
      settings.noiseStepZ = parsedSettings.noiseStepZ;
    }
    return true;
  }
  return false;
}

export function transform(state: State) {
  let vao = state.active ? state.particlesVao2 : state.particlesVao1;
  let buffer = state.active ? state.particlesBuf1 : state.particlesBuf2;

  // Bind the transform program
  state.gl.useProgram(state.transformProgram);

  // Disable rasterization of points
  state.gl.enable(state.gl.RASTERIZER_DISCARD);

  // Bind random texture
  state.gl.activeTexture(state.gl.TEXTURE0);
  state.gl.bindTexture(state.gl.TEXTURE_2D, state.noiseTexture);

  // Bind the vao and buffer
  state.gl.bindVertexArray(vao);
  state.gl.bindBufferBase(state.gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffer);

  // Set uDeltaTime uniform
  state.gl.uniform1f(state.uDeltaTimeLoc, state.deltaTime);

  // Do the transform feedback
  state.gl.beginTransformFeedback(state.gl.POINTS);
  state.gl.drawArrays(state.gl.POINTS, 0, state.settings.particleCount);
  state.gl.endTransformFeedback();

  // Unbind the buffer and vao
  state.gl.bindBufferBase(state.gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
  state.gl.bindVertexArray(null);

  // Enable rasterization of points
  state.gl.disable(state.gl.RASTERIZER_DISCARD);

  // Unbind the transform program
  state.gl.useProgram(null);

  // Swap the active vao and buffer
  state.active = !state.active;
}

export function render(state: State) {
  let vao = state.active ? state.particlesVao1 : state.particlesVao2;

  // Bind render program
  state.gl.useProgram(state.renderProgram);
  // Bind the vertex array object for the particles
  state.gl.bindVertexArray(vao);
  // Draw the particles
  state.gl.drawArrays(state.gl.POINTS, 0, state.settings.particleCount);
  // Unbind the vertex array object
  state.gl.bindVertexArray(null);
  // Unbind the render program
  state.gl.useProgram(null);
}

function applySettings(state: State) {
  state.gl.useProgram(state.transformProgram);
  state.gl.uniform1f(state.uDragConstantLoc, state.settings.dragConstant);
  state.gl.useProgram(state.renderProgram);
  state.gl.uniform1f(state.uPointSizeLoc, state.settings.pointSize);
  state.gl.uniform4f(
    state.uColorLoc,
    state.settings.red,
    state.settings.green,
    state.settings.blue,
    state.settings.alpha,
  );
  state.gl.useProgram(null);
}

export function cleanWebgl(state: State) {
  state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
  state.gl.bindBuffer(state.gl.ARRAY_BUFFER, null);
  state.gl.bindBuffer(state.gl.TRANSFORM_FEEDBACK_BUFFER, null);
  state.gl.bindVertexArray(null);
  state.gl.useProgram(null);
  state.gl.bindTexture(state.gl.TEXTURE_2D, null);
  state.gl.deleteProgram(state.transformProgram);
  state.gl.deleteProgram(state.renderProgram);
  state.gl.deleteBuffer(state.particlesBuf1);
  state.gl.deleteBuffer(state.particlesBuf2);
  state.gl.deleteVertexArray(state.particlesVao1);
  state.gl.deleteVertexArray(state.particlesVao2);
  state.gl.deleteTexture(state.noiseTexture);
}

// Log the contents of a buffer
export function saveBufferContents(
  gl: WebGL2RenderingContext,
  buffer: WebGLBuffer,
  size: number,
  filename: string = "buffer_contents.json",
) {
  const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  if (!sync) {
    console.error("Failed to create sync object.");
    return;
  }
  const checkStatus = () => {
    const status = gl.clientWaitSync(sync, gl.SYNC_FLUSH_COMMANDS_BIT, 0);
    if (status === gl.TIMEOUT_EXPIRED) {
      console.log("Waiting for GPU commands to complete...");
      setTimeout(checkStatus);
    } else if (status === gl.WAIT_FAILED) {
      console.error("Failed to wait for GPU commands to complete.");
    } else {
      const view = new Float32Array(size * 4);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.getBufferSubData(gl.ARRAY_BUFFER, 0, view);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      let data = [];
      for (let i = 0; i < view.length; i += 4) {
        data.push(view[i], view[i + 1]);
      }

      const dataStr = JSON.stringify(Array.from(data), null, 2);

      const blob = new Blob([dataStr], { type: "application/json" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 10);
    }
  };
  setTimeout(checkStatus);
}

/*
 * Compile and link WebGL shaders and produce a program.
 * @param vertexShader_in - The source code of the vertex shader.
 * @param fragmentShader_in - The source code of the fragment shader.
 * @param gl - The WebGL2RenderingContext to use for shader compilation and linking.
 * @param name - The name of the shader program for error messages.
 * @returns The compiled and linked program, or null if there was an error.
 * */
function compileLinkShader(
  vertexShader_in: string,
  fragmentShader_in: string,
  gl: WebGL2RenderingContext,
  name: string,
) {
  // Create the vertex shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  if (!vertexShader) {
    console.error(`Failed to create ${name} vertex shader.`);
    return null;
  }
  // Compile the vertex shader
  gl.shaderSource(vertexShader, vertexShader_in);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      `Failed to compile the ${name} vertex shader:`,
      gl.getShaderInfoLog(vertexShader),
    );
    return null;
  }

  // Create the fragment shader
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!fragmentShader) {
    console.error(`Failed to create ${name} fragment shader.`);
    return null;
  }
  // Compile the fragment shader
  gl.shaderSource(fragmentShader, fragmentShader_in);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      `Failed to compile the ${name} fragment shader:`,
      gl.getShaderInfoLog(fragmentShader),
    );
    return null;
  }

  // Create a program and link the shaders to it
  const program = gl.createProgram();
  if (!program) {
    console.error(`Failed to create ${name} program.`);
    return null;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  if (name === "transform") {
    gl.transformFeedbackVaryings(
      program,
      ["nPosition", "nVelocity"],
      gl.INTERLEAVED_ATTRIBS,
    );
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      `Failed to link the ${name} program:`,
      gl.getProgramInfoLog(program),
    );
    return null;
  }

  return program;
}

function getUniforms(state: State) {
  if (!state.renderProgram || !state.transformProgram) {
    console.error("Programs not initialized.");
    return;
  }
  state.uDeltaTimeLoc = state.gl.getUniformLocation(
    state.transformProgram,
    "uDeltaTime",
  );
  state.uDragConstantLoc = state.gl.getUniformLocation(
    state.transformProgram,
    "uDragConstant",
  );
  state.uNoiseLoc = state.gl.getUniformLocation(
    state.transformProgram,
    "uNoise",
  );
  state.uPointSizeLoc = state.gl.getUniformLocation(
    state.renderProgram,
    "uPointSize",
  );
  state.uColorLoc = state.gl.getUniformLocation(state.renderProgram, "uColor");
}

/*
 * Compile and link WebGL shaders for the rendering and transformation programs
 * @param state - The simulation state object containing WebGL context and other properties.
 * @returns {boolean} - Returns true if the shaders and programs were built successfully, false otherwise.
 * */
function compileShadersAndLinkPrograms(state: State) {
  // Build the render program
  state.renderProgram = compileLinkShader(
    RENDER_VERTEX_SHADER_GLSL,
    RENDER_FRAGMENT_SHADER_GLSL,
    state.gl,
    "render",
  );
  if (!state.renderProgram) {
    return false;
  }

  // Build the transform program
  state.transformProgram = compileLinkShader(
    TRANSFORM_VERTEX_SHADER_GLSL,
    TRANSFORM_FRAGMENT_SHADER_GLSL,
    state.gl,
    "transform",
  );
  if (!state.transformProgram) {
    return false;
  }

  getUniforms(state);

  return true;
}

function buildBuffers(state: State) {
  let particles = new Float32Array(state.settings.particleCount * 4);
  for (let i = 0; i < state.settings.particleCount; i++) {
    particles[i * 4] = Math.random() * 2 - 1; // x position
    particles[i * 4 + 1] = Math.random() * 2 - 1; // y position
    particles[i * 4 + 2] = Math.random() * 0.001 - 0.0005; // x velocity
    particles[i * 4 + 3] = Math.random() * 0.001 - 0.0005; // y velocity
  }

  // Create and init buffer 1
  state.particlesBuf1 = state.gl.createBuffer();
  state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.particlesBuf1);
  state.gl.bufferData(state.gl.ARRAY_BUFFER, particles, state.gl.DYNAMIC_DRAW);

  // Create a VAO for buffer 1
  state.particlesVao1 = state.gl.createVertexArray();
  if (!state.particlesVao1) {
    console.error("Failed to create vertex array object 1.");
    return false;
  }
  // Bind the VAO for buffer 1
  state.gl.bindVertexArray(state.particlesVao1);

  // Set up vertex attributes for aPosition and aVelocity
  state.gl.vertexAttribPointer(0, 2, state.gl.FLOAT, false, 16, 0);
  state.gl.vertexAttribPointer(1, 2, state.gl.FLOAT, false, 16, 8);
  state.gl.enableVertexAttribArray(0);
  state.gl.enableVertexAttribArray(1);

  // Unbind the vertex array object
  state.gl.bindVertexArray(null);
  // Unbind the buffer
  state.gl.bindBuffer(state.gl.ARRAY_BUFFER, null);

  // Create and init buffer 2
  state.particlesBuf2 = state.gl.createBuffer();
  state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.particlesBuf2);
  state.gl.bufferData(state.gl.ARRAY_BUFFER, particles, state.gl.DYNAMIC_DRAW);

  // Create a VAO for buffer 2
  state.particlesVao2 = state.gl.createVertexArray();
  if (!state.particlesVao2) {
    console.error("Failed to create vertex array object 2.");
    return false;
  }
  // Bind the VAO for buffer 2
  state.gl.bindVertexArray(state.particlesVao2);

  // Set up vertex attributes for aPosition and aVelocity
  state.gl.vertexAttribPointer(0, 2, state.gl.FLOAT, false, 16, 0);
  state.gl.vertexAttribPointer(1, 2, state.gl.FLOAT, false, 16, 8);
  state.gl.enableVertexAttribArray(0);
  state.gl.enableVertexAttribArray(1);

  // Unbind the vertex array object
  state.gl.bindVertexArray(null);
  // Unbind the buffer
  state.gl.bindBuffer(state.gl.ARRAY_BUFFER, null);

  state.active = true;

  return true;
}

export function updateNoiseTexture(state: State, data: Float32Array) {
  state.gl.bindTexture(state.gl.TEXTURE_2D, state.noiseTexture);
  state.gl.texSubImage2D(
    state.gl.TEXTURE_2D,
    0,
    0,
    0,
    state.settings.noiseSize,
    state.settings.noiseSize,
    state.gl.RG,
    state.gl.FLOAT,
    data,
  );
  state.gl.bindTexture(state.gl.TEXTURE_2D, null);
}

function buildNoiseTexture(state: State) {
  state.noiseTexture = state.gl.createTexture();
  if (!state.noiseTexture) {
    console.error("Failed to create noise texture.");
    return false;
  }

  const data = getNoiseData(
    state.settings.noiseSize,
    state.settings.noiseOffsetX,
    state.settings.noiseOffsetY,
    state.settings.noiseStepX,
    state.settings.noiseStepY,
    state.settings.noiseStrength,
    state.noiseZ,
  );

  state.gl.bindTexture(state.gl.TEXTURE_2D, state.noiseTexture);
  state.gl.texImage2D(
    state.gl.TEXTURE_2D,
    0,
    state.gl.RG32F,
    state.settings.noiseSize,
    state.settings.noiseSize,
    0,
    state.gl.RG,
    state.gl.FLOAT,
    data,
  );

  state.gl.texParameteri(
    state.gl.TEXTURE_2D,
    state.gl.TEXTURE_MIN_FILTER,
    state.gl.NEAREST,
  );
  state.gl.texParameteri(
    state.gl.TEXTURE_2D,
    state.gl.TEXTURE_MAG_FILTER,
    state.gl.NEAREST,
  );

  state.gl.bindTexture(state.gl.TEXTURE_2D, null);

  state.gl.useProgram(state.transformProgram);
  state.gl.uniform1i(state.uNoiseLoc, 0);
  state.gl.useProgram(null);

  return true;
}

/*
 * Setup WebGL context and shaders for the particle simulation.
 * @param state - The simulation state object containing WebGL context and other properties.
 * @return {boolean} - Returns true if setup was successful, false otherwise.
 * */
export function setupWebgl(state: State) {
  // Setup the shaders and get the programs
  if (!compileShadersAndLinkPrograms(state)) {
    return false;
  }

  if (!buildBuffers(state)) {
    return false;
  }

  if (!buildNoiseTexture(state)) {
    return false;
  }

  // Set the viewport to the size of the canvas
  state.gl.viewport(0, 0, state.canvas.width, state.canvas.height);

  state.gl.enable(state.gl.BLEND);
  state.gl.blendFunc(state.gl.SRC_ALPHA, state.gl.ONE_MINUS_SRC_ALPHA);

  applySettings(state);

  return true;
}

let lastTime = performance.now();
let lastFrame = 0;
/*
 * Get the frames per second (FPS) based on the elapsed time and frame count.
 * @param state - The simulation state
 * @return {string|null} - Returns the FPS as a string with two decimal places,
 * or null if not enough time has passed.
 * */
export function getFps(state: State) {
  const time = state.lastTime - lastTime;
  const frame = state.frame - lastFrame;
  const fps = frame / (time / 1000);
  lastTime = state.lastTime;
  lastFrame = state.frame;
  return fps.toFixed(2);
}
