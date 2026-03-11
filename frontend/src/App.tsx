import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Leva } from "leva";
import Scene from "./features/Scene";

function App() {
  const isProd = import.meta.env.VITE_PROD === "true";

  return (
    <>
      <Leva hidden={isProd} />
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas>
          <Scene />
        </Canvas>
      </div>
    </>
  );
}

export default App;
