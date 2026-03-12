import * as THREE from "three";
import { useMemo } from "react";
import { useControls } from "leva";

export default function SkyGrid({
  color,
  radius,
  lineWidth,
  rotation = [0, 0, 0],
}: {
  color: string;
  radius: number;
  lineWidth: number;
  rotation?: [number, number, number];
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
        highlighted ? lineWidth : lineWidth * 0.7,
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
        highlighted ? lineWidth : lineWidth * 0.7,
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
  }, [color, radius, gridOpacity, highlightSegments, lineWidth]);

  return <primitive object={rings} rotation={rotation} />;
}
