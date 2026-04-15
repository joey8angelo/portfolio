import { useEffect } from "react";
import { useProgress } from "@react-three/drei";
import useLoadingStore from "./useLoadingStore";

interface LoadingStoreSyncProps {
  duration?: number;
  ease?: string;
}

// syncs the loading progress from useProgress to the Zustand store.
export default function LoadingStoreSync({
  duration = 0.5,
  ease = "power2.out",
}: LoadingStoreSyncProps = {}) {
  const { progress } = useProgress();
  const updateProgress = useLoadingStore((state) => state.updateProgress);

  useEffect(() => {
    updateProgress(progress, duration, ease);
  }, [progress, updateProgress, duration, ease]);

  return null;
}
