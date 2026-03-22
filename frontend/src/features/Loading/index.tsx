import { Suspense } from "react";
import Boot from "./Boot";
import PulsarMap from "./PulsarMap";
// import EarthWireframe from "./EarthWireframe";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { HalftoneEffect } from "../Effects/Halftone/HalftoneEffect";
import { useLoadingStore } from "../../store";

export default function LoadingScene() {
  const isLoaded = useLoadingStore((state) => state.isLoaded);
  if (isLoaded) return null;

  return (
    <>
      <Suspense fallback={null}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} intensity={7} />
        <Boot />
        <PulsarMap />
        {/* <EarthWireframe /> */}
        <EffectComposer>
          <HalftoneEffect scale={3} rotation={0.8} frequency={100} />
          <Bloom
            intensity={1.5}
            luminanceThreshold={0}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Suspense>
    </>
  );
}
