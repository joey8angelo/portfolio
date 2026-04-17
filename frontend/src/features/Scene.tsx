import SkyScene from "./Sky/Sky";
import LoadingScene from "./Loading/Loading";
import { useControls } from "leva";
import { Suspense } from "react";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import { useHelper } from "@react-three/drei/core/Helper";
import { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import useLoadingStore from "../store/useLoadingStore";

const sceneControlsSchema = {
  useDebugCamera: false,
  fov: {
    value: 80,
    min: 10,
    max: 150,
    step: 1,
  },
};

export default function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const isLoaded = useLoadingStore((state) => state.isLoaded);

  const { useDebugCamera, fov } = useControls("Scene", sceneControlsSchema);

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
