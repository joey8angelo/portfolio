import SkyScene from "../Sky";
import LoadingScene from "../Loading";

import { useDebugControls } from "../../hooks";
import { Suspense } from "react";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import { useHelper } from "@react-three/drei/core/Helper";
import { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { LoadingStoreSync, useLoadingStore } from "../../store/";

export default function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const isLoaded = useLoadingStore((state) => state.isLoaded);

  const { useDebugCamera, fov } = useDebugControls({
    useDebugCamera: false,
    fov: {
      value: 80,
      min: 10,
      max: 150,
      step: 1,
    },
  });

  useHelper(useDebugCamera ? cameraRef : null, THREE.CameraHelper);

  return (
    <>
      <LoadingStoreSync duration={5} ease={"power1.out"} />
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
      <OrbitControls enabled={useDebugCamera} />

      {/* loading overlay */}
      <LoadingScene />

      {/* main scene */}
      <Suspense fallback={null}>
        <group visible={isLoaded}>
          <SkyScene />
        </group>
      </Suspense>
    </>
  );
}
