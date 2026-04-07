import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import "./App.css";
import Scene from "./features/Scene";

import { Stats } from "@react-three/drei";
import { LoadingStoreSync, useLoadingStore, useNavigationStore } from "./store";
import { useEffect } from "react";

const loadingDuration = 10;

function App() {
  const isDev = import.meta.env.DEV;

  const { setActiveTab } = useNavigationStore();
  const { isLoaded } = useLoadingStore();

  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        setActiveTab("home");
      }, 800);
    }
  }, [isLoaded, setActiveTab]);

  return (
    <>
      {isDev && <Leva />}
      <div className="w-[100dvw] h-[100dvh] grid grid-cols-1 grid-rows-1">
        <Canvas
          className="scene"
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
