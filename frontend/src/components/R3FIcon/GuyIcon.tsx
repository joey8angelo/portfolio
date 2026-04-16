import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useGLTF } from "@react-three/drei";
import { DitherEffect } from "../../features/Effects/Dither/Dither";
import useResponsive from "../../hooks/useResponsive";

useGLTF.preload("/assets/guy.glb");

export default function GuyIcon({
  selected,
  duration,
}: {
  selected: boolean;
  duration: number;
}) {
  const { scene } = useGLTF("/assets/guy.glb");
  const guyRef = useRef<THREE.Group>(null);
  const { is } = useResponsive();

  const [material] = useState<THREE.MeshBasicMaterial>(
    new THREE.MeshBasicMaterial({
      color: "rgb(255, 255, 255)",
      transparent: true,
    }),
  );

  useGSAP(() => {
    if (!guyRef.current) return;
    const scale_t = selected ? 1 : 0.8;
    gsap.to(guyRef.current.scale, {
      x: scale_t,
      y: scale_t,
      z: scale_t,
      duration: duration / 1000,
      ease: "power2.out",
    });

    const r = selected ? 255 : 70;
    const g = selected ? 255 : 70;
    const b = selected ? 255 : 70;

    gsap.to(material.color, {
      r: r / 255,
      g: g / 255,
      b: b / 255,
      duration: duration / 1000,
      ease: "power2.out",
    });
  }, [selected]);

  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = material;
      }
    });
  }, [scene, material]);

  useFrame(() => {
    if (!guyRef.current || !selected) return;
    guyRef.current.rotation.y += 0.002;
  });

  const luminanceThreshold = 0.8;
  const pixelSize = is(">xl") ? 2 : 1;

  return (
    <>
      <group
        rotation={[0, Math.PI, 0]}
        scale={0.8}
        position={[0, 0, 0]}
        ref={guyRef}
      >
        <group position={[0, -0.4, 0]}>
          <primitive object={scene} scale={1} />
        </group>
      </group>

      <EffectComposer>
        <DitherEffect colorNum={3} pixelSize={pixelSize} />
        <Bloom
          luminanceThreshold={luminanceThreshold}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  );
}
