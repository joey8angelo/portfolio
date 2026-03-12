import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import * as THREE from "three";
import { useEffect, useState } from "react";

export default function MilkyWay({ radius }: { radius: number }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let loadedTexture: THREE.Texture | null = null;

    const loader = new EXRLoader();
    loader.setDataType(THREE.HalfFloatType);

    loader.load(
      "/textures/milkyway_2020_4k.exr",
      (nextTexture) => {
        if (!isMounted) {
          nextTexture.dispose();
          return;
        }

        nextTexture.wrapS = THREE.RepeatWrapping;
        nextTexture.repeat.x = -1;
        nextTexture.center.set(0.5, 0.5);
        nextTexture.needsUpdate = true;

        loadedTexture = nextTexture;
        setTexture(nextTexture);
      },
      undefined,
      () => {
        if (isMounted) {
          setLoadFailed(true);
        }
      },
    );

    return () => {
      isMounted = false;
      if (loadedTexture) {
        loadedTexture.dispose();
      }
    };
  }, []);

  if (loadFailed) {
    return (
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial side={THREE.BackSide} color="#ff0000" />
      </mesh>
    );
  }

  if (!texture) {
    return null;
  }

  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
