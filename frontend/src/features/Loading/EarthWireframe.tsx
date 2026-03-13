import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useLoadingStore } from "../../store";
import { useGSAP } from "@gsap/react";
import { useResponsive } from "../../hooks";

useLoader.preload(THREE.FileLoader, "/assets/ne_110m_coastline.json");

const endSize = 2;

const convertCoords = (lon: number, lat: number, radius: number) => {
  const phi = (lat * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;

  const x = -radius * Math.cos(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi);
  const z = radius * Math.cos(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
};

export default function EarthWireframe() {
  const progress = useLoadingStore((state) => state.progress);
  const groupRef = useRef<THREE.Mesh>(null);
  const planeRef = useRef<THREE.Mesh>(null);
  const tlRef = useRef<gsap.core.Timeline>(null);
  const { isMobile } = useResponsive();
  const yPos = isMobile ? 8 : 5;

  useGSAP(() => {
    if (!groupRef.current || !planeRef.current) return;

    const mesh = groupRef.current;
    const plane = planeRef.current;
    const mat = plane.material as THREE.MeshBasicMaterial;

    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    tl.addLabel("enter", 40).addLabel("shine", 87).addLabel("fadeOut", 90);

    // scale in
    tl.to(
      mesh.scale,
      {
        x: endSize,
        y: endSize,
        z: endSize,
        duration: 60,
        ease: "power2.out",
      },
      "enter",
    );

    // fade in/out
    tl.to(
      mat,
      {
        opacity: 0.3,
        duration: 20,
        ease: "power2.out",
      },
      "enter",
    )
      .to(
        mat,
        {
          opacity: 0,
          duration: 3,
          ease: "power2.out",
        },
        "shine",
      )
      .to(
        mat,
        {
          opacity: 1,
          duration: 5,
          ease: "power2.out",
        },
        "fadeOut",
      );

    // scale/move plane to cover the wireframe
    tl.to(
      plane.scale,
      {
        x: endSize * 2,
        y: endSize * 2,
        z: 1,
        duration: 40,
        ease: "power2.out",
      },
      "enter",
    ).to(
      plane.position,
      {
        x: 0,
        y: yPos - endSize,
        z: 0,
        duration: 40,
        ease: "power2.out",
      },
      "enter",
    );
  }, []);

  useEffect(() => {
    tlRef.current?.seek(progress);
  }, [progress]);

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

  return (
    <>
      <group
        ref={groupRef}
        position={[0, yPos, 0]}
        rotation={[Math.PI / 2, 0, -23.5 * (Math.PI / 180)]}
        scale={0}
      >
        {lines}
      </group>

      {/* Cheat the opacity of the lines with a fading plane */}
      <mesh
        ref={planeRef}
        position={[0, yPos, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="black" transparent />
      </mesh>
    </>
  );
}
