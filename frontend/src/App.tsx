import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import "./App.css";
import Scene from "./features/Scene";

// import Scene from "./features/Scene/testScene";

function App() {
  const isDev = import.meta.env.DEV;

  return (
    <>
      {isDev && <Leva />}
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas>
          <Scene />
        </Canvas>
      </div>
    </>
  );
}

export default App;
