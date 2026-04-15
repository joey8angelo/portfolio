import { create } from "zustand";

interface ShowControlsState {
  showControls: boolean;
  setShowControls: (show: boolean) => void;
  toggleShowControls: () => void;
}

// global store for whether to show controls hints
const useShowControls = create<ShowControlsState>((set) => ({
  showControls: import.meta.env.DEV,
  setShowControls: (show) => set({ showControls: show }),
  toggleShowControls: () =>
    set((state) => ({ showControls: !state.showControls })),
}));

export default useShowControls;
