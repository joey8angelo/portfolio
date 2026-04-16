import { Suspense } from "react";
import Boot from "./Boot";
import PulsarMap from "./PulsarMap";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import useLoadingStore from "../../store/useLoadingStore";
import { DitherEffect } from "../Effects/Dither/Dither";

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
        <EffectComposer>
          <DitherEffect colorNum={4} pixelSize={2} />
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
