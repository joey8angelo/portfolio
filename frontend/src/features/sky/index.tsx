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

export default function SkyScene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const uniGroup = useRef<THREE.Group>(null);

  const initialRotation = useMemo(() => getLocalSiderealTime(lon), []);

  const currentRotationRef = useRef(initialRotation);

  const {
    timeMultiplier,
    showEquatorial,
    showAzimuthal,
    showAxes,
    showStars,
    useDebugCamera,
  } = useControls({
    timeMultiplier: {
      value: 1,
      min: 0,
      max: 10000,
      step: 0.1,
    },
    showEquatorial: false,
    showAzimuthal: false,
    showAxes: false,
    showStars: true,
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

  const latRad = useMemo(() => (lat * Math.PI) / 180, []);
  const RADS_PER_SECOND = (2 * Math.PI) / 86400;

  useFrame((_, delta) => {
    if (uniGroup.current) {
      currentRotationRef.current -= RADS_PER_SECOND * delta * timeMultiplier;

      uniGroup.current.rotation.y = currentRotationRef.current;
    }
  });

  return (
    <>
      {showAxes && <axesHelper args={[5]} />}
      <ambientLight intensity={1} />
      <PerspectiveCamera
        makeDefault={!useDebugCamera}
        ref={cameraRef}
        position={[0, -0.001, 0]}
        fov={100}
      />
      <PerspectiveCamera
        position={[50, -50, 0]}
        fov={100}
        makeDefault={useDebugCamera}
      />
      <OrbitControls enablePan={false} enabled={useDebugCamera} />

      {showAzimuthal && (
        <SkyGrid color="#ffffff" rotation={[0, 0, 0]} radius={99} />
      )}

      {/* Terrestrial objects */}
      {/* <Planes /> */}

      {/* Celestial objects */}
      <group rotation={[Math.PI / 2 - latRad, 0, 0]}>
        <group ref={uniGroup} rotation={[0, initialRotation, 0]}>
          <MilkyWay radius={100} />
          {showEquatorial && <SkyGrid color="cyan" radius={99} />}
          {showStars && <StarField url="/ybsc_parsed.csv" radius={99} />}
          {/* <Satellites /> ???*/}
        </group>
      </group>
    </>
  );
}
