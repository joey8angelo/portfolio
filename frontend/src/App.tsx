import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Leva } from "leva";

import SkyScene from "./features/sky";
import LoadingScene from "./features/loading";

import useSmoothProgress from "./hooks/useSmoothProgress";
import { Suspense } from "react";

function App() {
  const isProd = import.meta.env.VITE_PROD === "true";

  const progress = useSmoothProgress({ duration: 5 });

  return (
    <>
      <Leva hidden={isProd} />
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas>
          <LoadingScene progress={progress} />
          <Suspense fallback={null}>
            <SkyScene />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default App;
