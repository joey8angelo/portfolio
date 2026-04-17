import { useEffect, useState } from "react";
import {
  getPlanetEntry,
  getStarEntry,
  getSatelliteEntry,
  type SkyEntry,
} from "../../lib/getSkyEntry";
import LabeledBox from "../LabeledBox";
import GlitchText from "../GlitchText";
import useSkySelectionStore from "../../store/useSkySelectionStore";
import useResponsive from "../../hooks/useResponsive";

export default function SkyContent() {
  const skySelection = useSkySelectionStore((state) => state.selection);
  const [starData, setStarData] = useState<SkyEntry>(null);
  const { is } = useResponsive();

  useEffect(() => {
    let isMounted = true;
    if (skySelection?.type === "star") {
      getStarEntry(skySelection.id, skySelection.name).then((data) => {
        if (isMounted) setStarData(data);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [skySelection]);

  let skyEntry: SkyEntry = null;
  if (skySelection?.type === "planet") {
    skyEntry = getPlanetEntry(skySelection.id);
  } else if (skySelection?.type === "star") {
    skyEntry = starData;
  } else if (skySelection?.type === "satellite") {
    skyEntry = getSatelliteEntry(skySelection.id, skySelection.name);
  }

  const title =
    skyEntry?.title ||
    (skySelection
      ? skySelection.name || `HR ${skySelection.id}`
      : "Make a selection");
  const text =
    skyEntry?.extract || (skySelection ? "No information found" : "");
  const anchorHref = skyEntry?.url || "#";

  return (
    <LabeledBox
      pointerEvents={!is("sm")}
      label={
        <a href={anchorHref} className="pointer-events-auto">
          <GlitchText
            text={title}
            delay={[0, 400]}
            flickerProbability={[0.2, 0.6]}
            stepDuration={[100, 150]}
            stepProbability={[0.3, 0.4]}
            className="font-[Terminus] uppercase"
            revertOnUpdate={true}
          />
        </a>
      }
      className="flex-1 overflow-hidden"
    >
      <div className="w-full h-full p-4 flex flex-col text-[0.9em] sm:text-sm md:text-md 2xl:text-lg">
        <div className="flex-1 overflow-y-scroll">
          <GlitchText
            text={text}
            linearDelay={5}
            flickerProbability={[0.2, 0.6]}
            stepDuration={[15, 30]}
            stepProbability={[0.1, 0.2]}
            className="text-glow-md"
          />
        </div>
        <GlitchText
          text={skySelection ? skySelection.info : ""}
          flickerProbability={[0.2, 0.6]}
          stepDuration={[15, 30]}
          stepProbability={[0.1, 0.2]}
          className="w-full pt-2 text-[0.8em] sm:text-[0.9em] md:text-sm 2xl:text-md text-[var(--color-text-muted)] text-center text-balance text-glow-lg"
        />
      </div>
    </LabeledBox>
  );
}
