import { Html } from "@react-three/drei";
import bootTxt from "./boot.txt?raw";
import { useEffect, useRef } from "react";
import useResponsive from "../../hooks/useResponsive";
import useLoadingStore from "../../store/useLoadingStore";

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
          opacity: isMobile ? 0.5 : 1,
          fontSize: isMobile ? "10px" : "16px",
          fontFamily: "ProggyTinySZ",
          fontWeight: 200,
          zIndex: -1,
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          filter: "brightness(1.5)",
          paddingLeft: "4rem",
        }}
        className="text-glow-xl text-[var(--color-text-primary)]"
        ref={bootTxtContainerRef}
      ></div>
    </Html>
  );
}
