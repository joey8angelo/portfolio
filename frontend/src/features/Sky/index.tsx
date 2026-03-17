import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useDebugControls } from "../../hooks/useDebugControls";
import MilkyWay from "./MilkyWay";
import StarField from "./StarField";
import SkyGrid from "./SkyGrid";
import { getLocalSiderealTime } from "./skyUtils";
import Planets from "./Planets";

const lat = Number(import.meta.env.VITE_LAT);
const lon = Number(import.meta.env.VITE_LON);

// Objects that appear to rotate with the sky
function CelestialScene({ radius, gridR }: { radius: number; gridR: number }) {
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
        {showMilkyWay && <MilkyWay radius={radius} />}
        {showStars && (
          <StarField url="/assets/ybsc_parsed.csv" radius={radius} />
        )}
        {showPlanets && <Planets radius={radius} />}
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
  const { showAzimuthal, showAxes } = useDebugControls({
    showAzimuthal: false,
    showAxes: false,
  });

  return (
    <>
      {showAxes && <axesHelper args={[5]} />}
      <ambientLight intensity={1} />

      {showAzimuthal && (
        <SkyGrid color="#8a5137" radius={9.9} lineWidth={0.01} />
      )}

      <TerrestrialScene />

      <CelestialScene radius={10} gridR={9.9} />
    </>
  );
}
