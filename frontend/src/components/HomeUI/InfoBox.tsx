import { useEffect, useState } from "react";
import GlitchText from "../GlitchText";
import useNavigationStore from "../../store/useNavigationStore";
import LabeledBox from "../LabeledBox";
import Label from "./Label";

const activeViewNames: Record<string, string> = {
  home: "ROOT/",
  sky: "OBJ_REF/",
  about: "ABOUT/",
};

// format as yyy.mm.dd // hh:mm:ss PST
function formatTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "America/Los_Angeles",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);
  const datePart = `${parts[4].value}.${parts[0].value}.${parts[2].value}`;
  const timePart = `${parts[6].value}:${parts[8].value}:${parts[10].value}`;
  return `${datePart} // ${timePart} PST`;
}

function InfoEntry({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="text-[var(--color-text-muted)]">
      {label}:{" "}
      <span className="text-[var(--color-text-primary)]">{children}</span>
    </span>
  );
}

function GlitchWrapper({ text }: { text: string }) {
  return (
    <GlitchText
      text={text}
      delay={[0, 400]}
      flickerProbability={[0.2, 0.6]}
      stepDuration={[150, 400]}
      stepProbability={[0.3, 0.4]}
    />
  );
}

export default function InfoBox() {
  const activeTab = useNavigationStore((state) => state.activeTab);
  const [datestr, setDatestr] = useState(formatTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setDatestr(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [session_id] = useState(() => {
    return Math.random().toString(16).substring(2, 8).toUpperCase();
  });

  return (
    <LabeledBox label={<Label text="Info" />}>
      <div className="flex flex-col gap-0 px-2 xl:px-4 pb-2 font-[FixedsysExcelsior] leading-none w-full text-glow-sm">
        <InfoEntry label="ACTIVE_VIEW">
          <GlitchWrapper text={activeViewNames[activeTab]} />
        </InfoEntry>
        <InfoEntry label="SYSTEM_NOW">
          <GlitchText
            text={datestr}
            delay={0}
            flickerProbability={[0.1, 0.2]}
            stepDuration={[100, 150]}
            stepProbability={[0.1, 0.2]}
            charAppearRandomness={[0, 0.3, 0.5, 0.7]}
          />
        </InfoEntry>
        <InfoEntry label="SOURCE">LOS ANGELES, CA, USA</InfoEntry>
        <InfoEntry label="SESSION_ID">
          <GlitchWrapper text={`0x${session_id}`} />
        </InfoEntry>
      </div>
    </LabeledBox>
  );
}
