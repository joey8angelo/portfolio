import { create } from "zustand";

type SceneSelectionType = "star" | "planet";

interface SceneSelectionState {
  select: (
    type: SceneSelectionType,
    id: number,
    name: string,
    position: { x: number; y: number; z: number },
  ) => void;
  deselect: () => void;
  selection: {
    type: SceneSelectionType;
    id: number;
    name: string;
    position: {
      x: number;
      y: number;
      z: number;
    };
  } | null;
}

export const useSceneSelectionStore = create<SceneSelectionState>((set) => ({
  select: (type, id, name, position) =>
    set({ selection: { type, id, name, position } }),
  deselect: () => set({ selection: null }),
  selection: null,
}));
