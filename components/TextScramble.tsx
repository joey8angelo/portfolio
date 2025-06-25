"use client";

import React, { useRef, forwardRef, useImperativeHandle } from "react";

const chars =
  " .-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@";

export interface TextScrambleHandle {
  spinCharacter: (index: number) => void;
  spinAll: () => void;
  shrinkAll: () => void;
  growAll: () => void;
}

interface TextScrambleProps {
  text: string;
  className?: string;
  spinSpeed?: number;
  shrinkSpeed?: number;
  growSpeed?: number;
  spinTime?: number;
  randomizeMS?: number;
  growOffset?: number;
  shrinkOffset?: number;
  breakOnSpace?: boolean;
  spinOnHover?: boolean;
}

export const TextScramble = forwardRef<TextScrambleHandle, TextScrambleProps>(
  (
    {
      text,
      className = "",
      spinSpeed = 1,
      shrinkSpeed = 1,
      growSpeed = 1,
      spinTime = 10,
      randomizeMS = 50,
      growOffset = 40,
      shrinkOffset = 40,
      breakOnSpace = true,
      spinOnHover = true,
    },
    ref,
  ) => {
    const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const spinCharacter = (index: number) => {
      const span = spanRefs.current[index];
      if (span) {
        spin(span);
      }
    };

    const spinAll = () => {
      spanRefs.current.forEach((span) => {
        if (span) {
          spin(span);
        }
      });
    };

    const shrinkAll = () => {
      spanRefs.current.forEach((span) => {
        if (span) {
          shrink(span);
        }
      });
    };

    const growAll = () => {
      spanRefs.current.forEach((span) => {
        if (span) {
          grow(span);
        }
      });
    };

    useImperativeHandle(ref, () => ({
      spinCharacter,
      spinAll,
      shrinkAll,
      growAll,
    }));

    const shrink = (span: HTMLSpanElement) => {
      const originalText = span.dataset.originalText;
      if (!originalText) return;
      if (span.dataset.shrunk === "true") return;
      span.dataset.shrunk = "true";
      let i = chars.indexOf(originalText);
      const changeTime =
        Math.floor(Math.random() * randomizeMS) + 100 / shrinkSpeed;
      const offset = i / shrinkOffset;
      const interval = setInterval(() => {
        if (i > 0) {
          span.textContent = chars[Math.floor(i)];
          i -= offset;
        } else {
          clearInterval(interval);
          span.textContent = "⠀";
          span.dataset.shrunk = "true";
        }
      }, changeTime);
    };

    const grow = (span: HTMLSpanElement) => {
      const originalText = span.dataset.originalText;
      if (!originalText) return;
      if (span.dataset.shrunk !== "true") return;
      span.dataset.shrunk = "false";
      const stop = chars.indexOf(originalText);
      let i = Math.floor(Math.random() * 10);
      const changeTime =
        Math.floor(Math.random() * randomizeMS) + 100 / growSpeed;
      const offset = stop / growOffset;
      const interval = setInterval(() => {
        if (i < stop) {
          span.textContent = chars[Math.floor(i)];
          i += offset;
        } else {
          clearInterval(interval);
          span.textContent = originalText;
          span.dataset.shrunk = "false";
        }
      }, changeTime);
    };

    const spin = (span: HTMLSpanElement) => {
      const originalText = span.dataset.originalText;
      if (!originalText) return;
      if (span.dataset.spinning === "true") return;
      if (originalText === " ") return;
      if (span.dataset.shrunk === "true") return;
      span.dataset.spinning = "true";
      let i = Math.floor(Math.random() * 10) + spinTime;
      const changeTime =
        Math.floor(Math.random() * randomizeMS) + 100 / spinSpeed;
      const interval = setInterval(() => {
        if (i > 0) {
          const randomChar =
            chars[Math.floor(Math.random() * (chars.length - 1)) + 1];
          span.textContent = randomChar;
          i--;
        } else {
          clearInterval(interval);
          span.textContent = originalText;
          span.dataset.spinning = "false";
        }
      }, changeTime);
    };

    return (
      <div className={className}>
        {text.split("").map((char, index) => {
          if (breakOnSpace && char === " ") {
            return <br key={`${index}`} />;
          }
          return (
            <span
              key={`${index}`}
              ref={(el) => {
                if (el) {
                  el.dataset.originalText = char;
                }
                spanRefs.current[index] = el;
              }}
              onMouseEnter={() => {
                if (spinOnHover) {
                  spinCharacter(index);
                }
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  },
);
