import { Canvas } from "@react-three/fiber";

export default function R3FIcon({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full h-full"
      style={{ position: "relative" }}
    >
      <Canvas
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 100], fov: 1, far: 100000 }}
        gl={{ antialias: true, alpha: true }}
      >
        {children}
      </Canvas>
    </div>
  );
}
