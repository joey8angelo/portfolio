import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import "./App.css";
import Scene from "./features/Scene";

import { Stats } from "@react-three/drei";
import { LoadingStoreSync } from "./store";
import Cursor from "./components/Cursor";

const loadingDuration = 1;

function App() {
  const isDev = import.meta.env.DEV;

  return (
    <>
      {isDev && <Leva />}
      <div className="w-[100dvw] h-[100dvh] grid grid-cols-1 grid-rows-1">
        <Cursor />

        <Canvas
          style={{ zIndex: 0 }}
          raycaster={{
            params: {
              Points: { threshold: 0.1 },
              Mesh: { threshold: 0.1 },
              Line: { threshold: 0.1 },
              LOD: { threshold: 0.1 },
              Sprite: { threshold: 0.1 },
            },
          }}
        >
          {isDev && <Stats />}

          <LoadingStoreSync duration={loadingDuration} ease={"power1.out"} />
          <Scene />
        </Canvas>
      </div>
    </>
  );
}

export default App;
