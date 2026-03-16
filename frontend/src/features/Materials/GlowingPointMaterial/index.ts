import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import vertexShader from "./shaders/vert.glsl";
import fragmentShader from "./shaders/frag.glsl";

export const GlowingPointMaterial = shaderMaterial(
  {
    uTime: 0,
    uTwinkleIntensity: 0,
    uRadius: 0,
  },
  vertexShader,
  fragmentShader,
  (material) => {
    if (material instanceof THREE.ShaderMaterial) {
      material.transparent = true;
      material.blending = THREE.AdditiveBlending;
      material.depthWrite = false;
      material.vertexColors = true;
    }
  },
);
