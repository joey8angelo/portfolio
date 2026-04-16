import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Svg } from "@react-three/drei";
import * as THREE from "three";
import { DitherEffect } from "../../features/Effects/Dither/Dither";
import useResponsive from "../../hooks/useResponsive";

export default function PulsarIcon({
  selected,
  duration,
}: {
  selected: boolean;
  duration: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { is } = useResponsive();

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

  const luminanceThreshold = 0.8;
  const pixelSize = is(">xl") ? 2 : 1;

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
        <DitherEffect colorNum={3} pixelSize={pixelSize} />
        <Bloom
          luminanceThreshold={luminanceThreshold}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  );
}
