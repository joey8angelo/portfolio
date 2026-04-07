import { create } from "zustand";

const quote =
  "LOOK AT THE SKY; REMIND YOURSELF OF THE COSMOS. SEEK VASTNESS AT EVERY OPPORTUNITY IN ORDER TO SEE THE SMALLNESS OF YOURSELF";

type TabType = "home" | "about" | "sky";

type SkySelectionType = "star" | "planet";

interface SkySelection {
  type: SkySelectionType;
  id: number;
  name: string;
}

interface Position {
  x: number;
  y: number;
  z: number;
}

interface TextPathConfig {
  percentage: number;
  text: string;
}

interface NavigationState {
  activeTab: TabType;
  textPath: TextPathConfig;
  skySelection: SkySelection | null;
  skySelectionPosition: Position;

  setActiveTab: (tab: TabType) => void;
  setTextPath: (percentage: number, text: string) => void;
  selectSkyObject: (ob: SkySelection, position: Position) => void;
  updateSkySelectionPosition: (position: Position) => void;
  clearSkySelection: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeTab: "home",
  textPath: { percentage: 1.1, text: "" },
  skySelection: null,
  skySelectionPosition: { x: 0, y: 0, z: 0 },
  setActiveTab: (tab) => {
    if (tab !== "sky") {
      set({ skySelection: null });
    }
    if (tab === "home") {
      set({ textPath: { percentage: 0.99, text: quote } });
    }
    if (tab === "about") {
      set({
        textPath: {
          percentage: 0.5,
          text: "about about about about about about about about about",
        },
      });
    }

    set({ activeTab: tab });
  },
  setTextPath: (percentage, text) => set({ textPath: { percentage, text } }),
  selectSkyObject: (ob, position) => {
    set({ activeTab: "sky" });
    set({ skySelection: ob });
    set({ skySelectionPosition: position });
  },
  clearSkySelection: () =>
    set((state) => {
      if (state.skySelection === null) return {};
      return {
        skySelection: null,
        skySelectionPosition: { x: 0, y: 0, z: 0 },
        textPath: { percentage: 0.99, text: quote },
      };
    }),
  updateSkySelectionPosition: (position) =>
    set((state) => {
      if (!state.skySelectionPosition) return {};
      return {
        skySelectionPosition: position,
      };
    }),
}));
