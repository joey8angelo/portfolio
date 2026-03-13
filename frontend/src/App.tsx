import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import "./App.css";
import Scene from "./features/Scene";

function App() {
  const isDev = import.meta.env.DEV;

  return (
    <>
      {isDev && <Leva />}
      <div
        style={{
          width: "100%",
          height: "100dvh",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <Canvas>
          <Scene />
        </Canvas>
      </div>
    </>
  );
}

export default App;
