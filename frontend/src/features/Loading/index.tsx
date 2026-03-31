import { Suspense } from "react";
import Boot from "./Boot";
import PulsarMap from "./PulsarMap";
// import EarthWireframe from "./EarthWireframe";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { HalftoneEffect } from "../Effects/Halftone";
import { useLoadingStore } from "../../store";

const halftoneScale = 3;
const halftoneRotation = 0.8;
const halftoneFrequency = 100;
const bloomIntensity = 1.5;
const bloomLuminanceThreshold = 0;
const bloomLuminanceSmoothing = 0.9;

export default function LoadingScene() {
  const isLoaded = useLoadingStore((state) => state.isLoaded);
  if (isLoaded) return null;

  return (
    <>
      <Suspense fallback={null}>
        <Boot />
        <PulsarMap />
        {/* <EarthWireframe /> */}
        <EffectComposer>
          <HalftoneEffect
            scale={halftoneScale}
            rotation={halftoneRotation}
            frequency={halftoneFrequency}
          />
          <Bloom
            intensity={bloomIntensity}
            luminanceThreshold={bloomLuminanceThreshold}
            luminanceSmoothing={bloomLuminanceSmoothing}
          />
        </EffectComposer>
      </Suspense>
    </>
  );
}
