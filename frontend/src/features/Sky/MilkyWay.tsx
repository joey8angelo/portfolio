import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import * as THREE from "three";

export default function MilkyWay({ radius }: { radius: number }) {
  const texture = useLoader(EXRLoader, "/textures/milkyway_2020_4k.exr");
  const configuredTexture = useMemo(() => {
    const nextTexture = texture.clone();
    nextTexture.repeat.x = -1;
    nextTexture.center.set(0.5, 0.5);
    return nextTexture;
  }, [texture]);

  if (!texture)
    return (
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color="#ff0000" side={THREE.BackSide} />
      </mesh>
    );

  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial map={configuredTexture} side={THREE.BackSide} />
    </mesh>
  );
}
