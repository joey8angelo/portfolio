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

export default function EarthWireframe({
  globalProgress,
  endRadius,
  startProgress,
  endProgress,
  ease = "power2.out",
}: {
  globalProgress: number;
  endRadius: number;
  startProgress: number;
  endProgress: number;
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

  const data = useLoader(THREE.FileLoader, "/assets/ne_110m_coastline.json");
  const coastlineJSON = useMemo(() => JSON.parse(data as string), [data]);

  const lines = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return coastlineJSON.features.map((feature: any, index: number) => {
      const points = feature.geometry.coordinates.map(
        ([lon, lat]: [number, number]) => convertCoords(lon, lat, 1),
      );

      return <Line key={index} points={points} color="white" lineWidth={2} />;
    });
  }, [coastlineJSON]);

  const baseOpacity = useMemo(() => {
    if (t < 0.6) {
      return gsap.utils.mapRange(0, 0.6, 0, 0.7, t);
    } else if (t < 0.94) {
      return 0.7;
    } else if (t < 0.97) {
      return gsap.utils.mapRange(0.94, 0.97, 0.7, 1, t);
    } else if (t < 1) {
      return gsap.utils.mapRange(0.97, 1, 1, 0, t);
    }
    return 0;
  }, [t]);

  return (
    <>
      <group
        ref={groupRef}
        position={[0, 5, 0]}
        rotation={[Math.PI / 2, 0, -23.5 * (Math.PI / 180)]}
        scale={endRadius * t}
      >
        {lines}
      </group>

      {/* Cheat the opacity of the lines with a fading plane */}
      <mesh
        position={[0, 5 - endRadius * t, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={endRadius * t * 2}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="black"
          transparent
          opacity={1 - baseOpacity}
        />
      </mesh>
    </>
  );
}
