import { useLoadingStore, useNavigationStore } from "../store";
import MaskGridLayer from "./ExperienceOverlay/MaskGridLayer";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useResponsive, useWindowSize } from "../hooks";
import { useGSAP } from "@gsap/react";
import DatetimeLocation from "./ExperienceOverlay/DatetimeLocation";
import Header from "./Header";
import { getStarEntry } from "../lib/getStarEntry";
import parseStarName from "../lib/parseStarName";

export default function SceneOverlay() {
  const isLoaded = useLoadingStore((state) => state.isLoaded);
  const { skySelection, activeTab } = useNavigationStore();
  const textRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLAnchorElement>(null);

  const { width, height } = useWindowSize();
  const { isMobile } = useResponsive();

  const startX_t = width * 0.35;
  const endX_t = width * 0.65;
  const r_t = isMobile ? height * 0.5 : height;

  const [an, setAn] = useState({
    startX: 0,
    endX: 0,
    r: r_t,
  });

  useGSAP(() => {
    if (isLoaded) {
      gsap.to(an, {
        startX: startX_t,
        endX: endX_t,
        r: r_t,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => setAn({ ...an }),
        overwrite: "auto",
      });
    }
  }, [isLoaded, startX_t, endX_t, r_t]);

  useEffect(() => {
    if (!titleRef.current || !textRef.current) return;
    if (activeTab === "home") {
      titleRef.current!.innerHTML = "Home";
      textRef.current!.innerHTML = "";
    } else if (activeTab === "sky") {
      if (!skySelection) {
        if (textRef.current) textRef.current.innerHTML = "";
        if (titleRef.current) titleRef.current.innerHTML = "SELECT A STAR";
        return;
      }

      async function fetchStarInfo(id: number, name: string) {
        if (!textRef.current || !titleRef.current) return;
        const data = await getStarEntry(id, name);

        if (!data) {
          const { flamsteed, bayer, constellation } = parseStarName(name);
          titleRef.current.href = "#";
          titleRef.current.innerHTML = `HR ${id} ${flamsteed || ""} ${bayer || ""} ${constellation || ""}`;
          textRef.current.innerHTML = "No Wikipedia entry found for this star.";
          return;
        }

        titleRef.current.innerHTML = data.title;
        titleRef.current.href = data.url;
        textRef.current.innerHTML = data.extract;
      }

      if (skySelection.type === "star") {
        fetchStarInfo(skySelection.id, skySelection.name);
      } else if (skySelection.type === "planet") {
        titleRef.current.innerHTML = skySelection.name;
        textRef.current.innerHTML = "";
      }
    } else if (activeTab === "about") {
      titleRef.current!.innerHTML = "About";
      textRef.current!.innerHTML = "about about about about about about";
    }
  }, [activeTab, skySelection]);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-[100dvw] h-[100dvh] z-1 grid grid-cols-1 grid-rows-1 pointer-events-none"
        style={{
          visibility: isLoaded ? "visible" : "hidden",
        }}
      >
        <DatetimeLocation />
        <div className="w-full h-full">
          <Header />
          <MaskGridLayer
            startX={an.startX}
            endX={an.endX}
            r={an.r}
            gridSize={0}
          />

          <div className="text-white font-mono text-lg leading-relaxed opacity-80 uppercase p-20 pointer-events-none pt-20">
            <span className="text-[50px] pointer-events-auto cursor-grab">
              <a ref={titleRef}>hello</a>
            </span>
            <br />
            <span
              className="pointer-events-auto whitespace-break-spaces"
              style={{
                display: "block",
                textAlign: "justify",
                textAlignLast: "left",
                pointerEvents: "none",
              }}
            >
              <span
                className="pointer-events-auto cursor-text"
                ref={textRef}
              ></span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
