import { EffectComposer } from "@react-three/postprocessing";
import { HalftoneEffect } from "./HalftoneEffect";
import { OrbitControls } from "@react-three/drei";

export default function HalftoneScene() {
  return (
    <>
      <color attach="background" args={["black"]} />
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={7} />
      <OrbitControls />
      {/* <mesh position={[0, 0, 0]}>
        <torusKnotGeometry args={[1, 0.4, 128, 16]} />
        <meshLambertMaterial color="white" />
      </mesh> */}
      <EffectComposer>
        <HalftoneEffect scale={1} rotation={0.8} frequency={100.0} />
      </EffectComposer>
    </>
  );
}
