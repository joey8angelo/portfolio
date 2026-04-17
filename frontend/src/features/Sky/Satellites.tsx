import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  json2satrec,
  propagate,
  gstime,
  degreesToRadians,
  geodeticToEcf,
  ecfToEci,
  type OMMJsonObjectV3,
} from "satellite.js";
import SelectionMarker from "./SelectionMarker";
import useSkySelectionStore from "../../store/useSkySelectionStore";
import CelestialPoints, { type CelestialHandles } from "./CelestialPoints";
import type { ThreeEvent } from "@react-three/fiber/dist/declarations/src/core/events";
import useNavigationStore from "../../store/useNavigationStore";

const path = "/assets/satellite_data.json";

useLoader.preload(THREE.FileLoader, path);

const updateInterval = 100;

const lat = Number(import.meta.env.VITE_LAT);
const lon = Number(import.meta.env.VITE_LON);

const satelliteControls = {
  twinkleSpeed: {
    value: 1.5,
    min: 0,
    max: 2,
    step: 0.01,
  },
  twinkleIntensity: {
    value: 0.2,
    min: 0,
    max: 1,
    step: 0.01,
  },
  innerRadius: {
    value: 0.4,
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
  radiusMultiplier: {
    value: 3,
    min: 0.1,
    max: 100,
    step: 0.1,
  },
};

function formatSatelliteInfo(sat: OMMJsonObjectV3) {
  return `NORAD ${sat.NORAD_CAT_ID} ° Inclination ${sat.INCLINATION} ° Eccentricity ${sat.ECCENTRICITY} ° RA of Ascending Node ${sat.RA_OF_ASC_NODE} ° Argument of Pericenter ${sat.ARG_OF_PERICENTER} ° Mean Anomaly ${sat.MEAN_ANOMALY} ° Mean Motion ${sat.MEAN_MOTION} revs/day ° Mean Motion Dot ${sat.MEAN_MOTION_DOT} revs/day² ° Revolutions at Epoch ${sat.REV_AT_EPOCH}`;
}

export default function Satellites({ radius }: { radius: number }) {
  const satelliteData = useLoader(THREE.FileLoader, path);
  const parsedData = useMemo(() => {
    if (!satelliteData) return [];
    return JSON.parse(satelliteData as string) as OMMJsonObjectV3[];
  }, [satelliteData]);
  const pointsApi = useRef<CelestialHandles>(null);
  const markerRef = useRef<THREE.Group>(null);
  const skySelection = useSkySelectionStore((state) => state.selection);
  const selectSkyObject = useSkySelectionStore(
    (state) => state.selectSkyObject,
  );
  const setActiveTab = useNavigationStore((state) => state.setActiveTab);

  const { satrecs, positions, colors, sizes, seeds } = useMemo(() => {
    const satrecs = new Array(parsedData.length);
    const positions = new Float32Array(parsedData.length * 3);
    const colors = new Float32Array(parsedData.length * 3);
    const sizes = new Float32Array(parsedData.length);
    const seeds = new Float32Array(parsedData.length);

    // convert satellite position from ECI to observer-centered coordinates
    // project back onto the celestial sphere
    // if this is not done, the camera acts as if its in the center of the earth
    const date = new Date();
    const gmst = gstime(date);
    const observerGd = {
      longitude: degreesToRadians(lon),
      latitude: degreesToRadians(lat),
      height: 0,
    };
    const observerEcf = geodeticToEcf(observerGd);
    const observerEci = ecfToEci(observerEcf, gmst);

    parsedData.forEach((sat: OMMJsonObjectV3, i: number) => {
      const satrec = json2satrec(sat);
      satrecs[i] = satrec;

      const posVel = propagate(satrec, date);
      let posVec = new THREE.Vector3(0, 0, 0);

      if (posVel && posVel.position) {
        const pos = posVel.position as { x: number; y: number; z: number };

        posVec = new THREE.Vector3(
          pos.x - observerEci.x,
          pos.y - observerEci.y,
          pos.z - observerEci.z,
        )
          .normalize()
          .multiplyScalar(radius);
      }

      positions[i * 3] = posVec.x;
      positions[i * 3 + 1] = posVec.z;
      positions[i * 3 + 2] = -posVec.y;

      const typeColor = new THREE.Color("#ffffff");
      colors[i * 3] = typeColor.r;
      colors[i * 3 + 1] = typeColor.g;
      colors[i * 3 + 2] = typeColor.b;

      sizes[i] = 1;

      const dot =
        positions[i * 3] * 12.9898 +
        positions[i * 3 + 1] * 78.233 +
        positions[i * 3 + 2] * 437.164;
      const hash = Math.sin(dot) * 43758.5453;
      seeds[i] = hash - Math.floor(hash);
    });

    return { satrecs, positions, colors, sizes, seeds };
  }, [radius, parsedData]);

  // Use a ref to track the last update time
  const lastUpdateTime = useRef(0);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime() * 1000;
    if (elapsedTime - lastUpdateTime.current < updateInterval) return;
    lastUpdateTime.current = elapsedTime;

    if (!pointsApi.current) return;
    if (!pointsApi.current.points) return;

    const date = new Date();
    const gmst = gstime(date);
    const observerGd = {
      longitude: degreesToRadians(lon),
      latitude: degreesToRadians(lat),
      height: 0,
    };
    const observerEcf = geodeticToEcf(observerGd);
    const observerEci = ecfToEci(observerEcf, gmst);

    const points = pointsApi.current?.points;
    if (!points) return;
    const posVec = new THREE.Vector3();
    for (let i = 0; i < positions.length / 3; i++) {
      const posVel = propagate(satrecs[i], date);
      if (posVel && posVel.position) {
        const pos = posVel.position as { x: number; y: number; z: number };

        posVec.x = pos.x - observerEci.x;
        posVec.y = pos.y - observerEci.y;
        posVec.z = pos.z - observerEci.z;

        posVec.normalize().multiplyScalar(radius);

        if (
          skySelection?.type === "satellite" &&
          skySelection?.id === parsedData[i].NORAD_CAT_ID
        ) {
          markerRef.current?.position.set(posVec.x, posVec.z, -posVec.y);
        }

        points.geometry.attributes.position.setXYZ(
          i,
          posVec.x,
          posVec.z,
          -posVec.y,
        );
      }
    }
    points.geometry.attributes.position.needsUpdate = true;
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.button === 0) {
      e.stopPropagation();

      if (e.index === undefined) return;
      if (!parsedData) return;

      let id = parsedData[e.index].NORAD_CAT_ID;
      if (typeof id !== "number") {
        id = parseInt(id);
      }
      const name = parsedData[e.index].OBJECT_NAME.trim();

      selectSkyObject({
        type: "satellite",
        id: id,
        name: name,
        info: formatSatelliteInfo(parsedData[e.index]),
      });

      if (parsedData) {
        console.log(parsedData[e.index]);
      }

      setActiveTab("sky");
    }
  };

  return (
    <>
      <SelectionMarker
        ref={markerRef}
        visible={skySelection?.type === "satellite"}
      />
      <CelestialPoints
        ref={pointsApi}
        namespace="Sky.Satellites"
        positions={positions}
        colors={colors}
        sizes={sizes}
        seeds={seeds}
        handlePointerDown={handlePointerDown}
        radius={radius}
        controls={satelliteControls}
      />
    </>
  );
}
