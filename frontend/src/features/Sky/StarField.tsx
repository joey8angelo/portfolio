import * as THREE from "three";
import { useFrame, useLoader, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { useDebugControls } from "../../hooks/useDebugControls";
import { bvToColor } from "./skyUtils";
import { useLoadingStore } from "../../store";
import { gsap } from "gsap";
import { GlowingPointMaterial } from "../Materials/GlowingPoint";
import { Html } from "@react-three/drei/web/Html";
import { useNavigationStore } from "../../store";

useLoader.preload(THREE.FileLoader, "/assets/ybsc_parsed.csv");

const markerHRNums = [2491, 2326, 5460, 2061, 5340, 7001, 2943, 1708];

type StarData = {
  hr: number;
  name: string;
  dm: string;
  sao: string;
  bv: number;
  vmag: number;
  x: number;
  y: number;
  z: number;
  rah: number;
  ram: number;
  ras: number;
  desn: string;
  ded: number;
  dem: number;
  des: number;
  sptype: string;
  pmra: string;
  pmde: string;
};

function formatTextPath(starData: StarData) {
  const {
    hr,
    name,
    dm,
    sao,
    bv,
    vmag,
    rah,
    ram,
    ras,
    desn,
    ded,
    dem,
    des,
    sptype,
  } = starData;

  return `
    ${name ? name + " ◦ " : ""}
    SpecType ${sptype} ◦ 
    ${`HR ${hr}`} ◦ 
    B-V ${bv} ◦ 
    SAO ${sao || "N/A"} ◦ 
    Visual Mag ${vmag} ◦ 
    DM ${dm || "N/A"} ◦ 
    RA ${rah}h ${ram}m ${ras}s ◦ 
    DEC ${desn}${ded}° ${dem}' ${des}" ◦ 
  `;
}

export default function StarField({
  url,
  radius,
}: {
  url: string;
  radius: number;
}) {
  const isLoaded = useLoadingStore((state) => state.isLoaded);
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const {
    setTextPath,
    selectSkyObject,
    clearSkySelection,
    skySelection,
    skySelectionPosition,
  } = useNavigationStore();

  const starData = useLoader(THREE.FileLoader, url);
  const parsedStars = useMemo(() => {
    if (!starData) return null;
    const lines = (starData as string)
      .split("\n")
      .slice(1)
      .filter((l) => l.trim() !== "")
      .map((line) => {
        const [
          hr,
          name,
          dm,
          sao,
          bv,
          vmag,
          x,
          y,
          z,
          rah,
          ram,
          ras,
          desn,
          ded,
          dem,
          des,
          sptype,
          pmra,
          pmde,
        ] = line.split(",");
        return {
          hr: Number(hr),
          name: name.trim(),
          dm: dm.trim(),
          sao: sao.trim(),
          bv: Number(bv),
          vmag: Number(vmag),
          x: Number(x),
          y: Number(y),
          z: Number(z),
          rah: Number(rah),
          ram: Number(ram),
          ras: Number(ras),
          desn: desn.trim(),
          ded: Number(ded),
          dem: Number(dem),
          des: Number(des),
          sptype: sptype.trim(),
          pmra: pmra.trim(),
          pmde: pmde.trim(),
        } as StarData;
      })
      .sort((a, b) => {
        if (a.name && !b.name) return 1;
        if (!a.name && b.name) return -1;
        return a.vmag < b.vmag ? -1 : 1;
      });
    console.log(`Loaded ${lines.length} stars`);
    return lines;
  }, [starData]);

  const starMaterial = useMemo(() => new GlowingPointMaterial(), []);

  const {
    twinkleSpeed,
    twinkleIntensity,
    radiusMultiplier,
    showMarkerStars,
    starInnerRadius,
    glowIntensity,
  } = useDebugControls({
    twinkleSpeed: {
      value: 0.6,
      min: 0,
      max: 2,
      step: 0.01,
    },
    twinkleIntensity: {
      value: 0.12,
      min: 0,
      max: 1,
      step: 0.01,
    },
    radiusMultiplier: {
      value: 3,
      min: 0,
      max: 10,
      step: 0.1,
    },
    showMarkerStars: false,
    starInnerRadius: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    glowIntensity: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });

  useEffect(() => {
    if (isLoaded && materialRef.current) {
      gsap.fromTo(
        materialRef.current.uniforms.uRadius,
        { value: 0 },
        { value: radius * radiusMultiplier, duration: 5, ease: "power2.out" },
      );
    }
  }, [isLoaded, radius, radiusMultiplier]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value =
        state.clock.elapsedTime * twinkleSpeed;
    }
  });

  const { geometry, markerStars } = useMemo(() => {
    if (!parsedStars) return { geometry: null, markerStars: [] };
    const positions = new Float32Array(parsedStars.length * 3);
    const colors = new Float32Array(parsedStars.length * 3);
    const sizes = new Float32Array(parsedStars.length);
    const seeds = new Float32Array(parsedStars.length);
    const markerStars: {
      hr: number;
      position: THREE.Vector3;
      name: string;
    }[] = [];

    parsedStars.forEach((star, i) => {
      const { hr, name, bv, vmag, x, y, z } = star;

      positions[i * 3] = x * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = z * radius;

      if (markerHRNums.includes(hr)) {
        markerStars.push({
          hr: hr,
          position: new THREE.Vector3(x, y, z).multiplyScalar(radius),
          name: name.trim(),
        });
      }

      const color = bvToColor(bv);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.max(0.1, (7.0 - vmag) * 0.5);

      const dot = x * 12.9898 + y * 78.233 + z * 437.164;
      const hash = Math.sin(dot) * 43758.5453;
      seeds[i] = hash - Math.floor(hash);
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));

    return { geometry: geo, markerStars: markerStars };
  }, [parsedStars, radius]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    if (!parsedStars || e.index === undefined) return;

    console.log("Selected star:", parsedStars[e.index]);

    setTextPath(0.99, formatTextPath(parsedStars[e.index]));
    selectSkyObject(
      {
        type: "star",
        id: parsedStars[e.index].hr,
        name: parsedStars[e.index].name,
      },
      {
        x: parsedStars[e.index].x * radius,
        y: parsedStars[e.index].y * radius,
        z: parsedStars[e.index].z * radius,
      },
    );
  };

  return (
    <>
      {skySelection && skySelection.type === "star" && parsedStars && (
        <Html
          position={
            new THREE.Vector3(
              skySelectionPosition.x,
              skySelectionPosition.y,
              skySelectionPosition.z,
            )
          }
          style={{
            color: "white",
            fontSize: "2em",
            whiteSpace: "nowrap",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 40 40"
            style={{ transform: "translate(-50%, -50%)" }}
            onClick={() => clearSkySelection()}
          >
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="#00ffff"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          </svg>
        </Html>
      )}
      {geometry && (
        <points
          ref={pointsRef}
          geometry={geometry}
          renderOrder={1}
          onPointerDown={handlePointerDown}
        >
          <primitive
            object={starMaterial}
            attach="material"
            ref={materialRef}
            uTwinkleIntensity={twinkleIntensity}
            uInnerRadius={starInnerRadius}
            uGlowIntensity={glowIntensity}
          />
        </points>
      )}
      {showMarkerStars &&
        geometry &&
        markerStars.map((star) => (
          <Html
            key={star.hr}
            position={star.position}
            distanceFactor={10}
            style={{
              color: "white",
              fontSize: "2em",
              whiteSpace: "nowrap",
            }}
          >
            {star.name}, {star.hr}
          </Html>
        ))}
    </>
  );
}
