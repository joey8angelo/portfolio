import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useLoader, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/Addons.js";
import { useControls } from "leva";

function getCelestialPoint(
  raHour: number,
  raMin: number,
  raSec: number,
  decDegrees: number,
  decMinutes: number,
  decSeconds: number,
  radius: number,
) {
  const raHours = raHour + raMin / 60 + raSec / 3600;
  const decDegreesTotal =
    Math.abs(decDegrees) + decMinutes / 60 + decSeconds / 3600;
  const decDegreesSigned = decDegrees < 0 ? -decDegreesTotal : decDegreesTotal;

  const phi = -(raHours / 24) * Math.PI * 2;
  const theta = (decDegreesSigned / 180) * Math.PI;

  const x = radius * Math.cos(theta) * Math.cos(phi);
  const y = radius * Math.sin(theta);
  const z = radius * Math.cos(theta) * Math.sin(phi);

  return new THREE.Vector3(x, y, z);
}

function MilkyWay() {
  const originalTexture = useLoader(EXRLoader, "/starmap_2020_4k.exr");
  const texture = useMemo(() => {
    const t = originalTexture.clone();
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;

    t.center.set(0.5, 0.5);
    return t;
  }, [originalTexture]);

  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[100, 32, 32]} />
      <meshStandardMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function SkyGrid({
  color,
  rotation = [0, 0, 0],
  radius = 99,
}: {
  color: string;
  rotation?: [number, number, number];
  radius?: number;
}) {
  const { gridOpacity } = useControls({
    gridOpacity: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });

  const segments = 12;
  const highlightSegments = segments / 2;
  const rings = useMemo(() => {
    const group = new THREE.Group();

    // Horizontal Rings (Latitude / Declination)
    for (let i = 1; i < segments; i++) {
      const lat = (i / segments) * Math.PI; // 0 to PI
      const ringRadius = radius * Math.sin(lat);
      const yPos = radius * Math.cos(lat);

      const highlighted = i % highlightSegments === 0;

      const geometry = new THREE.TorusGeometry(
        ringRadius,
        highlighted ? 0.1 : 0.07,
        16,
        100,
      );
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        side: THREE.BackSide,
        opacity: highlighted ? 1 : gridOpacity,
      });
      const ring = new THREE.Mesh(geometry, material);

      ring.rotation.x = Math.PI / 2;
      ring.position.y = yPos;
      group.add(ring);
    }

    // Vertical Rings (Longitude / Right Ascension)
    for (let i = 0; i < segments; i++) {
      const highlighted = i % highlightSegments === 0;
      const geometry = new THREE.TorusGeometry(
        radius,
        highlighted ? 0.1 : 0.07,
        16,
        100,
      );
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        side: THREE.BackSide,
        opacity: highlighted ? 1 : gridOpacity,
      });
      const ring = new THREE.Mesh(geometry, material);

      ring.rotation.y = (i / segments) * Math.PI;
      group.add(ring);
    }

    return group;
  }, [color, radius, gridOpacity, highlightSegments]);

  return <primitive object={rings} rotation={rotation} />;
}

export default function SkyScene() {
  const uniGroup = useRef<THREE.Group>(null);
  const lat = 34.1211;
  const lon = -117.4362;

  const initialRotation = useMemo(() => {
    const now = new Date();
    const JD = now.getTime() / 86400000 + 2440587.5;
    const D = JD - 2451545.0;
    let gmst = (18.697374558 + 24.06570982441908 * D) % 24;
    if (gmst < 0) gmst += 24;

    const gmstRad = (gmst * Math.PI) / 12;
    const lonRad = (lon * Math.PI) / 180;

    const lst = gmstRad + lonRad;

    return Math.PI / 2 - lst;
  }, [lon]);

  const { timeMultiplier, showEquatorial, showAzimuthal, showAxes } =
    useControls({
      timeMultiplier: {
        value: 1,
        min: 0,
        max: 10000,
        step: 0.1,
      },
      showEquatorial: true,
      showAzimuthal: true,
      showAxes: true,
    });

  const latRad = useMemo(() => (lat * Math.PI) / 180, []);
  const RADS_PER_SECOND = (2 * Math.PI) / 86400;

  useFrame((_, delta) => {
    if (uniGroup.current) {
      uniGroup.current.rotation.y -= RADS_PER_SECOND * delta * timeMultiplier;
    }
  });

  return (
    <>
      <ambientLight intensity={1} />
      <PerspectiveCamera makeDefault position={[0, -0.001, 0]} fov={100} />
      <OrbitControls enablePan={false} />

      {showAzimuthal && <SkyGrid color="#ffffff" rotation={[0, 0, 0]} />}
      <group rotation={[Math.PI / 2 - latRad, 0, 0]}>
        <group ref={uniGroup} rotation={[0, initialRotation, 0]}>
          <MilkyWay />
          {showEquatorial && <SkyGrid color="cyan" />}
          {/* <StarField /> */}
          {/* <Satellites /> */}

          {/* LMC */}
          <mesh position={getCelestialPoint(5, 23, 34, -69, 45, 22, 100)}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={"red"} />
          </mesh>
          {/* Polaris */}
          <mesh position={getCelestialPoint(3, 3, 25.3, 89, 22, 35.8, 100)}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={"blue"} />
          </mesh>
          {/* Betelgeuse */}
          <mesh position={getCelestialPoint(5, 56, 36.2, 7, 24, 38.8, 100)}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={"red"} />
          </mesh>
        </group>
      </group>
      {showAxes && <axesHelper args={[5]} />}
    </>
  );
}
