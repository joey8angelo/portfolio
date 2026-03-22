import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import * as THREE from "three";
import { useLoadingStore } from "../../store";
import { gsap } from "gsap";

useLoader.preload(EXRLoader, "/textures/milkyway_2020_4k.exr");

export default function MilkyWay({ radius }: { radius: number }) {
  const texture = useLoader(EXRLoader, "/textures/milkyway_2020_4k.exr");
  const configuredTexture = useMemo(() => {
    const nextTexture = texture.clone();
    nextTexture.repeat.x = -1;
    nextTexture.center.set(0.5, 0.5);
    nextTexture.colorSpace = THREE.NoColorSpace;
    nextTexture.mapping = THREE.EquirectangularReflectionMapping;
    return nextTexture;
  }, [texture]);

  const meshRef = useRef<THREE.Mesh>(null);
  const isLoaded = useLoadingStore((state) => state.isLoaded);

  useEffect(() => {
    if (isLoaded && meshRef.current) {
      gsap.to(meshRef.current.material, {
        opacity: 1,
        duration: 5,
        ease: "power2.out",
      });
    }
  }, [isLoaded]);

  if (!texture)
    return (
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color="#ff0000" side={THREE.BackSide} />
      </mesh>
    );

  return (
    <mesh position={[0, 0, 0]} ref={meshRef} renderOrder={0}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial
        map={configuredTexture}
        side={THREE.BackSide}
        opacity={0}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
