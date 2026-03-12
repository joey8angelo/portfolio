import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import { useHelper } from "@react-three/drei/core/Helper";
import { useRef } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import EarthWireframe from "../Loading/EarthWireframe";
import { EffectComposer } from "@react-three/postprocessing";
import { HalftoneEffect } from "../Effects/Halftone/HalftoneEffect";
import { Bloom } from "@react-three/postprocessing";

export default function Scene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  const { useDebugCamera, testProgress } = useControls({
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
    testProgress: {
      value: 0,
      min: 0,
      max: 100,
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
      <EarthWireframe
        globalProgress={testProgress}
        endRadius={1}
        startProgress={30}
        endProgress={100}
      />
      <EffectComposer>
        <HalftoneEffect scale={4} rotation={0.8} frequency={100} />

        <Bloom
          intensity={1.5}
          width={300}
          height={300}
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  );
}
