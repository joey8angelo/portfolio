import { create } from "zustand";
import { gsap } from "gsap";

interface LoadingState {
  progress: number;
  isLoaded: boolean;
  _proxy: { value: number };
  updateProgress: (target: number, duration?: number, ease?: string) => void;
}

// global store for the loading state
// animates the progress to the target value
const useLoadingStore = create<LoadingState>((set, get) => ({
  progress: 0,
  isLoaded: false,
  _proxy: { value: 0 },
  updateProgress: (target, duration = 0.5, ease = "power2.out") => {
    const { _proxy } = get();

    gsap.killTweensOf(_proxy);
    gsap.to(_proxy, {
      value: target,
      duration: duration,
      ease: ease,
      onUpdate: () => {
        const curr = _proxy.value;
        set({ progress: curr });
        if (curr >= 100) {
          set({ isLoaded: true });
        }
      },
    });
  },
}));

export default useLoadingStore;
