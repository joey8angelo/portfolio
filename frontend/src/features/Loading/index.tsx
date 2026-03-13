import { Suspense } from "react";
import Boot from "./Boot";
import PulsarMap from "./PulsarMap";
import EarthWireframe from "./EarthWireframe";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { HalftoneEffect } from "../Effects/Halftone/HalftoneEffect";
import { useResponsive } from "../../hooks";

export default function LoadingScene({ progress }: { progress: number }) {
  const { isMobile } = useResponsive();
  if (progress === 100) return null;
  return (
    <>
      <Suspense fallback={null}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} intensity={7} />
        <Boot progress={progress} />
        <PulsarMap
          globalProgress={progress}
          endTravelDistance={3}
          startProgress={0}
          endProgress={80}
          yPosition={isMobile ? 2 : 1}
        />
        <EarthWireframe
          globalProgress={progress}
          endRadius={2}
          startProgress={30}
          endProgress={100}
        />
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
