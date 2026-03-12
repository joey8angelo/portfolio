import { useState, useEffect } from "react";

const breakpoints = {
  mobile: "(max-width: 639px)",
  tablet: "(min-width: 640px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px) and (max-width: 1439px)",
  large: "(min-width: 1440px)",
};

export default function useResponsive() {
  const [breakpoint, setBreakpoint] = useState("mobile");

  useEffect(() => {
    const handlers = Object.entries(breakpoints).map(([name, query]) => {
      const mql = window.matchMedia(query);

      const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) setBreakpoint(name);
      };

      if (mql.matches) setBreakpoint(name);

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
    isDesktop: breakpoint === "desktop",
    isLargeDesktop: breakpoint === "large",
  };
}
