import { create } from "zustand";

type SkySelectionType = "star" | "planet";

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
  selectSkyObject: (ob) => set({ selection: ob }),
  clearSkySelection: () => set({ selection: null }),
}));

export default useSkySelectionStore;
