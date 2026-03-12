import { useMemo, useRef } from "react";
import { gsap } from "gsap";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";

const convertCoords = (lon: number, lat: number, radius: number) => {
  const phi = (lat * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;

  const x = -radius * Math.cos(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi);
  const z = radius * Math.cos(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
};

function EarthWireframe({ radius, t }: { radius: number; t: number }) {
  const data = useLoader(THREE.FileLoader, "/assets/ne_110m_coastline.json");
  const coastlineJSON = useMemo(() => JSON.parse(data as string), [data]);

  const lines = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return coastlineJSON.features.map((feature: any, idx: number) => {
      const points = feature.geometry.coordinates.map(
        ([lon, lat]: [number, number]) => convertCoords(lon, lat, radius),
      );
      return (
        <Line
          transparent
          key={idx}
          points={points}
          color="white"
          lineWidth={0.5}
          opacity={gsap.utils.mapRange(0.95, 1, 1, 0.1, t)}
        />
      );
    });
  }, [radius, coastlineJSON, t]);

  return <group>{lines}</group>;
}

export default function SphereGrid({
  globalProgress,
  endRadius = 1.5,
  startProgress = 20,
  endProgress = 60,
  ease = "power2.out",
}: {
  globalProgress: number;
  endRadius?: number;
  startProgress?: number;
  endProgress?: number;
  ease?: string;
}) {
  const groupRef = useRef<THREE.Mesh>(null);
  const t = useMemo(() => {
    const local = gsap.utils.clamp(
      0,
      1,
      gsap.utils.mapRange(startProgress, endProgress, 0, 1, globalProgress),
    );
    const easedProgress = gsap.parseEase(ease)(local);
    return easedProgress;
  }, [globalProgress, startProgress, endProgress, ease]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotateOnAxis(new THREE.Vector3(0, 1, 0), -0.002);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, 10, 0]}
      rotation={[Math.PI / 2, 0, -23.5 * (Math.PI / 180)]}
    >
      <EarthWireframe radius={endRadius * t} t={t} />
    </group>
  );
}
