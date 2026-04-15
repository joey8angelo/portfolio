import GlitchText from "./GlitchText";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import steppedEase from "../lib/steppedEase";
import { useGSAP } from "@gsap/react";

const steps = 15;

export default function LinedText({
  text,
  enabled,
  onComplete,
}: {
  text: string;
  enabled: boolean;
  onComplete: () => void;
}) {
  const lhsRef = useRef<HTMLDivElement>(null);
  const rhsRef = useRef<HTMLDivElement>(null);

  const tl = useRef<gsap.core.Timeline>(null);

  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useGSAP(() => {
    if (!lhsRef.current || !rhsRef.current) return;

    tl.current = gsap.timeline({
      paused: true,

      onComplete: () => {
        if (!enabledRef.current && tl.current) {
          setTimeout(() => {
            if (tl.current) tl.current.reverse();
          }, 100);
        }
      },
    });
    tl.current.to(
      lhsRef.current,
      {
        flex: 1,
        duration: 0.5,
        ease: steppedEase("power1.inOut", steps),
      },
      0,
    );
    tl.current.to(
      rhsRef.current,
      {
        flex: 0,
        duration: 0.5,
        ease: steppedEase("power1.inOut", steps),
      },
      0,
    );

    return () => tl.current?.kill();
  }, [text]);

  useGSAP(
    () => {
      if (!tl.current) return;
      if (enabled) {
        tl.current.play();
      } else {
        if (tl.current.progress() === 1 || tl.current.progress() === 0) {
          tl.current.reverse();
        }
      }
    },
    { dependencies: [enabled] },
  );

  const bgClass = enabled
    ? "bg-[var(--color-text-primary)]"
    : "bg-[var(--color-text-muted)]";
  const textClass = enabled
    ? "text-[var(--color-text-primary)]"
    : "text-[var(--color-text-muted)]";

  return (
    <div className="flex-1 flex flex-row justify-center items-center gap-2">
      <div ref={lhsRef} className={`h-[2px] ${bgClass} rounded-full`} />
      <GlitchText
        text={text}
        delay={[0, 1500]}
        flickerProbability={0}
        stepDuration={[10, 300]}
        stepProbability={[0.3, 0.4]}
        charAppearRandomness={[0.1, 0.3, 0.6, 0.9]}
        steps={["", "", "", ""]}
        defaultChar=""
        onComplete={() => {
          onComplete();
        }}
        className={`${textClass} text-glow-md`}
      />
      <div ref={rhsRef} className={`h-[2px] ${bgClass} rounded-full flex-1`} />
    </div>
  );
}
