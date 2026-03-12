import { Html } from "@react-three/drei";
import bootTxt from "../../assets/bootTxt";
import { useEffect, useRef } from "react";
import PulsarMap from "./PulsarMap";
import SphereGrid from "./SphereGrid";
import { EffectComposer } from "@react-three/postprocessing";
import { HalftoneEffect } from "../Effects/Halftone/HalftoneEffect";

const bootLines = bootTxt.split("\n");
const bootLinesMarked = bootLines.map((line) => {
  const percentageMatch = line.match(/\[ (\d{3}%) \]/);
  const percentage = percentageMatch ? parseInt(percentageMatch[1]) : 0;
  return {
    text: line,
    percentage,
  };
});

export default function LoadingScene({ progress }: { progress: number }) {
  const bootTxtContainerRef = useRef<HTMLDivElement>(null);
  const lastDisplayedIndexRef = useRef(-1);

  useEffect(() => {
    const container = bootTxtContainerRef.current;
    if (!container) return;

    const newLines = [];
    let nextIndex = lastDisplayedIndexRef.current + 1;
    while (
      nextIndex < bootLinesMarked.length &&
      bootLinesMarked[nextIndex].percentage <= progress
    ) {
      newLines.push(bootLinesMarked[nextIndex].text);
      nextIndex++;
    }

    if (newLines.length > 0) {
      newLines.forEach((line) => {
        const lineElement = document.createElement("div");
        lineElement.textContent = line;
        container.appendChild(lineElement);
      });

      lastDisplayedIndexRef.current = nextIndex - 1;
    }
  }, [progress]);

  if (progress === 100) return null;
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={7} />
      <PulsarMap
        globalProgress={progress}
        endTravelDistance={3}
        startProgress={30}
        endProgress={70}
      />
      <SphereGrid
        globalProgress={progress}
        endRadius={3}
        startProgress={30}
        endProgress={100}
      />
      <Html center>
        <div
          style={{
            color: "white",
            fontSize: "15px",
            fontFamily: "StampRSPKOne-ExtraLight",
            zIndex: 100,
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
          }}
          ref={bootTxtContainerRef}
        ></div>
      </Html>
      <EffectComposer>
        <HalftoneEffect scale={3} rotation={0.8} frequency={2} />
      </EffectComposer>
    </>
  );
}
