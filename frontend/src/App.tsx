import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Fourier from "./pages/legacy/Fourier";
import LL1 from "./pages/legacy/LL1";
import LR1 from "./pages/legacy/LR1";
import Map from "./pages/legacy/Map";
import NeuralNet from "./pages/legacy/NeuralNet";
import PlantSystem from "./pages/legacy/PlantSystem";
import Particles from "./pages/Particles";
import ReactGA from "react-ga4";
import usePageTracking from "./hooks/usePageTracking";

ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID, {
  gaOptions: {
    debug_mode: import.meta.env.DEV,
  },
});

function AppRoutes() {
  usePageTracking();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/fourier" element={<Fourier />} />
      <Route path="/ll1" element={<LL1 />} />
      <Route path="/lr1" element={<LR1 />} />
      <Route path="/map" element={<Map />} />
      <Route path="/neural-net" element={<NeuralNet />} />
      <Route path="/plant-system" element={<PlantSystem />} />
      <Route path="/particles" element={<Particles />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
