import { Body, Equator, Illumination, Observer } from "astronomy-engine";
import { useEffect, useMemo, useRef } from "react";
import { bvToColor, getCelestialPoint } from "./skyUtils";
import { GlowingPointMaterial } from "../Materials/GlowingPointMaterial";
import * as THREE from "three";
import { useLoadingStore } from "../../store";
import { gsap } from "gsap";

const lat = Number(import.meta.env.VITE_LAT);
const lon = Number(import.meta.env.VITE_LON);

const planets = [
  { planet: Body.Mercury, bv: 0.64 },
  { planet: Body.Venus, bv: 0.82 },
  { planet: Body.Mars, bv: 1.36 },
  { planet: Body.Jupiter, bv: 0.85 },
  { planet: Body.Saturn, bv: 1.04 },
  // { planet: Body.Uranus, bv: -0.11 },
  // { planet: Body.Neptune, bv: -0.03 },
];

export default function Planets({ radius }: { radius: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const planetMaterial = useMemo(() => new GlowingPointMaterial(), []);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const observer = useMemo(() => new Observer(lat, lon, 0), []);
  const isLoaded = useLoadingStore((state) => state.isLoaded);

  const geometry = useMemo(() => {
    const positions = new Float32Array(planets.length * 3);
    const colors = new Float32Array(planets.length * 3);
    const sizes = new Float32Array(planets.length);

    planets.forEach(({ planet, bv }, i) => {
      const date = new Date();
      const eq = Equator(planet, date, observer, true, false);
      const pos = getCelestialPoint(eq.ra, 0, 0, eq.dec, 0, 0, radius);
      const mag = Illumination(planet, date).mag;
      const color = bvToColor(bv);

      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.max(0.1, (7.0 - mag) * 0.5) * 8;
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    return geo;
  }, [radius, observer]);

  useEffect(() => {
    if (!pointsRef.current) return;
    const updatePlanets = () => {
      const date = new Date();
      planets.forEach(({ planet }, i) => {
        const eq = Equator(planet, date, observer, true, false);
        const pos = getCelestialPoint(eq.ra, 0, 0, eq.dec, 0, 0, radius);

        pointsRef.current?.geometry.attributes.position.setXYZ(
          i,
          pos.x,
          pos.y,
          pos.z,
        );
      });
      pointsRef.current!.geometry.attributes.position.needsUpdate = true;
    };

    const interval = setInterval(updatePlanets, 1000);
    return () => clearInterval(interval);
  }, [observer, radius]);

  useEffect(() => {
    if (isLoaded && materialRef.current) {
      gsap.fromTo(
        materialRef.current.uniforms.uRadius,
        { value: 0 },
        { value: radius, duration: 5, ease: "power2.out" },
      );
    }
  }, [isLoaded, radius]);

  return (
    <points geometry={geometry} renderOrder={1} ref={pointsRef}>
      <primitive
        object={planetMaterial}
        attach="material"
        uInnerRadius={0.07}
        uGlowIntensity={0.2}
        uTwinkleIntensity={0.0}
        uRadius={radius}
        ref={materialRef}
      />
    </points>
  );
}
