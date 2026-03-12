import { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

const PULSAR_DATA = [
  { id: 1, angle: 342.6, r: 0.65, label: "PSR B1706-16" },
  { id: 2, angle: 313.9, r: 0.15, label: "PSR B1451-68" },
  { id: 3, angle: 302.1, r: 0.9, label: "PSR B1237+25" },
  { id: 4, angle: 263.6, r: 0.45, label: "Vela" },
  { id: 5, angle: 228.9, r: 0.1, label: "PSR B0950+08" },
  { id: 6, angle: 197.0, r: 0.15, label: "PSR B0823+26" },
  { id: 7, angle: 184.6, r: 0.6, label: "Crab" },
  { id: 8, angle: 183.6, r: 0.55, label: "PSR B0525+21" },
  { id: 9, angle: 145.0, r: 0.4, label: "PSR B0329+54" },
  { id: 10, angle: 98.4, r: 0.45, label: "PSR B2217+47" },
  { id: 11, angle: 68.1, r: 0.3, label: "PSR B2016+28" },
  { id: 12, angle: 52.4, r: 0.85, label: "PSR B1933+16" },
  { id: 13, angle: 47.4, r: 0.12, label: "PSR B1929+10" },
  { id: 14, angle: 29.4, r: 0.35, label: "PSR B1911-04" },
];

export default function PulsarMap({
  globalProgress,
  yPosition = 1,
  endTravelDistance = 2,
  ease = "power2.out",
  startProgress = 0,
  endProgress = 100,
}: {
  globalProgress: number;
  yPosition?: number;
  endTravelDistance?: number;
  ease?: string;
  startProgress?: number;
  endProgress?: number;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const t = useMemo(() => {
    const local = gsap.utils.clamp(
      0,
      1,
      gsap.utils.mapRange(startProgress, endProgress, 0, 1, globalProgress),
    );
    const easedProgress = gsap.parseEase(ease)(local);
    return easedProgress;
  }, [globalProgress, startProgress, endProgress, ease]);

  const travelDistance = useMemo(() => {
    if (t < 0.7) {
      return 0;
    } else {
      return gsap.utils.mapRange(0.7, 1, 0, endTravelDistance, t);
    }
  }, [t, endTravelDistance]);

  const pulsarLines = useMemo(() => {
    return PULSAR_DATA.map((p) => {
      const rad = (p.angle * Math.PI) / 180;
      const x = Math.cos(rad);
      const z = Math.sin(rad);
      return { ...p, dir: new THREE.Vector3(x, 0, z) };
    });
  }, []);

  const opacity = useMemo(() => {
    if (t < 0.3) {
      return gsap.utils.mapRange(0, 0.3, 0, 1, t);
    } else if (t < 0.8) {
      return 1;
    } else {
      return gsap.utils.mapRange(0.8, 1, 1, 0, t);
    }
  }, [t]);

  if (t === 1) return null;
  return (
    <>
      <group ref={groupRef}>
        {/* Galactic Center reference line */}
        <Line
          points={[
            [0, yPosition, 0],
            [1 + travelDistance, yPosition, 0],
          ]}
          color="white"
          transparent
          lineWidth={1}
          opacity={opacity}
        />

        {/* Pulsar lines */}
        {pulsarLines.map((p) => {
          const endPos = p.dir.clone().multiplyScalar(travelDistance + p.r);
          return (
            <Line
              key={p.id}
              points={[
                [0, yPosition, 0],
                [endPos.x, yPosition, endPos.z],
              ]}
              color={"white"}
              lineWidth={1}
              transparent
              opacity={opacity}
            />
          );
        })}
      </group>
    </>
  );
}
