import { Body, Equator, Illumination, Observer } from "astronomy-engine";
import { useEffect, useMemo, useRef } from "react";
import { bvToColor, getCelestialPoint } from "../../lib/skyUtils";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber/dist/declarations/src/core/events";
import {
  bodies,
  getFormattedPlanetInfo,
  getPlanetInfo,
} from "../../lib/planetData";
import useSkySelectionStore from "../../store/useSkySelectionStore";
import useNavigationStore from "../../store/useNavigationStore";
import type { CelestialHandles } from "./CelestialPoints";
import CelestialPoints from "./CelestialPoints";
import SelectionMarker from "./SelectionMarker";

const lat = Number(import.meta.env.VITE_LAT);
const lon = Number(import.meta.env.VITE_LON);

const planetControls = {
  twinkleSpeed: {
    value: 0,
    min: 0,
    max: 2,
    step: 0.01,
  },
  twinkleIntensity: {
    value: 0.0,
    min: 0,
    max: 1,
    step: 0.01,
  },
  innerRadius: {
    value: 0.07,
    min: 0,
    max: 1,
    step: 0.01,
  },
  glowIntensity: {
    value: 0.2,
    min: 0,
    max: 1,
    step: 0.01,
  },
  radiusMultiplier: {
    value: 8,
    min: 0.1,
    max: 20,
    step: 0.1,
  },
};

export default function Planets({ radius }: { radius: number }) {
  const pointsApi = useRef<CelestialHandles>(null);
  const observer = useMemo(() => new Observer(lat, lon, 0), []);
  const skySelection = useSkySelectionStore((state) => state.selection);
  const selectSkyObject = useSkySelectionStore(
    (state) => state.selectSkyObject,
  );
  const markerRef = useRef<THREE.Group>(null);
  const setActiveTab = useNavigationStore((state) => state.setActiveTab);

  const { positions, colors, sizes, seeds } = useMemo(() => {
    const positions = new Float32Array(bodies.length * 3);
    const colors = new Float32Array(bodies.length * 3);
    const sizes = new Float32Array(bodies.length);
    const seeds = new Float32Array(bodies.length);

    bodies.forEach((body, i) => {
      const info = getPlanetInfo(i);
      if (!info) return;
      const date = new Date();
      const eq = Equator(body, date, observer, true, false);
      const pos = getCelestialPoint(eq.ra, 0, 0, eq.dec, 0, 0, radius);
      const mag = Illumination(body, date).mag;
      const color = bvToColor(info.bv);

      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.max(0.1, (7.0 - mag) * 0.5);

      const dot = pos.x * 12.9898 + pos.y * 78.233 + pos.z * 437.164;
      const hash = Math.sin(dot) * 43758.5453;
      seeds[i] = hash - Math.floor(hash);
    });

    return { positions, colors, sizes, seeds };
  }, [radius, observer]);

  useEffect(() => {
    if (!pointsApi.current) return;
    if (!pointsApi.current.points) return;

    const updatePositions = () => {
      const date = new Date();

      const points = pointsApi.current?.points;
      if (!points) return;
      bodies.forEach((body, i) => {
        const info = getPlanetInfo(i);
        if (!info) return;
        const eq = Equator(body, date, observer, true, false);
        const pos = getCelestialPoint(eq.ra, 0, 0, eq.dec, 0, 0, radius);

        if (skySelection?.type === "planet" && skySelection?.id === i) {
          markerRef.current?.position.set(pos.x, pos.y, pos.z);
        }

        points.geometry.attributes.position.setXYZ(i, pos.x, pos.y, pos.z);
      });
      points.geometry.attributes.position.needsUpdate = true;
    };
    const interval = setInterval(updatePositions, 10000);
    return () => clearInterval(interval);
  }, [observer, radius, skySelection]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.button === 0) {
      e.stopPropagation();

      if (e.index === undefined) return;

      const points = pointsApi.current?.points;
      const pos = points?.geometry.attributes.position;
      if (!pos) return;

      const planetPos = new THREE.Vector3(
        pos.getX(e.index),
        pos.getY(e.index),
        pos.getZ(e.index),
      );

      selectSkyObject({
        type: "planet",
        id: e.index,
        name: Body[bodies[e.index]],
        info: getFormattedPlanetInfo(e.index),
      });
      markerRef.current?.position.set(planetPos.x, planetPos.y, planetPos.z);

      setActiveTab("sky");
    }
  };

  return (
    <>
      <SelectionMarker
        ref={markerRef}
        visible={skySelection?.type === "planet"}
      />
      <CelestialPoints
        ref={pointsApi}
        namespace="Sky.Planets"
        positions={positions}
        colors={colors}
        sizes={sizes}
        seeds={seeds}
        handlePointerDown={handlePointerDown}
        radius={radius}
        controls={planetControls}
      />
    </>
  );
}
