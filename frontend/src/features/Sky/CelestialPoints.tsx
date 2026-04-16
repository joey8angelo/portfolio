import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { GlowingPointMaterial } from "../Materials/GlowingPoint/GlowingPoint";

export interface CelestialHandles {
  points: THREE.Points | null;
  material: THREE.ShaderMaterial | null;
}

interface NumberControl {
  value: number;
  min: number;
  max: number;
  step: number;
}

interface Controls {
  twinkleSpeed: NumberControl;
  twinkleIntensity: NumberControl;
  innerRadius: NumberControl;
  glowIntensity: NumberControl;
  radiusMultiplier: NumberControl;
}

interface CelestialPointsProps {
  namespace: string;
  controls: Controls;
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  seeds: Float32Array;
  handlePointerDown: (e: ThreeEvent<PointerEvent>) => void;
  radius: number;
}

const CelestialPoints = forwardRef<CelestialHandles, CelestialPointsProps>(
  (props, ref) => {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const material = useMemo(() => new GlowingPointMaterial(), []);

    useImperativeHandle(ref, () => ({
      get points() {
        return pointsRef.current;
      },
      get material() {
        return materialRef.current;
      },
    }));

    const geometry = useMemo(() => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(props.positions, 3),
      );
      geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(props.colors, 3),
      );
      geometry.setAttribute(
        "size",
        new THREE.BufferAttribute(new Float32Array(props.sizes), 1), // copy, to keep original sizes intact
      );
      geometry.setAttribute("seed", new THREE.BufferAttribute(props.seeds, 1));
      return geometry;
    }, [props.positions, props.colors, props.sizes, props.seeds]);

    const { twinkleSpeed, twinkleIntensity, innerRadius, glowIntensity } =
      useControls(props.namespace, {
        radiusMultiplier: {
          onChange: (value) => {
            if (pointsRef.current) {
              const sizes = pointsRef.current.geometry.attributes.size;
              for (let i = 0; i < sizes.count; i++) {
                sizes.setX(i, props.sizes[i] * value);
              }
              sizes.needsUpdate = true;
            }
          },
          ...props.controls.radiusMultiplier,
        },
        twinkleSpeed: props.controls.twinkleSpeed,
        twinkleIntensity: props.controls.twinkleIntensity,
        innerRadius: props.controls.innerRadius,
        glowIntensity: props.controls.glowIntensity,
      });

    useFrame((state) => {
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value =
          state.clock.elapsedTime * twinkleSpeed;
      }
    });

    return (
      <points
        geometry={geometry}
        renderOrder={1}
        ref={pointsRef}
        onPointerDown={props.handlePointerDown}
      >
        <primitive
          object={material}
          attach="material"
          ref={materialRef}
          uRadius={props.radius}
          uTwinkleIntensity={twinkleIntensity}
          uInnerRadius={innerRadius}
          uGlowIntensity={glowIntensity}
        />
      </points>
    );
  },
);

export default CelestialPoints;
