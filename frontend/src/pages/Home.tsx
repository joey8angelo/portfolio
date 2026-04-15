import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import Scene from "../features/Scene";

import useNavigationStore from "../store/useNavigationStore";
import useLoadingStore from "../store/useLoadingStore";
import LoadingStoreSync from "../store/loadingStoreSync";
import { useEffect } from "react";
import HomeUI from "../components/HomeUI/HomeUI";
import useShowControls from "../store/useShowControls";

const loadingDuration = 2;

export default function Home() {
  const showControls = useShowControls((state) => state.showControls);

  const setActiveTab = useNavigationStore((state) => state.setActiveTab);
  const isLoaded = useLoadingStore((state) => state.isLoaded);

  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        setActiveTab("home");
      }, 800);
    }
  }, [isLoaded, setActiveTab]);

  const bgColor = isLoaded
    ? "bg-[var(--color-background-default)]"
    : "bg-[var(--color-background-loading)]";
  const qColor = isLoaded
    ? "text-[var(--color-text-muted)]"
    : "text-[var(--color-background-loading)]";

  return (
    <>
      {/* LEVA CONTROLS */}
      <Leva hidden={!showControls} />

      {/* MAIN SCENE */}
      <div
        className={`w-screen h-screen relative transition-colors duration-1000 ${bgColor} text-[var(--color-text-primary)]`}
      >
        <div
          className={`absolute inset-8 rounded-[20px] overflow-hidden transition-all duration-1000 ${isLoaded ? "outline-none" : "outline outline-1 outline-[#333333]"}`}
          id="main-content"
        >
          {/* UI */}
          <HomeUI className="absolute inset-0 z-50" />

          {/* 3D SCENE */}
          <Canvas
            id="main-scene"
            className="absolute inset-0"
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
            <LoadingStoreSync duration={loadingDuration} ease={"power1.out"} />
            <Scene />
          </Canvas>
        </div>

        {/* FOOTER QUOTE */}
        <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center px-8">
          <p
            className={`text-[1.2rem] font-['Noto_Serif_KR'] w-full px-16 transition-colors duration-1000 ${qColor}`}
            style={{
              textAlign: "justify",
              textAlignLast: "justify",
              letterSpacing: "0.1rem",
            }}
          >
            LOOK AT THE SKY; REMIND YOURSELF OF THE COSMOS. SEEK VASTNESS AT
            EVERY OPPORTUNITY IN ORDER TO SEE THE SMALLNESS OF YOURSELF
          </p>
        </div>
      </div>
    </>
  );
}
