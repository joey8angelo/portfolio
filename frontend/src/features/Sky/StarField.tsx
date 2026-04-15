import * as THREE from "three";
import { useLoader, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { bvToColor } from "../../lib/skyUtils";
import useSkySelectionStore from "../../store/useSkySelectionStore";
import useNavigationStore from "../../store/useNavigationStore";
import CelestialPoints, { type CelestialHandles } from "./CelestialPoints";
import SelectionMarker from "./SelectionMarker";

useLoader.preload(THREE.FileLoader, "/assets/ybsc_parsed.csv");

// const markerHRNums = [2491, 2326, 5460, 2061, 5340, 7001, 2943, 1708];

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

function formatStarInfo(starData: StarData) {
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

  return `${name ? name + " ◦ " : ""}SpecType ${sptype} ◦ ${`HR ${hr}`} ◦ B-V ${bv} ◦ SAO ${sao || "N/A"} ◦ Visual Mag ${vmag} ◦ DM ${dm || "N/A"} ◦ RA ${rah}h ${ram}m ${ras}s ◦ DEC ${desn}${ded}° ${dem}' ${des}"`;
}

const starControls = {
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
  innerRadius: {
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
};

export default function StarField({
  url,
  radius,
}: {
  url: string;
  radius: number;
}) {
  const selectSkyObject = useSkySelectionStore(
    (state) => state.selectSkyObject,
  );
  const skySelection = useSkySelectionStore((state) => state.selection);
  const [selectionPos, setSelectionPos] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0),
  );
  const setActiveTab = useNavigationStore((state) => state.setActiveTab);
  const pointsApi = useRef<CelestialHandles>(null);

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
    return lines;
  }, [starData]);

  const { positions, colors, sizes, seeds } = useMemo(() => {
    if (!parsedStars)
      return {
        positions: new Float32Array(0),
        colors: new Float32Array(0),
        sizes: new Float32Array(0),
        seeds: new Float32Array(0),
      };
    const positions = new Float32Array(parsedStars.length * 3);
    const colors = new Float32Array(parsedStars.length * 3);
    const sizes = new Float32Array(parsedStars.length);
    const seeds = new Float32Array(parsedStars.length);

    parsedStars.forEach((star, i) => {
      const { bv, vmag, x, y, z } = star;

      positions[i * 3] = x * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = z * radius;

      const color = bvToColor(bv);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.max(0.1, (7.0 - vmag) * 0.5);

      const dot = x * 12.9898 + y * 78.233 + z * 437.164;
      const hash = Math.sin(dot) * 43758.5453;
      seeds[i] = hash - Math.floor(hash);
    });

    return { positions, colors, sizes, seeds };
  }, [parsedStars, radius]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.button === 0) {
      e.stopPropagation();

      if (!parsedStars || e.index === undefined) return;

      const points = pointsApi.current?.points;
      const pos = points?.geometry.attributes.position;
      if (!pos) return;

      selectSkyObject({
        type: "star",
        id: parsedStars[e.index].hr,
        name: parsedStars[e.index].name,
        info: formatStarInfo(parsedStars[e.index]),
      });
      setSelectionPos(
        new THREE.Vector3(
          pos.getX(e.index),
          pos.getY(e.index),
          pos.getZ(e.index),
        ),
      );

      setActiveTab("sky");
    }
  };

  return (
    <>
      <SelectionMarker
        visible={skySelection?.type === "star"}
        position={selectionPos}
      />
      <CelestialPoints
        ref={pointsApi}
        radius={radius}
        namespace="Sky.Stars"
        controls={starControls}
        positions={positions}
        colors={colors}
        sizes={sizes}
        seeds={seeds}
        handlePointerDown={handlePointerDown}
      />
    </>
  );
}
