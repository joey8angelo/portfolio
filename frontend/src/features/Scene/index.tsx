import SkyScene from "../Sky";
import LoadingScene from "../Loading";

import useSmoothProgress from "../../hooks/useSmoothProgress";
import { Suspense } from "react";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import { useHelper } from "@react-three/drei/core/Helper";
import { useRef } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { OrbitControls } from "@react-three/drei";
import "../Materials/HalftoneMaterial";
import { useFrame } from "@react-three/fiber";

export default function Scene() {
  const progress = useSmoothProgress({ duration: 10, ease: "power2.out" });
  const isLoaded = progress === 100;

  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  const { useDebugCamera } = useControls({
    useDebugCamera: false,
    fov: {
      value: 100,
      min: 10,
      max: 150,
      step: 1,
      onChange: (value) => {
        if (cameraRef.current) {
          cameraRef.current.fov = value;
          cameraRef.current.updateProjectionMatrix();
        }
      },
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
      <PerspectiveCamera
        makeDefault={!useDebugCamera}
        ref={cameraRef}
        position={[0, -0.01, 0]}
        fov={100}
      />
      <PerspectiveCamera
        position={[5, -5, 0]}
        fov={100}
        makeDefault={useDebugCamera}
      />
      <OrbitControls enablePan={false} enabled={useDebugCamera} />
      <LoadingScene progress={progress} />
      <Suspense fallback={null}>
        <group visible={isLoaded}>
          <SkyScene />
        </group>
      </Suspense>
      {/* <mesh position={[0, 6, 0]} ref={torusRef}>
        <torusKnotGeometry args={[1, 0.4, 128, 16]} />
        <halftoneMaterialImpl uScale={1} uRotation={0.8} uFrequency={20} />
      </mesh> */}
    </>
  );
}
