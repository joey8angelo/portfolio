import { useMemo, useRef } from "react";
import * as THREE from "three";
import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import MilkyWay from "./MilkyWay";
import StarField from "./StarField";
import SkyGrid from "./SkyGrid";
import { getLocalSiderealTime } from "./starUtils";

const lat = Number(import.meta.env.VITE_LAT);
const lon = Number(import.meta.env.VITE_LON);

// Objects that appear to rotate with the sky
function CelestialScene({
  radius,
  innerRadius,
}: {
  radius: number;
  innerRadius: number;
}) {
  const uniGroup = useRef<THREE.Group>(null);
  const initialRotation = useMemo(() => getLocalSiderealTime(lon), []);

  const currentRotationRef = useRef(initialRotation);
  const latRad = useMemo(() => (lat * Math.PI) / 180, []);
  const RADS_PER_SECOND = (2 * Math.PI) / 86400;

  const { timeMultiplier, showEquatorial, showStars, showMilkyWay } =
    useControls({
      timeMultiplier: {
        value: 1,
        min: 0,
        max: 10000,
        step: 0.1,
      },
      showEquatorial: false,
      showStars: true,
      showMilkyWay: true,
    });

  useFrame((_, delta) => {
    if (uniGroup.current) {
      currentRotationRef.current -= RADS_PER_SECOND * delta * timeMultiplier;

      uniGroup.current.rotation.y = currentRotationRef.current;
    }
  });
  return (
    <group rotation={[Math.PI / 2 - latRad, 0, 0]}>
      <group ref={uniGroup} rotation={[0, initialRotation, 0]}>
        {showEquatorial && (
          <SkyGrid color="cyan" radius={innerRadius} lineWidth={0.01} />
        )}
        {showStars && <StarField url="/ybsc_parsed.csv" radius={innerRadius} />}
        {showMilkyWay && <MilkyWay radius={radius} />}
        {/* <Satellites /> ???*/}
      </group>
    </group>
  );
}

// Objects that appear fixed relative to the Earth
function TerrestrialScene() {
  return null;
}

export default function SkyScene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  const { showAzimuthal, showAxes, useDebugCamera } = useControls({
    showAzimuthal: false,
    showAxes: false,
    useDebugCamera: false,
    fov: {
      value: 100,
      min: 10,
      max: 150,
      step: 1,
      onChange: (value) => {
        if (cameraRef.current) {
          cameraRef.current.fov = value;
          cameraRef.current.updateProjectionMatrix();
        }
      },
    },
  });

  useHelper(useDebugCamera ? cameraRef : null, THREE.CameraHelper);

  return (
    <>
      {showAxes && <axesHelper args={[5]} />}
      <ambientLight intensity={1} />
      <PerspectiveCamera
        makeDefault={!useDebugCamera}
        ref={cameraRef}
        position={[0, -0.01, 0]}
        fov={100}
      />
      <PerspectiveCamera
        position={[5, -5, 0]}
        fov={100}
        makeDefault={useDebugCamera}
      />
      <OrbitControls enablePan={false} enabled={useDebugCamera} />

      {showAzimuthal && (
        <SkyGrid color="#ffffff" radius={9.9} lineWidth={0.01} />
      )}

      <TerrestrialScene />

      <CelestialScene radius={10} innerRadius={9.9} />
    </>
  );
}
