import { useWindowSize } from "../../hooks/useWindowSize";
import { useMemo, useRef, useState, useLayoutEffect, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { useNavigationStore } from "../../store";

interface TextPathProps {
  href: string;
  pathLength: number;
}

function TextPath({ href, pathLength }: TextPathProps) {
  const textOneRef = useRef<SVGTextElement>(null);
  const textTwoRef = useRef<SVGTextElement>(null);
  const pathOneRef = useRef<SVGTextPathElement>(null);
  const pathTwoRef = useRef<SVGTextPathElement>(null);

  const pathLengthRef = useRef<number>(pathLength);

  const tlRef = useRef<gsap.core.Timeline>(null);

  const { textPath } = useNavigationStore();

  const [timeScale, setTimeScale] = useState(1);

  const pendingTextRef = useRef<string>(textPath.text);
  const pendingPathPercentageRef = useRef<number>(textPath.percentage);
  const repeatCountRef = useRef<number>(0);
  const isChangingRef = useRef<boolean>(false);

  useEffect(() => {
    pathLengthRef.current = pathLength;
  }, [pathLength]);

  const updatePathText = (
    textRef: React.RefObject<SVGTextElement | null>,
    pathRef: React.RefObject<SVGTextPathElement | null>,
    newText: string,
    newPathPercentage: number,
  ) => {
    if (!textRef.current || !pathRef.current) return;

    const textLength = pathLengthRef.current * newPathPercentage;
    const fontSize = textLength / newText.length / 0.6;

    console.log("Updating path text:", {
      newText,
      newPathPercentage,
      textLength,
      fontSize,
    });

    textRef.current.setAttribute("textLength", textLength.toString());
    textRef.current.setAttribute("font-size", fontSize.toString());

    pathRef.current.textContent = newText;
  };

  useEffect(() => {
    console.log("TextPath useEffect triggered with:", textPath);
    const doSetTimeScale = () => {
      setTimeScale(800);
    };
    if (
      textPath.text !== pendingTextRef.current ||
      textPath.percentage !== pendingPathPercentageRef.current
    ) {
      pendingTextRef.current = textPath.text;
      pendingPathPercentageRef.current = textPath.percentage;

      repeatCountRef.current = 0;
      isChangingRef.current = true;
      doSetTimeScale();
    }
  }, [textPath]);

  const duration = 80;
  useGSAP(() => {
    if (!pathOneRef.current || !pathTwoRef.current) return;

    tlRef.current = gsap.timeline({
      repeat: -1,
      onRepeat: () => {
        if (!isChangingRef.current) return;
        repeatCountRef.current += 1;

        if (repeatCountRef.current === 1) {
          updatePathText(
            textTwoRef,
            pathTwoRef,
            pendingTextRef.current,
            pendingPathPercentageRef.current,
          );
        } else if (repeatCountRef.current === 2) {
          updatePathText(
            textOneRef,
            pathOneRef,
            pendingTextRef.current,
            pendingPathPercentageRef.current,
          );
          repeatCountRef.current = 0;
          isChangingRef.current = false;
          setTimeScale(1);
        }
      },
    });

    tlRef.current.to(
      pathOneRef.current,
      {
        attr: { startOffset: "100%" },
        duration: duration,
        ease: "none",
      },
      0,
    );

    tlRef.current.to(
      pathTwoRef.current,
      {
        attr: { startOffset: "0%" },
        duration: duration,
        ease: "none",
      },
      0,
    );
  }, []);

  const prevTimeScaleRef = useRef<number>(timeScale);

  useGSAP(() => {
    const prev = prevTimeScaleRef.current;
    const next = timeScale;

    const duration = prev === 1 && next > 1 ? 5 : 0.5;

    prevTimeScaleRef.current = next;
    if (tlRef.current) {
      gsap.killTweensOf(tlRef.current);
      gsap.to(tlRef.current, {
        timeScale: next,
        duration,
        ease: "power2.out",
      });
    }
  }, [timeScale]);

  return (
    <>
      <text
        ref={textOneRef}
        fill="#868686"
        className="tracking-tight font-[JetBrains_Mono_Variable] pointer-events-auto cursor-text"
        lengthAdjust={"spacing"}
      >
        <textPath xlinkHref={href} startOffset="0%" ref={pathOneRef}></textPath>
      </text>
      <text
        ref={textTwoRef}
        fill="#868686"
        className="tracking-tight font-[JetBrains_Mono_Variable] pointer-events-auto cursor-text"
        lengthAdjust={"spacing"}
      >
        <textPath
          xlinkHref={href}
          startOffset="-100%"
          ref={pathTwoRef}
        ></textPath>
      </text>
    </>
  );
}

interface MaskGridLayerProps {
  startX: number;
  endX: number;
  r: number;
  gridSize?: number;
  text?: string;
  fillPercentage?: number;
}

export default function MaskGridLayer({
  startX,
  endX,
  r,
  gridSize = 40,
}: MaskGridLayerProps) {
  const { width, height } = useWindowSize();
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useLayoutEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [width, height, startX, endX, r]);

  const { curveData, pathData, polygonPath } = useMemo(() => {
    const startY = 0;
    const endY = height + 20;

    const curveRadius = r * 1.5;

    const curveData = `
    M ${startX}, ${startY}
    A ${curveRadius},${curveRadius} 0 0 0 ${endX}, ${endY}
  `;

    const pathData = `
    M 0,0 H ${width} V ${height} H 0 Z
    ${curveData}
    H ${width} V 0
    Z
  `;

    // Polygon to create a float area for things to wrap around
    // cant get path-based shape-outside to work ¯\_(ツ)_/¯
    // possible todo
    const dy = height;
    const dx = endX - startX;
    const chord = Math.sqrt(dx * dx + dy * dy);

    const hMid = Math.sqrt(
      Math.max(0, curveRadius * curveRadius - Math.pow(chord / 2, 2)),
    );

    const ux = dx / chord;
    const uy = dy / chord;

    const Cx = (startX + endX) / 2 + hMid * uy;
    const Cy = (0 + height) / 2 - hMid * ux;

    const getArcX = (targetY: number) => {
      const x =
        Cx -
        Math.sqrt(
          Math.max(0, curveRadius * curveRadius - Math.pow(targetY - Cy, 2)),
        );
      return x;
    };

    const points = [0, 0.25, 0.5, 0.75, 1].map((p) => ({
      x: getArcX(height * p),
      y: height * p,
    }));

    const polygonPath = `polygon(
      100% 0%, 
      ${points[0].x}px ${points[0].y}px, 
      ${points[1].x}px ${points[1].y}px, 
      ${points[2].x}px ${points[2].y}px, 
      ${points[3].x}px ${points[3].y}px, 
      ${points[4].x}px ${points[4].y}px, 
      100% 100%
    )`;

    return { curveData, pathData, polygonPath };
  }, [startX, endX, r, width, height]);

  return (
    <>
      <svg width="100%" height="100%" className="pointer-events-none absolute">
        <defs>
          <pattern
            id="grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.2"
            />
          </pattern>

          <clipPath id="grid-clip">
            <path d={pathData} fillRule="evenodd" />
          </clipPath>

          <path id="text-curve-path" d={curveData} ref={pathRef} />
        </defs>

        {/* Background */}
        <path
          d={pathData}
          fill="transparent"
          fillRule="evenodd"
          className="pointer-events-auto"
        />

        {/* Grid */}
        <rect
          width="100%"
          height="100%"
          fill="url(#grid)"
          clipPath="url(#grid-clip)"
        />

        {/* Text following the curve */}
        <TextPath href="#text-curve-path" pathLength={pathLength} />
      </svg>

      {/* Float */}
      <div
        className="w-full h-full float-right"
        style={{
          shapeOutside: polygonPath,
          shapeMargin: "40px",
        }}
      />
    </>
  );
}
