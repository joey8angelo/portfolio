import { useState, useEffect, useMemo } from "react";
import { useProgress } from "@react-three/drei";

import { gsap } from "gsap";

interface UseSmoothProgressProps {
  duration?: number;
  ease?: string;
}

export default function useSmoothProgress({
  duration = 0.5,
  ease = "power2.out",
}: UseSmoothProgressProps = {}) {
  const { progress } = useProgress();
  const [smoothProgress, setSmoothProgress] = useState(0);

  const progressProxy = useMemo(() => ({ value: 0 }), []);

  useEffect(() => {
    console.log("Progress updated:", progress);
  }, [progress]);

  useEffect(() => {
    gsap.to(progressProxy, {
      value: progress,
      duration: duration,
      ease: ease,
      onUpdate: () => {
        setSmoothProgress(progressProxy.value);
      },
    });
  }, [progress, progressProxy, duration, ease]);

  return smoothProgress;
}
