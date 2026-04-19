import { create } from "zustand";
import { trackEvent } from "../hooks/useAnalytics";

type SkySelectionType = "star" | "planet" | "satellite";

interface SkySelection {
  type: SkySelectionType;
  id: number;
  name: string;
  info: string;
}

interface SkySelectionState {
  selection: SkySelection | null;
  selectSkyObject: (ob: SkySelection) => void;
  clearSkySelection: () => void;
}

const useSkySelectionStore = create<SkySelectionState>((set) => ({
  selection: null,
  selectSkyObject: (ob) => {
    trackEvent("3D Scene", "Select Object", ob.type);
    set({ selection: ob });
  },
  clearSkySelection: () => set({ selection: null }),
}));

export default useSkySelectionStore;
