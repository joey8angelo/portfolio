import { Html } from "@react-three/drei";
import bootTxt from "../../assets/bootTxt";
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

export default function Boot({ progress }: { progress: number }) {
  const bootTxtContainerRef = useRef<HTMLDivElement>(null);
  const lastDisplayedIndexRef = useRef(-1);

  useEffect(() => {
    if (progress === 0) {
      lastDisplayedIndexRef.current = -1;
      if (bootTxtContainerRef.current) {
        bootTxtContainerRef.current.innerHTML = "";
      }
      return;
    }

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

  return (
    <Html center>
      <div
        style={{
          color: "white",
          fontSize: "15px",
          fontFamily: "StampRSPKOne-ExtraLight",
          zIndex: -1,
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          textShadow:
            "0 0 8px rgba(255, 255, 255, 0.8), 0 0 15px rgba(255, 255, 255, 0.5)",
          filter: "brightness(1.5)",
        }}
        ref={bootTxtContainerRef}
      ></div>
    </Html>
  );
}
