import { Html } from "@react-three/drei";
import bootTxt from "../../assets/bootTxt";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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

  const torusRef = useRef<THREE.Mesh>(null);

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

  useFrame(() => {
    if (torusRef.current) {
      torusRef.current.rotation.x += 0.01;
      torusRef.current.rotation.y += 0.01;
    }
  });

  if (progress === 100) return null;
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={7} />
      <mesh position={[0, 5, 0]} ref={torusRef}>
        <torusKnotGeometry args={[1, 0.4, 128, 16]} />
        <meshLambertMaterial color="white" />
      </mesh>
      <Html center>
        <div
          style={{
            color: "white",
            fontSize: "10px",
            fontFamily: "monospace",
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
    </>
  );
}
