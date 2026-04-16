import React, { useEffect, useState } from "react";
import GlitchText, { type RangeValue } from "./GlitchText";

interface Conf {
  linearDelay: number;
  flickerProbability: RangeValue;
  stepDuration: number;
  stepProbability: RangeValue;
  charAppearRandomness: [number, number, number, number];
  defaultChar: string;
  delay?: number;
}

export default function GlitchTextAnimationWrapper({
  name,
  children,
  glitchConf = {
    linearDelay: 20,
    flickerProbability: [0.2, 0.6],
    stepDuration: 10,
    stepProbability: [0.3, 0.4],
    charAppearRandomness: [0.1, 0.3, 0.6, 0.9],
    defaultChar: "",
  },
  selGlitchConf = {
    linearDelay: 0,
    flickerProbability: 0,
    stepDuration: 0,
    stepProbability: 0,
    charAppearRandomness: [0, 0, 0, 0],
    defaultChar: "",
    delay: 0,
  },
  className,
}: {
  name: string;
  children: React.ReactNode;
  glitchConf?: Conf;
  selGlitchConf?: Conf;
  className?: string;
}) {
  const [hasSelected] = useState(() => {
    if (typeof window === "undefined") return false;

    const storedValue = localStorage.getItem(name);
    if (!storedValue) return false;

    const prevSelected = new Date(storedValue);
    const dayInMs = 24 * 60 * 60 * 1000;

    return Date.now() - prevSelected.getTime() < dayInMs;
  });

  useEffect(() => {
    localStorage.setItem(name, new Date().toISOString());
  }, [name]);

  const activeConf = hasSelected ? selGlitchConf : glitchConf;

  const injectProps = (
    nodes: React.ReactNode,
    totalDelay: { current: number } = { current: 0 },
  ): React.ReactNode => {
    return React.Children.map(nodes, (child) => {
      if (!React.isValidElement(child)) return child;

      const el = child as React.ReactElement<{
        children?: React.ReactNode;
        text?: string;
        delay?: number;
      }>;

      if (child.type === GlitchText) {
        const text = el.props.text || "";
        const userDelay = activeConf.delay ?? el.props.delay ?? 0;

        const delay = totalDelay.current + userDelay;
        totalDelay.current += text.length * activeConf.linearDelay + userDelay;

        return React.cloneElement(el, {
          ...el.props,
          ...activeConf,
          delay,
        });
      }

      if (child.props && el.props.children) {
        const result = injectProps(el.props.children, totalDelay);
        return React.cloneElement(el, {
          children: result,
        });
      }

      return child;
    });
  };

  return <div className={className}>{injectProps(children)}</div>;
}
