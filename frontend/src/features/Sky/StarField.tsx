import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { useDebugControls } from "../../hooks/useDebugControls";
import { bvToColor } from "./starUtils";
import { useLoadingStore } from "../../store";
import { gsap } from "gsap";
import { GlowingPointMaterial } from "../Materials/GlowingPointMaterial";

useLoader.preload(THREE.FileLoader, "/assets/ybsc_parsed.csv");

export default function StarField({
  url,
  radius,
}: {
  url: string;
  radius: number;
}) {
  const isLoaded = useLoadingStore((state) => state.isLoaded);
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const starData = useLoader(THREE.FileLoader, url);

  const starMaterial = useMemo(() => new GlowingPointMaterial(), []);

  const { twinkleSpeed, twinkleIntensity, radiusMultiplier } = useDebugControls(
    {
      twinkleSpeed: {
        value: 0.6,
        min: 0,
        max: 2,
        step: 0.01,
      },
      twinkleIntensity: {
        value: 0.12,
        min: 0,
        max: 1,
        step: 0.01,
      },
      radiusMultiplier: {
        value: 3,
        min: 0,
        max: 10,
        step: 0.1,
      },
    },
  );

  useEffect(() => {
    if (isLoaded && materialRef.current) {
      gsap.fromTo(
        materialRef.current.uniforms.uRadius,
        { value: 0 },
        { value: radius * radiusMultiplier, duration: 5, ease: "power2.out" },
      );
    }
  }, [isLoaded, radius, radiusMultiplier]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value =
        state.clock.elapsedTime * twinkleSpeed;
    }
  });

  const geometry = useMemo(() => {
    const lines = (starData as string).split("\n").slice(1);
    const positions = new Float32Array(lines.length * 3);
    const colors = new Float32Array(lines.length * 3);
    const sizes = new Float32Array(lines.length);
    const seeds = new Float32Array(lines.length);

    lines.forEach((line, i) => {
      if (!line.trim()) return;
      const [, , bv, vmag, x, y, z] = line.split(",");
      const bvVal = parseFloat(bv);
      const magVal = parseFloat(vmag);

      const xV = parseFloat(x);
      const yV = parseFloat(y);
      const zV = parseFloat(z);

      positions[i * 3] = xV * radius;
      positions[i * 3 + 1] = yV * radius;
      positions[i * 3 + 2] = zV * radius;

      const color = bvToColor(bvVal);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.max(0.1, (7.0 - magVal) * 0.5);

      const dot = xV * 12.9898 + yV * 78.233 + zV * 437.164;
      const hash = Math.sin(dot) * 43758.5453;
      seeds[i] = hash - Math.floor(hash);
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));

    return geo;
  }, [starData, radius]);

  return (
    <points ref={pointsRef} geometry={geometry} renderOrder={1}>
      <primitive
        object={starMaterial}
        attach="material"
        ref={materialRef}
        uTwinkleIntensity={twinkleIntensity}
      />
    </points>
  );
}
