import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { EffectComposer } from "@react-three/postprocessing";
import { DitherEffect } from "../../features/Effects/Dither";

export default function WireframeSphereIcon({
  selected,
  duration,
}: {
  selected: boolean;
  duration: number;
}) {
  const sphereRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!sphereRef.current || !selected) return;
    sphereRef.current.rotation.y += 0.001;
    sphereRef.current.rotation.x += 0.0006;
    sphereRef.current.rotation.z += 0.0004;
  });

  const radius = 0.8;
  const segments = 6;
  const lineWidth = 0.02;

  const [material] = useState<THREE.Material>(
    new THREE.MeshBasicMaterial({
      color: "white",
      transparent: true,
      opacity: 0.5,
    }),
  );

  useGSAP(() => {
    if (!groupRef.current) return;

    gsap.to(material, {
      opacity: selected ? 1 : 0.5,
      duration: duration / 1000,
      ease: "power2.out",
    });

    const scale_t = selected ? 1 : 0.8;

    gsap.to(groupRef.current.scale, {
      x: scale_t,
      y: scale_t,
      z: scale_t,
      duration: duration / 1000,
      ease: "power2.out",
    });
  }, [selected]);

  const rings = useMemo(() => {
    const group = new THREE.Group();

    // Horizontal Rings
    for (let i = 1; i < segments; i++) {
      const lat = (i / segments) * Math.PI; // 0 to PI
      const ringRadius = radius * Math.sin(lat);
      const yPos = radius * Math.cos(lat);

      const geometry = new THREE.TorusGeometry(ringRadius, lineWidth, 3, 100);
      const ring = new THREE.Mesh(geometry, material);

      ring.rotation.x = Math.PI / 2;
      ring.position.y = yPos;
      group.add(ring);
    }

    // Vertical Rings
    for (let i = 0; i < segments; i++) {
      const geometry = new THREE.TorusGeometry(radius, lineWidth, 3, 100);
      const ring = new THREE.Mesh(geometry, material);

      ring.rotation.y = (i / segments) * Math.PI;
      group.add(ring);
    }

    return group;
  }, [material]);

  return (
    <>
      <group ref={groupRef} scale={0.8}>
        <primitive
          object={rings}
          rotation={[0, Math.PI / 4, Math.PI / 4]}
          ref={sphereRef}
        />
        <mesh>
          <torusGeometry args={[radius, lineWidth, 3, 100]} />
          <primitive object={material} attach="material" />
        </mesh>

        <mesh>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial colorWrite={false} depthWrite={true} />
        </mesh>
      </group>

      <EffectComposer>
        <DitherEffect colorNum={3} />
      </EffectComposer>
    </>
  );
}
