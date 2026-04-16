import { create } from "zustand";

type TabType = "home" | "about" | "sky";

interface NavigationState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const useNavigationStore = create<NavigationState>((set) => ({
  activeTab: "home",
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },
}));

export default useNavigationStore;
