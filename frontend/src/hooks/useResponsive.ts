import { useSyncExternalStore } from "react";

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

const breakpointOrder: Breakpoint[] = ["sm", "md", "lg", "xl", "2xl"];

function getBreakpoint(width: number): Breakpoint {
  let current: Breakpoint = "sm";
  for (const bp of breakpointOrder) {
    if (width >= breakpoints[bp]) {
      current = bp;
    }
  }
  return current;
}

const subscribe = (callback: () => void) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};

function getServerSnapshot(): Breakpoint {
  return "lg";
}

function getSnapshot(): Breakpoint {
  return getBreakpoint(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
}

function getWidthSnapshot(): number {
  return typeof window !== "undefined" ? window.innerWidth : 1024;
}

function parseCondition(condition: string | Breakpoint): {
  operator: ">" | ">=" | "<" | "<=" | "=";
  bp: Breakpoint;
} {
  const match = String(condition).match(/^(>=|>|<|<=|=)?(.+)$/);
  const operator = (match?.[1] || "=") as ">" | ">=" | "<" | "<=" | "=";
  const bp = match?.[2] as Breakpoint;
  return { operator, bp };
}

export default function useResponsive() {
  const breakpoint = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const width = useSyncExternalStore(subscribe, getWidthSnapshot, getWidthSnapshot);

  const currentIndex = breakpointOrder.indexOf(breakpoint);

  const is = (condition: string | Breakpoint) => {
    const { operator, bp } = parseCondition(condition);
    const bpIndex = breakpointOrder.indexOf(bp);

    switch (operator) {
      case ">":
        return currentIndex > bpIndex;
      case ">=":
        return currentIndex >= bpIndex;
      case "<":
        return currentIndex < bpIndex;
      case "<=":
        return currentIndex <= bpIndex;
      case "=":
      default:
        return breakpoint === bp;
    }
  };

  return { breakpoint, width, is };
}
