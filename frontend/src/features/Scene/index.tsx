import SkyScene from "../Sky";
import LoadingScene from "../Loading";

import { useSmoothProgress, useDebugControls } from "../../hooks";
import { Suspense } from "react";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import { useHelper } from "@react-three/drei/core/Helper";
import { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

export default function Scene() {
  const progress = useSmoothProgress({ duration: 5, ease: "power1.out" });
  const isLoaded = progress === 100;

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
