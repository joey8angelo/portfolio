"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  State,
  getFps,
  setupWebgl,
  updateNoiseTexture,
  transform,
  render,
  cleanWebgl,
  saveBufferContents,
  loadSettings,
  saveSettings,
} from "@/components/particles/util";
import pako from "pako";

interface SettingsInputProps {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  type?: "number" | "range";
  min?: number;
  max?: number;
  step?: number;
}

function SettingsInput({
  label,
  value,
  onChange,
  type = "number",
  min = -Infinity,
  max = Infinity,
  step = 1,
}: SettingsInputProps) {
  return (
    <div className="mb-2">
      <label className="block mb-1 w-fit">{label}:</label>
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        className="border p-1 w-fit rounded"
      />
    </div>
  );
}

interface ParticleSimulationProps {
  id: string;
  particleCount?: number;
  pointSize?: number;
  dragConstant?: number;
  red?: number;
  green?: number;
  blue?: number;
  alpha?: number;
  noiseSize?: number;
  noiseOffsetX?: number;
  noiseOffsetY?: number;
  noiseStrength?: number;
  noiseStepX?: number;
  noiseStepY?: number;
  noiseStepZ?: number;
  className?: string;
  showSettings?: boolean;
  logFps?: boolean;
  cacheSettings?: boolean;
  dynamicParticleCount?: boolean;
  targetFps?: number;
  disableAnimationThreshold?: number;
  doStatic?: boolean;
}

/*
 * ParticleSimulation component that renders a WebGL particle simulation
 * with customizable settings.
 *
 * @param {id} id - Unique identifier for the simulation instance.
 * @param {particleCount} particleCount - Optional number of particles to simulate.
 * @param {pointSize} pointSize - Optional size of each particle point.
 * @param {dragConstant} dragConstant - Optional drag constant for particle movement.
 * @param {red} red - Optional red color component for particles.
 * @param {green} green - Optional green color component for particles.
 * @param {blue} blue - Optional blue color component for particles.
 * @param {alpha} alpha - Optional alpha (transparency) value for particles.
 * @param {noiseSize} noiseSize - Optional size of the noise texture.
 * Controls the resolution of the noise texture
 * @param {noiseOffsetX} noiseOffsetX - Optional X offset for the noise texture.
 * @param {noiseOffsetY} noiseOffsetY - Optional Y offset for the noise texture.
 * Noise offsets are the starting point of the noise texture changing over time.
 * A random X/Y offset makes the noise random each time the simulation starts.
 * @param {noiseStrength} noiseStrength - Optional strength of the noise effect on particle movement.
 * @param {noiseStepX} noiseStepX - Optional step size for noise calculation in the X direction.
 * @param {noiseStepY} noiseStepY - Optional step size for noise calculation in the Y direction.
 * @param {noiseStepZ} noiseStepZ - Optional step size for noise calculation in the Z direction(time).
 * @param {className} className - Optional CSS class name for styling the component.
 * @param {showSettings} showSettings - Optional flag to show/hide the settings panel.
 * @param {logFps} logFps - Optional flag to log the frames per second (FPS) in the console.
 * @param {cacheSettings} cacheSettings - Optional flag to save settings in local storage
 * This will make settings persistent across pages and reloads
 * Overwriting the settings passed in the props if the settings are already cached.
 * After the first cache settings can only be changed through the settings panel.
 * @param {dynamicParticleCount} dynamicParticleCount - Optional flag to enable dynamic particle count.
 * On the first render a search simulation will run to look for a particle count that gives a stable FPS
 * at the target FPS and stores it in local storage, using particleCount as an upper bound.
 * Note that this setting will make the Particle Count setting in the settings panel read-only.
 * @param {targetFps} targetFps - Optional target FPS for dynamicParticleCount.
 * @param {disableAnimationThreshold} disableAnimationThreshold - Optional threshold to disable the simulation.
 * If dynamicParticleCount finds a particle count below this threshold the simulation will stop running
 * @param {doStatic} doStatic - Optional flag to enable static rendering.
 * If true, the component will render a static canvas with precomputed particle positions
 * If something goes wrong with the WebGL context or the simulation, like if the browser does
 * not support WebGL2, or the particle count is below disableAnimationThreshold.
 * The static canvas can still be edited with the settings panel, but will not animate.
 * */
export default function ParticleSimulation({
  id,
  particleCount = 10000000,
  pointSize = 1,
  dragConstant = 1500000,
  red = 0.92,
  green = 1,
  blue = 0.75,
  alpha = 0.15,
  noiseSize = 400,
  noiseOffsetX = Math.random() * 5000,
  noiseOffsetY = Math.random() * 5000,
  noiseStrength = 0.000002,
  noiseStepX = 0.02,
  noiseStepY = 0.015,
  noiseStepZ = 0.006,
  className = "",
  showSettings = false,
  logFps = false,
  cacheSettings = true,
  dynamicParticleCount = true,
  targetFps = 60,
  disableAnimationThreshold = 1000,
  doStatic = true,
}: ParticleSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const [settings, setSettings] = useState({
    particleCount: particleCount,
    pointSize: pointSize,
    noiseSize: noiseSize,
    dragConstant: dragConstant,
    red: red,
    green: green,
    blue: blue,
    alpha: alpha,
    noiseOffsetX: noiseOffsetX,
    noiseOffsetY: noiseOffsetY,
    noiseStrength: noiseStrength,
    noiseStepX: noiseStepX,
    noiseStepY: noiseStepY,
    noiseStepZ: noiseStepZ,
  });
  // Display settings are used to update the UI
  const [displaySettings, setDisplaySettings] = useState(settings);
  // Debounce ref for settings updates
  const settingsDebounceRef = useRef<NodeJS.Timeout | null>(null);
  // Animation frame reference
  const animationRef = useRef(0);
  // Noise update ref is used to update the noise texture every 500ms
  const noiseUpdateRef = useRef<NodeJS.Timeout | null>(null);
  // Worker reference for noise texture computation
  const noiseWorkerRef = useRef<Worker | null>(null);
  // FPS update ref is used to log the FPS every second
  const fpsUpdateRef = useRef<NodeJS.Timeout | null>(null);
  const cycles = 24; // 2**24 = 16777216 is a good max
  const [dynamicParticleCountCycles, setDynamicParticleCountCycles] = useState(
    dynamicParticleCount ? 0 : cycles,
  );
  const particleBufRef = useRef<WebGLBuffer | null>(null);

  const [isStatic, setIsStatic] = useState(false);

  const staticParticleRef = useRef<any | null>(null);

  // Static Canvas
  // This effect runs only when isStatic and doStatic are true
  // Renders precomputed static particle position data without animation
  useEffect(() => {
    if (!isStatic || !doStatic) return;
    console.log(`Static canvas with id ${id} initialized.`);
    const canvas = staticCanvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found.");
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("2D context not available.");
      return;
    }

    // resize observer to adjust canvas size
    const resizeObserver = new ResizeObserver((event) => {
      canvas.width = event[0].contentRect.width;
      canvas.height = event[0].contentRect.height;
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      draw();
    });
    resizeObserver.observe(canvas);

    const draw = () => {
      if (!staticParticleRef.current) return;
      for (let i = 0; i < staticParticleRef.current.length; i += 2) {
        const x = ((staticParticleRef.current[i] + 1) / 2) * canvas.width;
        const y =
          ((staticParticleRef.current[i + 1] * -1 + 1) / 2) * canvas.height;
        ctx.fillStyle = `rgba(${settings.red * 255}, ${settings.green * 255}, ${settings.blue * 255}, ${settings.alpha})`;
        ctx.beginPath();
        ctx.rect(x, y, settings.pointSize, settings.pointSize);
        ctx.fill();
      }
    };

    const getDataAndDraw = async () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!staticParticleRef.current) {
        try {
          const response = await fetch("/buffer_contents.json.gz");
          const compressed = await response.arrayBuffer();
          const decompressed = pako.inflate(compressed, { to: "string" });
          const staticData = JSON.parse(decompressed);
          staticParticleRef.current = staticData;
          if (!staticParticleRef.current) {
            console.error("Static particle data not found.");
            return;
          }
          console.log("loaded static particle data");
        } catch (error) {
          console.error("Error loading static particle data:", error);
          return;
        }
      }

      // hide the default canvas
      canvasRef.current?.classList.add("hidden");
      // show the static canvas
      canvas.classList.remove("hidden");

      loadSettings(id, settings, false);
      setDisplaySettings((prev) => ({
        ...prev,
        particleCount: particleCount,
        pointSize: settings.pointSize,
        noiseSize: settings.noiseSize,
        dragConstant: settings.dragConstant,
        red: settings.red,
        green: settings.green,
        blue: settings.blue,
        alpha: settings.alpha,
        noiseOffsetX: settings.noiseOffsetX,
        noiseOffsetY: settings.noiseOffsetY,
        noiseStrength: settings.noiseStrength,
        noiseStepX: settings.noiseStepX,
        noiseStepY: settings.noiseStepY,
        noiseStepZ: settings.noiseStepZ,
      }));

      draw();
    };

    getDataAndDraw();

    return () => {
      resizeObserver.disconnect();
      console.log(`Static canvas with id ${id} cleaned up.`);
    };
  }, [JSON.stringify(settings), isStatic]);

  // Dynamic Particle Count Simulation
  // This effect runs when dynamicParticleCount is true and
  // dynamicParticleCountCycles is less than cycles and isStatic is false.
  // It will run 15 frames cycles times until it finds a suitable particle count
  useEffect(() => {
    if (
      !dynamicParticleCount ||
      dynamicParticleCountCycles >= cycles ||
      isStatic
    )
      return;

    console.log(
      "Dynamic particle count sim cycle: ",
      dynamicParticleCountCycles,
      " with id ",
      id,
    );
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found.");
      return;
    }
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      setIsStatic(true);
      return;
    }

    // Simulation state
    let state: State = {
      id: id,
      canvas: canvas,
      gl: gl,
      // programs
      renderProgram: null,
      transformProgram: null,
      // uniform locations
      uDeltaTimeLoc: null,
      uPointSizeLoc: null,
      uNoiseLoc: null,
      uDragConstantLoc: null,
      uColorLoc: null,
      // buffers and vaos
      particlesBuf1: null,
      particlesBuf2: null,
      particlesVao1: null,
      particlesVao2: null,
      noiseTexture: null,
      // timekeeping
      deltaTime: 0,
      lastTime: 0,
      startTime: 0,
      frame: 0,

      settings: settings,
      noiseZ: 0,

      active: true,
    };

    // get the cached particle count from local storage
    const cachedDynamicParticleTimeStamp = localStorage.getItem(
      `${id}:dynamicParticleTimeStamp`,
    );
    if (cachedDynamicParticleTimeStamp) {
      const timeStamp = parseInt(cachedDynamicParticleTimeStamp);
      // If the cached dynamic particle count is older than 24 hours, remove it
      if (Date.now() - timeStamp < 24 * 60 * 60 * 1000) {
        if (loadSettings(state.id, state.settings, true)) {
          setDynamicParticleCountCycles(cycles);
          return;
        }
      }
    }

    if (dynamicParticleCountCycles === 0) {
      setTimeout(() => {
        setDynamicParticleCountCycles(1);
      }, 1000);
      return;
    }

    state.settings.particleCount = Math.pow(2, dynamicParticleCountCycles);
    if (state.settings.particleCount > particleCount) {
      state.settings.particleCount = particleCount;
      setDynamicParticleCountCycles(cycles);
      saveSettings(state.id, state.settings, true);
      localStorage.setItem(`${id}:dynamicParticleTimeStamp`, `${Date.now()}`);
    }

    const originalAlpha = state.settings.alpha;
    state.settings.alpha = 0;
    if (!setupWebgl(state)) {
      setIsStatic(true);
      cleanWebgl(state);
      return;
    }
    state.settings.alpha = originalAlpha;

    const resizeObserver = new ResizeObserver((event) => {
      canvas.width = event[0].contentRect.width;
      canvas.height = event[0].contentRect.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
    });
    resizeObserver.observe(canvas);

    const loop = () => {
      state.deltaTime = performance.now() - state.lastTime;
      state.lastTime = performance.now();
      state.frame++;

      transform(state);
      render(state);

      // Check the test simulation after 15 frames
      if (state.frame == 15) {
        if (dynamicParticleCountCycles < 2) {
          setDynamicParticleCountCycles(dynamicParticleCountCycles + 1);
        } else {
          const end = performance.now();
          const cfps = (1000 / (end - state.startTime)) * 15;
          console.log(
            cfps,
            "fps at particle count",
            state.settings.particleCount,
          );
          if (cfps < targetFps - 5) {
            setDynamicParticleCountCycles(cycles);
            state.settings.particleCount = Math.pow(
              2,
              dynamicParticleCountCycles - 1,
            );
            saveSettings(state.id, state.settings, true);
            localStorage.setItem(
              `${id}:dynamicParticleTimeStamp`,
              `${Date.now()}`,
            );
          } else {
            setDynamicParticleCountCycles(dynamicParticleCountCycles + 1);
          }
        }
      }

      // get the animation frame for cleanup
      animationRef.current = requestAnimationFrame(loop);
    };
    state.startTime = performance.now();
    animationRef.current = requestAnimationFrame(loop);

    return () => {
      cleanWebgl(state);
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      console.log("Finished cycle", dynamicParticleCountCycles, "for id", id);
    };
  }, [dynamicParticleCountCycles]);

  // Main Simulation
  // This effect runs when isStatic is false and the dynamicParticleCount simulation
  // finishes.
  useEffect(() => {
    if (isStatic || dynamicParticleCountCycles < cycles) return;

    console.log(`Start simulation with id ${id}.`);
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found.");
      return;
    }
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      setIsStatic(true);
      return;
    }

    // Simulation state
    let state: State = {
      id: id,
      canvas: canvas,
      gl: gl,
      // programs
      renderProgram: null,
      transformProgram: null,
      // uniform locations
      uDeltaTimeLoc: null,
      uPointSizeLoc: null,
      uNoiseLoc: null,
      uDragConstantLoc: null,
      uColorLoc: null,
      // buffers and vaos
      particlesBuf1: null,
      particlesBuf2: null,
      particlesVao1: null,
      particlesVao2: null,
      noiseTexture: null,
      // timekeeping
      deltaTime: 0,
      lastTime: 0,
      startTime: 0,
      frame: 0,

      settings: settings,
      noiseZ: 0,

      active: true,
    };

    loadSettings(state.id, state.settings, !cacheSettings);

    setDisplaySettings({
      particleCount: state.settings.particleCount,
      pointSize: state.settings.pointSize,
      noiseSize: state.settings.noiseSize,
      dragConstant: state.settings.dragConstant,
      red: state.settings.red,
      green: state.settings.green,
      blue: state.settings.blue,
      alpha: state.settings.alpha,
      noiseOffsetX: state.settings.noiseOffsetX,
      noiseOffsetY: state.settings.noiseOffsetY,
      noiseStrength: state.settings.noiseStrength,
      noiseStepX: state.settings.noiseStepX,
      noiseStepY: state.settings.noiseStepY,
      noiseStepZ: state.settings.noiseStepZ,
    });

    // Initialize webgl, create shaders, buffers, and textures
    // and apply the states settings
    if (!setupWebgl(state)) {
      setIsStatic(true);
      return;
    }

    // Update canvas size and viewport on resize
    const resizeObserver = new ResizeObserver((event) => {
      canvas.width = event[0].contentRect.width;
      canvas.height = event[0].contentRect.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
    });
    resizeObserver.observe(canvas);

    particleBufRef.current = state.particlesBuf1;

    // Create the noise web worker to compute the noise texture
    noiseWorkerRef.current = new Worker(
      new URL("@/components/particles/noise.worker.ts", import.meta.url),
    );
    // When the worker sends a message with the texture data,
    // send the data to the gpu
    noiseWorkerRef.current.onmessage = (event) => {
      const { data, nZ } = event.data;
      state.noiseZ = nZ;

      updateNoiseTexture(state, data);
    };
    // Noise update loop updates the noise texture every 500ms
    // Sends the relevant noise data to a web worker to compute the
    // noise texture
    noiseUpdateRef.current = setInterval(() => {
      if (noiseWorkerRef.current) {
        noiseWorkerRef.current.postMessage({
          noiseSize: state.settings.noiseSize,
          noiseOffsetX: state.settings.noiseOffsetX,
          noiseOffsetY: state.settings.noiseOffsetY,
          noiseStepX: state.settings.noiseStepX,
          noiseStepY: state.settings.noiseStepY,
          noiseStepZ: state.settings.noiseStepZ,
          noiseStrength: state.settings.noiseStrength,
          noiseZ: state.noiseZ,
        });
      }
    }, 500);

    // FPS log loop, logs the FPS every second
    if (logFps) {
      fpsUpdateRef.current = setInterval(() => {
        const fps = getFps(state);
        console.log(`FPS: ${fps}`);
      }, 1000);
    }

    // Main animation loop
    // Transform will call the transform feedback shader to update the particles position/velocity
    // Render will call the render shader to draw the particles on the screen
    const loop = () => {
      state.deltaTime = performance.now() - state.lastTime;
      state.lastTime = performance.now();
      state.frame++;

      transform(state); // transform particles
      render(state); // render particles

      // get the animation frame for cleanup
      animationRef.current = requestAnimationFrame(loop);
    };
    if (state.settings.particleCount > disableAnimationThreshold) {
      state.startTime = performance.now();
      animationRef.current = requestAnimationFrame(loop);
    } else {
      console.warn(
        `Particle count is below the threshold (${disableAnimationThreshold}), animation will not run.`,
      );
      setIsStatic(true);
    }

    return () => {
      // cleanup function to stop the animation
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      if (noiseUpdateRef.current) {
        clearInterval(noiseUpdateRef.current);
      }
      if (fpsUpdateRef.current) {
        clearInterval(fpsUpdateRef.current);
      }
      if (noiseWorkerRef.current) {
        noiseWorkerRef.current.terminate();
      }
      if (settingsDebounceRef.current) {
        clearTimeout(settingsDebounceRef.current);
      }
      cleanWebgl(state);
      console.log("Simulation with id", id, "cleaned up.");
    };
  }, [JSON.stringify(settings), id, dynamicParticleCountCycles]);

  // Given a setting key and value update the settings state
  const handleSettingsChange = (key: string, value: string | number) => {
    // Update the displayed settings immediately
    setDisplaySettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Debounce the actual settings update
    if (settingsDebounceRef.current) {
      clearTimeout(settingsDebounceRef.current);
    }

    // Use a timeout to debounce the settings update
    settingsDebounceRef.current = setTimeout(() => {
      console.log(`Setting changed: ${key} = ${value}`);
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      if (cacheSettings) {
        saveSettings(id, newSettings, false);
      }
    }, 300);
  };

  function saveBuf() {
    if (!canvasRef.current || !particleBufRef.current) {
      console.log("canvas or particle buffer not found");
      return;
    }
    const gl = canvasRef.current.getContext("webgl2");
    if (!gl) {
      console.error("WebGL2 context not available.");
      return;
    }

    saveBufferContents(gl, particleBufRef.current, settings.particleCount);
  }
  return (
    <div className={className}>
      <div className={`relative w-full h-full`}>
        <canvas ref={canvasRef} className="absolute w-full h-full" />
        {doStatic && (
          <canvas
            ref={staticCanvasRef}
            className="absolute w-full h-full hidden"
          />
        )}
        {showSettings && (
          <div className="h-full w-fit absolute top-0 left-0 p-4 z-10 overflow-scroll p-bottom-20">
            <h2 className="text-lg w-fit font-bold mb-2">
              Simulation Settings
            </h2>
            <div className="mb-2 w-fit">
              {dynamicParticleCount ? (
                <p className="mb-1">
                  Particle Count: {displaySettings.particleCount}
                </p>
              ) : (
                <SettingsInput
                  label="Particle Count"
                  value={displaySettings.particleCount}
                  onChange={(value) =>
                    handleSettingsChange("particleCount", parseFloat(value))
                  }
                  min={0}
                  step={1000}
                />
              )}
              <SettingsInput
                label="Particle Size"
                value={displaySettings.pointSize}
                onChange={(value) =>
                  handleSettingsChange("pointSize", parseFloat(value))
                }
                min={0}
                step={0.1}
              />
              <SettingsInput
                label="Noise Strength"
                value={displaySettings.noiseStrength}
                onChange={(value) =>
                  handleSettingsChange("noiseStrength", parseFloat(value))
                }
                min={0}
                step={0.0000001}
              />
              <SettingsInput
                label="Drag"
                value={displaySettings.dragConstant}
                onChange={(value) =>
                  handleSettingsChange("dragConstant", parseFloat(value))
                }
                min={0}
                step={100000}
              />
              <SettingsInput
                label="Noise X Step Size"
                value={displaySettings.noiseStepX}
                onChange={(value) =>
                  handleSettingsChange("noiseStepX", parseFloat(value))
                }
                min={0}
                step={0.001}
              />
              <SettingsInput
                label="Noise Y Step Size"
                value={displaySettings.noiseStepY}
                onChange={(value) =>
                  handleSettingsChange("noiseStepY", parseFloat(value))
                }
                min={0}
                step={0.001}
              />
              <SettingsInput
                label="Noise Time Step Size"
                value={displaySettings.noiseStepZ}
                onChange={(value) =>
                  handleSettingsChange("noiseStepZ", parseFloat(value))
                }
                min={0}
                step={0.001}
              />
              <SettingsInput
                label="Particle Red"
                value={displaySettings.red}
                onChange={(value) =>
                  handleSettingsChange("red", parseFloat(value))
                }
                min={0}
                max={1}
                step={0.01}
                type="range"
              />
              <SettingsInput
                label="Particle Green"
                value={displaySettings.green}
                onChange={(value) =>
                  handleSettingsChange("green", parseFloat(value))
                }
                min={0}
                max={1}
                step={0.01}
                type="range"
              />
              <SettingsInput
                label="Particle Blue"
                value={displaySettings.blue}
                onChange={(value) =>
                  handleSettingsChange("blue", parseFloat(value))
                }
                min={0}
                max={1}
                step={0.01}
                type="range"
              />
              <SettingsInput
                label="Particle Alpha"
                value={displaySettings.alpha}
                onChange={(value) =>
                  handleSettingsChange("alpha", parseFloat(value))
                }
                min={0}
                max={1}
                step={0.01}
                type="range"
              />
              <div className="mb-2">
                <button
                  className="border-2 border-white rounded p-1 cursor-pointer
              hover:bg-white hover:text-black transition-colors duration-300 
              active:scale-95 w-fit mt-2"
                  onClick={() => {
                    localStorage.removeItem(`${id}:settings`);
                    localStorage.removeItem(`${id}:dynamicParticleCount`);
                    localStorage.removeItem(`${id}:dynamicParticleTimeStamp`);
                    setSettings({
                      particleCount: particleCount,
                      pointSize: pointSize,
                      noiseSize: noiseSize,
                      dragConstant: dragConstant,
                      red: red,
                      green: green,
                      blue: blue,
                      alpha: alpha,
                      noiseOffsetX: Math.random() * 5000,
                      noiseOffsetY: Math.random() * 5000,
                      noiseStrength: noiseStrength,
                      noiseStepX: noiseStepX,
                      noiseStepY: noiseStepY,
                      noiseStepZ: noiseStepZ,
                    });
                    if (dynamicParticleCount) {
                      setDynamicParticleCountCycles(0);
                    }
                    if (doStatic) {
                      setIsStatic(false);
                      staticCanvasRef.current?.classList.add("hidden");
                      canvasRef.current?.classList.remove("hidden");
                    }
                  }}
                >
                  Reset Settings
                </button>
              </div>
              <div className="mb-2">
                <button
                  className="border-2 border-white rounded p-1 cursor-pointer
              hover:bg-white hover:text-black transition-colors duration-300
              active:scale-95 w-fit mt-2"
                  onClick={() => saveBuf()}
                >
                  Save Particle Buffer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
