import { useEffect, useState } from "react";
import {
  getPlanetEntry,
  getStarEntry,
  type SkyEntry,
} from "../../lib/getSkyEntry";
import LabeledBox from "../LabeledBox";
import GlitchText from "../GlitchText";
import Label from "./Label";
import useSkySelectionStore from "../../store/useSkySelectionStore";

export default function SkyContent() {
  const skySelection = useSkySelectionStore((state) => state.selection);
  const [starData, setStarData] = useState<SkyEntry>(null);

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
      label={
        <a
          href={anchorHref}
          className="cursor-pointer underline text-[var(--color-accent)]"
        >
          <Label text={title} />
        </a>
      }
      className="m-4 flex-1 overflow-hidden"
    >
      <div className="w-full h-full p-4 flex flex-col">
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
          className="w-full pt-2 text-sm text-[var(--color-text-muted)] text-center text-balance text-glow-lg"
        />
      </div>
    </LabeledBox>
  );
}
