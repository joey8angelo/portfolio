import { Html } from "@react-three/drei";
import bootTxt from "../../assets/boot.txt?raw";
import { useEffect, useRef } from "react";
import { useResponsive } from "../../hooks";
import { useLoadingStore } from "../../store";

const bootLines = bootTxt.split("\n");
const bootLinesMarked = bootLines.map((line) => {
  const percentageMatch = line.match(/\[ (\d{3}%) \]/);
  const percentage = percentageMatch ? parseInt(percentageMatch[1]) : 0;
  return {
    text: line,
    percentage,
  };
});

export default function Boot() {
  const progress = useLoadingStore((state) => state.progress);
  const bootTxtContainerRef = useRef<HTMLDivElement>(null);
  const lastDisplayedIndexRef = useRef(-1);

  const { isMobile } = useResponsive();

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
          opacity: isMobile ? 0.5 : 1,
          fontSize: isMobile ? "10px" : "16px",
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
