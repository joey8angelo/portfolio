import { useState } from "react";
import LinedContainer from "../../LinedContainer";
import GlitchText from "../../GlitchText";

export default function ProjectListing({
  name,
  num,
  year,
  hovered,
  selected,
}: {
  name: string;
  num: number;
  year: number;
  hovered: boolean;
  selected: boolean;
}) {
  const [completed, setCompleted] = useState(false);

  const status = selected ? "SL" : completed ? "OK" : "..";

  const statusCn = !completed
    ? "text-[var(--color-danger)] text-glow-xl"
    : selected
      ? "text-[var(--color-success)] text-glow-xl"
      : hovered
        ? "text-[var(--color-text-primary)] text-glow-xl"
        : "text-[var(--color-text-muted)]";

  const textClass =
    hovered || selected
      ? "text-[var(--color-text-primary)]"
      : "text-[var(--color-text-muted)]";

  return (
    <div className="flex flex-row gap-2">
      <div>{num.toString().padStart(2, "0")}</div>
      <LinedContainer
        enabled={hovered || selected}
        lineClassName="h-[2px] rounded-full bg-[var(--color-text-muted)]"
        lineEnabledClassName="bg-[var(--color-text-primary)] h-[2px] rounded-full"
      >
        <GlitchText
          text={name}
          delay={[0, 1500]}
          flickerProbability={0}
          stepDuration={[10, 300]}
          stepProbability={[0.3, 0.4]}
          charAppearRandomness={[0.1, 0.3, 0.6, 0.9]}
          steps={["", "", "", ""]}
          defaultChar=""
          onComplete={() => {
            setCompleted(true);
          }}
          className={`${textClass} text-glow-md`}
        />
      </LinedContainer>
      <div>{year}</div>
      <div className={`${statusCn} pl-1`}>[{status}]</div>
    </div>
  );
}
