import { Html } from "@react-three/drei";
import bootTxt from "./bootTxt";
import { useEffect, useRef } from "react";

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

      // container.scrollTop = container.scrollHeight;
      lastDisplayedIndexRef.current = nextIndex - 1;
    }
  }, [progress]);

  // if (progress === 100) return null;
  return (
    <>
      <color attach="background" args={["black"]} />
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={7} />
      <Html center>
        <div
          style={{
            color: "white",
            fontSize: "10px",
            fontFamily: "monospace",
            background: "rgba(0, 0, 0)",
            zIndex: 100,
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
            // alignItems: "end",
          }}
          ref={bootTxtContainerRef}
        ></div>
      </Html>
    </>
  );
}
