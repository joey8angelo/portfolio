import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Svg } from "@react-three/drei";
import * as THREE from "three";
import { DitherEffect } from "../../features/Effects/Dither/Dither";

export default function PulsarIcon({
  selected,
  duration,
}: {
  selected: boolean;
  duration: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useGSAP(() => {
    if (!groupRef.current) return;
    const scale_t = selected ? 0.85 : 0.7;
    gsap.to(groupRef.current.scale, {
      x: scale_t,
      y: scale_t,
      z: scale_t,
      duration: duration / 1000,
      ease: "power2.out",
    });
  }, [selected]);

  return (
    <>
      <group scale={1} ref={groupRef} position={[-40, 0, -7300]}>
        <Svg
          src="/assets/pulsar.svg"
          position={[-50, 62.5, 0]}
          strokeMaterial={{
            opacity: selected ? 1.2 : 0.6,
          }}
        ></Svg>
      </group>

      <EffectComposer>
        <DitherEffect colorNum={3} />
        <Bloom luminanceThreshold={0.65} luminanceSmoothing={0.9} />
      </EffectComposer>
    </>
  );
}
