import { forwardRef, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { Effect } from "postprocessing";
import fragmentShader from "./Halftone/shaders/frag.glsl";

interface HalftoneParams {
  scale?: number;
  rotation?: number;
  frequency?: number;
}

class HalftoneEffectImpl extends Effect {
  constructor({
    scale = 1.0,
    rotation = 0.785,
    frequency = 40.0,
  }: HalftoneParams = {}) {
    super("HalftoneEffect", fragmentShader, {
      uniforms: new Map<string, THREE.Uniform>([
        ["uScale", new THREE.Uniform(scale)],
        ["uRotation", new THREE.Uniform(rotation)],
        ["uFrequency", new THREE.Uniform(frequency)],
      ]),
    });
  }

  updateUniforms(scale: number, rotation: number, frequency: number) {
    this.uniforms.get("uScale")!.value = scale;
    this.uniforms.get("uRotation")!.value = rotation;
    this.uniforms.get("uFrequency")!.value = frequency;
  }
}

interface HalftoneProps {
  scale?: number;
  rotation?: number;
  frequency?: number;
}

export const HalftoneEffect = forwardRef<HalftoneEffectImpl, HalftoneProps>(
  ({ scale = 1.0, rotation = 0.785, frequency = 40.0 }, ref) => {
    const effect = useMemo(
      () => new HalftoneEffectImpl({ scale, rotation, frequency }),
      [scale, rotation, frequency],
    );

    useLayoutEffect(() => {
      effect.updateUniforms(scale, rotation, frequency);
    }, [effect, scale, rotation, frequency]);

    return <primitive ref={ref} object={effect} dispose={null} />;
  },
);
