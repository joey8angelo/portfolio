import { useEffect, useRef } from "react";
import { Line } from "@react-three/drei";
import { Line2 } from "three-stdlib";
import * as THREE from "three";
import { gsap } from "gsap";
import useLoadingStore from "../../store/useLoadingStore";
import { useGSAP } from "@gsap/react";
import useResponsive from "../../hooks/useResponsive";

const PULSAR_DATA = [
  { id: 4, angle: 263.6, r: 0.45, label: "Vela" },
  { id: 14, angle: 29.4, r: 0.35, label: "PSR B1911-04" },
  { id: 13, angle: 47.4, r: 0.12, label: "PSR B1929+10" },
  { id: 5, angle: 228.9, r: 0.1, label: "PSR B0950+08" },
  { id: 6, angle: 197.0, r: 0.15, label: "PSR B0823+26" },
  { id: 11, angle: 68.1, r: 0.3, label: "PSR B2016+28" },
  { id: 10, angle: 98.4, r: 0.45, label: "PSR B2217+47" },
  { id: 1, angle: 342.6, r: 0.65, label: "PSR B1706-16" },
  { id: 3, angle: 302.1, r: 0.9, label: "PSR B1237+25" },
  { id: 9, angle: 145.0, r: 0.4, label: "PSR B0329+54" },
  { id: 7, angle: 184.6, r: 0.6, label: "Crab" },
  { id: 12, angle: 52.4, r: 0.85, label: "PSR B1933+16" },
  { id: 2, angle: 313.9, r: 0.15, label: "PSR B1451-68" },
  { id: 8, angle: 183.6, r: 0.55, label: "PSR B0525+21" },
];

const pulsarLines = PULSAR_DATA.map((p) => {
  const rad = (p.angle * Math.PI) / 180;
  const x = Math.cos(rad);
  const z = Math.sin(rad);
  return { ...p, dir: new THREE.Vector3(x, 0, z) };
});

const fadeIn = 10;
const fadeInDuration = 40;
const fadeInStagger = 1;
const fadeInEase = "power2.out";

const fadeOut = 70;
const fadeOutDuration = 30;
const fadeOutEase = "power2.in";

const scaleOut = 70;
const scaleDuration = 30;

export default function PulsarMap() {
  const progress = useLoadingStore((state) => state.progress);
  const groupRef = useRef<THREE.Group>(null);
  const tlRef = useRef<gsap.core.Timeline>(null);
  const { isMobile } = useResponsive();
  const yPosition = isMobile ? 3 : 1;

  useGSAP(() => {
    if (!groupRef.current) return;
    const lines = groupRef.current.children as Line2[];
    const materials = lines.map((line) => line.material);
    const scales = lines.map((line) => line.scale);

    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    // fade in/out
    tl.to(
      materials,
      {
        opacity: 1,
        duration: fadeInDuration,
        stagger: fadeInStagger,
        ease: fadeInEase,
      },
      fadeIn,
    ).to(
      materials,
      {
        opacity: 0,
        duration: fadeOutDuration,
        ease: fadeOutEase,
      },
      fadeOut,
    );

    // scale lines
    tl.to(
      scales,
      {
        x: 10,
        z: 10,
        duration: scaleDuration,
      },
      scaleOut,
    );
  }, []);

  useEffect(() => {
    tlRef.current?.seek(progress);
  }, [progress]);

  return (
    <>
      <group ref={groupRef}>
        {/* Galactic Center reference line */}
        <Line
          points={[
            [0, yPosition, 0],
            [1, yPosition, 0],
          ]}
          color="white"
          transparent
          lineWidth={1}
          opacity={0}
        />

        {/* Pulsar lines */}
        {pulsarLines.map((p) => {
          const endPos = p.dir.clone().multiplyScalar(p.r);
          return (
            <Line
              key={p.id}
              points={[
                [0, yPosition, 0],
                [endPos.x, yPosition, endPos.z],
              ]}
              color={"white"}
              transparent
              lineWidth={1}
              opacity={0}
            />
          );
        })}
      </group>
    </>
  );
}
