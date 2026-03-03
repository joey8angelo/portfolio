import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "./App.css";

import SkyScene from "./components/SkyScene";

function App() {
  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>
      <Suspense fallback={null}>
        <SkyScene />
      </Suspense>
    </Canvas>
  );
}

export default App;
