import { forwardRef, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import fragmentShader from "./shaders/frag.glsl";
import { Effect } from "postprocessing";

interface DitherParams {
  colorNum?: number;
  pixelSize?: number;
}

class DitherEffectImpl extends Effect {
  constructor({ colorNum = 4.0, pixelSize = 2.0 }: DitherParams = {}) {
    super("DitherEffect", fragmentShader, {
      uniforms: new Map<string, THREE.Uniform>([
        ["colorNum", new THREE.Uniform(colorNum)],
        ["pixelSize", new THREE.Uniform(pixelSize)],
      ]),
    });
  }
  updateUniforms(colorNum: number, pixelSize: number) {
    this.uniforms.get("colorNum")!.value = colorNum;
    this.uniforms.get("pixelSize")!.value = pixelSize;
  }
}

interface DitherProps {
  colorNum?: number;
  pixelSize?: number;
}

export const DitherEffect = forwardRef<DitherEffectImpl, DitherProps>(
  ({ colorNum = 4.0, pixelSize = 2.0 }, ref) => {
    const effect = useMemo(
      () => new DitherEffectImpl({ colorNum, pixelSize }),
      [colorNum, pixelSize],
    );
    useLayoutEffect(() => {
      effect.updateUniforms(colorNum, pixelSize);
    }, [effect, colorNum, pixelSize]);
    return <primitive ref={ref} object={effect} dispose={null} />;
  },
);
