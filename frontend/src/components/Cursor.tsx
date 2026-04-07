import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import "./Cursor/cursor.css";

interface CursorStateProps {
  d?: string;
  fill?: string;
  scale?: number;
  duration?: number;
  ease?: string;
}

interface CursorDef {
  enter: CursorStateProps;
  press?: Partial<CursorStateProps>;
  release?: Partial<CursorStateProps>;
}

const CIRCLE = "M 20,10 a 10,10 0 1,0 0,20 a 10,10 0 1,0 0,-20";

const cursors: Record<string, CursorDef> = {
  default: {
    enter: {
      d: CIRCLE,
      fill: "#ffffff",
      scale: 1,
      duration: 0.35,
      ease: "power2.out",
    },
    press: { scale: 0.65, duration: 0 },
    release: { scale: 1, duration: 0.5, ease: "elastic.out(6,0.8)" },
  },

  pointer: {
    enter: {
      d: "M20 2 L30 38 L20 30 L10 38 Z",
      fill: "#ff44cc",
      scale: 1,
      duration: 0.3,
      ease: "power3.out",
    },
    press: { scale: 0.8 },
    release: { scale: 1, duration: 0.4, ease: "back.out(2)" },
  },

  text: {
    enter: {
      d: "M18 0 L22 0 L22 40 L18 40 Z",
      fill: "#44ddff",
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    },
  },

  grab: {
    enter: {
      d: CIRCLE,
      fill: "#ffcc44",
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    },
    press: {
      d: CIRCLE,
      scale: 0.9,
      duration: 0.2,
      ease: "power2.out",
    },
    release: { scale: 1, duration: 0.3, ease: "back.out(2)" },
  },
};

export default function Cursor() {
  const cursorRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const cursorTypeRef = useRef("default");
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useGSAP(() => {
    if (!cursorRef.current || !pathRef.current) return;

    gsap.set(cursorRef.current, {
      x: -100,
      y: -100,
      xPercent: -50,
      yPercent: -50,
    });
    gsap.set(pathRef.current, {
      transformOrigin: "50% 50%",
    });

    const xTo = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.18,
      ease: "power3",
    });
    const yTo = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.18,
      ease: "power3",
    });

    const applyState = (state: CursorStateProps, overwrite = true) => {
      if (!pathRef.current) return;
      const path = pathRef.current;
      const { d, fill, scale, duration = 0.3, ease = "power2.out" } = state;

      if (d) {
        path.setAttribute("d", d);
      }

      gsap.to(path, {
        duration,
        ease,
        fill,
        scale,
        overwrite: overwrite ? "auto" : false,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as HTMLElement;
      if (!target) return;
      const value = window
        .getComputedStyle(target)
        .getPropertyValue("--cursor-type")
        .trim();

      const type = value || "default";

      if (type !== cursorTypeRef.current) {
        console.log("Cursor type changed to:", type);
        cursorTypeRef.current = type;
        const def = cursors[type] || cursors.default;
        applyState(def.enter);
      }
    };

    const handleMouseDown = () => {
      isMouseDownRef.current = true;
      const def = cursors[cursorTypeRef.current] || cursors.default;
      if (def.press) applyState({ ...def.enter, ...def.press });
    };
    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      const def = cursors[cursorTypeRef.current] || cursors.default;
      if (def.release) applyState({ ...def.enter, ...def.release });
      else applyState(def.enter);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <svg
      ref={cursorRef}
      width="20"
      height="20"
      viewBox="0 0 40 40"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 1000,
        overflow: "visible",
      }}
    >
      <path ref={pathRef} fill="white" d={CIRCLE} />
    </svg>
  );
}
