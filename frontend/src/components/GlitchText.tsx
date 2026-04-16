import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export type RangeValue = [number, number] | number;

export interface GlitchTextProps {
  text: string;
  delay?: RangeValue;
  linearDelay?: number;
  flickerProbability?: RangeValue;
  stepDuration?: RangeValue;
  stepProbability?: RangeValue;
  className?: string;
  charAppearRandomness?: [number, number, number, number];
  onComplete?: () => void;
  steps?: [string, string, string, string];
  defaultChar?: string;
  revertOnUpdate?: boolean;
}

function getRangeValue(value: RangeValue): [number, number] {
  if (Array.isArray(value)) return value;
  return [value, value];
}

function randomBetween(r: [number, number]): number {
  return Math.random() * (r[1] - r[0]) + r[0];
}

/* GlitchText animates given text with a glitchy effect
 * Ranged values select a random value in the range for each character
 * text: the final text to display
 * delay: [min, max] delay before each character starts glitching (ms)
 * linearDelay: delay before each character starts glitching (ms), applied linearly overwrites delay
 * flickerProbability: [min, max] probability that a character will flicker
 * stepDuration: [min, max] duration of each glitch step (ms)
 * stepProbability: [min, max] probability that a character will transition to the next glitch step
 * className: additional class for the text span
 * charAppearRandomness: [step0, step1, step2, step3] probability that the final character will appear at each glitch step
 */
export default function GlitchText({
  text,
  delay = [0, 300],
  linearDelay,
  flickerProbability = [0.2, 0.6],
  stepDuration = [200, 800],
  stepProbability = [0.4, 0.5],
  className,
  charAppearRandomness = [0, 0.2, 0.3, 0.5],
  onComplete,
  steps = ["▪▖▗▘▝░", "▚▞▒", "▙▛▜▟▓", "█▓"],
  defaultChar = " ",
  revertOnUpdate = false,
}: GlitchTextProps) {
  const parentRef = useRef<HTMLSpanElement>(null);

  // buffer for current chars being displayed
  const bufferRef = useRef<string[]>(text.split("").map(() => " "));

  // buffer for previous chars
  const prevCharsRef = useRef<string[]>([]);

  const revert = revertOnUpdate || linearDelay !== undefined;

  useGSAP(
    () => {
      const chars = text.split("");
      // if linearDelay is set, ignore previous chars and always start from blank
      const prevChars = linearDelay ? [] : prevCharsRef.current;

      // initialize buffer with previous chars or defaultChar
      const newBuf = chars.map((char, i) => {
        if (i < prevChars.length && char === prevChars[i]) {
          return char;
        }
        return defaultChar;
      });
      bufferRef.current = newBuf;

      const delayR = getRangeValue(delay);
      const flickerRandomnessR = getRangeValue(flickerProbability);
      const stepDurationR = getRangeValue(stepDuration);
      const stepRandomnessR = getRangeValue(stepProbability);

      const tl = gsap.timeline({
        onComplete() {
          if (parentRef.current) {
            parentRef.current.textContent = text;
          }
          prevCharsRef.current = chars;
          gsap.ticker.remove(updateDOM);
          onComplete?.();
        },
      });

      // write the buffer to the DOM each tick
      const updateDOM = () => {
        if (!parentRef.current) return;
        parentRef.current.textContent = bufferRef.current.join("");
      };
      gsap.ticker.add(updateDOM);

      const cDelay = randomBetween(delayR);

      // create an animation for each character
      chars.forEach((finalChar, i) => {
        // if the character is the same as before, keep it and skip animation
        if (i < prevChars.length && finalChar === prevChars[i]) {
          return;
        }
        const charFlickerRandomness = randomBetween(flickerRandomnessR);
        const charStepDuration = randomBetween(stepDurationR);
        const charStepRandomness = randomBetween(stepRandomnessR);
        const totalDuration = steps.length * charStepDuration;

        const proxy = { progress: 0 };

        tl.to(
          proxy,
          {
            progress: 1,
            duration: totalDuration * 0.001,
            delay: linearDelay ? linearDelay * i * 0.001 : 0,
            ease: "none",
            onUpdate() {
              // decide whether to change the character in the current step
              if (Math.random() > charStepRandomness) return;

              const stepIndex = Math.min(
                Math.floor(proxy.progress * steps.length),
                steps.length - 1,
              );
              const charset = steps[stepIndex];
              const showBlank = Math.random() < charFlickerRandomness;
              const showChar = Math.random() < charAppearRandomness[stepIndex];
              bufferRef.current[i] = showBlank
                ? " "
                : showChar
                  ? finalChar
                  : charset[Math.floor(Math.random() * charset.length)];
            },
            onComplete() {
              bufferRef.current[i] = finalChar;
            },
          },
          cDelay * 0.001,
        );
      });

      return () => {
        tl.kill();
        gsap.ticker.remove(updateDOM);
      };
    },
    { dependencies: [text], revertOnUpdate: revert }, // reset animation if revert
  );

  return (
    <span className={`whitespace-pre-wrap ${className || ""} `} ref={parentRef}>
      {text}
    </span>
  );
}
