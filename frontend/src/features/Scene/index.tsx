import SkyScene from "../Sky";
import LoadingScene from "../Loading";

import useSmoothProgress from "../../hooks/useSmoothProgress";
import { Suspense } from "react";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import { useHelper } from "@react-three/drei/core/Helper";
import { useRef } from "react";
import * as THREE from "three";
import { useDebugControls } from "../../hooks/useDebugControls";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Scene() {
  const progress = useSmoothProgress({ duration: 7, ease: "power1.out" });
  const isLoaded = progress >= 99.9;

  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  const { useDebugCamera, fov } = useDebugControls({
    useDebugCamera: false,
    fov: {
      value: 100,
      min: 10,
      max: 150,
      step: 1,
    },
  });

  const torusRef = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    if (torusRef.current) {
      torusRef.current.rotation.x += 0.01;
      torusRef.current.rotation.y += 0.01;
    }
  });

  useHelper(useDebugCamera ? cameraRef : null, THREE.CameraHelper);

  return (
    <>
      <color attach="background" args={["black"]} />
      {/* main camera */}
      <PerspectiveCamera
        makeDefault={!useDebugCamera}
        ref={cameraRef}
        position={[0, -0.01, 0]}
        fov={fov}
      />

      {/* debug camera */}
      <PerspectiveCamera
        position={[5, -5, 0]}
        fov={90}
        makeDefault={useDebugCamera}
      />
      <OrbitControls enablePan={false} enabled={useDebugCamera} />

      {/* loading overlay */}
      <LoadingScene progress={progress} />

      {/* main scene */}
      <Suspense fallback={null}>
        <group visible={isLoaded}>
          <SkyScene />
        </group>
      </Suspense>
    </>
  );
}
