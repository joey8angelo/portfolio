import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import MilkyWay from "./MilkyWay";
import StarField from "./StarField";
import SkyGrid from "./SkyGrid";
import { getLocalSiderealTime } from "../../lib/skyUtils";
import Planets from "./Planets";
import { EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { HueSaturation } from "@react-three/postprocessing";
import useLoadingStore from "../../store/useLoadingStore";
import Satellites from "./Satellites";

const lat = Number(import.meta.env.VITE_LAT);
const lon = Number(import.meta.env.VITE_LON);

const milkyWayR = 10;
const starsR = 9.9;
const planetsR = 9.8;
const gridR = 9.7;

const celestialControlsSchema = {
  showEquatorial: false,
  showStars: true,
  showMilkyWay: true,
  showPlanets: true,
  showSatellites: true,
};

// Objects that appear to rotate with the sky
function CelestialScene() {
  const uniGroup = useRef<THREE.Group>(null);
  const initialRotation = useMemo(() => getLocalSiderealTime(lon), []);

  const currentRotationRef = useRef(initialRotation);
  const latRad = useMemo(() => (lat * Math.PI) / 180, []);
  const RADS_PER_SECOND = (2 * Math.PI) / 86400;

  const {
    showEquatorial,
    showStars,
    showMilkyWay,
    showPlanets,
    showSatellites,
  } = useControls("Sky", celestialControlsSchema);

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
        {showSatellites && <Satellites radius={planetsR - 0.1} />}
      </group>
    </group>
  );
}

// Objects that appear fixed relative to the Earth
function TerrestrialScene() {
  return null;
}

const skySceneControlsSchema = {
  showAzimuthal: false,
  showAxes: false,
};

// View of the sky as seen from earth
export default function SkyScene() {
  const isLoaded = useLoadingStore((state) => state.isLoaded);
  const { showAzimuthal, showAxes } = useControls(
    "Sky",
    skySceneControlsSchema,
  );

  return (
    <>
      {showAxes && <axesHelper args={[5]} />}

      {showAzimuthal && (
        <SkyGrid color="#ee895b" radius={gridR} lineWidth={0.01} />
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
