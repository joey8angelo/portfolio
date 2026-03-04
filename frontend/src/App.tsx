import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "./App.css";
import { Leva } from "leva";

import SkyScene from "./features/sky";

function App() {
  const isProd = import.meta.env.VITE_PROD === "true";

  return (
    <>
      <Leva hidden={isProd} />
      <Canvas style={{ height: "100vh", width: "100vw" }}>
        <Suspense fallback={null}>
          <SkyScene />
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
