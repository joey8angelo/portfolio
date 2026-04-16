import { useRef, useState } from "react";
import InfoBox from "./InfoBox";
import NavBar from "./NavBar";
import { gsap } from "gsap";
import LabeledBox from "../LabeledBox";
import SkyContent from "./SkyContent";
import Label from "./Label";
import HomeContent from "./HomeContent";
import AboutContent from "./AboutContent";
import { useGSAP } from "@gsap/react";
import steppedEase from "../../lib/steppedEase";
import useLoadingStore from "../../store/useLoadingStore";
import useNavigationStore from "../../store/useNavigationStore";
import useResponsive from "../../hooks/useResponsive";

interface MainUIProps {
  className?: string;
}

export default function HomeUI({ className }: MainUIProps) {
  const isLoaded = useLoadingStore((state) => state.isLoaded);
  const activeTab = useNavigationStore((state) => state.activeTab);
  const arrowRef = useRef<SVGSVGElement>(null);
  const { is } = useResponsive();

  const uiRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState<"left" | "right">("left");
  const handleClick = () => {
    const newSide = side === "left" ? "right" : "left";
    setSide(newSide);
    gsap.to(uiRef.current, {
      x: newSide === "left" ? 0 : "100cqw",
      xPercent: newSide === "left" ? 0 : -100,
      duration: 0.7,
      ease: "power2.inOut",
    });
  };

  useGSAP(() => {
    if (!isLoaded || !arrowRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    tl.to(arrowRef.current, {
      y: 5,
      duration: 1,
      ease: steppedEase("power1.inOut", 4),
    }).to(arrowRef.current, {
      y: 0,
      duration: 1,
      ease: steppedEase("power1.inOut", 4),
    });
    return () => tl.kill();
  }, [isLoaded]);

  if (!isLoaded) return null;
  return (
    <div
      className={`pointer-events-none ${className} flex flex-row text-xs md:text-sm lg:text-md xl:text-md 2xl:text-lg font-[Terminus] font-[700] @container sm:text-glow-sm md:text-glow-sm text-glow-md`}
    >
      <div
        className={`w-[100%] md:w-[50%] lg:w-[50%] xl:w-[35%] h-full absolute flex flex-col max-h-full p-8 gap-2 ${is("sm") ? "" : "backdrop-blur-[4px]"}`}
        ref={uiRef}
      >
        {/* INFO SECTION */}
        <InfoBox />

        {/* MAIN CONTENT SECTION */}
        {activeTab === "home" && <HomeContent />}
        {activeTab === "sky" && <SkyContent />}
        {activeTab === "about" && <AboutContent />}

        {/* NAVIGATION SECTION */}
        <NavBar />

        {/* TOGGLE SIDE BUTTON */}
        {is(">=md") && (
          <button
            className={`${side === "right" ? "left-2 rotate-90" : "right-2 -rotate-90"} pointer-events-auto absolute top-1/2 translate-y-1/2  flex items-center justify-center text-white cursor-pointer`}
            onClick={handleClick}
          >
            <svg
              ref={arrowRef}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="#878787"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path fill="none" d="m6 9l6 6l6-6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
