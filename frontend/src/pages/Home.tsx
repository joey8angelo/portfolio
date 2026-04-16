import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import Scene from "../features/Scene";

import useNavigationStore from "../store/useNavigationStore";
import useLoadingStore from "../store/useLoadingStore";
import LoadingStoreSync from "../store/loadingStoreSync";
import { useEffect } from "react";
import HomeUI from "../components/HomeUI/HomeUI";
import useShowControls from "../store/useShowControls";
import useResponsive from "../hooks/useResponsive";

const loadingDuration = 2;

export default function Home() {
  const showControls = useShowControls((state) => state.showControls);
  const { is } = useResponsive();

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

  const footerVisible = is(">md");

  return (
    <>
      {/* LEVA CONTROLS */}
      <Leva hidden={!showControls} />

      {/* MAIN SCENE */}
      <div
        className={`w-full h-full relative transition-colors duration-1000 ${bgColor} text-[var(--color-text-primary)]`}
      >
        <div
          className={`absolute inset-0 lg:inset-5 xl:inset-6 2xl:inset-8 ${footerVisible ? "rounded-[20px]" : ""} overflow-hidden transition-all duration-1000 ${isLoaded ? "outline-none" : "outline outline-1 outline-[#333333]"} `}
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
        {footerVisible && (
          <div className="absolute bottom-0 left-0 right-0 lg:h-5 xl:h-6 2xl:h-8 flex items-center lg:px-5 xl:px-6 2xl:px-8">
            <p
              className={`lg:text-xs xl:text-xs 2xl:text-sm font-['Noto_Serif_KR'] w-full px-16 transition-colors duration-1000 ${qColor} 2xl:tracking-[0.2rem]`}
              style={{
                textAlign: "justify",
                textAlignLast: "justify",
                //letterSpacing: "0.1rem",
              }}
            >
              LOOK AT THE SKY; REMIND YOURSELF OF THE COSMOS. SEEK VASTNESS AT
              EVERY OPPORTUNITY IN ORDER TO SEE THE SMALLNESS OF YOURSELF
            </p>
          </div>
        )}
      </div>
    </>
  );
}
