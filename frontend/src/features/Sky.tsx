import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useDebugControls } from "../hooks/useDebugControls";
import MilkyWay from "./Sky/MilkyWay";
import StarField from "./Sky/StarField";
import SkyGrid from "./Sky/SkyGrid";
import { getLocalSiderealTime } from "./Sky/skyUtils";
import Planets from "./Sky/Planets";
import { EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { HueSaturation } from "@react-three/postprocessing";
import { useLoadingStore } from "../store";

const lat = Number(import.meta.env.VITE_LAT);
const lon = Number(import.meta.env.VITE_LON);

const milkyWayR = 10;
const starsR = 9.9;
const planetsR = 9.8;
const gridR = 9.7;

// Objects that appear to rotate with the sky
function CelestialScene() {
  const uniGroup = useRef<THREE.Group>(null);
  const initialRotation = useMemo(() => getLocalSiderealTime(lon), []);

  const currentRotationRef = useRef(initialRotation);
  const latRad = useMemo(() => (lat * Math.PI) / 180, []);
  const RADS_PER_SECOND = (2 * Math.PI) / 86400;

  const { showEquatorial, showStars, showMilkyWay, showPlanets } =
    useDebugControls({
      showEquatorial: false,
      showStars: true,
      showMilkyWay: true,
      showPlanets: true,
    });

  useFrame((_, delta) => {
    if (uniGroup.current) {
      currentRotationRef.current -= RADS_PER_SECOND * delta;

      uniGroup.current.rotation.y = currentRotationRef.current;
    }
  });
  return (
    <group rotation={[Math.PI / 2 - latRad, 0, 0]}>
      <group ref={uniGroup} rotation={[0, initialRotation, 0]}>
        {showMilkyWay && <MilkyWay radius={milkyWayR} />}
        {showStars && (
          <StarField url="/assets/ybsc_parsed.csv" radius={starsR} />
        )}
        {showPlanets && <Planets radius={planetsR} />}
        {showEquatorial && (
          <SkyGrid color="cyan" radius={gridR} lineWidth={0.01} />
        )}
        {/* <Satellites /> ???*/}
      </group>
    </group>
  );
}

// Objects that appear fixed relative to the Earth
function TerrestrialScene() {
  return null;
}

// View of the sky as seen from earth
export default function SkyScene() {
  const isLoaded = useLoadingStore((state) => state.isLoaded);
  const { showAzimuthal, showAxes } = useDebugControls({
    showAzimuthal: false,
    showAxes: false,
  });

  return (
    <>
      {showAxes && <axesHelper args={[5]} />}

      {showAzimuthal && (
        <SkyGrid color="#8a5137" radius={gridR} lineWidth={0.01} />
      )}

      <TerrestrialScene />

      <CelestialScene />
      {isLoaded && (
        <EffectComposer multisampling={0} frameBufferType={THREE.HalfFloatType}>
          <HueSaturation saturation={0.2} hue={0} />
          <ToneMapping mode={THREE.ReinhardToneMapping} />
        </EffectComposer>
      )}
    </>
  );
}
