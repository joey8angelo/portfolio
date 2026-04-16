import { useState } from "react";
import LinedText from "../../LinedText";

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

  return (
    <div className="flex flex-row gap-2">
      <div>{num.toString().padStart(2, "0")}</div>
      <LinedText
        text={name}
        enabled={hovered || selected}
        onComplete={() => setCompleted(true)}
      />
      <div>{year}</div>
      <div className={`${statusCn} pl-1`}>[{status}]</div>
    </div>
  );
}
