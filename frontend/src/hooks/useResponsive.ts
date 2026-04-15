import { useState, useEffect } from "react";

const breakpoints = {
  mobile: "(max-width: 640px)",
  tablet: "(min-width: 641px) and (max-width: 768px)",
  laptop: "(min-width: 769px) and (max-width: 1024px)",
  desktop: "(min-width: 1025px) and (max-width: 1280px)",
  large: "(min-width: 1281px)",
} as const;

type Breakpoint = keyof typeof breakpoints;

export default function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("laptop");

  useEffect(() => {
    const handlers = Object.entries(breakpoints).map(([name, query]) => {
      const mql = window.matchMedia(query);

      const key = name as Breakpoint;

      const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) setBreakpoint(key);
      };

      if (mql.matches) setBreakpoint(key);

      mql.addEventListener("change", onChange);
      return { mql, onChange };
    });

    return () => {
      handlers.forEach(({ mql, onChange }) =>
        mql.removeEventListener("change", onChange),
      );
    };
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isLaptop: breakpoint === "laptop",
    isDesktop: breakpoint === "desktop",
    isLargeDesktop: breakpoint === "large",
  };
}
