import { useLoader } from "@react-three/fiber";
import { EXRLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { useMemo } from "react";

export default function MilkyWay({ radius }: { radius: number }) {
  const originalTexture = useLoader(
    EXRLoader,
    "/textures/milkyway_2020_4k.exr",
  );
  const texture = useMemo(() => {
    const t = originalTexture.clone();
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;

    t.center.set(0.5, 0.5);
    return t;
  }, [originalTexture]);

  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
